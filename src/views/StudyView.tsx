import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layers, AlertTriangle, Check, CheckCircle2, GraduationCap, Sparkles, X } from 'lucide-react';
import { SubjectType, ScreenType, KnowledgeCategory, KnowledgeL1Chapter, KnowledgeCard } from '../types';
import { SubjectSelect } from '../components/SubjectSelect';

interface StudyViewProps {
  categories: KnowledgeCategory[];
  knowledgeTree: KnowledgeL1Chapter[];
  knowledgeCards: KnowledgeCard[];
  currentSubject: SubjectType;
  onSubjectChange: (subject: SubjectType) => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  onSelectKnowledgePointForPractice?: (title: string, code?: string) => void;
  onOpenQuestionBank?: (title: string, code?: string) => void;
  onMarkKnowledgeAsLearned?: (code: string) => void;
}

interface LearnedModalState {
  code: string;
  title: string;
  subject: SubjectType;
  chapterTitle: string;
  sectionTitle: string;
  phase: 'confirm' | 'success';
}

const SUBJECTS: SubjectType[] = ['数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const StudyView: React.FC<StudyViewProps> = ({
  categories,
  knowledgeTree,
  knowledgeCards,
  currentSubject,
  onSubjectChange,
  onNavigateToScreen,
  onSelectKnowledgePointForPractice,
  onOpenQuestionBank,
  onMarkKnowledgeAsLearned,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [learnedModal, setLearnedModal] = useState<LearnedModalState | null>(null);

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

  const filteredTree = knowledgeTree.filter((chapter) =>
    chapter.subject === currentSubject &&
    (chapter.title.includes(searchQuery) ||
      chapter.children.some(
        (sec) =>
          sec.title.includes(searchQuery) ||
          sec.children.some((p) => p.title.includes(searchQuery))
      ))
  );
  const subjectKnowledgeCards = knowledgeCards.filter((card) => card.subject === currentSubject);

  return (
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索知识点"
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Generated Knowledge Cards from the unified evidence base */}
      {subjectKnowledgeCards.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800">我的知识卡片</h2>
            <span className="text-[10px] text-slate-400"></span>
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
            {subjectKnowledgeCards.map((card) => (
              <div
                key={card.id}
                className={`w-56 shrink-0 rounded-xl border p-3 ${
                  card.type === '练习卡'
                    ? 'border-emerald-200 bg-emerald-50/80'
                    : 'border-blue-200 bg-blue-50/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    card.type === '练习卡' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {card.type}
                  </span>
                  {card.type === '学习卡' ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectKnowledgePointForPractice?.(card.title, card.knowledgeCode);
                          onNavigateToScreen('knowledge_study');
                        }}
                        className="text-blue-700 transition-colors hover:text-blue-900"
                      >
                        继续学习
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenQuestionBank?.(card.title, card.knowledgeCode);
                        }}
                        className="text-emerald-700 transition-colors hover:text-emerald-900"
                      >
                        开始练题
                      </button>
                    </div>
                  ) : card.unpracticedQuestionCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenQuestionBank?.(card.title, card.knowledgeCode);
                      }}
                      className="text-[10px] font-bold text-emerald-700 transition-colors hover:text-emerald-900"
                    >
                      开始练题
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">{card.status}</span>
                  )}
                </div>
                <p className="mt-2 truncate text-xs font-bold text-slate-900">{card.title}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{card.evidenceText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    <div className="flex min-w-0 items-center">
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
                              <div className="flex min-w-0 items-center">
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
                                {visiblePoints.map((point) => {
                                  const unpracticedCount = Math.max(0, point.boundQuestionCount - point.practicedQuestionCount);
                                  return (
                                  <div
                                    key={point.code}
                                    className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2 hover:border-emerald-400 transition-all"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center">
                                          <span className="text-xs font-bold text-slate-900">
                                            {point.title}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Quiet metadata-style mastery state */}
                                      <span className={`shrink-0 pt-0.5 font-mono text-[10px] font-semibold ${
                                        point.masteryState === '已练习'
                                          ? 'text-emerald-600'
                                          : point.masteryState === '已学习'
                                          ? 'text-blue-600'
                                          : point.masteryState === '学习中'
                                          ? 'text-amber-600'
                                          : 'text-slate-400'
                                      }`}>
                                        {point.masteryState}
                                      </span>
                                    </div>

                                    {/* Question Bank Progress & Action Row */}
                                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                                      {point.boundQuestionCount > 0 ? (
                                        <div className="flex items-center gap-1 text-[10px] font-bold">
                                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-700">已练 {point.practicedQuestionCount}</span>
                                          <span className={`rounded-md px-1.5 py-0.5 ${unpracticedCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
                                            未练 {unpracticedCount}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                          基础概念考点
                                        </span>
                                      )}

                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onSelectKnowledgePointForPractice?.(point.title, point.code);
                                            onNavigateToScreen('knowledge_study');
                                          }}
                                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1"
                                        >
                                          <Sparkles className="w-3 h-3 text-emerald-600" />
                                          <span>学习</span>
                                        </button>

                                        {point.masteryState === '未学习' || point.masteryState === '学习中' ? (
                                          <button
                                            type="button"
                                            onClick={() => setLearnedModal({
                                              code: point.code,
                                              title: point.title,
                                              subject: chapter.subject,
                                              chapterTitle: chapter.title,
                                              sectionTitle: sec.title,
                                              phase: 'confirm',
                                            })}
                                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-2xs transition-all hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95"
                                          >
                                            <GraduationCap className="h-3 w-3" />
                                            <span>标记已学</span>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => onOpenQuestionBank?.(point.title, point.code)}
                                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-2xs transition-all hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95"
                                          >
                                            <span>{point.masteryState === '已练习' ? '再练习' : '去练习'}</span>
                                            <ChevronRight className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  );
                                })}

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

      {learnedModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-5 backdrop-blur-[2px]"
          onClick={() => setLearnedModal(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="learned-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[350px] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLearnedModal(null)}
              aria-label="关闭"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <X className="h-4 w-4" />
            </button>

            {learnedModal.phase === 'success' ? (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
                </div>
                <h2 id="learned-dialog-title" className="mt-4 text-xl font-black tracking-tight text-slate-950">已标记为已学</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">很好，接下来用练习验证掌握程度</p>
              </div>
            ) : (
              <div className="pr-8">
                <p className="text-[10px] font-black tracking-[0.14em] text-emerald-700/65">学习状态确认</p>
                <h2 id="learned-dialog-title" className="mt-1 text-xl font-black tracking-tight text-slate-950">确认标记为已学？</h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">如果你已经在学校学过，可以跳过 AI 讲解，直接练习巩固。</p>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-left">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-black leading-5 text-slate-900">{learnedModal.title}</p>
                <p className="mt-1 truncate text-[10px] font-bold text-slate-500">
                  {learnedModal.subject} · {learnedModal.sectionTitle}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {learnedModal.phase === 'confirm' ? (
                <button
                  type="button"
                  onClick={() => {
                    onMarkKnowledgeAsLearned?.(learnedModal.code);
                    setLearnedModal((current) => current ? { ...current, phase: 'success' } : current);
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-md transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  确认标记
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onSelectKnowledgePointForPractice?.(learnedModal.title, learnedModal.code);
                    onOpenQuestionBank?.(learnedModal.title, learnedModal.code);
                    setLearnedModal(null);
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-md transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  去练习巩固 <ChevronRight className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setLearnedModal(null)}
                className="h-11 w-full rounded-xl text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {learnedModal.phase === 'confirm' ? '取消' : '稍后再说'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
