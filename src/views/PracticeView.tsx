import React, { useMemo, useState, useRef } from 'react';
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
  FileCheck,
  Circle,
} from 'lucide-react';
import { QuizQuestion, ScreenType, QuestionType, WrongQuestion, SubjectType } from '../types';
import { sampleQuestionsList } from '../data/initialData';

interface PracticeViewProps {
  question: QuizQuestion;
  knowledgePointTitle?: string | null;
  wrongQuestions?: WrongQuestion[];
  questionBank?: QuizQuestion[];
  learnedKnowledgePointTitles?: string[];
  currentSubject?: SubjectType;
  questionBankOnly?: boolean;
  deferredResults?: boolean;
  onNavigateToScreen: (screen: ScreenType) => void;
  onCompleteQuiz?: (completedQuestionIds: string[]) => void;
  onQuestionCompleted?: (questionId: string) => void;
  onUnresolvedQuestion?: (question: QuizQuestion, userAnswer: string) => void;
  onResolvedInSession?: (question: QuizQuestion, firstWrongAnswer: string) => void;
  onContinueQuestionBank?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  question: initialQuestion,
  knowledgePointTitle,
  wrongQuestions = [],
  questionBank = sampleQuestionsList,
  learnedKnowledgePointTitles = [],
  currentSubject,
  questionBankOnly = false,
  deferredResults = false,
  onNavigateToScreen,
  onCompleteQuiz,
  onQuestionCompleted,
  onUnresolvedQuestion,
  onResolvedInSession,
  onContinueQuestionBank,
}) => {
  const availableQuestionBank = useMemo(
    () => [...questionBank, ...sampleQuestionsList.filter((seedQuestion) => !questionBank.some((question) => question.id === seedQuestion.id))],
    [questionBank]
  );

  const questions = useMemo<QuizQuestion[]>(() => {
    const toWrongQuestion = (item: WrongQuestion, index: number, total: number): QuizQuestion => {
      const correctOptionKey = item.options
        ? item.correctAnswer.match(/^([A-D])(?:[.\s、]|$)/)?.[1]
        : undefined;

      return {
        id: `wrong-practice-${item.id}`,
        questionNumber: index + 1,
        totalQuestions: total,
        subject: item.subject,
        difficulty: item.difficulty,
        difficultyLabel: `${item.difficulty}错题`,
        questionType: item.options ? '选择题' : '解答题',
        knowledgePoint: item.knowledgePoints?.[0] || item.topic,
        questionText: item.questionText,
        options: item.options,
        correctOptionKey,
        sampleFinalAnswer: item.correctAnswer,
        sampleStepSolution: item.steps,
        aiHint: `这是你的历史错题。先独立重做，再对照解析找出原错因。`,
        practiceStatus: item.reviewStatus === '已掌握' ? '已练习' : '未练习',
      };
    };

    if (questionBankOnly && !knowledgePointTitle) {
      const subjectQuestions = availableQuestionBank.filter((item) => !currentSubject || item.subject === currentSubject);
      return subjectQuestions.map((item, index) => ({ ...item, questionNumber: index + 1, totalQuestions: subjectQuestions.length }));
    }

    if (!knowledgePointTitle) {
      const normalize = (value: string) => value.replace(/[\s的与及·、（）()Δ]/g, '').toLowerCase();
      const isLearnedKnowledge = (questionTitle: string) => {
        const normalizedQuestion = normalize(questionTitle);
        return learnedKnowledgePointTitles.some((title) => {
          const normalizedLearned = normalize(title);
          if (normalizedQuestion.includes(normalizedLearned) || normalizedLearned.includes(normalizedQuestion)) return true;
          const bigrams = Array.from({ length: Math.max(0, normalizedQuestion.length - 1) }, (_, index) => normalizedQuestion.slice(index, index + 2));
          return bigrams.filter((gram) => normalizedLearned.includes(gram)).length >= 2;
        });
      };

      const wrongPool = wrongQuestions.filter((item) => !currentSubject || item.subject === currentSubject);
      const learnedBankPool = availableQuestionBank.filter((item) =>
        (!currentSubject || item.subject === currentSubject) && isLearnedKnowledge(item.knowledgePoint)
      );
      const selectedWrong = wrongPool.slice(0, 2);
      const selectedBank = learnedBankPool.slice(0, Math.max(0, 5 - selectedWrong.length));
      const remainingWrong = wrongPool.slice(selectedWrong.length, selectedWrong.length + Math.max(0, 5 - selectedWrong.length - selectedBank.length));
      const wrongQuizQuestions = [...selectedWrong, ...remainingWrong].map((item, index) => toWrongQuestion(item, index, 5));
      const selected = [...wrongQuizQuestions, ...selectedBank];
      const selectedIds = new Set(selected.map((item) => item.id));
      const fallbackBank = availableQuestionBank.filter((item) =>
        (!currentSubject || item.subject === currentSubject) && !selectedIds.has(item.id)
      );
      const todayQuestions = [...selected, ...fallbackBank].slice(0, 5);
      return todayQuestions.map((item, index) => ({ ...item, questionNumber: index + 1, totalQuestions: todayQuestions.length }));
    }

    const matchedWrongQuestions = wrongQuestions.filter((item) =>
      (item.knowledgePoints?.length ? item.knowledgePoints : [item.topic]).includes(knowledgePointTitle)
    );

    const normalize = (value: string) => value.replace(/[\s的与及·、（）()Δ]/g, '').toLowerCase();
    const selectedTitle = normalize(knowledgePointTitle);
    const matchedBankQuestions = availableQuestionBank.filter((item) => {
      const questionTitle = normalize(item.knowledgePoint);
      if (questionTitle.includes(selectedTitle) || selectedTitle.includes(questionTitle)) return true;
      const bigrams = Array.from({ length: Math.max(0, questionTitle.length - 1) }, (_, index) => questionTitle.slice(index, index + 2));
      return bigrams.filter((gram) => selectedTitle.includes(gram)).length >= 2;
    });

    if (questionBankOnly) {
      return matchedBankQuestions.map((item, index) => ({ ...item, questionNumber: index + 1, totalQuestions: matchedBankQuestions.length }));
    }

    if (matchedWrongQuestions.length === 0) return matchedBankQuestions;

    return matchedWrongQuestions.map((item, index) => toWrongQuestion(item, index, matchedWrongQuestions.length));
  }, [availableQuestionBank, currentSubject, knowledgePointTitle, learnedKnowledgePointTitles, questionBankOnly, wrongQuestions]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[activeQuestionIndex] || initialQuestion;

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [fillAnswers, setFillAnswers] = useState<string>('');
  const [essayStepsInput, setEssayStepsInput] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);

  // Track answered questions status across all questions
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});
  const [questionResults, setQuestionResults] = useState<Record<number, boolean>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, string>>({});
  const [answerDrafts, setAnswerDrafts] = useState<Record<number, {
    selectedKey: string | null;
    fillAnswers: string;
    essayStepsInput: string;
    uploadedImages: string[];
  }>>({});
  const [showBatchResults, setShowBatchResults] = useState(false);
  const [isTodayLearningCompleted, setIsTodayLearningCompleted] = useState(false);
  // Question sheet modal
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentType: QuestionType = currentQuestion.questionType || (currentQuestion.options ? '选择题' : '解答题');
  const correctCount = Object.values(questionResults).filter(Boolean).length;
  const wrongCount = Math.max(0, questions.length - correctCount);
  const resultFeedback = correctCount === questions.length
    ? '今天的知识点掌握得很稳，保持这个节奏！'
    : correctCount >= Math.ceil(questions.length * 0.6)
      ? '整体表现不错，把错题再巩固一遍，会更扎实。'
      : '没关系，今天已经找到了需要补强的地方，继续加油！';

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setIsSubmitted(false);
      setSelectedKey(null);
      setFillAnswers('');
      setEssayStepsInput('');
      setUploadedImages([]);
    } else {
      if (deferredResults) {
        setShowBatchResults(true);
        return;
      }
      if (onCompleteQuiz) onCompleteQuiz(getCompletedQuestionIds());
      onNavigateToScreen('tab');
    }
  };

  const getCompletedQuestionIds = () => Object.entries(answeredQuestions)
    .filter(([, completed]) => completed)
    .map(([index]) => questions[Number(index)]?.id)
    .filter((id): id is string => Boolean(id));

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
    const isCorrect = currentType === '选择题' || currentType === '判断题'
      ? selectedKey === currentQuestion.correctOptionKey
      : currentType === '填空题'
      ? fillAnswers.trim() === (currentQuestion.sampleFinalAnswer || '').trim()
      : true;
    setIsSubmitted(true);
    setAnsweredQuestions((prev) => ({ ...prev, [activeQuestionIndex]: true }));
    setQuestionResults((prev) => ({ ...prev, [activeQuestionIndex]: isCorrect }));
    setSubmittedAnswers((prev) => ({
      ...prev,
      [activeQuestionIndex]: currentType === '选择题' || currentType === '判断题'
        ? selectedKey || '未作答'
        : currentType === '填空题'
          ? fillAnswers.trim()
          : essayStepsInput.trim() || `已上传 ${uploadedImages.length} 张作答图片`,
    }));
    setAnswerDrafts((prev) => ({
      ...prev,
      [activeQuestionIndex]: { selectedKey, fillAnswers, essayStepsInput, uploadedImages },
    }));
    if (!deferredResults) onQuestionCompleted?.(currentQuestion.id);
  };

  const jumpToQuestion = (idx: number) => {
    setActiveQuestionIndex(idx);
    setIsSubmitted(!!answeredQuestions[idx]);
    const draft = answerDrafts[idx];
    setSelectedKey(draft?.selectedKey || null);
    setFillAnswers(draft?.fillAnswers || '');
    setEssayStepsInput(draft?.essayStepsInput || '');
    setUploadedImages(draft?.uploadedImages || []);
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
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in relative min-h-full">
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
          {questions.map((q, idx) => {
            const isCurrent = activeQuestionIndex === idx;
            const isAnswered = !!answeredQuestions[idx];
            const isCorrect = questionResults[idx];
            const wasPracticed = q.practiceStatus === '已练习';

            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center shrink-0 ${
                  !deferredResults && isCurrent && isSubmitted && isCorrect === false
                    ? 'bg-rose-500 text-white shadow-2xs scale-105'
                    : isCurrent
                    ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                    : isAnswered && !deferredResults
                    ? isCorrect
                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/80'
                      : 'bg-rose-50 text-rose-700 font-bold border border-rose-300/80'
                    : wasPracticed
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-transparent text-slate-600 hover:bg-slate-200/60'
                }`}
                title={`第 ${idx + 1} 题 ${isAnswered ? '(已作答)' : wasPracticed ? '(已练习)' : '(未练习)'}`}
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
              const isCorrect = !deferredResults && isSubmitted && opt.key === currentQuestion.correctOptionKey;
              const isWrong = !deferredResults && isSubmitted && isSelected && opt.key !== currentQuestion.correctOptionKey;

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
          {isSubmitted && !deferredResults && (
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

          {isSubmitted && !deferredResults && (
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

          {isSubmitted && !deferredResults && (
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
      <div className="mobile-fixed-footer">
        {isSubmitted ? (
          <button
            onClick={handleNextQuestion}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <span>{activeQuestionIndex < questions.length - 1 ? '下一题' : deferredResults ? '查看全部答案' : '完成本次练习'}</span>
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

      {showBatchResults && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-50 px-5 py-6 animate-fade-in">
          <div className="mx-auto w-full max-w-md space-y-4">
            <div className="rounded-2xl bg-emerald-700 p-5 text-white shadow-lg">
              <p className="text-[10px] font-black tracking-[0.14em] text-emerald-100">今日学习已交卷</p>
              <h2 className="mt-1 text-xl font-black">今日练习完成</h2>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/10 px-2 py-2.5">
                  <span className="block text-lg font-black">{questions.length}</span>
                  <span className="text-[9px] font-bold text-emerald-100">完成题数</span>
                </div>
                <div className="rounded-xl bg-white/10 px-2 py-2.5">
                  <span className="block text-lg font-black text-emerald-100">{correctCount}</span>
                  <span className="text-[9px] font-bold text-emerald-100">答对</span>
                </div>
                <div className="rounded-xl bg-white/10 px-2 py-2.5">
                  <span className="block text-lg font-black text-amber-200">{wrongCount}</span>
                  <span className="text-[9px] font-bold text-emerald-100">答错</span>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/10 p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-xs font-bold leading-5 text-white">{resultFeedback}</p>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-900">5 题答案与解析</h3>
              <span className="text-[10px] font-bold text-slate-400">一次性公布</span>
            </div>

            <div className="space-y-3">
              {questions.map((item, index) => {
                const correctAnswer = item.correctOptionKey || item.sampleFinalAnswer || '请查看标准解题步骤';
                return (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-slate-900">第 {index + 1} 题</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${questionResults[index] ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                        {questionResults[index] ? '正确' : '需要巩固'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-700">{item.questionText}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-xl bg-slate-50 p-2.5">
                        <span className="block text-[9px] font-bold text-slate-400">你的答案</span>
                        <span className="mt-1 block font-black text-slate-700">{submittedAnswers[index] || '未作答'}</span>
                      </div>
                      <div className="rounded-xl bg-emerald-50 p-2.5">
                        <span className="block text-[9px] font-bold text-emerald-700/60">正确答案</span>
                        <span className="mt-1 block font-black text-emerald-800">{correctAnswer}</span>
                      </div>
                    </div>
                    {item.sampleStepSolution?.length ? (
                      <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-500">
                        {item.sampleStepSolution.map((step, stepIndex) => <p key={stepIndex}>{step}</p>)}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {!isTodayLearningCompleted ? (
              <button
                type="button"
                onClick={() => {
                  const completedIds = getCompletedQuestionIds();
                  completedIds.forEach((id) => onQuestionCompleted?.(id));
                  setIsTodayLearningCompleted(true);
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-white text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                <Circle className="h-5 w-5" />
                完成今日学习
              </button>
            ) : (
              <div className="space-y-2.5 animate-fade-in">
                <div className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-black text-emerald-800 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-5 w-5 fill-emerald-600 text-white" />
                  今日学习已完成
                </div>
                <button
                  type="button"
                  onClick={() => onContinueQuestionBank?.()}
                  className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
                >
                  继续练题
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                    共 {questions.length} 题 · 已完成 {Object.keys(answeredQuestions).length} 题
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
                <span className="text-slate-700">未作答 ({questions.length - Object.keys(answeredQuestions).length})</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2.5 py-1 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isCurrent = activeQuestionIndex === idx;
                const isAnswered = !!answeredQuestions[idx];
                const isCorrect = questionResults[idx];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-11 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center relative border ${
                      isCurrent && isSubmitted && isCorrect === false
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30 scale-105'
                        : isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30 scale-105'
                        : isAnswered
                        ? isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-300 font-extrabold hover:bg-rose-100'
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
                  if (onCompleteQuiz) onCompleteQuiz(getCompletedQuestionIds());
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
