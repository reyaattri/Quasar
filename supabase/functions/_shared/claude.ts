import Anthropic from "npm:@anthropic-ai/sdk";
import { env } from "./http.ts";
import { AiError, EFFORT, MAX_TOKENS, type Prepared, type Task } from "./tasks.ts";

const DEFAULT_MODEL = "claude-opus-5";

export async function runJson(task: Task, req: Prepared) {
  const client = new Anthropic({ apiKey: env("ANTHROPIC_API_KEY") });
  const model = Deno.env.get("AI_MODEL") ?? DEFAULT_MODEL;
  const response = await client.beta.messages.create(
    {
      model,
      max_tokens: MAX_TOKENS[task],
      // Server-side fallback re-runs a policy decline on Anthropic's recommended model.
      ...(model === DEFAULT_MODEL
        ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }
        : {}),
      output_config: {
        effort: EFFORT[task],
        format: { type: "json_schema", schema: req.schema },
      },
      system: req.system,
      messages: [{ role: "user", content: req.content }],
    },
    { timeout: task === "quiz" ? 120000 : 45000 },
  );
  if (response.stop_reason === "refusal")
    throw new AiError(422, "The AI couldn't help with this one.");
  if (response.stop_reason === "max_tokens")
    throw new AiError(502, "The AI's answer was cut short. Please try again.");
  const text = response.content
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { type: string; text?: string }) => b.text ?? "")
    .join("");
  return {
    data: JSON.parse(text) as Record<string, unknown>,
    model: response.model as string,
    usage: {
      input_tokens: response.usage?.input_tokens as number | undefined,
      output_tokens: response.usage?.output_tokens as number | undefined,
    },
  };
}
