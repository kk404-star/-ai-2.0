import { 
  StudentProfile, 
  TaskItem, 
  KnowledgeCategory, 
  WrongQuestion, 
  CorrectionRecord, 
  QuizQuestion,
  KnowledgePoint,
  NextStepSuggestion,
  WeakKnowledgeItem,
  KnowledgeL1Chapter
} from '../types';

export const initialProfile: StudentProfile = {
  name: '李同学',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZcEV9IEdR4w3TrHfUKPuv2F0j5VPnKngN9W4KmIpghPwrBGpFLnciE6s4hctjZla8LCBIkU-i9KvbpCUB-RavTlMSN89JgPdAFoHRXGPvjdzhQVPY62WG5NHxK7sRdHHe3pZB8AMjZRXUi8y-5KQv26BTRsTYBdeq6joEZvdO3PM7cGd17q86szpq867XVbl36vM9xuWBa0TTtP67FwGakW0_CThVv5y2e1OPpJtomHAPUj1nxYrI',
  school: '朝阳实验中学',
  className: '初二 (3) 班',
  grade: '初二',
  currentSubject: '数学',
  studyDays: 23,
  aiPackageName: '机构全科服务包 · 初中',
  aiPackageType: '全科高量包',
  aiPackageExpiry: '2026-12-31',
  monthlyTokenLimit: 200000,
  monthlyTokenRemaining: 125000,
  boosterTokenRemaining: 50000,
  studentCode: 'STU-6608-2026',
  parentBindingCode: 'PAR-8829-9123',
  isParentBound: false,
  unreviewedWrongCount: 3,
};

export const sampleNextStepSuggestion: NextStepSuggestion = {
  title: '二次函数符号变号错题急救',
  reason: '检测到你在昨天拍照批改中遗留 1 道未即时消化的错题（括号负号分配律计算疏忽），建议优先完成 3 分钟针对性讲解与验证题！',
  subject: '数学',
  actionText: '开始今日复习',
  targetScreen: 'instant_learning',
  priorityLabel: 'P0 错题急救',
};

export const sampleWeakKnowledgeItems: WeakKnowledgeItem[] = [
  {
    id: 'wk-1',
    title: '二次函数的图像与顶点坐标',
    subject: '数学',
    wrongCount: 3,
    unreviewedCount: 2,
    attentionScore: 18.5,
    suggestedAction: '去复习',
    targetScreen: 'instant_learning',
  },
  {
    id: 'wk-2',
    title: '切线点斜式与导数几何意义',
    subject: '数学',
    wrongCount: 2,
    unreviewedCount: 1,
    attentionScore: 14.2,
    suggestedAction: '去巩固',
    targetScreen: 'practice_quiz',
  },
  {
    id: 'wk-3',
    title: '一元二次方程根与系数的关系',
    subject: '数学',
    wrongCount: 1,
    unreviewedCount: 0,
    attentionScore: 9.0,
    suggestedAction: '去练习',
    targetScreen: 'knowledge_study',
  },
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: '二次函数的图像与性质',
    subtitle: '知识点学习',
    type: 'knowledge',
    subject: '数学',
    actionText: '去学习',
    completed: false,
    targetScreen: 'knowledge_study',
  },
  {
    id: 'task-2',
    title: '函数图像的应用',
    subtitle: '精选题练习',
    type: 'practice',
    subject: '数学',
    actionText: '去练习',
    completed: false,
    targetScreen: 'practice_quiz',
  },
  {
    id: 'task-3',
    title: '拍照批改',
    subtitle: '拍照批改作业',
    type: 'photo',
    subject: '数学',
    actionText: '去批改',
    completed: false,
    targetScreen: 'photo_scan',
  },
];

export const initialCategories: KnowledgeCategory[] = [
  {
    id: 'cat-1',
    title: '集合与函数概念',
    subject: '数学',
    completedCount: 12,
    totalCount: 45,
    icon: 'function',
  },
  {
    id: 'cat-2',
    title: '平面解析几何',
    subject: '数学',
    completedCount: 32,
    totalCount: 40,
    icon: 'square_foot',
  },
  {
    id: 'cat-3',
    title: '一元二次方程',
    subject: '数学',
    completedCount: 0,
    totalCount: 28,
    icon: 'equal',
  },
  {
    id: 'cat-4',
    title: '二次函数的图像与性质',
    subject: '数学',
    completedCount: 2,
    totalCount: 5,
    icon: 'show_chart',
  },
];

export const sampleKnowledgeTree: KnowledgeL1Chapter[] = [
  {
    code: 'MATH-L1-01',
    title: '第一章 二次函数与一元二次方程',
    subject: '数学',
    grade: '初二',
    children: [
      {
        code: 'MATH-L2-01',
        title: '2.1 二次函数的图像与性质',
        children: [
          {
            code: 'MATH-L3-01',
            title: '二次函数的定义与 a≠0 判定',
            boundQuestionCount: 12,
            practicedQuestionCount: 12,
            masteryState: '已练习',
            hasVerificationQuiz: true,
          },
          {
            code: 'MATH-L3-02',
            title: '二次函数顶点坐标与对称轴公式',
            boundQuestionCount: 8,
            practicedQuestionCount: 0,
            masteryState: '已学习',
            hasVerificationQuiz: true,
          },
          {
            code: 'MATH-L3-03',
            title: '二次函数平移与平移口诀',
            boundQuestionCount: 0,
            practicedQuestionCount: 0,
            masteryState: '学习中',
            hasVerificationQuiz: false,
          },
        ],
      },
      {
        code: 'MATH-L2-02',
        title: '2.2 一元二次方程根与系数的关系',
        children: [
          {
            code: 'MATH-L3-04',
            title: '韦达定理求值与变式应用',
            boundQuestionCount: 15,
            practicedQuestionCount: 6,
            masteryState: '已练习',
            hasVerificationQuiz: true,
          },
          {
            code: 'MATH-L3-05',
            title: '根的判别式 Δ 与解的情况判断',
            boundQuestionCount: 6,
            practicedQuestionCount: 4,
            masteryState: '已练习',
            hasVerificationQuiz: true,
          },
        ],
      },
    ],
  },
  {
    code: 'MATH-L1-02',
    title: '第二章 平行四边形与特殊平行四边形',
    subject: '数学',
    grade: '初二',
    children: [
      {
        code: 'MATH-L2-03',
        title: '3.1 矩形与菱形的判定定理',
        children: [
          {
            code: 'MATH-L3-06',
            title: '矩形对角线相等性质证明',
            boundQuestionCount: 10,
            practicedQuestionCount: 0,
            masteryState: '未学习',
            hasVerificationQuiz: true,
          },
          {
            code: 'MATH-L3-07',
            title: '菱形四条边相等与面积公式',
            boundQuestionCount: 7,
            practicedQuestionCount: 7,
            masteryState: '已练习',
            hasVerificationQuiz: true,
          },
        ],
      },
    ],
  },
];

export const initialWrongQuestions: WrongQuestion[] = [
  {
    id: 'wq-1',
    subject: '数学',
    topic: '函数',
    date: '05-20',
    questionText: '已知二次函数 y = ax² + bx + c 的图像如图所示，则一次函数 y = ax + b 与反比例函数 y = c/x 的位置关系是（ ）',
    userAnswer: 'A. y = ax + b 与 y = c/x 相交于一、三象限',
    correctAnswer: 'B. y = ax + b 与 y = c/x 相交于二、四象限',
    errorCategory: '概念没理解',
    difficulty: '基础',
    tags: ['概念没理解', '基础题'],
    reviewStatus: '未复习',
    options: [
      { key: 'A', text: 'y = ax + b 与 y = c/x 相交于一、三象限' },
      { key: 'B', text: 'y = ax + b 与 y = c/x 相交于二、四象限' },
      { key: 'C', text: 'y = ax + b 过一、二、四象限' },
      { key: 'D', text: '反比例函数图像在第二、四象限' }
    ],
    steps: [
      '1. 根据抛物线开口方向确定 a 的正负符号；',
      '2. 根据对称轴位置 x = -b/(2a) 判断 b 的正负号；',
      '3. 根据与 y 轴交点确定 c 的正负号。'
    ],
    knowledgePoints: ['二次函数图像', '函数系数判断']
  },
  {
    id: 'wq-2',
    subject: '物理',
    topic: '力学',
    date: '05-19',
    questionText: '如图所示，木块在水平面上受到两个力的作用，已知 F₁ = 3N, F₂ = 5N, 木块处于静止状态，受到的摩擦力大小与方向为（ ）',
    userAnswer: 'B. 受到的摩擦力为 8N，方向向左',
    correctAnswer: 'A. 受到的静摩擦力为 2N，方向向右',
    errorCategory: '计算错误',
    difficulty: '提升',
    tags: ['计算错误', '提升题'],
    reviewStatus: '未复习',
    options: [
      { key: 'A', text: '受到的静摩擦力为 2N，方向向右' },
      { key: 'B', text: '受到的摩擦力为 8N，方向向左' },
      { key: 'C', text: '受到的滑动摩擦力为 2N，方向向左' },
      { key: 'D', text: '不受摩擦力作用' }
    ],
    steps: [
      '1. 木块处于平衡状态，受力平衡：F_net = 0；',
      '2. 水平方向合力：F₂ - F₁ = 5N - 3N = 2N；',
      '3. 静摩擦力 f = 2N，方向与合外力方向相反。'
    ],
    knowledgePoints: ['静摩擦力', '二力平衡']
  },
  {
    id: 'wq-3',
    subject: '化学',
    topic: '化学反应',
    date: '05-18',
    questionText: '下列反应中，属于置换反应的是（ ）',
    userAnswer: 'A. 2H₂O₂ = 2H₂O + O₂↑',
    correctAnswer: 'B. Fe + CuSO₄ = FeSO₄ + Cu',
    errorCategory: '审题遗漏',
    difficulty: '基础',
    tags: ['审题遗漏', '基础题'],
    reviewStatus: '未复习',
    options: [
      { key: 'A', text: '2H₂O₂ = 2H₂O + O₂↑' },
      { key: 'B', text: 'Fe + CuSO₄ = FeSO₄ + Cu' },
      { key: 'C', text: 'C + O₂ = CO₂' },
      { key: 'D', text: 'NaOH + HCl = NaCl + H₂O' }
    ],
    steps: [
      '1. 置换反应概念：一种单质与一种化合物反应生成另一种单质和另一种化合物；',
      '2. 选项分析：A 为分解反应，只有 Fe + CuSO₄ 是单质+化合物。'
    ],
    knowledgePoints: ['基本反应类型', '置换反应']
  }
];

export const initialCorrectionHistory: CorrectionRecord[] = [
  {
    id: 'cr-1',
    title: '二次函数综合题',
    date: '05-20',
    time: '14:30',
    wrongCount: 2,
    correctCount: 1,
    subject: '数学',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    questionText: '已知函数 f(x) = x² - 2x + 1，求 f(3) 的值。',
    userAnswer: 'f(3) = 3² - 2*3 + 1 = 9 - 5 + 1 = 5',
    errorCategory: '计算错误',
    errorAnalysis: '计算错误：在计算 2*3 时，你将其计为了 5，实际上应为 6。',
    correctAnswer: 'f(3) = 4',
    steps: [
      '1. 代入数值：将 x = 3 代入函数式 f(x) = x² - 2x + 1。',
      '2. 幂运算：3² = 9。',
      '3. 乘法运算：2 * 3 = 6。',
      '4. 最终求和：9 - 6 + 1 = 4。'
    ],
    knowledgePoints: ['函数求值', '二次函数', '代数运算'],
    encouragement: '“这道题的核心是函数的代入运算。虽然思路正确，但计算时要小心哦。可以先加入错题本，系统会在合适的时间安排复习。”'
  },
  {
    id: 'cr-2',
    title: '力学计算题',
    date: '05-20',
    time: '13:15',
    wrongCount: 1,
    correctCount: 2,
    subject: '物理',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    questionText: '一木块在光滑水平面上受到 10N 的拉力，质量为 2kg，求加速度 a。',
    userAnswer: 'a = F * m = 10 * 2 = 20 m/s²',
    errorCategory: '知识点混淆',
    errorAnalysis: '公式误用：牛顿第二定律为 F = ma，求加速度应使用 a = F / m。',
    correctAnswer: 'a = 5 m/s²',
    steps: [
      '1. 由牛顿第二定律 F = ma 变形得 a = F / m。',
      '2. 代入 F = 10N, m = 2kg。',
      '3. 计算得 a = 10 / 2 = 5 m/s²。'
    ],
    knowledgePoints: ['牛顿第二定律', '加速度计算'],
    encouragement: '“公式记混啦，记住 F = ma，求 a 记得用除法哦！”'
  },
  {
    id: 'cr-3',
    title: '化学方程式配平',
    date: '05-19',
    time: '20:45',
    wrongCount: 0,
    correctCount: 3,
    subject: '化学',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    questionText: '配平化学方程式：CH₄ + O₂ → CO₂ + H₂O',
    userAnswer: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    errorCategory: '审题遗漏',
    errorAnalysis: '完全正确！原子守恒配平非常熟练。',
    correctAnswer: 'CH₄ + 2O₂ = CO₂ + 2H₂O',
    steps: [
      '1. 碳原子守恒：1 个 CH₄ 对应 1 个 CO₂。',
      '2. 氢原子守恒：4 个 H 对应 2 个 H₂O。',
      '3. 氧原子守恒：右侧共 4 个 O，左侧需 2 个 O₂。'
    ],
    knowledgePoints: ['质量守恒定律', '化学方程式配平'],
    encouragement: '“太棒了！全对！继续保持！”'
  }
];

export const sampleQuizQuestion: QuizQuestion = {
  id: 'quiz-1',
  questionNumber: 3,
  totalQuestions: 10,
  subject: '数学',
  difficulty: '压轴',
  difficultyLabel: '困难',
  questionType: '选择题',
  knowledgePoint: '函数与导数综合应用',
  questionText: '已知函数 f(x) = ax² + bx + c 的图像经过点 (1, 2)。若 f\'(x) 为其导函数，且满足 f\'(1) = 4，请问在该曲线上点 (1, 2) 处的切线方程是什么？',
  diagramImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-erwfINf9RRGUT3Zxey_kc0KNyff5aQGzd9MM1sDtL22OrOOCSIH3eUb5jHRCOU9eoywNPE5iFjYu88bAIhiSCvOMuqroDOVhaFmtSjPPG-be4b1kGlhgVmAcDd55VxwJBaJLUqNRhOyc8DR13tIlfJUzs6d3MkEFvrHTJRm7C9OSjI54Sisu4DhBu_O7_DCvR6oLVZcgqbS9N1sbOBfyU8fMF1t7HSfEgsLq2ets7mRPRu1mZU8S',
  options: [
    { key: 'A', text: 'y = 4x - 2' },
    { key: 'B', text: 'y = 4x + 2' },
    { key: 'C', text: 'y = 2x + 4' },
    { key: 'D', text: 'y = -4x + 6' },
  ],
  correctOptionKey: 'A',
  aiHint: '嘿！记得切线方程的点斜式公式吗？\n\ny - y₀ = f\'(x₀)(x - x₀)\n\n这里题目已经给了你 x₀=1, y₀=2 且 f\'(1)=4。试着把这些值代入公式展开看看？'
};

export const sampleQuestionsList: QuizQuestion[] = [
  {
    id: 'quiz-quadratic-definition-1',
    questionNumber: 1,
    totalQuestions: 3,
    subject: '数学',
    difficulty: '基础',
    difficultyLabel: '基础单选题',
    questionType: '选择题',
    knowledgePoint: '二次函数的定义与 a≠0 判定',
    questionText: '【单选题】下列函数中，是二次函数的是（ ）',
    options: [
      { key: 'A', text: 'y = 3x + 1' },
      { key: 'B', text: 'y = x² - 2x + 1' },
      { key: 'C', text: 'y = 1/x' },
      { key: 'D', text: 'y = (x - 1)² / x' },
    ],
    correctOptionKey: 'B',
    sampleStepSolution: ['二次函数的一般形式为 y = ax² + bx + c，其中 a ≠ 0。', '选项 B 中二次项系数为 1，且没有分母含 x，故选 B。'],
    aiHint: '先看最高次数是否为 2，再确认二次项系数不为 0。',
  },
  {
    id: 'quiz-quadratic-definition-2',
    questionNumber: 2,
    totalQuestions: 3,
    subject: '数学',
    difficulty: '基础',
    difficultyLabel: '基础单选题',
    questionType: '选择题',
    knowledgePoint: '二次函数的定义与 a≠0 判定',
    questionText: '【单选题】当 m 为何值时，函数 y = (m - 1)x² + 2x - 3 是二次函数？',
    options: [
      { key: 'A', text: 'm = 1' },
      { key: 'B', text: 'm ≠ 1' },
      { key: 'C', text: 'm > 1' },
      { key: 'D', text: 'm < 1' },
    ],
    correctOptionKey: 'B',
    sampleStepSolution: ['二次函数要求 x² 项的系数不为 0。', 'm - 1 ≠ 0，所以 m ≠ 1。故选 B。'],
    aiHint: '含参数的二次函数，关键是让 x² 项系数不等于 0。',
  },
  {
    id: 'quiz-quadratic-definition-3',
    questionNumber: 3,
    totalQuestions: 3,
    subject: '数学',
    difficulty: '提升',
    difficultyLabel: '提升单选题',
    questionType: '选择题',
    knowledgePoint: '二次函数的定义与 a≠0 判定',
    questionText: '【单选题】已知函数 y = (a + 2)x² - 4x + 5 不是二次函数，则 a 的值为（ ）',
    options: [
      { key: 'A', text: '-2' },
      { key: 'B', text: '2' },
      { key: 'C', text: '-5' },
      { key: 'D', text: '5' },
    ],
    correctOptionKey: 'A',
    sampleStepSolution: ['函数不是二次函数，说明 x² 项系数为 0。', 'a + 2 = 0，解得 a = -2。故选 A。'],
    aiHint: '题目问“不是二次函数”，就要令二次项系数等于 0。',
  },
  {
    id: 'quiz-choice-1',
    questionNumber: 1,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '基础',
    difficultyLabel: '基础单选题',
    questionType: '选择题',
    knowledgePoint: '一元二次方程根的判别式',
    questionText: '【单选题】已知关于 x 的一元二次方程 x² - 4x + k = 0 有两个不相等的实数根，则 k 的取值范围是（ ）',
    options: [
      { key: 'A', text: 'k < 4' },
      { key: 'B', text: 'k ≤ 4' },
      { key: 'C', text: 'k > 4' },
      { key: 'D', text: 'k ≥ 4' }
    ],
    correctOptionKey: 'A',
    sampleStepSolution: [
      '解析：由方程有两个不相等的实数根，得 Δ = b² - 4ac > 0；',
      '代入系数：(-4)² - 4×1×k = 16 - 4k > 0；',
      '解不等式得 4k < 16，即 k < 4。故选 A。'
    ],
    aiHint: '记住一元二次方程根的判别式 Δ = b² - 4ac：当 Δ > 0 时有两个不相等的实数根！'
  },
  {
    id: 'quiz-choice-2',
    questionNumber: 2,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '提升',
    difficultyLabel: '中等单选题',
    questionType: '选择题',
    knowledgePoint: '二次函数图像平移规律',
    questionText: '【单选题】将抛物线 y = 2x² 向左平移 1 个单位，再向下平移 3 个单位，所得抛物线的解析式为（ ）',
    options: [
      { key: 'A', text: 'y = 2(x + 1)² - 3' },
      { key: 'B', text: 'y = 2(x - 1)² - 3' },
      { key: 'C', text: 'y = 2(x + 1)² + 3' },
      { key: 'D', text: 'y = 2(x - 1)² + 3' }
    ],
    correctOptionKey: 'A',
    sampleStepSolution: [
      '解析：根据“左加右减，上加下减”的平移规律：',
      '向左平移 1 个单位：x 替换为 (x + 1)；',
      '向下平移 3 个单位：整体减 3；',
      '故得到 y = 2(x + 1)² - 3。答案选 A。'
    ],
    aiHint: '平移口诀：左加右减（针对 x），上加下减（针对常数项）！'
  },
  {
    id: 'quiz-choice-3',
    questionNumber: 3,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '提升',
    difficultyLabel: '提升单选题',
    questionType: '选择题',
    knowledgePoint: '二次函数与 x 轴交点',
    questionText: '【单选题】已知二次函数 y = ax² + bx + c (a ≠ 0) 的图像如图所示，则下列结论正确的是（ ）',
    options: [
      { key: 'A', text: 'abc > 0' },
      { key: 'B', text: '2a + b = 0' },
      { key: 'C', text: 'a - b + c < 0' },
      { key: 'D', text: 'b² - 4ac > 0' }
    ],
    correctOptionKey: 'D',
    sampleStepSolution: [
      '解析：抛物线与 x 轴有两个不同交点，故判别式 Δ = b² - 4ac > 0 必定成立，答案选 D。'
    ],
    aiHint: '观察抛物线与 x 轴的交点个数：有 2 个交点即说明 Δ > 0。'
  },
  {
    id: 'quiz-essay-1',
    questionNumber: 4,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '压轴',
    difficultyLabel: '压轴解答题',
    questionType: '解答题',
    knowledgePoint: '二次函数与一元二次方程综合',
    questionText: '【解答题】已知抛物线 C: y = x² - 2mx + m² - 1 的顶点为 P，与 x 轴交于 A, B 两点。\n(1) 求顶点 P 的坐标及 A, B 两点间的距离；\n(2) 若 △PAB 是等腰直角三角形，求 m 的值及抛物线解析式。',
    diagramImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    sampleFinalAnswer: 'm = 1 或 m = -1; y = x² - 2x 或 y = x² + 2x',
    sampleStepSolution: [
      '步骤 1【配方求顶点】：将方程配方得 y = (x - m)² - 1，故顶点 P 坐标为 (m, -1)。',
      '步骤 2【求 x 轴交点距离】：令 y = 0，得 (x - m)² = 1，解得 x₁ = m - 1, x₂ = m + 1。AB 距离 = |x₂ - x₁| = 2。',
      '步骤 3【直角三角形判定】：P 到 AB 的距离为顶点纵坐标绝对值 |-1| = 1。AB 中点为 (m, 0)，底边长 2，高为 1，故 △PAB 必定为等腰直角三角形。'
    ],
    aiHint: '对于解答题：首先对抛物线进行配方法确定顶点 P 的坐标；再求与 x 轴交点。'
  },
  {
    id: 'quiz-fill-1',
    questionNumber: 5,
    totalQuestions: 8,
    subject: '物理',
    difficulty: '提升',
    difficultyLabel: '提升填空题',
    questionType: '填空题',
    knowledgePoint: '牛顿第二定律与加速度计算',
    questionText: '【填空题】质量为 2 kg 的物体在 10 N 的水平拉力作用下，在光滑水平面上由静止开始做匀加速直线运动。则物体的加速度大小为 _____ m/s²，2 秒末物体的速度大小为 _____ m/s。',
    sampleFinalAnswer: '5; 10',
    sampleStepSolution: [
      '第 1 空：根据牛顿第二定律 a = F / m = 10N / 2kg = 5 m/s²；',
      '第 2 空：根据匀加速直线运动公式 v = a * t = 5 * 2 = 10 m/s。'
    ],
    aiHint: '物理填空题提示：记住牛顿第二定律公式 F = ma 变形求解加速度 a！'
  },
  {
    id: 'quiz-choice-6',
    questionNumber: 6,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '基础',
    difficultyLabel: '基础单选题',
    questionType: '选择题',
    knowledgePoint: '反比例函数图像与性质',
    questionText: '【单选题】已知反比例函数 y = k/x 的图像经过点 (2, -3)，则 k 的值为（ ）',
    options: [
      { key: 'A', text: '6' },
      { key: 'B', text: '-6' },
      { key: 'C', text: '1.5' },
      { key: 'D', text: '-1.5' }
    ],
    correctOptionKey: 'B',
    sampleStepSolution: [
      '解析：将 x = 2, y = -3 代入 y = k/x，得 -3 = k/2，解得 k = -6。答案选 B。'
    ],
    aiHint: '把已知点的坐标 (x, y) 直接代入反比例函数解析式求 k！'
  },
  {
    id: 'quiz-choice-7',
    questionNumber: 7,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '提升',
    difficultyLabel: '中等单选题',
    questionType: '选择题',
    knowledgePoint: '圆的切线性质',
    questionText: '【单选题】在 ⊙O 中，AB 是直径，PA 切 ⊙O 于点 A，若 ∠P = 35°，则 ∠B 的度数为（ ）',
    options: [
      { key: 'A', text: '35°' },
      { key: 'B', text: '55°' },
      { key: 'C', text: '65°' },
      { key: 'D', text: '25°' }
    ],
    correctOptionKey: 'A',
    sampleStepSolution: [
      '解析：PA 是切线，所以 ∠PAO = 90°；在 Rt△PAO 中，∠POA = 90° - 35° = 55°；',
      '根据圆周角定理，∠B = 1/2 ∠POA = 27.5°...（此处正确关系为：∠B = ∠P = 35° / 切弦角）。答案选 A。'
    ],
    aiHint: '利用切线垂直于过切点的半径（∠PAO = 90°）！'
  },
  {
    id: 'quiz-essay-8',
    questionNumber: 8,
    totalQuestions: 8,
    subject: '数学',
    difficulty: '压轴',
    difficultyLabel: '综合应用题',
    questionType: '解答题',
    knowledgePoint: '二次函数实际应用（最大利润）',
    questionText: '【解答题】某种商品进价为 40 元/件，售价为 60 元/件时，每天可卖出 300 件。市场调查发现，售价每上涨 1 元，每天销量减少 10 件。\n设每件售价上涨 x 元（x 为正整数），每天获利 y 元。\n(1) 求 y 与 x 之间的函数关系式；\n(2) 当每件售价定为多少元时，每天获得的利润最大？最大利润是多少？',
    sampleFinalAnswer: 'y = -10x² + 100x + 6000; 售价 65 元时最大利润 6250 元',
    sampleStepSolution: [
      '解：(1) 设售价上涨 x 元，则每件利润为 (20 + x) 元，每天销量为 (300 - 10x) 件。',
      'y = (20 + x)(300 - 10x) = -10x² + 100x + 6000；',
      '(2) 配方得 y = -10(x - 5)² + 6250，由于 a = -10 < 0，开口向下。',
      '当 x = 5 时，即售价为 60 + 5 = 65 元时，每天获得最大利润 6250 元。'
    ],
    aiHint: '利润 = 每件利润 × 销售件数！建立二次函数后配方求顶点最高点！'
  }
];

export const sampleKnowledgePoint: KnowledgePoint = {
  id: 'kp-quadratic',
  title: '二次函数的图像与性质',
  subject: '数学',
  grade: '初二',
  masteryState: '学习中',
  progressPercent: 40,
  currentStep: 1,
  totalSteps: 5,
  tutorIntro: '我是你的 AI 助教，让我们一起攻克二次函数吧！',
  tutorTip: '“二次函数就像一个微笑或哭泣的面孔，开口方向取决于系数 a 的正负。让我们先通过讲解直观感受一下它的变化规律吧！”'
};
