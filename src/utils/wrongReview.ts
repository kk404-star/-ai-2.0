import { WrongQuestion, WrongQuestionReviewAttempt } from '../types';

export const WRONG_QUESTIONS_STORAGE_KEY = 'kaiqiao-wrong-questions-v2';

export const toLocalDateKey = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const addDays = (dateKey: string, days: number) => {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
};

export const normalizeWrongQuestion = (item: WrongQuestion, today = toLocalDateKey()): WrongQuestion => ({
  ...item,
  addedAt: item.addedAt || today,
  nextReviewAt: item.reviewStatus === '已掌握' ? undefined : item.nextReviewAt || today,
  reviewStage: item.reviewStage || 1,
  reviewFailureCount: item.reviewFailureCount || 0,
  reviewAttempts: item.reviewAttempts || [],
});

export const isReviewDue = (item: WrongQuestion, today = toLocalDateKey()) =>
  item.reviewStatus !== '已掌握' && Boolean(item.nextReviewAt) && item.nextReviewAt! <= today;

export const getDueWrongQuestions = (items: WrongQuestion[], today = toLocalDateKey(), limit = 5) =>
  items
    .filter((item) => isReviewDue(item, today))
    .sort((a, b) => (a.nextReviewAt || '').localeCompare(b.nextReviewAt || '') || (a.addedAt || '').localeCompare(b.addedAt || ''))
    .slice(0, limit);

interface ReviewResult {
  originalCorrect: boolean;
  variantCorrect: boolean;
  countedForMastery: boolean;
  reviewedAt?: string;
}

export const applyWrongQuestionReview = (item: WrongQuestion, result: ReviewResult): WrongQuestion => {
  const reviewedAt = result.reviewedAt || toLocalDateKey();
  const stage = item.reviewStage || 1;
  const passed = result.originalCorrect && result.variantCorrect;
  const attempt: WrongQuestionReviewAttempt = { reviewedAt, stage, ...result };
  const base = {
    ...item,
    lastReviewedAt: reviewedAt,
    reviewStatus: '复习中' as const,
    reviewAttempts: [...(item.reviewAttempts || []), attempt],
  };

  if (!result.countedForMastery) return base;
  if (!passed) {
    return {
      ...base,
      nextReviewAt: addDays(reviewedAt, 1),
      reviewFailureCount: (item.reviewFailureCount || 0) + 1,
    };
  }
  if (stage === 1) {
    return { ...base, reviewStage: 2, nextReviewAt: addDays(reviewedAt, 3) };
  }
  return { ...base, reviewStatus: '已掌握', nextReviewAt: undefined };
};
