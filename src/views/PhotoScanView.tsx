import React, { useState, useRef } from 'react';
import { Camera, Image, Sparkles, Edit3, X, Check, BookOpenCheck, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { CorrectionRecord, SubjectType, WrongQuestion } from '../types';
import { CustomDropdownSelect } from '../components/SubjectSelect';

interface PhotoScanViewProps {
  records: CorrectionRecord[];
  wrongQuestions: WrongQuestion[];
  onNavigateToDetail: (record: CorrectionRecord) => void;
  onOpenWrongQuestion: (question: WrongQuestion) => void;
}

const SUBJECTS: SubjectType[] = ['数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const PhotoScanView: React.FC<PhotoScanViewProps> = ({
  records,
  wrongQuestions,
  onNavigateToDetail,
  onOpenWrongQuestion,
}) => {
  const [photoMode, setPhotoMode] = useState<'single' | 'multi'>('single');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('数学');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('图片上传中...');
  
  // OCR Edit Confirmation Modal State
  const [showOcrConfirmModal, setShowOcrConfirmModal] = useState(false);
  const [currentEditingRecord, setCurrentEditingRecord] = useState<CorrectionRecord | null>(null);
  const [ocrQuestionText, setOcrQuestionText] = useState('');
  const [ocrUserAnswer, setOcrUserAnswer] = useState('');
  const [expandedWrongIds, setExpandedWrongIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSubject, setExportSubject] = useState<string>('全部学科');
  const [includeExported, setIncludeExported] = useState(false);
  const [exportedWrongIds, setExportedWrongIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kaiqiao-exported-wrong-ids') || '[]') as string[]; } catch { return []; }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toggleWrongQuestion = (id: string) => setExpandedWrongIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  const exportCandidates = wrongQuestions.filter((question) => exportSubject === '全部学科' || question.subject === exportSubject);
  const questionsToExport = includeExported ? exportCandidates : exportCandidates.filter((question) => !exportedWrongIds.includes(question.id));
  const handleExportWrongQuestions = () => {
    if (questionsToExport.length === 0) return;
    const quote = (value: unknown) => `"${String(value ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`;
    const optionText = (question: WrongQuestion, key: string) => question.options?.find((option) => option.key === key)?.text || '';
    const rows = questionsToExport.map((question) => [question.questionText, optionText(question, 'A'), optionText(question, 'B'), optionText(question, 'C'), optionText(question, 'D')]);
    const csv = `\uFEFF${[['题目', '选项 A', '选项 B', '选项 C', '选项 D'], ...rows].map((row) => row.map(quote).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `错题导出-${exportSubject === '全部学科' ? '全部学科' : exportSubject}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    const nextIds = [...new Set([...exportedWrongIds, ...questionsToExport.map((question) => question.id)])];
    setExportedWrongIds(nextIds);
    localStorage.setItem('kaiqiao-exported-wrong-ids', JSON.stringify(nextIds));
    setShowExportModal(false);
  };
  const handleStartCaptureProcess = (sampleRecordIndex: number = 0) => {
    const targetRecord = records[sampleRecordIndex] || records[0];
    setIsScanning(true);
    setScanStepText('图片上传与预处理...');

    setTimeout(() => {
      setScanStepText('AI OCR 识别题目与手写解法...');
    }, 600);

    setTimeout(() => {
      setScanStepText('整理题目结构与切分...');
    }, 1200);

    setTimeout(() => {
      setIsScanning(false);
      setCurrentEditingRecord(targetRecord);
      setOcrQuestionText(targetRecord.questionText);
      setOcrUserAnswer(targetRecord.userAnswer);
      setShowOcrConfirmModal(true);
    }, 1800);
  };

  const handleConfirmOcrAndGrade = () => {
    setShowOcrConfirmModal(false);
    if (currentEditingRecord) {
      const updatedRecord = {
        ...currentEditingRecord,
        questionText: ocrQuestionText,
        userAnswer: ocrUserAnswer,
        subject: selectedSubject,
      };
      onNavigateToDetail(updatedRecord);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleStartCaptureProcess(0);
    }
  };

  return (
    <div className="px-5 pt-4 pb-28 space-y-5 animate-fade-in">
      {/* Subject Mandatory Picker */}
      <div className="bg-white p-3.5 rounded-2xl card-shadow border border-slate-200/80 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900">选择题目学科（必选）：</span>
          <span className="text-[11px] text-emerald-600 font-bold">已选：{selectedSubject}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Selector Chips */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200/80 flex shadow-xs">
        <button
          onClick={() => setPhotoMode('single')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            photoMode === 'single'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          一道题 (大题/微小问)
        </button>
        <button
          onClick={() => setPhotoMode('multi')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            photoMode === 'multi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          多道题 (整页练习)
        </button>
      </div>

      {/* Main Camera Capture Area */}
      <div className="relative border-2 border-dashed border-emerald-500/80 rounded-3xl p-8 bg-emerald-50/40 text-center space-y-4 shadow-xs hover:bg-emerald-50/70 transition-all">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {isScanning ? (
          <div className="py-6 space-y-3">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center animate-bounce">
              <Sparkles className="w-8 h-8 text-emerald-700 animate-spin" />
            </div>
            <p className="text-sm font-bold text-emerald-800">{scanStepText}</p>
            <p className="text-xs text-slate-500">根据 PRD 规范，批改前可确认和修正文字</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleStartCaptureProcess(0)}
              className="w-20 h-20 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center mx-auto active:scale-90 transition-all"
            >
              <Camera className="w-9 h-9" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">点击拍照或上传图片</h3>
              <p className="text-xs text-slate-500 mt-1">模式：{photoMode === 'single' ? '一道完整大题' : '多道试题拆分'}</p>
            </div>

            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 shadow-xs"
              >
                <Image className="w-3.5 h-3.5 text-emerald-600" />
                从相册选择
              </button>
            </div>
          </>
        )}
      </div>

      {/* Collected wrong questions */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">已收录错题</h3>
          <div className="flex items-center gap-2"><span className="text-xs font-semibold text-slate-500">共 {wrongQuestions.length} 题</span><button type="button" onClick={() => setShowExportModal(true)} className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-bold text-emerald-700"><Download className="h-3.5 w-3.5" />导出</button></div>
        </div>

        <div className="space-y-2.5">
          {wrongQuestions.map((question) => (
            <div key={question.id} onClick={() => toggleWrongQuestion(question.id)} className="cursor-pointer bg-white p-3.5 rounded-2xl card-shadow border border-slate-200/80 space-y-2 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-600">{question.subject}</span><span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">{question.errorCategory}</span></div><div className="flex items-center gap-1.5"><span className="text-[11px] font-mono text-slate-400">收录于 {question.addedAt || question.date}</span>{expandedWrongIds.includes(question.id) ? <ChevronUp className="h-4 w-4 text-emerald-600" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}</div></div>
              <p className={`text-sm font-bold leading-relaxed text-slate-900 ${expandedWrongIds.includes(question.id) ? '' : 'line-clamp-2'}`}>{question.questionText}</p>
              <p className="text-xs font-semibold text-emerald-600">考点：{question.knowledgePoints?.join('、') || question.topic}</p>
              {expandedWrongIds.includes(question.id) && <div className="space-y-3 border-t border-slate-100 pt-3 animate-fade-in" onClick={(event) => event.stopPropagation()}>{question.options?.length ? <div className="space-y-2"><p className="text-xs font-bold text-slate-600">题目选项</p><div className="space-y-1.5">{question.options.map((option) => { const isCorrect = question.correctAnswer.includes(option.key); const isUser = question.userAnswer.includes(option.key); return <div key={option.key} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : isUser ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isCorrect ? 'bg-emerald-600 text-white' : isUser ? 'bg-rose-500 text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>{option.key}</span><span>{option.text}</span></div>; })}</div></div> : null}<div className="space-y-1.5"><p className="flex items-center gap-1 text-xs font-bold text-emerald-800"><Sparkles className="h-4 w-4 text-emerald-600" />解析</p><div className="space-y-1.5 text-xs font-medium leading-relaxed text-slate-600">{question.steps?.length ? question.steps.map((step, index) => <p key={index}>{step}</p>) : <p>围绕“{question.topic}”的关键条件逐步判断，正确答案为：{question.correctAnswer}。</p>}</div></div><button type="button" onClick={() => onOpenWrongQuestion(question)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">复习</button></div>}
            </div>
          ))}
          {wrongQuestions.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center"><BookOpenCheck className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">还没有收录错题</p><p className="mt-1 text-xs text-slate-400">完成拍照批改后，可选择加入错题</p></div>}
        </div>
      </div>

      {showExportModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"><div className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900"><Download className="h-5 w-5 text-emerald-600" />导出错题</h3><button type="button" onClick={() => setShowExportModal(false)} className="p-1 text-slate-400"><X className="h-5 w-5" /></button></div><p className="text-xs leading-relaxed text-slate-500">导出内容仅包含题目和选项，不包含答案与解析。</p><div className="space-y-1.5"><span className="text-xs font-bold text-slate-700">导出学科</span><CustomDropdownSelect value={exportSubject} onChange={setExportSubject} options={['全部学科', ...SUBJECTS]} placeholder="全部学科" /></div><label className="flex cursor-pointer items-start gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={includeExported} onChange={(event) => setIncludeExported(event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-600" /><span className="text-xs leading-relaxed text-slate-600"><b className="text-slate-800">包含此前已导出的题目</b><br />不勾选时，仅导出尚未导出的题目。</span></label><p className="text-xs font-semibold text-slate-500">本次将导出 {questionsToExport.length} 题</p><div className="flex gap-2"><button type="button" onClick={() => setShowExportModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600">取消</button><button type="button" disabled={questionsToExport.length === 0} onClick={handleExportWrongQuestions} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white disabled:bg-slate-200 disabled:text-slate-400">确认导出</button></div></div></div>}

      {/* PRD 10.10 & 10.11 OCR Recognition Confirmation & Editing Drawer Modal */}
      {showOcrConfirmModal && (
        <div className="fixed md:absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center p-3 overflow-hidden">
          <div className="bg-white w-full max-w-[420px] rounded-3xl p-4 shadow-2xl space-y-3.5 animate-slide-up border-t-4 border-emerald-500 max-h-[90%] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">确认并修正识别结果</h4>
              </div>
              <button
                onClick={() => setShowOcrConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  识别到的题目内容：
                </label>
                <textarea
                  rows={3}
                  value={ocrQuestionText}
                  onChange={(e) => setOcrQuestionText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  识别到的本人解答：
                </label>
                <textarea
                  rows={2}
                  value={ocrUserAnswer}
                  onChange={(e) => setOcrUserAnswer(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowOcrConfirmModal(false)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmOcrAndGrade}
                className="flex-1 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                确认并开始批改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
