import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle,
  ZoomIn, 
  Clock, 
  ChevronRight,
  Check,
  ArrowLeft,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  X,
  Sparkles,
  Eye,
  LayoutGrid,
  FileCheck
} from 'lucide-react';
import { QuizQuestion, ScreenType, QuestionType } from '../types';
import { sampleQuestionsList } from '../data/initialData';

interface PracticeViewProps {
  question: QuizQuestion;
  knowledgePointTitle?: string | null;
  onNavigateToScreen: (screen: ScreenType) => void;
  onCompleteQuiz?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  question: initialQuestion,
  knowledgePointTitle,
  onNavigateToScreen,
  onCompleteQuiz,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const currentQuestion = sampleQuestionsList[activeQuestionIndex] || initialQuestion;

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [fillAnswers, setFillAnswers] = useState<string>('');
  const [essayStepsInput, setEssayStepsInput] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);

  // Track answered questions status across all questions
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});
  // Question sheet modal
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentType: QuestionType = currentQuestion.questionType || (currentQuestion.options ? '选择题' : '解答题');

  const handleNextQuestion = () => {
    if (activeQuestionIndex < sampleQuestionsList.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setIsSubmitted(false);
      setSelectedKey(null);
      setFillAnswers('');
      setEssayStepsInput('');
      setUploadedImages([]);
    } else {
      if (onCompleteQuiz) onCompleteQuiz();
      onNavigateToScreen('tab');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setAnsweredQuestions((prev) => ({ ...prev, [activeQuestionIndex]: true }));
  };

  const jumpToQuestion = (idx: number) => {
    setActiveQuestionIndex(idx);
    setIsSubmitted(!!answeredQuestions[idx]);
    setSelectedKey(null);
    setFillAnswers('');
    setEssayStepsInput('');
    setUploadedImages([]);
    setShowAnswerSheet(false);
  };

  const canSubmit = () => {
    if (currentType === '选择题' || currentType === '判断题') {
      return !!selectedKey;
    }
    if (currentType === '填空题') {
      return fillAnswers.trim().length > 0;
    }
    if (currentType === '解答题' || currentType === '综合题') {
      return essayStepsInput.trim().length > 0 || uploadedImages.length > 0;
    }
    return true;
  };

  return (
    <div className="px-5 pt-4 pb-32 space-y-4 animate-fade-in relative min-h-screen">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200/80 card-shadow">
        <button
          onClick={() => onNavigateToScreen('tab')}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> 退出
        </button>

        {/* Question Selector Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-[60%] sm:max-w-[70%]">
          {sampleQuestionsList.map((q, idx) => {
            const isCurrent = activeQuestionIndex === idx;
            const isAnswered = !!answeredQuestions[idx];

            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/80'
                    : 'bg-transparent text-slate-600 hover:bg-slate-200/60'
                }`}
                title={`第 ${idx + 1} 题 ${isAnswered ? '(已答)' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-200/60 shrink-0">
          <Clock className="w-3.5 h-3.5 text-emerald-600" /> 12:45
        </span>
      </div>

      {/* Target Knowledge Point Banner */}
      <div className="bg-emerald-50/90 border border-emerald-200/90 px-3.5 py-2 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-emerald-900">
            绑定考点：{knowledgePointTitle || currentQuestion.knowledgePoint || '二次函数与方程'}
          </span>
        </div>
        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
          精准匹配真题
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl card-shadow p-4 space-y-3 border border-slate-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md">
              {currentType}
            </span>
            <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {currentQuestion.difficultyLabel}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">{currentQuestion.knowledgePoint}</span>
        </div>

        {/* Question Text */}
        <p className="text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
          {currentQuestion.questionText}
        </p>

        {/* Diagram Image */}
        {currentQuestion.diagramImage && (
          <div
            onClick={() => setShowDiagramModal(true)}
            className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-900 cursor-zoom-in group border border-slate-200/80"
          >
            <img
              src={currentQuestion.diagramImage}
              alt="Diagram"
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-medium flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5" />
              查看大图
            </div>
          </div>
        )}
      </div>

      {/* Answer Area */}
      {/* 1. 选择题 / 判断题 */}
      {(currentType === '选择题' || currentType === '判断题') && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options?.map((opt) => {
              const isSelected = selectedKey === opt.key;
              const isCorrect = isSubmitted && opt.key === currentQuestion.correctOptionKey;
              const isWrong = isSubmitted && isSelected && opt.key !== currentQuestion.correctOptionKey;

              return (
                <button
                  key={opt.key}
                  disabled={isSubmitted}
                  onClick={() => setSelectedKey(opt.key)}
                  className={`flex items-center text-left p-3.5 rounded-2xl border transition-all active:scale-98 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : isWrong
                      ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                      : isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 text-slate-900 font-bold ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-white border-slate-200/80 text-slate-900 hover:border-emerald-500/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {opt.key}
                  </div>
                  <p className="ml-3 text-sm font-medium flex-1">{opt.text}</p>
                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Analysis Card */}
          {isSubmitted && (
            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 text-xs text-slate-800 space-y-2 animate-fade-in mt-3">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {selectedKey === currentQuestion.correctOptionKey ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 回答正确！
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-rose-500" /> 正确答案：{currentQuestion.correctOptionKey}
                  </span>
                )}
              </div>
              <p className="text-slate-700 leading-relaxed font-medium pt-1 border-t border-emerald-200/60">
                <span className="font-bold text-emerald-900">【题目解析】</span>
                切线斜率 $k = f'(1) = 4$。切点为 $(1, 2)$。由点斜式方程 $y - 2 = 4(x - 1)$ 展开得 $y = 4x - 2$。故正确答案为 {currentQuestion.correctOptionKey}。
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. 填空题 */}
      {currentType === '填空题' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold text-slate-800">请输入答案：</h3>
            <input
              type="text"
              disabled={isSubmitted}
              value={fillAnswers}
              onChange={(e) => setFillAnswers(e.target.value)}
              placeholder="请输入最终计算答案"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {isSubmitted && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 text-xs text-slate-800 space-y-2 animate-fade-in">
              <p className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                标准答案：{currentQuestion.sampleFinalAnswer}
              </p>
              <div className="space-y-1 text-slate-700 font-medium pt-1 border-t border-emerald-200/60">
                {currentQuestion.sampleStepSolution?.map((step, sIdx) => (
                  <p key={sIdx}>{step}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. 解答题 / 综合题 */}
      {(currentType === '解答题' || currentType === '综合题') && (
        <div className="space-y-3">
          {/* Hidden File Input for Image Upload / Camera Capture */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">书面推导步骤：</h3>
              <span className="text-[10px] text-slate-400 font-normal">支持输入文字或拍照上传</span>
            </div>

            <textarea
              disabled={isSubmitted}
              value={essayStepsInput}
              onChange={(e) => setEssayStepsInput(e.target.value)}
              placeholder="在此输入书面推导步骤（如：(1) 配方得 y = (x - m)² - 1 ...）"
              className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />

            {/* Uploaded Image Thumbnails Grid */}
            {uploadedImages.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    已上传作答图片 ({uploadedImages.length} 张)
                  </span>
                  {isSubmitted && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI OCR 手写识别完成
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1 hide-scrollbar">
                  {uploadedImages.map((imgSrc, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="relative w-20 h-20 rounded-xl border border-slate-200 bg-slate-100 shrink-0 overflow-hidden group shadow-2xs"
                    >
                      <img
                        src={imgSrc}
                        alt={`Answer sheet ${imgIdx + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewImageSrc(imgSrc)}
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewImageSrc(imgSrc)}
                          className="p-1 bg-white/90 rounded-full text-slate-800 hover:bg-white"
                          title="查看大图"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!isSubmitted && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgIdx)}
                            className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                            title="删除图片"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo / Upload Button */}
            {!isSubmitted && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>拍照 / 上传答题纸</span>
                </button>
              </div>
            )}
          </div>

          {isSubmitted && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 text-xs text-slate-800 space-y-2 animate-fade-in">
              <p className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                参考标准解答过程：
              </p>
              <div className="space-y-1 text-slate-700 font-medium pt-1 border-t border-emerald-200/60">
                {currentQuestion.sampleStepSolution?.map((step, sIdx) => (
                  <p key={sIdx}>{step}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md p-3.5 border-t border-slate-200 z-40 shadow-lg rounded-t-2xl">
        {isSubmitted ? (
          <button
            onClick={handleNextQuestion}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <span>{activeQuestionIndex < sampleQuestionsList.length - 1 ? '下一题' : '完成本次练习'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="w-full h-12 bg-emerald-600 disabled:bg-slate-300 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center shadow-md active:scale-98 transition-all"
          >
            提交答案
          </button>
        )}
      </div>

      {/* Diagram Zoom Modal */}
      {showDiagramModal && (
        <div
          onClick={() => setShowDiagramModal(false)}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={currentQuestion.diagramImage}
            alt="Full Diagram"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl bg-white p-2"
          />
        </div>
      )}

      {/* Uploaded Answer Image Zoom Modal */}
      {previewImageSrc && (
        <div
          onClick={() => setPreviewImageSrc(null)}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImageSrc}
              alt="Uploaded Answer Sheet"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl bg-white p-2"
            />
            <button
              type="button"
              onClick={() => setPreviewImageSrc(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center font-bold hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* Full Answer Sheet Modal (答题卡) */}
      {showAnswerSheet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-up border border-slate-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">练习答题卡</h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    共 {sampleQuestionsList.length} 题 · 已完成 {Object.keys(answeredQuestions).length} 题
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAnswerSheet(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Legend */}
            <div className="flex items-center justify-around bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-300" />
                <span className="text-slate-700">正在作答</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400" />
                <span className="text-slate-700">已作答 ({Object.keys(answeredQuestions).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300" />
                <span className="text-slate-700">未作答 ({sampleQuestionsList.length - Object.keys(answeredQuestions).length})</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2.5 py-1 max-h-64 overflow-y-auto p-1">
              {sampleQuestionsList.map((q, idx) => {
                const isCurrent = activeQuestionIndex === idx;
                const isAnswered = !!answeredQuestions[idx];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-11 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center relative border ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30 scale-105'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className="text-[9px] font-normal opacity-80">
                      {q.questionType?.slice(0, 2) || '题目'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAnswerSheet(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                继续做题
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAnswerSheet(false);
                  if (onCompleteQuiz) onCompleteQuiz();
                  onNavigateToScreen('tab');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all active:scale-95"
              >
                结束并提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

