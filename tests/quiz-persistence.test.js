import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const client = await readFile(new URL("../src/lib/supabase.js", import.meta.url), "utf8");
const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");

test("general mini-test completion uses the batch persistence path", () => {
  assert.match(app, /const finishGeneralQuiz=async\(\)=>\{[\s\S]*?saveAttempts\(questions\.map/);
  assert.match(app, /idx===questions\.length-1\?finishGeneralQuiz\(\)/);
});

test("batch persistence refuses to claim success without Supabase", () => {
  assert.match(client, /function requireSupabase\(\)[\s\S]*?if \(!supabase\)[\s\S]*?throw new Error/);
  assert.match(client, /export async function saveAttempts\(answers\)[\s\S]*?requireSupabase\(\)/);
  assert.match(client, /supabase\.rpc\("record_quiz_attempts"/);
});

test("batch persistence validates size and selected option bounds", () => {
  assert.match(client, /answers\.length < 1/);
  assert.match(client, /answers\.length > 50/);
  assert.match(client, /answer\.selectedOption < 0/);
  assert.match(client, /answer\.selectedOption > 3/);
});

test("database derives correctness from the private answer key", () => {
  assert.match(schema, /create schema if not exists private/);
  assert.match(schema, /create table if not exists private\.quiz_answer_key/);
  assert.match(schema, /security definer[\s\S]*?auth\.uid\(\) is null/);
  assert.match(schema, /select \* into answer from private\.quiz_answer_key where question_text=question/);
  assert.match(schema, /selected=answer\.correct_option/);
  assert.match(schema, /grant execute on function public\.record_quiz_attempts\(jsonb\) to authenticated/);
  assert.match(schema, /revoke all on function public\.record_quiz_attempts\(jsonb\) from public,anon/);
});

test("all general mini-test questions have server-side answer-key entries", () => {
  const questions = [
    "240 का 25% कितना है?",
    "यदि 3 : 5 = x : 20, तो x क्या है?",
    "₹800 की वस्तु ₹920 में बेची। लाभ प्रतिशत?",
  ];
  for (const question of questions) {
    assert.ok(app.includes(question), `frontend question missing: ${question}`);
    assert.ok(schema.includes(question), `server answer key missing: ${question}`);
  }
});
