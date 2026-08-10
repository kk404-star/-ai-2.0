import {
  KnowledgeL1Chapter,
  MasteryState,
  SubjectType,
} from '../types';

export interface HomeRecommendation {
  code: string;
  title: string;
  subject: SubjectType;
  chapterTitle: string;
  sectionTitle: string;
  masteryState: Extract<MasteryState, '学习中' | '已学习' | '已练习' | '未学习'>;
  boundQuestionCount: number;
  practicedQuestionCount: number;
  unpracticedQuestionCount: number;
}

const STATE_PRIORITY: Record<HomeRecommendation['masteryState'], number> = {
  学习中: 0,
  已学习: 1,
  未学习: 2,
  已练习: 3,
};

export function getHomeRecommendations(
  tree: KnowledgeL1Chapter[],
  subject: SubjectType,
  limit = 3,
): HomeRecommendation[] {
  return tree
    .filter((chapter) => chapter.subject === subject)
    .flatMap((chapter) => chapter.children.flatMap((section) =>
      section.children.flatMap((point) => {
        return [{
          code: point.code,
          title: point.title,
          subject: chapter.subject,
          chapterTitle: chapter.title,
          sectionTitle: section.title,
          masteryState: point.masteryState,
          boundQuestionCount: point.boundQuestionCount,
          practicedQuestionCount: point.practicedQuestionCount,
          unpracticedQuestionCount: Math.max(0, point.boundQuestionCount - point.practicedQuestionCount),
        }];
      }),
    ))
    .sort((a, b) => STATE_PRIORITY[a.masteryState] - STATE_PRIORITY[b.masteryState])
    .slice(0, Math.max(0, limit));
}
