import React, { useState } from 'react';
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
  GradeType, 
  StudentProfile, 
  CorrectionRecord, 
  WrongQuestion 
} from './types';

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
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>(initialWrongQuestions);
  const [correctionHistory, setCorrectionHistory] = useState<CorrectionRecord[]>(initialCorrectionHistory);
  
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRecord>(initialCorrectionHistory[0]);
  const [selectedWrongItem, setSelectedWrongItem] = useState<WrongQuestion | null>(null);
  const [selectedKnowledgePointTitle, setSelectedKnowledgePointTitle] = useState<string | null>(null);
  const [selectedKnowledgePointCode, setSelectedKnowledgePointCode] = useState<string | null>(null);

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

    const practicedWrongQuestions = selectedWrongItem
      ? completedCount > 0 ? [selectedWrongItem] : []
      : selectedKnowledgePointTitle
        ? wrongQuestions
            .filter((item) => (item.knowledgePoints?.length ? item.knowledgePoints : [item.topic]).includes(selectedKnowledgePointTitle))
            .slice(0, completedCount)
        : [];
    const practicedWrongIds = new Set(practicedWrongQuestions.map((item) => item.id));
    const newlyReviewedCount = practicedWrongQuestions.filter((item) => item.reviewStatus === '未复习').length;
    const newlyPracticedQuestionCount = newlyPracticedBankCount + newlyReviewedCount;

    if (completedQuestionIdSet.size > 0) {
      setQuestionBank((questions) => questions.map((question) => completedQuestionIdSet.has(question.id)
        ? { ...question, practiceStatus: '已练习' }
        : question));
    }
    if (selectedKnowledgePointCode && newlyPracticedQuestionCount > 0) {
      setKnowledgeTree((chapters) => chapters.map((chapter) => ({
        ...chapter,
        children: chapter.children.map((section) => ({
          ...section,
          children: section.children.map((point) => point.code === selectedKnowledgePointCode
            ? {
                ...point,
                practicedQuestionCount: Math.min(
                  point.boundQuestionCount,
                  point.practicedQuestionCount + newlyPracticedQuestionCount
                ),
              }
            : point),
        })),
      })));
    }
    if (practicedWrongIds.size > 0) {
      setWrongQuestions((items) => items.map((item) => practicedWrongIds.has(item.id)
        ? { ...item, reviewStatus: '已掌握' }
        : item));
      if (newlyReviewedCount > 0) {
        setStudent((current) => ({
          ...current,
          unreviewedWrongCount: Math.max(0, current.unreviewedWrongCount - newlyReviewedCount),
        }));
      }
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
        return '错题针对性学习';
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

  // Grade Change
  const handleGradeChange = (newGrade: GradeType) => {
    setStudent((prev) => ({ ...prev, grade: newGrade }));
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
  const handleAddToWrongQuestions = (record: CorrectionRecord, errorCategory: CorrectionRecord['errorCategory']) => {
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
      steps: record.steps,
      knowledgePoints: record.knowledgePoints,
    };

    setWrongQuestions((prev) => [newWrong, ...prev]);
    setStudent((prev) => ({
      ...prev,
      unreviewedWrongCount: prev.unreviewedWrongCount + 1,
    }));
  };

  // Render current tab or sub-screen
  const renderContent = () => {
    if (activeScreen === 'knowledge_study') {
      return (
        <KnowledgeStudyView
          knowledgePoint={selectedKnowledgePointTitle
            ? { ...sampleKnowledgePoint, title: selectedKnowledgePointTitle }
            : sampleKnowledgePoint}
          onNavigateToQuiz={() => setActiveScreen('practice_quiz')}
        />
      );
    }

    if (activeScreen === 'photo_scan') {
      return (
        <PhotoScanView
          records={correctionHistory}
          onNavigateToDetail={(rec) => {
            setSelectedCorrection(rec);
            setActiveScreen('correction_detail');
          }}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
          onNavigateToInstantLearning={(record) => {
            setSelectedCorrection(record);
            selectKnowledgePoint(record.knowledgePoints[0] || record.title);
            setActiveScreen('instant_learning');
          }}
        />
      );
    }

    if (activeScreen === 'correction_detail') {
      return (
        <CorrectionDetailView
          record={selectedCorrection}
          onNavigateToScreen={(screen) => {
            if (screen === 'instant_learning') {
              selectKnowledgePoint(selectedCorrection.knowledgePoints[0] || selectedCorrection.title);
            }
            setActiveScreen(screen);
          }}
          onAddToWrongQuestions={handleAddToWrongQuestions}
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
          onNavigateToScreen={(screen) => {
            if (screen === 'practice' || screen === 'practice_quiz') selectKnowledgePoint('');
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
        student={student}
        onBack={() => setActiveScreen('tab')}
        onGradeChange={handleGradeChange}
        onOpenReport={() => setActiveScreen('diagnostic_report')}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">{renderContent()}</main>

      {/* Glassmorphism Bottom Navigation Bar (Visible in Tab mode) */}
      {activeScreen === 'tab' && (
        <Navigation
          activeTab={activeTab}
          unreviewedWrongCount={student.unreviewedWrongCount}
          onTabChange={(tab) => setActiveTab(tab)}
          onScanClick={() => setActiveScreen('photo_scan')}
        />
      )}
    </MobileFrame>
  );
}
