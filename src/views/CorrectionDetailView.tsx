import React, { useEffect, useState } from 'react';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  CheckCircle2, 
  ListOrdered, 
  Bot, 
  BookMarked, 
  Sparkles,
  Check
} from 'lucide-react';
import { CorrectionRecord, ErrorCategory, ERROR_CATEGORIES, ScreenType } from '../types';

interface CorrectionDetailViewProps {
  record: CorrectionRecord;
  onNavigateToScreen: (screen: ScreenType) => void;
  onAddToWrongQuestions?: (record: CorrectionRecord, errorCategory: ErrorCategory) => void;
}

export const CorrectionDetailView: React.FC<CorrectionDetailViewProps> = ({
  record,
  onNavigateToScreen,
  onAddToWrongQuestions,
}) => {
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [isAddedToWrong, setIsAddedToWrong] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [showErrorCausePicker, setShowErrorCausePicker] = useState(false);
  const [selectedErrorCategory, setSelectedErrorCategory] = useState<ErrorCategory>(record.errorCategory);

  useEffect(() => {
    if (!showErrorCausePicker) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowErrorCausePicker(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showErrorCausePicker]);

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      setIsReanalyzing(false);
    }, 1000);
  };

  const handleAddWrong = () => {
    setIsAddedToWrong(true);
    setShowErrorCausePicker(false);
    if (onAddToWrongQuestions) {
      onAddToWrongQuestions(record, selectedErrorCategory);
    }
  };

  return (
    <div className="px-5 pt-4 pb-32 space-y-4 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900">批改结果</h2>
        <button
          onClick={handleReanalyze}
          disabled={isReanalyzing}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
          {isReanalyzing ? '分析中...' : '重新分析'}
        </button>
      </div>

      {/* Cropped Original Photo Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 h-44 group bg-slate-900">
        <img
          src={record.image}
          alt={record.title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[10px] font-medium">
          原图缩略图
        </div>
        <button
          onClick={() => setShowImageZoom(true)}
          className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-2 rounded-full text-xs flex items-center gap-1 shadow-md"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* OCR Text Box & User Answer */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-2">
          <span className="font-bold">识别文本</span>
          <span className="text-emerald-700 font-bold cursor-pointer hover:underline">
            ✎ 修正内容
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="font-bold text-slate-900">题目：</span>
            <p className="text-slate-800 font-medium leading-relaxed mt-0.5">
              {record.questionText}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-900">你的答案：</span>
            <p className="text-rose-600 font-bold font-mono leading-relaxed mt-0.5 bg-rose-50 p-2 rounded-lg border border-rose-100">
              {record.userAnswer}
            </p>
          </div>
        </div>
      </div>



      {/* Detailed Analysis Section */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-l-4 border-rose-500 pl-2">
          详细分析
        </h3>

        {/* Error Cause */}
        <div className="flex gap-3 text-xs">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold">
            !
          </div>
          <div>
            <span className="font-bold text-slate-500">错因分析</span>
            <p className="text-slate-900 font-medium mt-0.5 leading-relaxed">
              {record.errorAnalysis}
            </p>
          </div>
        </div>

        {/* Correct Answer */}
        <div className="flex gap-3 text-xs">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-500">正确答案</span>
            <p className="text-emerald-700 font-bold text-sm mt-0.5 font-mono">
              {record.correctAnswer}
            </p>
          </div>
        </div>

        {/* Solution Steps */}
        <div className="flex gap-3 text-xs">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-bold text-slate-500">解析步骤</span>
            {record.steps.map((st, i) => (
              <p key={i} className="text-slate-900 font-medium leading-relaxed">
                {st}
              </p>
            ))}
          </div>
        </div>

        {/* Related Knowledge Points */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">关联知识点：</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {record.knowledgePoints.map((kp, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100"
              >
                {kp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tutor Encouragement Box */}
      <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-medium">
          {record.encouragement}
        </p>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="mobile-fixed-footer flex gap-2.5">
        <button
          onClick={() => setShowErrorCausePicker(true)}
          disabled={isAddedToWrong}
          className={`flex-1 h-12 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            isAddedToWrong
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'border-emerald-700 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          {isAddedToWrong ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              已加入错题
            </>
          ) : (
            <>
              <BookMarked className="w-4 h-4" />
              加入错题
            </>
          )}
        </button>

        <button
          onClick={() => onNavigateToScreen('instant_learning')}
          className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          学习变式
        </button>
      </div>

      {/* Error Cause Picker */}
      {showErrorCausePicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-cause-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            onClick={() => setShowErrorCausePicker(false)}
            aria-label="关闭错因选择"
          />
          <div className="relative flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-bottom))] w-full max-w-[366px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in">
            <div className="mx-auto mb-4 mt-3 h-1 w-10 shrink-0 rounded-full bg-slate-200" />
            <div className="flex items-start justify-between gap-4 px-5">
              <div>
                <h3 id="error-cause-title" className="text-base font-bold text-slate-900">选择错因</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">请选择这道题的主要错因，加入后可按错因复习。</p>
              </div>
              <button
                type="button"
                onClick={() => setShowErrorCausePicker(false)}
                className="-mr-1 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid min-h-0 grid-cols-2 gap-2 overflow-y-auto px-5 hide-scrollbar">
              {ERROR_CATEGORIES.map((category) => {
                const isSelected = selectedErrorCategory === category;
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedErrorCategory(category)}
                    className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all active:scale-[0.98] last:col-span-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/40'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span>{category}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-100 p-4 pt-3">
              <button
                type="button"
                onClick={handleAddWrong}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                <BookMarked className="h-4 w-4" />
                确认加入错题
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Zoom Modal */}
      {showImageZoom && (
        <div
          onClick={() => setShowImageZoom(false)}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={record.image}
            alt="Full view"
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
          />
          <button
            onClick={() => setShowImageZoom(false)}
            className="absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full hover:bg-white/40"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
