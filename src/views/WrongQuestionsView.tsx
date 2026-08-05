import React, { useState } from 'react';
import { Camera, ChevronDown, ChevronUp, CheckCircle2, HelpCircle, FileText, XCircle, Sparkles, Download, BookOpen, Play } from 'lucide-react';
import { WrongQuestion, ScreenType, QuizQuestion, SubjectType } from '../types';
import { CustomDropdownSelect } from '../components/SubjectSelect';

interface WrongQuestionsViewProps {
  wrongQuestions: WrongQuestion[];
  questionBank: QuizQuestion[];
  currentSubject: SubjectType;
  selectedKnowledgePointTitle?: string | null;
  workspaceMode: 'wrong' | 'bank';
  onWorkspaceModeChange: (mode: 'wrong' | 'bank') => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  onSelectWrongItemForInstantLearning?: (item: WrongQuestion) => void;
  onStartQuestionBankPractice: () => void;
}

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  wrongQuestions,
  questionBank,
  currentSubject,
  selectedKnowledgePointTitle,
  workspaceMode,
  onWorkspaceModeChange,
  onNavigateToScreen,
  onSelectWrongItemForInstantLearning,
  onStartQuestionBankPractice,
}) => {
  const [statusFilter, setStatusFilter] = useState<'全部' | '未复习' | '复习中' | '已掌握'>('全部');
  const [subjectFilter, setSubjectFilter] = useState<string>('全部学科');
  const [expandedIds, setExpandedIds] = useState<string[]>(['wq-1']); // default expand the first one for quick inspection

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredList = wrongQuestions.filter((item) => {
    if (statusFilter !== '全部' && item.reviewStatus !== statusFilter) return false;
    if (subjectFilter !== '全部学科' && item.subject !== subjectFilter) return false;
    return true;
  });

  const normalizeTitle = (value: string) => value.replace(/[\s的与及·、（）()Δ]/g, '').toLowerCase();
  const bankQuestions = questionBank.filter((item) => {
    if (item.subject !== currentSubject) return false;
    if (!selectedKnowledgePointTitle) return true;
    const questionTitle = normalizeTitle(item.knowledgePoint);
    const selectedTitle = normalizeTitle(selectedKnowledgePointTitle);
    if (questionTitle.includes(selectedTitle) || selectedTitle.includes(questionTitle)) return true;
    const bigrams = Array.from({ length: Math.max(0, questionTitle.length - 1) }, (_, index) => questionTitle.slice(index, index + 2));
    return bigrams.filter((gram) => selectedTitle.includes(gram)).length >= 2;
  });

  const workspaceSwitcher = (
    <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onWorkspaceModeChange('wrong')}
        className={`rounded-lg py-2 text-xs font-bold transition-all ${workspaceMode === 'wrong' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'}`}
      >
        错题
      </button>
      <button
        type="button"
        onClick={() => onWorkspaceModeChange('bank')}
        className={`rounded-lg py-2 text-xs font-bold transition-all ${workspaceMode === 'bank' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'}`}
      >
        题库练习
      </button>
    </div>
  );

  if (workspaceMode === 'bank') {
    return (
      <div className="space-y-4 px-5 pb-28 pt-4 animate-fade-in">
        {workspaceSwitcher}
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-emerald-600">当前题库</p>
              <h2 className="mt-1 truncate text-sm font-extrabold text-slate-900">{selectedKnowledgePointTitle || `${currentSubject}已学知识点`}</h2>
              <p className="mt-1 text-xs text-slate-500">共匹配 {bankQuestions.length} 道题</p>
            </div>
            <button
              type="button"
              disabled={bankQuestions.length === 0}
              onClick={onStartQuestionBankPractice}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Play className="h-3.5 w-3.5 fill-current" />开始练习
            </button>
          </div>
        </div>
        <div className="space-y-2.5">
          {bankQuestions.map((question, index) => (
            <div key={question.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700"><BookOpen className="h-3.5 w-3.5" />第 {index + 1} 题</span>
                <span className="text-[10px] font-medium text-slate-400">{question.difficulty}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-bold leading-relaxed text-slate-900">{question.questionText}</p>
              <p className="mt-2 truncate text-[10px] font-medium text-slate-400">考点：{question.knowledgePoint}</p>
            </div>
          ))}
          {bankQuestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
              <BookOpen className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-2 text-sm font-bold text-slate-700">该知识点暂无匹配题目</p>
              <p className="mt-1 text-xs text-slate-400">可以返回知识点继续学习</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleExportWrongQuestions = () => {
    if (filteredList.length === 0) return;

    const protectSpreadsheetCell = (value: unknown) => {
      const text = String(value ?? '').replace(/\r?\n/g, ' ');
      const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safeText.replace(/"/g, '""')}"`;
    };
    const headers = ['序号', '学科', '知识点', '题目', '选项 A', '选项 B', '选项 C', '选项 D', '正确答案'];
    const rows = filteredList.map((item, index) => {
      const getOption = (key: string) => item.options?.find((option) => option.key === key)?.text || '';
      return [
        index + 1,
        item.subject,
        item.knowledgePoints?.join('、') || item.topic,
        item.questionText,
        getOption('A'),
        getOption('B'),
        getOption('C'),
        getOption('D'),
        item.correctAnswer,
      ];
    });
    const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(protectSpreadsheetCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `错题导出-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in">
      {workspaceSwitcher}
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        {/* Subject Filter */}
        <CustomDropdownSelect
          value={subjectFilter}
          onChange={(val) => setSubjectFilter(val)}
          options={['全部学科', '数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治']}
          placeholder="全部学科"
        />

        <button
          type="button"
          onClick={handleExportWrongQuestions}
          disabled={filteredList.length === 0}
          title="导出当前筛选结果"
          className="flex h-9 items-center justify-center gap-1 rounded-xl border border-emerald-300 bg-white px-3 text-xs font-bold text-emerald-700 shadow-2xs transition-all hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
        >
          <Download className="h-3.5 w-3.5" />
          导出
        </button>
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
                onClick={() => {
                  onSelectWrongItemForInstantLearning?.(item);
                  onNavigateToScreen('instant_learning');
                }}
                className="cursor-pointer bg-white rounded-2xl p-4 card-shadow border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3"
              >
                {/* Card Header */}
                <div className="space-y-2 select-none">
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
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.reviewStatus === '已掌握' ? 'bg-emerald-50 text-emerald-700' : item.reviewStatus === '复习中' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.reviewStatus}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{item.date}</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleExpand(item.id);
                        }}
                        aria-label={isExpanded ? '收起错题详情' : '展开错题详情'}
                        className="rounded-full p-1 transition-colors hover:bg-slate-100"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Question Text Preview / Full text */}
                  <p className={`text-sm text-slate-900 font-medium leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {item.questionText}
                  </p>

                  {!isExpanded && (
                    <div className="flex items-center pt-1">
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                        考点：{item.knowledgePoints?.join('、') || item.topic} ▾
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded Detailed Analysis Section */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3.5 animate-fade-in">
                    {/* Options for Choice Questions (Vertical Single Column when Expanded) */}
                    {item.options && item.options.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">题目选项：</span>
                        <div className="flex flex-col divide-y divide-slate-100">
                          {item.options.map((opt) => {
                            const isCorrect = item.correctAnswer.startsWith(opt.key) || item.correctAnswer.includes(opt.key);
                            const isUser = item.userAnswer.startsWith(opt.key) || item.userAnswer.includes(opt.key);
                            return (
                              <div
                                key={opt.key}
                                className={`flex items-center gap-3 px-1 py-2.5 text-xs ${
                                  isCorrect
                                    ? 'text-emerald-800 font-semibold'
                                    : isUser
                                    ? 'text-rose-700 font-semibold'
                                    : 'text-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : isUser
                                      ? 'bg-rose-500 text-white'
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
                    <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>解析</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-slate-600 font-medium leading-relaxed">
                        {item.steps && item.steps.length > 0 ? (
                          item.steps.map((step, idx) => (
                            <p key={idx} className="pl-5 -indent-5">
                              {step}
                            </p>
                          ))
                        ) : (
                          <p>
                            通过理解【{item.topic}】的核心推导公式，分析可知正确选项为：{item.correctAnswer}。
                          </p>
                        )}
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
