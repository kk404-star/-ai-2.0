import React, { useState } from 'react';
import { Camera, ChevronDown, ChevronUp, CheckCircle2, RefreshCw, HelpCircle, FileText, XCircle, Sparkles } from 'lucide-react';
import { ERROR_CATEGORIES, WrongQuestion, ScreenType } from '../types';
import { CustomDropdownSelect } from '../components/SubjectSelect';

interface WrongQuestionsViewProps {
  wrongQuestions: WrongQuestion[];
  onNavigateToScreen: (screen: ScreenType) => void;
  onSelectWrongItemForInstantLearning?: (item: WrongQuestion) => void;
}

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  wrongQuestions,
  onNavigateToScreen,
  onSelectWrongItemForInstantLearning,
}) => {
  const [statusFilter, setStatusFilter] = useState<'全部' | '未复习' | '复习中' | '已掌握'>('全部');
  const [subjectFilter, setSubjectFilter] = useState<string>('全部学科');
  const [errorFilter, setErrorFilter] = useState<string>('全部错因');
  const [expandedIds, setExpandedIds] = useState<string[]>(['wq-1']); // default expand the first one for quick inspection

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredList = wrongQuestions.filter((item) => {
    if (statusFilter !== '全部' && item.reviewStatus !== statusFilter) return false;
    if (subjectFilter !== '全部学科' && item.subject !== subjectFilter) return false;
    if (errorFilter !== '全部错因' && item.errorCategory !== errorFilter) return false;
    return true;
  });

  return (
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in">
      {/* Top Status Filter Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {(['全部', '未复习', '复习中', '已掌握'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Dropdown Selectors */}
      <div className="grid grid-cols-3 gap-2">
        {/* Subject Filter */}
        <CustomDropdownSelect
          value={subjectFilter}
          onChange={(val) => setSubjectFilter(val)}
          options={['全部学科', '数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治']}
          placeholder="全部学科"
        />

        {/* Error Filter */}
        <CustomDropdownSelect
          value={errorFilter}
          onChange={(val) => setErrorFilter(val)}
          options={['全部错因', ...ERROR_CATEGORIES]}
          placeholder="全部错因"
        />

        {/* Difficulty Selector */}
        <CustomDropdownSelect
          value="全部难度"
          onChange={() => {}}
          options={['全部难度', '基础', '提升', '压轴']}
          placeholder="全部难度"
        />
      </div>

      {/* Wrong Question Cards List */}
      <div className="space-y-3 pt-1">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center card-shadow border border-slate-200/80">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-slate-900">暂无符合条件的错题</p>
            <p className="text-xs text-slate-500 mt-1">太棒了，继续保持！</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isExpanded = expandedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 card-shadow border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3"
              >
                {/* Card Header (Clickable to toggle) */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="cursor-pointer space-y-2 select-none"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.subject === '数学'
                            ? 'bg-blue-50 text-blue-600'
                            : item.subject === '物理'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {item.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold">
                        {item.errorCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{item.date}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Question Text Preview / Full text */}
                  <p className={`text-sm text-slate-900 font-medium leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {item.questionText}
                  </p>

                  {!isExpanded && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                        考点：{item.knowledgePoints?.join('、') || item.topic} ▾
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{item.difficulty}题</span>
                    </div>
                  )}
                </div>

                {/* Expanded Detailed Analysis Section */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3.5 animate-fade-in">
                    {/* Options for Choice Questions (Vertical Single Column when Expanded) */}
                    {item.options && item.options.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">题目选项：</span>
                        <div className="flex flex-col space-y-2">
                          {item.options.map((opt) => {
                            const isCorrect = item.correctAnswer.startsWith(opt.key) || item.correctAnswer.includes(opt.key);
                            const isUser = item.userAnswer.startsWith(opt.key) || item.userAnswer.includes(opt.key);
                            return (
                              <div
                                key={opt.key}
                                className={`px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-3 border transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                    : isUser
                                    ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : isUser
                                      ? 'bg-rose-500 text-white shadow-2xs'
                                      : 'bg-white border border-slate-300 text-slate-600'
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <span className="leading-snug pt-0.5">{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* Optional Question Image */}
                    {item.image && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center p-2">
                        <img
                          src={item.image}
                          alt="Question Graphic"
                          className="max-h-44 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* AI Smart Diagnosis & Step Analysis */}
                    <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/50 p-3 rounded-xl border border-emerald-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>AI 错因点拨与解题思路</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          AI 智能诊断
                        </span>
                      </div>

                      <div className="space-y-1.5 text-slate-700 font-medium leading-relaxed font-mono">
                        {item.steps && item.steps.length > 0 ? (
                          item.steps.map((step, idx) => (
                            <p key={idx} className="bg-white/90 p-2.5 rounded-lg border border-emerald-100/80 shadow-2xs">
                              {step}
                            </p>
                          ))
                        ) : (
                          <p className="bg-white/90 p-2.5 rounded-lg border border-emerald-100/80">
                            通过理解【{item.topic}】的核心推导公式，分析可知正确选项为：{item.correctAnswer}。
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Practice Action */}
                    <div className="flex items-center justify-end pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (onSelectWrongItemForInstantLearning) {
                              onSelectWrongItemForInstantLearning(item);
                            }
                            onNavigateToScreen('instant_learning');
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 rounded-xl transition-all active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          错题强化
                        </button>

                        <button
                          onClick={() => {
                            if (onSelectWrongItemForInstantLearning) {
                              onSelectWrongItemForInstantLearning(item);
                            }
                            onNavigateToScreen('practice_quiz');
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          复练此题
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

