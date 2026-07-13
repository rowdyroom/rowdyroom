import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleBuiltInQuestionBankFix } from './fix-built-in-question-bank.mjs';

const bank = `const QUESTION_BANK=[
  {question:'Q1',answers:['A1','B1'],points:[10,5]},
  {question:'Q2',answers:['A2','B2'],points:[10,5]},
  {question:'Q3',answers:['A3','B3'],points:[10,5]}
];`;
const picker = `function pickQuestion(){let available=QUESTION_BANK.map((_,i)=>i).filter(i=>!state.used.includes(i)); if(!available.length){state.used=[]; available=QUESTION_BANK.map((_,i)=>i);} const idx=available[Math.floor(Math.random()*available.length)]; state.used.push(idx); state.currentQuestion=QUESTION_BANK[idx]; state.revealed=[]; state.pool=0; state.timer=40;}`;
const legacyUi = `<section id="questionTools">
  <h3 class="title">Question Bank (Max 2000)</h3>
  <textarea id="bulkQuestions" placeholder="Question | Answer1, Answer2, Answer3 | Points1, Points2, Points3"></textarea>
  <div><span id="questionCount">0 / 2000</span></div>
  <button id="loadQuestionsBtn">Load Questions</button>
  <button id="clearQuestionsBtn">Clear Questions</button>
  <input id="questionFile" type="file">
</section>`;
const fixture = `<html>
<head></head>
<body>
<div id="setupPage">
  <select id="matchSize"><option>2</option></select>
  <button id="nextQuestionBtn">Next Question</button>
  ${legacyUi}
</div>
<script>
${bank}
const state={used:[],revealed:[],pool:0,timer:40,currentQuestion:null};
${picker}
</script>
<script id="rowdy-tv-mode-repair"></script>
</body>
</html>`;

test('removes the legacy question upload controls and heading from static HTML', () => {
  const result = applyRumbleBuiltInQuestionBankFix(fixture);
  assert.equal(result.changed, true);
  for (const id of ['bulkQuestions','loadQuestionsBtn','clearQuestionsBtn','questionCount','questionFile']) {
    assert.doesNotMatch(result.source, new RegExp(`id=["']${id}["']`));
  }
  assert.doesNotMatch(result.source, />\s*Question Bank\s*\(Max 2000\)\s*</i);
});

test('preserves the built-in QUESTION_BANK byte-for-byte', () => {
  const result = applyRumbleBuiltInQuestionBankFix(fixture);
  assert.ok(result.source.includes(bank));
});

test('preserves the non-repeating random pickQuestion implementation byte-for-byte', () => {
  const result = applyRumbleBuiltInQuestionBankFix(fixture);
  assert.ok(result.source.includes(picker));
  assert.match(result.source, /QUESTION_BANK\.map\(\(_,\s*i\)=>i\)\.filter\(i=>!state\.used\.includes\(i\)\)/);
  assert.match(result.source, /if\(!available\.length\)\{state\.used=\[\]/);
});

test('the preserved picker selects each unused question before resetting', () => {
  const QUESTION_BANK = [
    {question:'Q1'}, {question:'Q2'}, {question:'Q3'},
  ];
  const state = {used:[],revealed:[],pool:0,timer:40,currentQuestion:null};
  const randomValues = [0, 0, 0, 0];
  const fakeMath = Object.assign(Object.create(Math), { random: () => randomValues.shift() ?? 0 });
  const factory = new Function('QUESTION_BANK','state','Math',`${picker}; return pickQuestion;`);
  const pickQuestion = factory(QUESTION_BANK,state,fakeMath);
  pickQuestion(); pickQuestion(); pickQuestion();
  assert.deepEqual(state.used, [0,1,2]);
  pickQuestion();
  assert.deepEqual(state.used, [0]);
  assert.equal(state.currentQuestion.question, 'Q1');
});

test('injects one built-in-only guard before the closing body', () => {
  const result = applyRumbleBuiltInQuestionBankFix(fixture);
  assert.equal((result.source.match(/id="rowdy-built-in-question-bank-repair"/g) || []).length, 1);
  assert.match(result.source, /<script id="rowdy-built-in-question-bank-repair">[\s\S]*<\/script>\n<\/body>/);
  assert.match(result.source, /window\.ROWDY_QUESTION_MODE='built_in_only'/);
});

test('guard removes dynamically reintroduced upload selectors', () => {
  const result = applyRumbleBuiltInQuestionBankFix(fixture);
  assert.match(result.source, /\[data-question-upload\]/);
  assert.match(result.source, /\[data-question-bank-upload\]/);
  assert.match(result.source, /new MutationObserver\(removeLegacyQuestionUploadUi\)/);
  assert.match(result.source, /observer\.observe\(document\.documentElement,\{childList:true,subtree:true\}\)/);
});

test('preserves unrelated setup and Next Question controls', () => {
  const result = applyRumbleBuiltInQuestionBankFix(fixture);
  assert.match(result.source, /id="matchSize"/);
  assert.match(result.source, /id="nextQuestionBtn">Next Question/);
});

test('removes legacy controls that use single-quoted id attributes', () => {
  const source = fixture.replace('id="bulkQuestions"', "id='bulkQuestions'");
  const result = applyRumbleBuiltInQuestionBankFix(source);
  assert.doesNotMatch(result.source, /id=['"]bulkQuestions['"]/);
});

test('removes self-closing legacy upload inputs safely', () => {
  const source = fixture.replace('<input id="questionFile" type="file">', '<input id="questionUpload" type="file" />');
  const result = applyRumbleBuiltInQuestionBankFix(source);
  assert.doesNotMatch(result.source, /id="questionUpload"/);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleBuiltInQuestionBankFix(fixture);
  const twice = applyRumbleBuiltInQuestionBankFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 9', () => {
  const source = fixture.replace('<script id="rowdy-tv-mode-repair"></script>', '');
  assert.throws(() => applyRumbleBuiltInQuestionBankFix(source), /Prerequisite missing/);
});

test('refuses a file without the built-in QUESTION_BANK', () => {
  const source = fixture.replace(bank, 'const LEGACY_QUESTIONS=[];');
  assert.throws(() => applyRumbleBuiltInQuestionBankFix(source), /QUESTION_BANK is missing/);
});

test('refuses an unexpected picker that does not avoid repeats', () => {
  const source = fixture.replace(
    picker,
    `function pickQuestion(){state.currentQuestion=QUESTION_BANK[Math.floor(Math.random()*QUESTION_BANK.length)];}`,
  );
  assert.throws(() => applyRumbleBuiltInQuestionBankFix(source), /pickQuestion implementation is missing or unexpected/);
});

test('refuses a picker without an exhaustion reset', () => {
  const source = fixture.replace(
    `if(!available.length){state.used=[]; available=QUESTION_BANK.map((_,i)=>i);}`,
    `if(!available.length) return;`,
  );
  assert.throws(() => applyRumbleBuiltInQuestionBankFix(source), /exhaustion reset is missing or unexpected/);
});

test('refuses an ambiguous body insertion point', () => {
  const source = `${fixture}\n${fixture}`;
  assert.throws(() => applyRumbleBuiltInQuestionBankFix(source), /expected exactly 1 match/);
});
