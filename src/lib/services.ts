import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import Constants from "expo-constants";
import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import type { Progress } from "./progress";
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabase =
  url && anon
    ? createClient(url, anon, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
export const storageKey = "quasar.progress.v1";
let saveQueue: Promise<void> = Promise.resolve();
export async function saveProgress(p: Progress, userId?: string) {
  const key = userId ? storageKey + "." + userId : storageKey;
  const raw = JSON.stringify(p);
  saveQueue = saveQueue
    .catch(() => {})
    .then(() => AsyncStorage.setItem(key, raw));
  return saveQueue;
}
export async function syncProgress(p: Progress, userId: string) {
  if (!supabase)
    throw new Error(
      "Cloud sync is not configured yet. Your progress is saved on this device.",
    );
  const { error } = await supabase.from("learning_states").upsert({
    user_id: userId,
    state: p,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  const { error: profileError } = await supabase
    .from("personalization_profiles")
    .upsert({
      user_id: userId,
      interests: p.profile,
      preferred_style: p.profile.style,
    });
  if (profileError) throw profileError;
  const rows = p.reviews.map((r) => ({
    id: r.id,
    user_id: userId,
    mnemonic_id: r.factId,
    recalled_correctly: r.correct,
    reviewed_at: r.at,
    next_review_at: r.due,
    fsrs_stability: r.stability,
    fsrs_difficulty: r.difficulty,
  }));
  if (rows.length) {
    const { error: e } = await supabase
      .from("review_logs")
      .upsert(rows, { onConflict: "id" });
    if (e) throw e;
  }
}
export async function loadCloud(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("learning_states")
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.state ?? null;
}
// Web uses RevenueCat Billing (Stripe checkout); phones use the App Store / Google Play.
const rcKey =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_REVENUECAT_WEB_KEY
    : Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
export const webPurchases = Platform.OS === "web";
export const purchaseReady = Constants.appOwnership !== "expo" && !!rcKey;
let configured = false;
let knownUser: string | null = null;
async function purchases() {
  if (!purchaseReady)
    throw new Error(
      "Purchases aren't connected in this build yet. No payment has been made.",
    );
  const p = (await import("react-native-purchases")).default;
  if (!configured) {
    p.configure({ apiKey: rcKey!, appUserID: knownUser ?? undefined });
    configured = true;
  }
  return p;
}
export const hasPro = (info: CustomerInfo) =>
  !!info.entitlements.active["quasar_pro"];
export async function getOfferings() {
  const p = await purchases();
  return (await p.getOfferings()).current?.availablePackages ?? [];
}
export async function customerInfo() {
  return (await purchases()).getCustomerInfo();
}
export async function buy(pack: PurchasesPackage) {
  const p = await purchases();
  return (await p.purchasePackage(pack)).customerInfo;
}
export async function restore() {
  return (await purchases()).restorePurchases();
}
export async function identifyPurchases(userId: string | null) {
  knownUser = userId;
  if (!purchaseReady) return;
  const p = await purchases();
  if (userId) await p.logIn(userId);
  else if (!(await p.isAnonymous())) await p.logOut();
}
let analyticsClient: any;
export async function track(
  event: string,
  enabled: boolean,
  properties: Record<string, string | number | boolean> = {},
) {
  if (!enabled || !process.env.EXPO_PUBLIC_POSTHOG_KEY) return;
  try {
    if (!analyticsClient) {
      const { PostHog } = await import("posthog-react-native");
      analyticsClient = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_KEY, {
        host:
          process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        captureAppLifecycleEvents: false,
      });
    }
    analyticsClient.capture(event, properties);
  } catch {
    /* Analytics never blocks learning. */
  }
}
export async function deleteAccount() {
  if (!supabase)
    throw new Error("Account deletion needs the connected Supabase service.");
  const { error } = await supabase.functions.invoke("delete-account", {
    body: { confirmation: "DELETE" },
  });
  if (error) throw error;
  await supabase.auth.signOut();
}
