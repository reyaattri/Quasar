import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, json } from "../_shared/http.ts";
import { consumeQuota, logRequest, requirePlus, requireUser, serviceClient } from "../_shared/access.ts";
import { runJson } from "../_shared/claude.ts";
import {
  AiError,
  TASKS,
  checkHook,
  checkQuiz,
  checkStory,
  checkTutor,
  hookRequest,
  parseHook,
  parseQuiz,
  parseStory,
  parseTutor,
  quizRequest,
  storyRequest,
  tutorRequest,
  type Task,
} from "../_shared/tasks.ts";

const MAX_BODY = 7_200_000;

async function storyImage(db: SupabaseClient, userId: string, prompt: string) {
  const token = Deno.env.get("REPLICATE_API_TOKEN");
  if (!token) return null;
  const prediction = await fetch(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-2-pro/predictions",
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", Prefer: "wait=60" },
      body: JSON.stringify({ input: { prompt, aspect_ratio: "1:1", output_format: "webp" } }),
      signal: AbortSignal.timeout(65000),
    },
  );
  if (!prediction.ok) return null;
  const r = await prediction.json();
  const output = Array.isArray(r.output) ? r.output[0] : r.output;
  if (r.status !== "succeeded" || typeof output !== "string") return null;
  const u = new URL(output);
  if (u.protocol !== "https:" || !(u.hostname === "replicate.delivery" || u.hostname.endsWith(".replicate.delivery"))) return null;
  const img = await fetch(output, { signal: AbortSignal.timeout(15000) });
  if (!img.ok) return null;
  const bytes = await img.arrayBuffer();
  if (bytes.byteLength > 10485760) return null;
  const path = userId + "/" + crypto.randomUUID() + ".webp";
  const { error } = await db.storage.from("mnemonics").upload(path, bytes, { contentType: "image/webp" });
  return error ? null : path;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const db = serviceClient();
  let userId: string | null = null;
  let task: Task | null = null;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) throw new AiError(413, "That request is too large.");
    const body = JSON.parse(raw);
    if (!TASKS.includes(body.task)) throw new AiError(400, "Unknown AI task.");
    task = body.task as Task;
    const input = (body.input ?? {}) as Record<string, unknown>;

    const user = await requireUser(req, db);
    userId = user.id;
    await requirePlus(user.id);

    // Validate before spending quota, so a bad request never costs the learner a turn.
    const prepared =
      task === "tutor" ? { kind: task, args: parseTutor(input) }
      : task === "quiz" ? { kind: task, args: parseQuiz(input) }
      : task === "story" ? { kind: task, args: parseStory(input) }
      : { kind: task, args: parseHook(input) };

    let factText = "";
    if (prepared.kind === "story") {
      const { data: fact, error } = await db.from("facts").select("fact_text").eq("id", prepared.args.factId).single();
      if (error || !fact) throw new AiError(400, "That fact isn't in the curriculum.");
      factText = fact.fact_text;
    }

    await consumeQuota(db, user.id, task);

    const request =
      prepared.kind === "tutor" ? tutorRequest(prepared.args)
      : prepared.kind === "quiz" ? quizRequest(prepared.args)
      : prepared.kind === "story" ? storyRequest(prepared.args, factText)
      : hookRequest(prepared.args);
    const { data, model, usage } = await runJson(task, request);

    let result: unknown;
    if (prepared.kind === "tutor") result = checkTutor(data);
    else if (prepared.kind === "quiz") result = checkQuiz(data, prepared.args);
    else if (prepared.kind === "hook") result = checkHook(data, prepared.args);
    else {
      const story = checkStory(data);
      const imagePath = await storyImage(db, user.id, story.imagePrompt);
      const { error } = await db.from("generated_mnemonics").insert({
        user_id: user.id,
        fact_id: prepared.args.factId,
        story: story.story,
        image_path: imagePath,
        style: prepared.args.style,
      });
      if (error) throw error;
      const signed = imagePath ? await db.storage.from("mnemonics").createSignedUrl(imagePath, 3600) : null;
      result = { story: story.story, imageUrl: signed?.data?.signedUrl };
    }

    await logRequest(db, { user_id: user.id, task, model, status: "ok", ...usage });
    return json(result);
  } catch (e) {
    const status = e instanceof AiError ? e.status : 503;
    if (userId && task) await logRequest(db, { user_id: userId, task, status: "error " + status });
    if (!(e instanceof AiError)) console.error("ai_failed", task, e instanceof Error ? e.message : "error");
    return json(
      { error: e instanceof AiError ? e.message : "The AI is unavailable right now. Please try again in a moment." },
      status,
    );
  }
});
