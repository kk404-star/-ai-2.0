import React, { useState } from 'react';
import { BookOpenCheck, ChevronDown, ChevronUp, Download, Sparkles, X } from 'lucide-react';
import { SubjectType, WrongQuestion } from '../types';
import { CustomDropdownSelect } from '../components/SubjectSelect';

interface WrongQuestionsViewProps {
  wrongQuestions: WrongQuestion[];
  currentSubject: SubjectType;
  onOpenWrongQuestion: (question: WrongQuestion) => void;
}

const SUBJECTS = ['全科', '数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  wrongQuestions,
  currentSubject,
  onOpenWrongQuestion,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>(currentSubject);
  const [expandedWrongIds, setExpandedWrongIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [includeExported, setIncludeExported] = useState(false);
  const [exportedWrongIds, setExportedWrongIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kaiqiao-exported-wrong-ids') || '[]') as string[]; } catch { return []; }
  });

  const toggleWrongQuestion = (id: string) => {
    setExpandedWrongIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const collectedWrongQuestions = wrongQuestions.filter((item) => subjectFilter === '全科' || item.subject === subjectFilter);
  const questionsToExport = includeExported ? collectedWrongQuestions : collectedWrongQuestions.filter((question) => !exportedWrongIds.includes(question.id));
  const handleExportWrongQuestions = () => {
    if (questionsToExport.length === 0) return;
    const quote = (value: unknown) => `"${String(value ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`;
    const optionText = (question: WrongQuestion, key: string) => question.options?.find((option) => option.key === key)?.text || '';
    const rows = questionsToExport.map((question) => [question.questionText, optionText(question, 'A'), optionText(question, 'B'), optionText(question, 'C'), optionText(question, 'D')]);
    const csv = `\uFEFF${[['题目', '选项 A', '选项 B', '选项 C', '选项 D'], ...rows].map((row) => row.map(quote).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `错题导出-${subjectFilter}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    const nextIds = [...new Set([...exportedWrongIds, ...questionsToExport.map((question) => question.id)])];
    setExportedWrongIds(nextIds);
    localStorage.setItem('kaiqiao-exported-wrong-ids', JSON.stringify(nextIds));
    setShowExportModal(false);
  };

  return (
    <div className="space-y-4 px-4 pb-28 pt-4 animate-fade-in md:px-8 md:pt-6 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-1.5 text-base font-extrabold text-slate-900"><BookOpenCheck className="h-5 w-5 text-emerald-600" />我的错题</h2>
          <p className="mt-1 text-xs text-slate-500">统一查看、复习与导出已收录错题</p>
        </div>
        <div className="w-32 shrink-0"><CustomDropdownSelect value={subjectFilter} onChange={setSubjectFilter} options={SUBJECTS} placeholder="选择学科" /></div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="text-sm font-black text-slate-900">已收录错题</h3><p className="mt-0.5 text-[11px] text-slate-500">共 {collectedWrongQuestions.length} 题</p></div>
          <button type="button" onClick={() => setShowExportModal(true)} className="flex items-center gap-1 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-700"><Download className="h-3.5 w-3.5" />导出</button>
        </div>
        <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {collectedWrongQuestions.map((question) => {
            const isExpanded = expandedWrongIds.includes(question.id);
            return (
              <div key={question.id} className={`self-start overflow-hidden rounded-2xl border bg-white shadow-2xs transition-colors ${isExpanded ? 'border-emerald-300' : 'border-slate-200/80 hover:border-emerald-200'}`}>
                <button type="button" onClick={() => toggleWrongQuestion(question.id)} aria-expanded={isExpanded} className="w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500">
                  <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">{question.subject}</span><span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">{question.errorCategory}</span></div><span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">{question.addedAt || question.date}{isExpanded ? <ChevronUp className="h-4 w-4 text-emerald-600" /> : <ChevronDown className="h-4 w-4" />}</span></div>
                  <p className={`mt-3 text-sm font-bold leading-relaxed text-slate-900 ${isExpanded ? '' : 'line-clamp-2'}`}>{question.questionText}</p>
                  <p className="mt-2 truncate text-[10px] font-semibold text-emerald-600">考点：{question.knowledgePoints?.join('、') || question.topic}</p>
                </button>
                {isExpanded && <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3 animate-fade-in">{question.options?.length ? <div className="space-y-2"><p className="text-xs font-bold text-slate-600">题目选项</p><div className="space-y-1.5">{question.options.map((option) => { const isCorrect = question.correctAnswer.includes(option.key); const isUser = question.userAnswer.includes(option.key); return <div key={option.key} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : isUser ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${isCorrect ? 'bg-emerald-600 text-white' : isUser ? 'bg-rose-500 text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>{option.key}</span><span>{option.text}</span></div>; })}</div></div> : null}<div className="rounded-xl bg-slate-50 p-3"><p className="flex items-center gap-1 text-xs font-bold text-emerald-800"><Sparkles className="h-4 w-4 text-emerald-600" />答案与解析</p><p className="mt-2 text-xs font-bold text-slate-800">正确答案：{question.correctAnswer}</p><div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">{question.steps?.length ? question.steps.map((step, index) => <p key={index}>{step}</p>) : <p>围绕“{question.topic}”的关键条件逐步判断。</p>}</div></div><button type="button" onClick={() => onOpenWrongQuestion(question)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">重新复习</button></div>}
              </div>
            );
          })}
          {collectedWrongQuestions.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center md:col-span-2"><BookOpenCheck className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">还没有收录错题</p><p className="mt-1 text-xs text-slate-400">完成拍照批改后，可选择加入错题本</p></div>}
        </div>
      </section>

      {showExportModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"><div className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900"><Download className="h-5 w-5 text-emerald-600" />导出错题</h3><button type="button" aria-label="关闭导出错题" onClick={() => setShowExportModal(false)} className="p-1 text-slate-400"><X className="h-5 w-5" /></button></div><p className="text-xs leading-relaxed text-slate-500">导出当前学科的题目和选项，不包含答案与解析。</p><label className="flex cursor-pointer items-start gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={includeExported} onChange={(event) => setIncludeExported(event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-600" /><span className="text-xs leading-relaxed text-slate-600"><b className="text-slate-800">包含此前已导出的题目</b><br />不勾选时，仅导出尚未导出的题目。</span></label><p className="text-xs font-semibold text-slate-500">本次将导出 {questionsToExport.length} 题</p><div className="flex gap-2"><button type="button" onClick={() => setShowExportModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600">取消</button><button type="button" disabled={questionsToExport.length === 0} onClick={handleExportWrongQuestions} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white disabled:bg-slate-200 disabled:text-slate-400">确认导出</button></div></div></div>}
    </div>
  );
};
