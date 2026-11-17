import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseReady = Boolean(url && anonKey);
export const supabase = supabaseReady ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;

// The database resolves correctness from its private answer key. Never send claimed
// correct_option or is_correct values from the browser.
export async function saveAttempt({ questionText, selectedOption }) {
  if (!supabase) return;
  if (typeof questionText !== "string" || !questionText.trim() ||
      !Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption > 3) {
    throw new Error("Invalid quiz answer.");
  }
  const { error } = await supabase.rpc("record_quiz_attempt", {
    p_question_text: questionText,
    p_selected_option: selectedOption,
  });
  if (error) throw error;
}

export async function getProgress(userId) {
  if (!supabase || !userId) return { attempted: 0, correct: 0, accuracy: 0 };
  const [allRows, correctRows] = await Promise.all([
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("is_correct", true),
  ]);
  if (allRows.error) throw allRows.error;
  if (correctRows.error) throw correctRows.error;
  const attempted = allRows.count ?? 0;
  const correct = correctRows.count ?? 0;
  return { attempted, correct, accuracy: attempted ? Math.round(correct / attempted * 100) : 0 };
}
