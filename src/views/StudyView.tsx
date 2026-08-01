import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layers, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { SubjectType, ScreenType, KnowledgeCategory } from '../types';
import { sampleKnowledgeTree } from '../data/initialData';
import { SubjectSelect } from '../components/SubjectSelect';

interface StudyViewProps {
  categories: KnowledgeCategory[];
  currentSubject: SubjectType;
  onSubjectChange: (subject: SubjectType) => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  onSelectKnowledgePointForPractice?: (title: string) => void;
}

const SUBJECTS: SubjectType[] = ['数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const StudyView: React.FC<StudyViewProps> = ({
  categories,
  currentSubject,
  onSubjectChange,
  onNavigateToScreen,
  onSelectKnowledgePointForPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'全部' | '基础' | '提高' | '冲刺'>('全部');

  // Collapsible state for Tree Chapters (L1) and Sections (L2)
  const [expandedL1, setExpandedL1] = useState<Record<string, boolean>>({
    'MATH-L1-01': true,
  });

  const [expandedL2, setExpandedL2] = useState<Record<string, boolean>>({
    'MATH-L2-01': true,
  });

  // Expand state for showing more than 2 points in a section
  const [showAllPointsMap, setShowAllPointsMap] = useState<Record<string, boolean>>({});

  const toggleL1 = (code: string) => {
    setExpandedL1((prev) => ({ ...prev, [code]: !(prev[code] ?? false) }));
  };

  const toggleL2 = (code: string) => {
    setExpandedL2((prev) => ({ ...prev, [code]: !(prev[code] ?? false) }));
  };

  const toggleShowAllPoints = (secCode: string) => {
    setShowAllPointsMap((prev) => ({ ...prev, [secCode]: !prev[secCode] }));
  };

  const filteredTree = sampleKnowledgeTree.filter((chapter) =>
    chapter.subject === currentSubject &&
    (chapter.title.includes(searchQuery) ||
      chapter.children.some(
        (sec) =>
          sec.title.includes(searchQuery) ||
          sec.children.some((p) => p.title.includes(searchQuery))
      ))
  );

  return (
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索三级知识点、考纲或章节编号 (如 MATH-L3-01)..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Difficulty Filter Chips */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">难度:</span>
        {(['全部', '基础', '提高', '冲刺'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedDifficulty === diff
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Three-Level Knowledge Tree Section */}
      <div className="space-y-3 pt-1">
        {/* Header with Title and Subject Pills inline */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>知识点目录</span>
          </h2>

          {/* Subject Dropdown Select */}
          <SubjectSelect
            value={currentSubject}
            onChange={onSubjectChange}
            size="sm"
          />
        </div>

        {/* Knowledge Tree Chapters */}
        <div className="space-y-3">
          {filteredTree.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center text-xs text-slate-400 border border-slate-200">
              当前学科暂无匹配的三级知识点，请调整搜索条件或切换学科。
            </div>
          ) : (
            filteredTree.map((chapter, chapterIdx) => {
              const isL1Open = expandedL1[chapter.code] ?? (chapterIdx === 0);
              return (
                <div
                  key={chapter.code}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
                >
                  {/* Level 1 Chapter Header */}
                  <div
                    onClick={() => toggleL1(chapter.code)}
                    className="p-3.5 bg-slate-50/90 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between border-b border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">
                        章
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{chapter.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {chapter.children.length} 节
                      </span>
                      {isL1Open ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Level 2 Sections List */}
                  {isL1Open && (
                    <div className="p-3 space-y-3 bg-white">
                      {chapter.children.map((sec, secIdx) => {
                        const isL2Open = expandedL2[sec.code] ?? (secIdx === 0);
                        const isShowingAll = showAllPointsMap[sec.code] ?? false;
                        const visiblePoints = isShowingAll ? sec.children : sec.children.slice(0, 2);

                        return (
                          <div
                            key={sec.code}
                            className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40"
                          >
                            {/* Level 2 Section Header */}
                            <div
                              onClick={() => toggleL2(sec.code)}
                              className="p-3 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-100 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                                  节
                                </span>
                                <h4 className="text-xs font-bold text-slate-800 truncate">
                                  {sec.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                  {sec.children.length} 个知识点
                                </span>
                                {isL2Open ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                            </div>

                            {/* Level 3 Points List */}
                            {isL2Open && (
                              <div className="p-2.5 space-y-2 bg-slate-50/60">
                                {visiblePoints.map((point) => (
                                  <div
                                    key={point.code}
                                    className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2 hover:border-emerald-400 transition-all"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                                            知识点
                                          </span>
                                          <span className="text-xs font-bold text-slate-900">
                                            {point.title}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                          编号: {point.code}
                                        </p>
                                      </div>

                                      {/* Mastery State Badge */}
                                      <span
                                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                                          point.masteryState === '稳定掌握'
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                            : point.masteryState === '待验证'
                                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                                            : point.masteryState === '待复习'
                                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                                            : 'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                      >
                                        {point.masteryState}
                                      </span>
                                    </div>

                                    {/* Bound Questions Count & Action Row */}
                                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                                      {point.boundQuestionCount > 0 ? (
                                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          关联真题 {point.boundQuestionCount} 道
                                        </span>
                                      ) : (
                                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                          基础概念考点
                                        </span>
                                      )}

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => onNavigateToScreen('knowledge_study')}
                                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1"
                                        >
                                          <Sparkles className="w-3 h-3 text-emerald-600" />
                                          <span>学习</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (onSelectKnowledgePointForPractice) {
                                              onSelectKnowledgePointForPractice(point.title);
                                            }
                                            onNavigateToScreen('practice');
                                          }}
                                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all active:scale-95 flex items-center gap-1"
                                        >
                                          <span>练题</span>
                                          <ChevronRight className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Toggle button for > 2 items */}
                                {sec.children.length > 2 && (
                                  <button
                                    onClick={() => toggleShowAllPoints(sec.code)}
                                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-200/80 flex items-center justify-center gap-1 transition-all active:scale-98 shadow-2xs"
                                  >
                                    {isShowingAll ? (
                                      <>
                                        <span>收起知识点</span>
                                        <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                                      </>
                                    ) : (
                                      <>
                                        <span>展开全部 {sec.children.length} 个知识点</span>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>


    </div>
  );
};

