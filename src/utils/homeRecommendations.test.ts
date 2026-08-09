import test from 'node:test';
import assert from 'node:assert/strict';
import { getHomeRecommendations } from './homeRecommendations';
import { KnowledgeL1Chapter } from '../types';

const tree: KnowledgeL1Chapter[] = [
  {
    code: 'MATH-01',
    title: '函数',
    subject: '数学',
    grade: '初三',
    children: [
      {
        code: 'MATH-01-01',
        title: '二次函数',
        children: [
          { code: 'p-practiced', title: '已完成知识点', boundQuestionCount: 5, practicedQuestionCount: 5, masteryState: '已练习', hasVerificationQuiz: true },
          { code: 'p-unlearned', title: '待开始知识点', boundQuestionCount: 4, practicedQuestionCount: 0, masteryState: '未学习', hasVerificationQuiz: true },
          { code: 'p-learning', title: '正在学习知识点', boundQuestionCount: 6, practicedQuestionCount: 1, masteryState: '学习中', hasVerificationQuiz: true },
          { code: 'p-learned', title: '待练习知识点', boundQuestionCount: 7, practicedQuestionCount: 2, masteryState: '已学习', hasVerificationQuiz: true },
        ],
      },
    ],
  },
  {
    code: 'PHYSICS-01',
    title: '力学',
    subject: '物理',
    grade: '初三',
    children: [
      {
        code: 'PHYSICS-01-01',
        title: '运动与力',
        children: [
          { code: 'p-physics', title: '牛顿第二定律', boundQuestionCount: 5, practicedQuestionCount: 0, masteryState: '学习中', hasVerificationQuiz: true },
        ],
      },
    ],
  },
];

test('prioritizes learning, learned, then unlearned points for the current subject', () => {
  const recommendations = getHomeRecommendations(tree, '数学', 3);

  assert.deepEqual(recommendations.map((item) => item.code), [
    'p-learning',
    'p-learned',
    'p-unlearned',
  ]);
});

test('includes section metadata and remaining question count', () => {
  const [recommendation] = getHomeRecommendations(tree, '数学', 1);

  assert.equal(recommendation.chapterTitle, '函数');
  assert.equal(recommendation.sectionTitle, '二次函数');
  assert.equal(recommendation.unpracticedQuestionCount, 5);
});

test('filters other subjects and fully practiced points', () => {
  const recommendations = getHomeRecommendations(tree, '数学', 10);

  assert.equal(recommendations.some((item) => item.code === 'p-physics'), false);
  assert.equal(recommendations.some((item) => item.code === 'p-practiced'), false);
});

test('respects the requested limit', () => {
  assert.equal(getHomeRecommendations(tree, '数学', 2).length, 2);
});
