import test from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeL1Chapter, MasteryState } from '../types';
import { markKnowledgePointAsLearned } from './knowledgeMastery';

const createTree = (masteryState: MasteryState): KnowledgeL1Chapter[] => [{
  code: 'chapter-1',
  title: '函数',
  subject: '数学',
  grade: '初三',
  children: [{
    code: 'section-1',
    title: '二次函数',
    children: [
      { code: 'target', title: '二次函数图像', boundQuestionCount: 6, practicedQuestionCount: 1, masteryState, hasVerificationQuiz: true },
      { code: 'other', title: '二次函数性质', boundQuestionCount: 5, practicedQuestionCount: 0, masteryState: '未学习', hasVerificationQuiz: true },
    ],
  }],
}];

test('marks an unlearned point as learned without changing unrelated points', () => {
  const tree = createTree('未学习');
  const next = markKnowledgePointAsLearned(tree, 'target');

  assert.equal(next[0].children[0].children[0].masteryState, '已学习');
  assert.equal(next[0].children[0].children[1].masteryState, '未学习');
  assert.notEqual(next, tree);
});

test('marks an in-progress point as learned', () => {
  const next = markKnowledgePointAsLearned(createTree('学习中'), 'target');

  assert.equal(next[0].children[0].children[0].masteryState, '已学习');
});

test('does not downgrade an already practiced point', () => {
  const tree = createTree('已练习');
  const next = markKnowledgePointAsLearned(tree, 'target');

  assert.equal(next[0].children[0].children[0].masteryState, '已练习');
  assert.equal(next, tree);
});

test('returns the same tree when the point code is missing', () => {
  const tree = createTree('未学习');

  assert.equal(markKnowledgePointAsLearned(tree, 'missing'), tree);
});
