import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseReady = Boolean(url && anonKey);
export const supabase = supabaseReady ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
export async function saveAttempt({ userId, subject, topic, questionText, selectedOption, correctOption, isCorrect }) {
  if (!supabase || !userId) return;
  const { error } = await supabase.from("quiz_attempts").insert({ user_id:userId, subject, topic, question_text:questionText, selected_option:selectedOption, correct_option:correctOption, is_correct:isCorrect });
  if (error) throw error;
}
export async function getProgress(userId) {
  if (!supabase || !userId) return { attempted:0, correct:0, accuracy:0 };
  const { data, error } = await supabase.from("quiz_attempts").select("is_correct").eq("user_id",userId);
  if (error) throw error;
  const attempted=data.length, correct=data.filter(row=>row.is_correct).length;
  return { attempted, correct, accuracy:attempted?Math.round(correct/attempted*100):0 };
}