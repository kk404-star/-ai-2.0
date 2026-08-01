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
  sampleKnowledgePoint
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
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>(initialWrongQuestions);
  const [correctionHistory, setCorrectionHistory] = useState<CorrectionRecord[]>(initialCorrectionHistory);
  
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRecord>(initialCorrectionHistory[0]);
  const [selectedWrongItem, setSelectedWrongItem] = useState<WrongQuestion | null>(null);
  const [selectedKnowledgePointTitle, setSelectedKnowledgePointTitle] = useState<string | null>(null);

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
  const handleAddToWrongQuestions = (record: CorrectionRecord) => {
    const newWrong: WrongQuestion = {
      id: 'wq-' + Date.now(),
      subject: record.subject,
      topic: record.title,
      date: record.date,
      questionText: record.questionText,
      userAnswer: record.userAnswer,
      correctAnswer: record.correctAnswer,
      errorCategory: record.errorCategory,
      difficulty: '基础',
      tags: [record.errorCategory, '基础题'],
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
          knowledgePoint={sampleKnowledgePoint}
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
        />
      );
    }

    if (activeScreen === 'correction_detail') {
      return (
        <CorrectionDetailView
          record={selectedCorrection}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
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
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
          onCompleteQuiz={() => {
            setActiveScreen('tab');
            setActiveTab('home');
          }}
        />
      );
    }

    if (activeScreen === 'diagnostic_report') {
      return (
        <DiagnosticReportView
          student={student}
          onNavigateToScreen={(screen) => setActiveScreen(screen)}
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
            onSelectKnowledgePointForPractice={(title) => setSelectedKnowledgePointTitle(title)}
            onSelectWrongItemForInstantLearning={(item) => setSelectedWrongItem(item)}
          />
        );

      case 'study':
        return (
          <StudyView
            categories={categories}
            currentSubject={student.currentSubject}
            onSubjectChange={handleSubjectChange}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
            onSelectKnowledgePointForPractice={(title) => setSelectedKnowledgePointTitle(title)}
          />
        );

      case 'wrong':
        return (
          <WrongQuestionsView
            wrongQuestions={wrongQuestions}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
            onSelectWrongItemForInstantLearning={(item) => setSelectedWrongItem(item)}
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
