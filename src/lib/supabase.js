import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseReady = Boolean(url && anonKey);
export const supabase = supabaseReady
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

// Correctness is derived by the database. The browser sends only the question
// identifier/text and the selected option, never a claimed score.
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
  const { data, error } = await supabase.rpc("get_quiz_progress");
  if (error) throw error;
  const attempted = Number(data?.attempted ?? 0);
  const correct = Number(data?.correct ?? 0);
  return { attempted, correct, accuracy: attempted ? Math.round(correct / attempted * 100) : 0 };
}
