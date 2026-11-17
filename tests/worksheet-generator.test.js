import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const component=await readFile(new URL("../src/components/WorksheetGenerator.jsx",import.meta.url),"utf8");
const app=await readFile(new URL("../src/App.jsx",import.meta.url),"utf8");
test("worksheet generator is mounted without replacing existing sections",()=>{
 assert.match(app,/WorksheetGenerator/);assert.match(app,/id="practice"/);assert.match(app,/id="resources"/);
});
test("worksheet defaults to 30 questions and includes same-file solutions",()=>{
 assert.match(component,/useState\(30\)/);assert.match(component,/Answer Key & Solutions/);assert.match(component,/doc\.save\(/);
});
test("worksheet uses mixed-difficulty progression and keeps generated variants labelled",()=>{
 assert.match(component,/basic/);assert.match(component,/moderate/);assert.match(component,/challenging/);assert.match(component,/generated-variation/);assert.match(component,/verified-bank/);
});
test("existing ten-question answer-key test matches object literals",async()=>{
 const source=await readFile(new URL("../src/App.jsx",import.meta.url),"utf8");
 const start=source.indexOf("const questions=[");const end=source.indexOf("];",start);
 assert.notEqual(start,-1);assert.equal((source.slice(start,end).match(/\{q:/g)||[]).length,10);
});
