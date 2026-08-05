export type TabType = 'home' | 'study' | 'wrong' | 'profile';

export type ScreenType = 
  | 'tab' 
  | 'knowledge_study' 
  | 'photo_scan' 
  | 'correction_detail' 
  | 'instant_learning' 
  | 'practice_quiz' 
  | 'diagnostic_report' 
  | 'parent_binding'
  | 'profile_details';

export type SubjectType = '数学' | '物理' | '化学' | '生物' | '英语' | '语文' | '历史' | '地理' | '政治';

export type GradeType = '初一' | '初二' | '初三' | '高一' | '高二' | '高三';

export type DifficultyLevel = '基础' | '提升' | '压轴';

export const ERROR_CATEGORIES = ['概念没理解', '计算错误', '审题遗漏', '知识点混淆', '推理跳步'] as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[number];

export type MasteryState = '未学习' | '学习中' | '已学习' | '已练习';

export type ConceptLevel = '0 - 未理解' | '1 - 知道定义' | '2 - 理解特征' | '3 - 能解释易混点' | '4 - 主动讲清楚';

export type ApplicationLevel = '0 - 未练习' | '1 - 会做基础题' | '2 - 会做常规题' | '3 - 会做综合题' | '4 - 会迁移变式';

export type AiPackageType = '单科低量包' | '单科高量包' | '全科低量包' | '全科高量包';

export interface NextStepSuggestion {
  title: string;
  reason: string;
  subject: SubjectType;
  actionText: string;
  targetScreen: ScreenType;
  priorityLabel: 'P0 错题急救' | 'P1 概念强化' | 'P2 变式验证' | 'P3 保持日常';
}

export interface TokenBoosterPack {
  id: string;
  name: string;
  tokens: number;
  price: number;
  popular?: boolean;
}

export interface StudentProfile {
  name: string;
  avatar: string;
  school: string;
  className: string;
  grade: GradeType;
  currentSubject: SubjectType;
  studyDays: number;
  aiPackageName: string;
  aiPackageType: AiPackageType;
  aiPackageExpiry: string;
  
  // Platform Token metering (matching支付系统需求文档 v0.22)
  monthlyTokenLimit: number;       // 月度套餐 Token 总额 (例如 200,000)
  monthlyTokenRemaining: number;   // 月度套餐 Token 剩余 (例如 125,000)
  boosterTokenRemaining: number;   // B2C 加油包永久 Token 剩余 (例如 50,000)
  
  // Dual binding code system (孩子专属学生码 + 家长绑定邀请码)
  studentCode: string;             // 孩子专属学生识别码 (例如 STU-6608-2026)
  parentBindingCode: string;       // 家长绑定邀请码 (例如 PAR-8829-9123)
  activatedAuthorizationCode?: string;
  
  isParentBound: boolean;
  parentName?: string;
  unreviewedWrongCount: number;
}

export interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'knowledge' | 'practice' | 'photo';
  subject: SubjectType;
  actionText: string;
  completed: boolean;
  targetScreen: ScreenType;
}

export interface KnowledgeL3Point {
  code: string;
  title: string;
  boundQuestionCount: number;
  practicedQuestionCount: number;
  masteryState: MasteryState;
  hasVerificationQuiz: boolean;
}

export interface KnowledgeEvidence {
  knowledgeCode: string;
  title: string;
  subject: SubjectType;
  grade: GradeType;
  status: MasteryState;
  totalQuestionCount: number;
  practicedQuestionCount: number;
  unpracticedQuestionCount: number;
}

export interface KnowledgeCard {
  id: string;
  knowledgeCode: string;
  title: string;
  subject: SubjectType;
  type: '学习卡' | '练习卡';
  status: Extract<MasteryState, '已学习' | '已练习'>;
  evidenceText: string;
  unpracticedQuestionCount: number;
}

export interface LearningEvidenceBase {
  knowledgePoints: KnowledgeEvidence[];
  knowledgeCards: KnowledgeCard[];
  totalQuestionCount: number;
  practicedQuestionCount: number;
  wrongQuestionCount: number;
  unreviewedWrongQuestionCount: number;
  errorCategoryCounts: Record<ErrorCategory, number>;
}

export interface KnowledgeL2Section {
  code: string;
  title: string;
  children: KnowledgeL3Point[];
}

export interface KnowledgeL1Chapter {
  code: string;
  title: string;
  subject: SubjectType;
  grade: GradeType;
  children: KnowledgeL2Section[];
}

export interface KnowledgeCategory {
  id: string;
  title: string;
  subject: SubjectType;
  completedCount: number;
  totalCount: number;
  icon: string;
  conceptLevel?: string;
  applicationLevel?: string;
}

export interface KnowledgePoint {
  id: string;
  title: string;
  subject: SubjectType;
  grade: GradeType;
  masteryState: MasteryState;
  progressPercent: number;
  currentStep: number;
  totalSteps: number;
  tutorIntro: string;
  tutorTip: string;
  conceptLevel?: ConceptLevel;
  applicationLevel?: ApplicationLevel;
}

export interface WeakKnowledgeItem {
  id: string;
  title: string;
  subject: SubjectType;
  wrongCount: number;
  unreviewedCount: number;
  attentionScore: number;
  suggestedAction: '去复习' | '去巩固' | '去练习';
  targetScreen: ScreenType;
}

export interface WrongQuestion {
  id: string;
  subject: SubjectType;
  topic: string;
  date: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  errorCategory: ErrorCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  reviewStatus: '未复习' | '复习中' | '已掌握';
  sourceCorrectionId?: string;
  addedAt?: string;
  nextReviewAt?: string;
  reviewStage?: 1 | 2;
  lastReviewedAt?: string;
  reviewFailureCount?: number;
  reviewAttempts?: WrongQuestionReviewAttempt[];
  image?: string;
  steps?: string[];
  knowledgePoints?: string[];
  options?: { key: string; text: string }[];
}

export interface WrongQuestionReviewAttempt {
  reviewedAt: string;
  stage: 1 | 2;
  originalCorrect: boolean;
  variantCorrect: boolean;
  countedForMastery: boolean;
}

export interface CorrectionRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  wrongCount: number;
  correctCount: number;
  subject: SubjectType;
  image: string;
  questionText: string;
  userAnswer: string;
  errorCategory: ErrorCategory;
  errorAnalysis: string;
  correctAnswer: string;
  steps: string[];
  knowledgePoints: string[];
  encouragement: string;
}

export type QuestionType = '选择题' | '填空题' | '解答题' | '判断题' | '综合题';

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  subject: SubjectType;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  knowledgePoint: string;
  questionText: string;
  questionType?: QuestionType;
  diagramImage?: string;
  options?: {
    key: string;
    text: string;
  }[];
  correctOptionKey?: string;
  sampleStepSolution?: string[];
  sampleFinalAnswer?: string;
  aiHint: string;
  practiceStatus?: '已练习' | '未练习';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  badgeText?: string;
  checkQuestion?: string;
  imageUrl?: string;
}
