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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('tab');

  const [student, setStudent] = useState<StudentProfile>(initialProfile);
  const [tasks, setTasks] = useState(initialTasks);
  const [categories, setCategories] = useState(initialCategories);
  const [knowledgeTree, setKnowledgeTree] = useState(sampleKnowledgeTree);
  const [questionBank, setQuestionBank] = useState(() => sampleQuestionsList.map((question, index) => ({
    ...question,
    practiceStatus: index < 2 ? '已练习' as const : '未练习' as const,
  })));
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
  
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRecord>(initialCorrectionHistory[0]);
  const [selectedWrongItem, setSelectedWrongItem] = useState<WrongQuestion | null>(null);
  const [selectedKnowledgePointTitle, setSelectedKnowledgePointTitle] = useState<string | null>(null);
  const [selectedKnowledgePointCode, setSelectedKnowledgePointCode] = useState<string | null>(null);
  const todayReviewQuestions = useMemo(() => getDueWrongQuestions(wrongQuestions), [wrongQuestions]);
  const dueWrongQuestionCount = useMemo(() => wrongQuestions.filter((item) => isReviewDue(item)).length, [wrongQuestions]);

  useEffect(() => {
    localStorage.setItem(WRONG_QUESTIONS_STORAGE_KEY, JSON.stringify(wrongQuestions));
  }, [wrongQuestions]);

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
    setKnowledgeTree((chapters) => chapters.map((chapter) => ({
      ...chapter,
      children: chapter.children.map((section) => ({
        ...section,
        children: section.children.map((point) => point.code === selectedKnowledgePointCode && point.masteryState !== '已练习'
          ? { ...point, masteryState: '已学习' }
          : point),
      })),
    })));
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

  const handleCompleteQuiz = (completedQuestionIds: string[]) => {
    const completedCount = completedQuestionIds.length;
    const completedQuestionIdSet = new Set(completedQuestionIds);
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
      case 'diagnostic_report':
        return '学习诊断报告';
      case 'parent_binding':
        return '家长绑定与监督';
      default:
        if (activeTab === 'study') return '精选题库';
        if (activeTab === 'wrong') return '错题本';
        if (activeTab === 'profile') return '个人中心';
        return '开窍 AI 学伴';
    }
  };

  // Subject Change
  const handleSubjectChange = (newSubject: SubjectType) => {
    setStudent((prev) => ({ ...prev, currentSubject: newSubject }));
  };

  // Code Activation (B2B 机构授权码)
  const handleActivateCode = (code: string): boolean => {
    if (code.trim().length >= 8) {
      setStudent((prev) => ({
        ...prev,
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

  // Add Wrong Question from Correction Detail
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
    };

    setWrongQuestions((prev) => [newWrong, ...prev]);
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

    if (activeScreen === 'practice' || activeScreen === 'practice_quiz') {
      return (
        <PracticeView
          question={sampleQuizQuestion}
          knowledgePointTitle={selectedKnowledgePointTitle}
          wrongQuestions={wrongQuestions}
          questionBank={questionBank}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
          onCompleteQuiz={handleCompleteQuiz}
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

    // Default Main Tab Views
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            student={student}
            tasks={tasks}
            wrongQuestions={wrongQuestions}
            todayReviewQuestions={todayReviewQuestions}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
            onOpenReport={() => setActiveScreen('diagnostic_report')}
            onSubjectChange={handleSubjectChange}
            onSelectKnowledgePointForPractice={(title) => selectKnowledgePoint(title)}
            onSelectWrongItemForInstantLearning={selectWrongQuestion}
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
          />
        );

      case 'wrong':
        return (
          <WrongQuestionsView
            wrongQuestions={wrongQuestions}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
            onSelectWrongItemForInstantLearning={selectWrongQuestion}
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
        onOpenReport={() => setActiveScreen('diagnostic_report')}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">{renderContent()}</main>

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
