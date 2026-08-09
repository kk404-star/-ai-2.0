import React, { useEffect, useMemo, useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

import { HomeView } from './views/HomeView';
import { StudyView } from './views/StudyView';
import { WrongQuestionsView } from './views/WrongQuestionsView';
import { ProfileView } from './views/ProfileView';

import { KnowledgeStudyView } from './views/KnowledgeStudyView';
import { PhotoScanView } from './views/PhotoScanView';
import { CorrectionDetailView } from './views/CorrectionDetailView';
import { InstantLearningView } from './views/InstantLearningView';
import { PracticeView } from './views/PracticeView';
import { DiagnosticReportView } from './views/DiagnosticReportView';
import { ParentBindingView } from './views/ParentBindingView';
import { ProfileDetailsView } from './views/ProfileDetailsView';

import { 
  initialProfile, 
  initialTasks, 
  initialCategories, 
  initialWrongQuestions, 
  initialCorrectionHistory, 
  sampleQuizQuestion,
  sampleKnowledgePoint,
  sampleKnowledgeTree,
  sampleQuestionsList
} from './data/initialData';

import { 
  TabType, 
  ScreenType, 
  SubjectType, 
  StudentProfile, 
  CorrectionRecord, 
  WrongQuestion,
  QuizQuestion,
  ResolutionEvidence,
  LearningEvidenceBase,
  ERROR_CATEGORIES,
} from './types';
import {
  applyWrongQuestionReview,
  addDays,
  getDueWrongQuestions,
  isReviewDue,
  normalizeWrongQuestion,
  toLocalDateKey,
  WRONG_QUESTIONS_STORAGE_KEY,
} from './utils/wrongReview';
import { getHomeRecommendations } from './utils/homeRecommendations';
import { markKnowledgePointAsLearned } from './utils/knowledgeMastery';

export default function App() {
  const todayTaskDate = toLocalDateKey();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('tab');
  const [wrongWorkspaceMode, setWrongWorkspaceMode] = useState<'wrong' | 'bank'>('wrong');

  const [student, setStudent] = useState<StudentProfile>(initialProfile);
  const [tasks, setTasks] = useState(initialTasks);
  const [categories, setCategories] = useState(initialCategories);
  const [knowledgeTree, setKnowledgeTree] = useState(sampleKnowledgeTree);
  const [questionBank, setQuestionBank] = useState(() => sampleQuestionsList.map((question, index) => ({
    ...question,
    practiceStatus: index < 2 ? '已练习' as const : '未练习' as const,
  })));
  const [completedTodayTaskIds, setCompletedTodayTaskIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`kaiqiao-today-task-${todayTaskDate}`);
      return new Set(saved ? JSON.parse(saved) as string[] : []);
    } catch {
      return new Set();
    }
  });
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(WRONG_QUESTIONS_STORAGE_KEY);
      const items = saved ? JSON.parse(saved) as WrongQuestion[] : initialWrongQuestions;
      return items.map((item) => normalizeWrongQuestion(item));
    } catch {
      return initialWrongQuestions.map((item) => normalizeWrongQuestion(item));
    }
  });
  const [correctionHistory, setCorrectionHistory] = useState<CorrectionRecord[]>(initialCorrectionHistory);
  const [resolutionEvidence, setResolutionEvidence] = useState<ResolutionEvidence[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('kaiqiao-resolution-evidence-v1') || '[]') as ResolutionEvidence[];
    } catch {
      return [];
    }
  });
  const [immediateCorrectionItem, setImmediateCorrectionItem] = useState<WrongQuestion | null>(null);
  
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRecord>(initialCorrectionHistory[0]);
  const [selectedWrongItem, setSelectedWrongItem] = useState<WrongQuestion | null>(null);
  const [selectedKnowledgePointTitle, setSelectedKnowledgePointTitle] = useState<string | null>(null);
  const [selectedKnowledgePointCode, setSelectedKnowledgePointCode] = useState<string | null>(null);
  const todayReviewQuestions = useMemo(() => getDueWrongQuestions(wrongQuestions), [wrongQuestions]);
  const dueWrongQuestionCount = useMemo(() => wrongQuestions.filter((item) => isReviewDue(item)).length, [wrongQuestions]);

  useEffect(() => {
    localStorage.setItem(WRONG_QUESTIONS_STORAGE_KEY, JSON.stringify(wrongQuestions));
  }, [wrongQuestions]);

  useEffect(() => {
    localStorage.setItem('kaiqiao-resolution-evidence-v1', JSON.stringify(resolutionEvidence));
  }, [resolutionEvidence]);

  useEffect(() => {
    localStorage.setItem(`kaiqiao-today-task-${todayTaskDate}`, JSON.stringify([...completedTodayTaskIds]));
  }, [completedTodayTaskIds, todayTaskDate]);

  const learningEvidence = useMemo<LearningEvidenceBase>(() => {
    const knowledgePoints = knowledgeTree.flatMap((chapter) =>
      chapter.children.flatMap((section) => section.children.map((point) => ({
        knowledgeCode: point.code,
        title: point.title,
        subject: chapter.subject,
        grade: chapter.grade,
        status: point.masteryState,
        totalQuestionCount: point.boundQuestionCount,
        practicedQuestionCount: point.practicedQuestionCount,
        unpracticedQuestionCount: Math.max(0, point.boundQuestionCount - point.practicedQuestionCount),
      })))
    );

    const knowledgeCards = knowledgePoints
      .flatMap((point) => {
        if (point.status !== '已学习' && point.status !== '已练习') return [];
        return [{
          id: `${point.knowledgeCode}-${point.status}`,
          knowledgeCode: point.knowledgeCode,
          title: point.title,
          subject: point.subject,
          type: point.status === '已练习' ? '练习卡' as const : '学习卡' as const,
          status: point.status,
          evidenceText: point.status === '已练习'
            ? `已练 ${point.practicedQuestionCount} 题，待练 ${point.unpracticedQuestionCount} 题`
            : '已完成知识点学习，建议进入练习验证',
          unpracticedQuestionCount: point.unpracticedQuestionCount,
        }];
      })
      .sort((a, b) => {
        const getPriority = (card: typeof a) => {
          if (card.type === '学习卡') return 0;
          return card.unpracticedQuestionCount > 0 ? 1 : 2;
        };
        return getPriority(a) - getPriority(b);
      });

    const errorCategoryCounts = Object.fromEntries(
      ERROR_CATEGORIES.map((category) => [category, wrongQuestions.filter((item) => item.errorCategory === category).length])
    ) as LearningEvidenceBase['errorCategoryCounts'];

    return {
      knowledgePoints,
      knowledgeCards,
      totalQuestionCount: knowledgePoints.reduce((sum, point) => sum + point.totalQuestionCount, 0),
      practicedQuestionCount: knowledgePoints.reduce((sum, point) => sum + point.practicedQuestionCount, 0),
      wrongQuestionCount: wrongQuestions.length,
      unreviewedWrongQuestionCount: wrongQuestions.filter((item) => item.reviewStatus === '未复习').length,
      errorCategoryCounts,
    };
  }, [knowledgeTree, wrongQuestions]);

  const todayTaskProgress = useMemo(() => {
    const learnedTitles = learningEvidence.knowledgePoints
      .filter((point) => point.subject === student.currentSubject && (point.status === '已学习' || point.status === '已练习'))
      .map((point) => point.title);
    const normalize = (value: string) => value.replace(/[\s的与及·、（）()Δ]/g, '').toLowerCase();
    const isLearnedQuestion = (questionTitle: string) => {
      const normalizedQuestion = normalize(questionTitle);
      return learnedTitles.some((title) => {
        const normalizedLearned = normalize(title);
        if (normalizedQuestion.includes(normalizedLearned) || normalizedLearned.includes(normalizedQuestion)) return true;
        const bigrams = Array.from({ length: Math.max(0, normalizedQuestion.length - 1) }, (_, index) => normalizedQuestion.slice(index, index + 2));
        return bigrams.filter((gram) => normalizedLearned.includes(gram)).length >= 2;
      });
    };
    const wrongPool = wrongQuestions.filter((item) => item.subject === student.currentSubject);
    const bankPool = questionBank.filter((item) => item.subject === student.currentSubject && isLearnedQuestion(item.knowledgePoint));
    const selectedWrong = wrongPool.slice(0, 2);
    const selectedBank = bankPool.slice(0, Math.max(0, 5 - selectedWrong.length));
    const remainingWrong = wrongPool.slice(selectedWrong.length, selectedWrong.length + Math.max(0, 5 - selectedWrong.length - selectedBank.length));
    return {
      total: selectedWrong.length + selectedBank.length + remainingWrong.length,
      completed: [...selectedWrong, ...remainingWrong]
        .filter((item) => completedTodayTaskIds.has(`wrong-practice-${item.id}`) || item.reviewStatus === '已掌握').length
        + selectedBank.filter((item) => completedTodayTaskIds.has(item.id) || item.practiceStatus === '已练习').length,
    };
  }, [completedTodayTaskIds, learningEvidence.knowledgePoints, questionBank, student.currentSubject, wrongQuestions]);

  const homeRecommendations = useMemo(
    () => getHomeRecommendations(knowledgeTree, student.currentSubject, 3),
    [knowledgeTree, student.currentSubject],
  );

  useEffect(() => {
    if (activeScreen !== 'knowledge_study' || !selectedKnowledgePointCode) return;
    setKnowledgeTree((chapters) => chapters.map((chapter) => ({
      ...chapter,
      children: chapter.children.map((section) => ({
        ...section,
        children: section.children.map((point) => point.code === selectedKnowledgePointCode && point.masteryState === '未学习'
          ? { ...point, masteryState: '学习中' }
          : point),
      })),
    })));
  }, [activeScreen, selectedKnowledgePointCode]);

  const markSelectedKnowledgeAsLearned = () => {
    if (!selectedKnowledgePointCode) return;
    setKnowledgeTree((chapters) => markKnowledgePointAsLearned(chapters, selectedKnowledgePointCode));
  };

  const selectKnowledgePoint = (title: string, code?: string) => {
    if (!title) {
      setSelectedKnowledgePointTitle(null);
      setSelectedKnowledgePointCode(null);
      setSelectedWrongItem(null);
      return;
    }

    const normalize = (value: string) => value.replace(/[\s的与及··、（）()]/g, '').toLowerCase();
    const normalizedTitle = normalize(title);
    const points = knowledgeTree.flatMap((chapter) =>
      chapter.children.flatMap((section) => section.children)
    );

    const resolvedPoint = code
      ? points.find((point) => point.code === code)
      : points
          .map((point) => {
            const normalizedPoint = normalize(point.title);
            const titleBigrams = Array.from({ length: Math.max(0, normalizedTitle.length - 1) }, (_, index) => normalizedTitle.slice(index, index + 2));
            const score = titleBigrams.filter((gram) => normalizedPoint.includes(gram)).length;
            return { point, score, exact: normalizedPoint.includes(normalizedTitle) || normalizedTitle.includes(normalizedPoint) };
          })
          .sort((a, b) => Number(b.exact) - Number(a.exact) || b.score - a.score)[0]?.point;

    setSelectedKnowledgePointTitle(title);
    setSelectedKnowledgePointCode(code || resolvedPoint?.code || null);
    setSelectedWrongItem(null);
  };

  const selectWrongQuestion = (item: WrongQuestion) => {
    setSelectedWrongItem(item);
    selectKnowledgePoint(item.knowledgePoints?.[0] || item.topic);
    setSelectedWrongItem(item);
  };

  const openQuestionBank = (title: string, code?: string) => {
    selectKnowledgePoint(title, code);
    setWrongWorkspaceMode('bank');
    setActiveTab('wrong');
    setActiveScreen('practice');
  };

  const handleCompleteQuiz = (completedQuestionIds: string[]) => {
    const completedCount = completedQuestionIds.length;
    const completedQuestionIdSet = new Set(completedQuestionIds);
    if (completedQuestionIds.length > 0) {
      setCompletedTodayTaskIds((current) => new Set([...current, ...completedQuestionIds]));
    }
    const newlyPracticedBankCount = questionBank.filter((question) =>
      completedQuestionIdSet.has(question.id) && question.practiceStatus !== '已练习'
    ).length;

    const newlyPracticedQuestionCount = newlyPracticedBankCount;

    if (completedQuestionIdSet.size > 0) {
      setQuestionBank((questions) => questions.map((question) => completedQuestionIdSet.has(question.id)
        ? { ...question, practiceStatus: '已练习' }
        : question));
    }
    if (selectedKnowledgePointCode && completedCount > 0) {
      setKnowledgeTree((chapters) => chapters.map((chapter) => ({
        ...chapter,
        children: chapter.children.map((section) => ({
          ...section,
          children: section.children.map((point) => point.code === selectedKnowledgePointCode
            ? {
                ...point,
                masteryState: '已练习',
                practicedQuestionCount: Math.min(
                  point.boundQuestionCount,
                  point.practicedQuestionCount + newlyPracticedQuestionCount
                ),
              }
            : point),
        })),
      })));
    }
    setSelectedKnowledgePointCode(null);
    setSelectedKnowledgePointTitle(null);
    setSelectedWrongItem(null);
    setActiveScreen('tab');
    setActiveTab('study');
  };

  // Screen Title helper
  const getScreenTitle = (): string => {
    switch (activeScreen) {
      case 'knowledge_study':
        return '知识点学习';
      case 'photo_scan':
        return '拍照批改';
      case 'correction_detail':
        return '批改结果';
      case 'instant_learning':
        return '今日错题复习';
      case 'practice':
      case 'practice_quiz':
        return '考点真题练习';
      case 'today_practice':
        return '今日学习';
      case 'diagnostic_report':
        return '学习诊断报告';
      case 'parent_binding':
        return '家长绑定与监督';
      case 'profile_details':
        return '个人资料';
      default:
        if (activeTab === 'study') return '知识点学习';
        if (activeTab === 'wrong') return '错题归纳';
        if (activeTab === 'profile') return '个人中心';
        return '开窍 AI 学伴';
    }
  };

  // Subject Change
  const handleSubjectChange = (newSubject: SubjectType) => {
    setStudent((prev) => ({ ...prev, currentSubject: newSubject }));
  };

  const handleUpdateProfile = (changes: Pick<StudentProfile, 'name' | 'avatar' | 'school'>) => {
    setStudent((current) => ({ ...current, ...changes }));
  };

  // Code Activation (B2B 机构授权码)
  const handleActivateCode = (code: string): boolean => {
    if (code.trim().length >= 8) {
      setStudent((prev) => ({
        ...prev,
        activatedAuthorizationCode: code.trim(),
        aiPackageExpiry: '2027-12-31',
        monthlyTokenLimit: 250000,
        monthlyTokenRemaining: prev.monthlyTokenRemaining + 100000,
      }));
      return true;
    }
    return false;
  };

  // Token Booster Purchase (B2C 加油包)
  const handleBuyBoosterPack = (addedTokens: number) => {
    setStudent((prev) => ({
      ...prev,
      boosterTokenRemaining: prev.boosterTokenRemaining + addedTokens,
    }));
  };

  const addResolutionEvidence = (evidence: ResolutionEvidence) => {
    setResolutionEvidence((items) => [evidence, ...items.filter((item) => item.sourceQuestionId !== evidence.sourceQuestionId)]);
  };

  const createPendingWrongQuestion = (question: QuizQuestion, userAnswer: string, reason: WrongQuestion['errorCategory'] | '其他：错因不明' = '其他：错因不明'): WrongQuestion => {
    const today = toLocalDateKey();
    return {
      id: `wq-${Date.now()}`,
      subject: question.subject,
      topic: question.knowledgePoint,
      date: today,
      questionText: question.questionText,
      userAnswer,
      correctAnswer: question.correctOptionKey || question.sampleFinalAnswer || '请查看标准答案',
      errorCategory: reason === '其他：错因不明' ? '概念没理解' : reason,
      difficulty: question.difficulty,
      tags: [reason, '待修复'],
      reviewStatus: '未复习',
      addedAt: today,
      nextReviewAt: addDays(today, 1),
      reviewStage: 1,
      reviewFailureCount: 0,
      reviewAttempts: [],
      steps: question.sampleStepSolution,
      knowledgePoints: [question.knowledgePoint],
      options: question.options,
      sourceType: '系统内练习',
      sourceQuestionId: question.id,
      evaluationRule: question.questionType === '选择题' ? '按标准选项判定' : '按标准答案或评价规则判定',
      errorReasonTrace: { finalReason: reason, source: '系统兜底' },
      firstErrorEvidence: { firstWrongAnswer: userAnswer, assistanceEvidence: ['已展示解析', '已提供撤除提示后的重做入口'], createdAt: today },
      repairUnitId: `${question.subject}-${question.knowledgePoint}`,
    };
  };

  const handleUnresolvedPracticeQuestion = (question: QuizQuestion, userAnswer: string) => {
    if (wrongQuestions.some((item) => item.sourceQuestionId === question.id)) return;
    const pending = createPendingWrongQuestion(question, userAnswer);
    setWrongQuestions((items) => [pending, ...items]);
    addResolutionEvidence({
      id: `evidence-${Date.now()}`,
      sourceQuestionId: question.id,
      sourceType: '系统内练习',
      subject: question.subject,
      questionText: question.questionText,
      firstWrongAnswer: userAnswer,
      correctAnswer: pending.correctAnswer,
      assistanceEvidence: pending.firstErrorEvidence?.assistanceEvidence || [],
      status: '待修复',
      createdAt: toLocalDateKey(),
    });
  };

  const handleResolvedPracticeQuestion = (question: QuizQuestion, firstWrongAnswer: string) => {
    addResolutionEvidence({
      id: `evidence-${Date.now()}`,
      sourceQuestionId: question.id,
      sourceType: '系统内练习',
      subject: question.subject,
      questionText: question.questionText,
      firstWrongAnswer,
      correctAnswer: question.correctOptionKey || question.sampleFinalAnswer || '已通过评价规则',
      assistanceEvidence: ['已展示解析', '撤除提示后独立重做通过'],
      status: '已当场解决',
      resolvedAt: toLocalDateKey(),
      createdAt: toLocalDateKey(),
    });
  };

  // 拍照批改的题目由学生明确选择“稍后修复”后才进入待修复队列。
  const handleAddToWrongQuestions = (record: CorrectionRecord, errorCategory: CorrectionRecord['errorCategory']): boolean => {
    if (wrongQuestions.some((item) => item.sourceCorrectionId === record.id)) return false;
    const today = toLocalDateKey();
    const newWrong: WrongQuestion = {
      id: 'wq-' + Date.now(),
      subject: record.subject,
      topic: record.title,
      date: record.date,
      questionText: record.questionText,
      userAnswer: record.userAnswer,
      correctAnswer: record.correctAnswer,
      errorCategory,
      difficulty: '基础',
      tags: [errorCategory, '基础题'],
      reviewStatus: '未复习',
      sourceCorrectionId: record.id,
      addedAt: today,
      nextReviewAt: addDays(today, 1),
      reviewStage: 1,
      reviewFailureCount: 0,
      reviewAttempts: [],
      steps: record.steps,
      knowledgePoints: record.knowledgePoints,
      sourceType: '拍照批改',
      sourceQuestionId: record.id,
      evaluationRule: '按拍照批改的标准答案判定',
      errorReasonTrace: { finalReason: errorCategory, source: '学生自报', studentReportedReason: errorCategory, aiCandidateReason: record.errorCategory },
      firstErrorEvidence: { firstWrongAnswer: record.userAnswer, assistanceEvidence: ['已展示错因分析', '已展示解析步骤'], createdAt: today },
      repairUnitId: `${record.subject}-${record.knowledgePoints[0] || record.title}`,
    };

    setWrongQuestions((prev) => [newWrong, ...prev]);
    addResolutionEvidence({ id: `evidence-${Date.now()}`, sourceQuestionId: record.id, sourceType: '拍照批改', subject: record.subject, questionText: record.questionText, firstWrongAnswer: record.userAnswer, correctAnswer: record.correctAnswer, assistanceEvidence: ['已展示错因分析', '学生选择稍后修复'], status: '待修复', createdAt: today });
    return true;
  };

  const handleCompleteWrongReview = (itemId: string, originalCorrect: boolean, variantCorrect: boolean) => {
    setWrongQuestions((items) => items.map((item) => item.id === itemId
      ? applyWrongQuestionReview(item, {
          originalCorrect,
          variantCorrect,
          countedForMastery: Boolean(item.nextReviewAt && item.nextReviewAt <= toLocalDateKey()),
        })
      : item));
  };

  // Render current tab or sub-screen
  const renderContent = () => {
    if (activeScreen === 'knowledge_study') {
      return (
        <KnowledgeStudyView
          relatedWrongQuestionCount={wrongQuestions.filter((item) => {
            if (!selectedKnowledgePointTitle) return false;
            const normalize = (value: string) => value.replace(/[\s的与及··、（）()]/g, '').toLowerCase();
            const selectedTitle = normalize(selectedKnowledgePointTitle);
            return (item.knowledgePoints?.length ? item.knowledgePoints : [item.topic]).some((label) => {
              const normalizedLabel = normalize(label);
              return selectedTitle.includes(normalizedLabel) || normalizedLabel.includes(selectedTitle);
            });
          }).length}
          knowledgePoint={selectedKnowledgePointTitle
            ? {
                ...sampleKnowledgePoint,
                title: selectedKnowledgePointTitle,
                masteryState: learningEvidence.knowledgePoints.find((point) => point.knowledgeCode === selectedKnowledgePointCode)?.status || '学习中',
              }
            : sampleKnowledgePoint}
          onNavigateToQuiz={() => {
            markSelectedKnowledgeAsLearned();
            setActiveScreen('practice_quiz');
          }}
          onMarkAsLearned={markSelectedKnowledgeAsLearned}
          onStartTargetedPractice={() => setActiveScreen('practice')}
        />
      );
    }

    if (activeScreen === 'photo_scan') {
      return (
        <PhotoScanView
          records={correctionHistory}
          wrongQuestions={wrongQuestions}
          onNavigateToDetail={(rec) => {
            setSelectedCorrection(rec);
            setActiveScreen('correction_detail');
          }}
          onOpenWrongQuestion={(question) => {
            selectWrongQuestion(question);
            setActiveScreen('instant_learning');
          }}
        />
      );
    }

    if (activeScreen === 'correction_detail') {
      return (
        <CorrectionDetailView
          record={selectedCorrection}
          onAddToWrongQuestions={handleAddToWrongQuestions}
          isAlreadyAdded={wrongQuestions.some((item) => item.sourceCorrectionId === selectedCorrection.id)}
          onContinueScan={() => setActiveScreen('photo_scan')}
          onReturnHome={() => {
            setActiveScreen('tab');
            setActiveTab('home');
          }}
        />
      );
    }

    if (activeScreen === 'instant_learning') {
      return (
        <InstantLearningView
          wrongItem={selectedWrongItem}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
          onReturnHome={() => {
            setActiveScreen('tab');
            setActiveTab('home');
          }}
          isDue={Boolean(selectedWrongItem && selectedWrongItem.nextReviewAt && selectedWrongItem.nextReviewAt <= toLocalDateKey())}
          onCompleteReview={handleCompleteWrongReview}
        />
      );
    }

    if (activeScreen === 'practice' || activeScreen === 'practice_quiz' || activeScreen === 'today_practice') {
      return (
        <PracticeView
          question={sampleQuizQuestion}
          knowledgePointTitle={selectedKnowledgePointTitle}
          wrongQuestions={wrongQuestions}
          questionBank={questionBank}
          currentSubject={student.currentSubject}
          questionBankOnly={activeTab === 'wrong' && wrongWorkspaceMode === 'bank'}
          deferredResults={activeScreen === 'today_practice'}
          learnedKnowledgePointTitles={learningEvidence.knowledgePoints
            .filter((point) => point.subject === student.currentSubject && (point.status === '已学习' || point.status === '已练习'))
            .map((point) => point.title)}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
          onCompleteQuiz={handleCompleteQuiz}
          onQuestionCompleted={(questionId) => {
            setCompletedTodayTaskIds((current) => new Set([...current, questionId]));
          }}
          onUnresolvedQuestion={handleUnresolvedPracticeQuestion}
          onResolvedInSession={handleResolvedPracticeQuestion}
        />
      );
    }

    if (activeScreen === 'diagnostic_report') {
      return (
        <DiagnosticReportView
          student={student}
          learningEvidence={learningEvidence}
          onNavigateToScreen={(screen) => {
            if (screen === 'practice' || screen === 'practice_quiz') selectKnowledgePoint('');
            if (screen === 'instant_learning') {
              const reviewItem = todayReviewQuestions[0] || wrongQuestions.find((item) => item.reviewStatus !== '已掌握');
              if (reviewItem) selectWrongQuestion(reviewItem);
            }
            setActiveScreen(screen);
          }}
        />
      );
    }

    if (activeScreen === 'parent_binding') {
      return (
        <ParentBindingView
          student={student}
          onToggleParentBinding={(bound) =>
            setStudent((prev) => ({ ...prev, isParentBound: bound }))
          }
        />
      );
    }

    if (activeScreen === 'profile_details') {
      return <ProfileDetailsView student={student} onSave={handleUpdateProfile} />;
    }

    // Default Main Tab Views
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            student={student}
            todayTaskCompleted={todayTaskProgress.completed}
            todayTaskTotal={todayTaskProgress.total}
            recommendations={homeRecommendations}
            onStartTodayLearning={() => {
              selectKnowledgePoint('');
              setActiveScreen('today_practice');
            }}
            onOpenKnowledgePoint={(title, code) => {
              selectKnowledgePoint(title, code);
              setActiveScreen('knowledge_study');
            }}
            onPracticeKnowledgePoint={(title, code) => {
              selectKnowledgePoint(title, code);
              setActiveScreen('practice');
            }}
            onOpenStudyCatalog={() => {
              setActiveScreen('tab');
              setActiveTab('study');
            }}
            onOpenDiagnosticReport={() => setActiveScreen('diagnostic_report')}
          />
        );

      case 'study':
        return (
          <StudyView
            categories={categories}
            knowledgeTree={knowledgeTree}
            knowledgeCards={learningEvidence.knowledgeCards}
            currentSubject={student.currentSubject}
            onSubjectChange={handleSubjectChange}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
            onSelectKnowledgePointForPractice={selectKnowledgePoint}
            onOpenQuestionBank={openQuestionBank}
          />
        );

      case 'wrong':
        return (
          <WrongQuestionsView
            wrongQuestions={wrongQuestions}
            questionBank={questionBank}
            currentSubject={student.currentSubject}
            selectedKnowledgePointTitle={selectedKnowledgePointTitle}
            workspaceMode={wrongWorkspaceMode}
            onWorkspaceModeChange={(mode) => {
              setWrongWorkspaceMode(mode);
              if (mode === 'bank') {
                setSelectedKnowledgePointTitle(null);
                setSelectedKnowledgePointCode(null);
              }
            }}
            onStartKnowledgeStudy={(title) => {
              selectKnowledgePoint(title);
              setActiveScreen('knowledge_study');
            }}
            onOpenWrongQuestion={(item) => {
              selectWrongQuestion(item);
              setActiveScreen('instant_learning');
            }}
            onStartQuestionBankPractice={() => setActiveScreen('practice')}
          />
        );

      case 'profile':
        return (
          <ProfileView
            student={student}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
            onActivateCode={handleActivateCode}
            onBuyBoosterPack={handleBuyBoosterPack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <MobileFrame>
      {/* Header */}
      <Header
        currentScreen={activeScreen}
        screenTitle={getScreenTitle()}
        onBack={() => setActiveScreen('tab')}
      />

      {/* Main View Area */}
      <main className="app-main flex flex-1 flex-col">{renderContent()}</main>

      {/* Glassmorphism Bottom Navigation Bar (Visible in Tab mode) */}
      {activeScreen === 'tab' && (
        <Navigation
          activeTab={activeTab}
          unreviewedWrongCount={dueWrongQuestionCount}
          onTabChange={(tab) => setActiveTab(tab)}
          onScanClick={() => setActiveScreen('photo_scan')}
        />
      )}
    </MobileFrame>
  );
}
