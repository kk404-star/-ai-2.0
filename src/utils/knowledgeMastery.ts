import { KnowledgeL1Chapter } from '../types';

export function markKnowledgePointAsLearned(
  tree: KnowledgeL1Chapter[],
  knowledgeCode: string,
): KnowledgeL1Chapter[] {
  let changed = false;

  const nextTree = tree.map((chapter) => {
    let chapterChanged = false;
    const nextSections = chapter.children.map((section) => {
      let sectionChanged = false;
      const nextPoints = section.children.map((point) => {
        if (
          point.code !== knowledgeCode
          || point.masteryState === '已学习'
          || point.masteryState === '已练习'
        ) {
          return point;
        }

        changed = true;
        chapterChanged = true;
        sectionChanged = true;
        return { ...point, masteryState: '已学习' as const };
      });

      return sectionChanged ? { ...section, children: nextPoints } : section;
    });

    return chapterChanged ? { ...chapter, children: nextSections } : chapter;
  });

  return changed ? nextTree : tree;
}
