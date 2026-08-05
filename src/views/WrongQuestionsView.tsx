import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Lightbulb, Play } from 'lucide-react';
import { QuizQuestion, SubjectType, WrongQuestion } from '../types';
import { CustomDropdownSelect } from '../components/SubjectSelect';

interface WrongQuestionsViewProps {
  wrongQuestions: WrongQuestion[];
  questionBank: QuizQuestion[];
  currentSubject: SubjectType;
  selectedKnowledgePointTitle?: string | null;
  workspaceMode: 'wrong' | 'bank';
  onWorkspaceModeChange: (mode: 'wrong' | 'bank') => void;
  onStartKnowledgeStudy: (title: string) => void;
  onOpenWrongQuestion: (item: WrongQuestion) => void;
  onStartQuestionBankPractice: () => void;
}

const SUBJECTS = ['全部学科', '数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  wrongQuestions,
  questionBank,
  currentSubject,
  selectedKnowledgePointTitle,
  workspaceMode,
  onWorkspaceModeChange,
  onStartKnowledgeStudy,
  onOpenWrongQuestion,
  onStartQuestionBankPractice,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>(currentSubject);
  const [selectedWeakTitle, setSelectedWeakTitle] = useState<string | null>(null);

  const weakKnowledgeItems = useMemo(() => {
    const stats = new Map<string, { subject: SubjectType; wrongCount: number }>();
    wrongQuestions
      .filter((item) => subjectFilter === '全部学科' || item.subject === subjectFilter)
      .forEach((item) => {
        const points = item.knowledgePoints?.length ? [...new Set(item.knowledgePoints)] : [item.topic];
        points.forEach((title) => {
          const current = stats.get(title) || { subject: item.subject, wrongCount: 0 };
          current.wrongCount += 1;
          stats.set(title, current);
        });
      });

    return Array.from(stats.entries())
      .map(([title, item]) => ({ ...item, title }))
      .sort((a, b) => b.wrongCount - a.wrongCount || a.title.localeCompare(b.title));
  }, [subjectFilter, wrongQuestions]);

  const normalizeTitle = (value: string) => value.replace(/[\s的与及·、（）()Δ]/g, '').toLowerCase();
  const bankQuestions = questionBank.filter((item) => {
    if (item.subject !== currentSubject) return false;
    if (!selectedKnowledgePointTitle) return true;
    const questionTitle = normalizeTitle(item.knowledgePoint);
    const selectedTitle = normalizeTitle(selectedKnowledgePointTitle);
    return questionTitle.includes(selectedTitle) || selectedTitle.includes(questionTitle);
  });

  const switcher = (
    <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
      <button type="button" onClick={() => onWorkspaceModeChange('wrong')} className={`rounded-lg py-2 text-xs font-bold transition-all ${workspaceMode === 'wrong' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'}`}>薄弱知识点</button>
      <button type="button" onClick={() => onWorkspaceModeChange('bank')} className={`rounded-lg py-2 text-xs font-bold transition-all ${workspaceMode === 'bank' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'}`}>题库练习</button>
    </div>
  );

  if (workspaceMode === 'bank') {
    return (
      <div className="space-y-4 px-5 pb-28 pt-4 animate-fade-in">
        {switcher}
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><p className="text-[10px] font-bold text-emerald-600">已学知识点题库</p><h2 className="mt-1 truncate text-sm font-extrabold text-slate-900">{selectedKnowledgePointTitle || `${currentSubject}已学知识点`}</h2><p className="mt-1 text-xs text-slate-500">共匹配 {bankQuestions.length} 道题</p></div>
            <button type="button" disabled={bankQuestions.length === 0} onClick={onStartQuestionBankPractice} className="flex shrink-0 items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs disabled:bg-slate-200 disabled:text-slate-400"><Play className="h-3.5 w-3.5 fill-current" />开始练习</button>
          </div>
        </div>
        <div className="space-y-2.5">
          {bankQuestions.map((question, index) => <div key={question.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700"><BookOpen className="h-3.5 w-3.5" />第 {index + 1} 题</span></div><p className="mt-2 line-clamp-2 text-xs font-bold leading-relaxed text-slate-900">{question.questionText}</p><p className="mt-2 truncate text-[10px] font-medium text-slate-400">考点：{question.knowledgePoint}</p></div>)}
          {bankQuestions.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center"><BookOpen className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">该知识点暂无匹配题目</p></div>}
        </div>
      </div>
    );
  }

  const relatedWrongQuestions = selectedWeakTitle
    ? wrongQuestions.filter((item) => (item.knowledgePoints?.length ? item.knowledgePoints : [item.topic]).includes(selectedWeakTitle))
    : [];

  if (selectedWeakTitle) {
    return (
      <div className="space-y-4 px-5 pb-28 pt-4 animate-fade-in">
        {switcher}
        <div className="flex items-center gap-2"><button type="button" onClick={() => setSelectedWeakTitle(null)} className="rounded-full p-1 text-slate-500 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /></button><div><h2 className="text-base font-extrabold text-slate-900">{selectedWeakTitle}</h2><p className="mt-0.5 text-xs text-slate-500">已收录错题 {relatedWrongQuestions.length} 题</p></div></div>
        <div className="space-y-3">
          {relatedWrongQuestions.map((item) => <button type="button" key={item.id} onClick={() => onOpenWrongQuestion(item)} className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 text-left card-shadow transition-colors hover:border-emerald-300"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">{item.subject}</span><span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">{item.errorCategory}</span></div><span className="text-[10px] font-mono text-slate-400">{item.addedAt || item.date}</span></div><p className="mt-3 text-sm font-bold leading-relaxed text-slate-900">{item.questionText}</p><span className="mt-3 inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">查看解析与举一反三<ChevronRight className="h-3.5 w-3.5" /></span></button>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-5 pb-28 pt-4 animate-fade-in">
      {switcher}
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="flex items-center gap-1.5 text-base font-extrabold text-slate-900"><Lightbulb className="h-5 w-5 fill-amber-400 text-amber-500" />薄弱知识点</h2><p className="mt-1 text-xs text-slate-500">根据已收录错题自动归纳</p></div>
        <div className="w-32 shrink-0"><CustomDropdownSelect value={subjectFilter} onChange={setSubjectFilter} options={SUBJECTS} placeholder="全部学科" /></div>
      </div>

      <div className="space-y-3">
        {weakKnowledgeItems.map((item) => (
          <div key={`${item.subject}-${item.title}`} className="rounded-2xl border border-slate-200/80 bg-white p-4 card-shadow">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">{item.subject}</span><span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">关联错题 {item.wrongCount} 题</span></div>
            <div className="mt-3 flex items-center justify-between gap-3"><h3 className="min-w-0 truncate text-sm font-extrabold text-slate-900">{item.title}</h3><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => onStartKnowledgeStudy(item.title)} className="rounded-xl border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-700">学习知识点</button><button type="button" onClick={() => setSelectedWeakTitle(item.title)} className="flex items-center gap-0.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">查看错题<ChevronRight className="h-3.5 w-3.5" /></button></div></div>
          </div>
        ))}
        {weakKnowledgeItems.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center"><Lightbulb className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">暂无薄弱知识点</p><p className="mt-1 text-xs text-slate-400">拍照批改并收录错题后，会自动归纳</p></div>}
      </div>
    </div>
  );
};
