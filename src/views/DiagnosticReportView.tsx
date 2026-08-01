import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  PieChart,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import gsap from 'gsap';
import { StudentProfile, ScreenType } from '../types';

interface DiagnosticReportViewProps {
  student: StudentProfile;
  onNavigateToScreen: (screen: ScreenType) => void;
}

const ALL_SUBJECT_OPTIONS = [
  '全科', '数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'
];

const RADAR_DATA_MAP: Record<string, { labels: string[]; scores: number[] }> = {
  '全科': { labels: ['基础', '解题', '思维', '应用', '提速'], scores: [0.85, 0.78, 0.82, 0.75, 0.88] },
  '数学': { labels: ['概念', '计算', '逻辑', '综合', '速度'], scores: [0.92, 0.88, 0.85, 0.76, 0.82] },
  '物理': { labels: ['原理', '推导', '模型', '应用', '准确'], scores: [0.80, 0.78, 0.94, 0.82, 0.72] },
  '化学': { labels: ['方程', '实验', '计算', '推断', '记忆'], scores: [0.86, 0.82, 0.80, 0.88, 0.85] },
  '生物': { labels: ['概念', '识图', '遗传', '实验', '理解'], scores: [0.90, 0.72, 0.82, 0.90, 0.88] },
  '英语': { labels: ['词汇', '语法', '阅读', '听力', '写作'], scores: [0.88, 0.92, 0.84, 0.86, 0.78] },
  '语文': { labels: ['积累', '古诗', '阅读', '鉴赏', '写作'], scores: [0.86, 0.80, 0.88, 0.82, 0.85] },
  '历史': { labels: ['时序', '史料', '事件', '辨析', '表达'], scores: [0.92, 0.85, 0.88, 0.80, 0.86] },
  '地理': { labels: ['识图', '区域', '气候', '综合', '分析'], scores: [0.84, 0.88, 0.82, 0.86, 0.80] },
  '政治': { labels: ['概念', '时政', '材料', '逻辑', '表达'], scores: [0.88, 0.82, 0.90, 0.84, 0.88] },
};

// Precise, Cute & Animated 5-Axis Radar Chart Component
const RadarChartGraphic: React.FC<{ subject: string }> = ({ subject }) => {
  const polyRef = useRef<SVGPolygonElement>(null);
  const sweepRef = useRef<SVGGElement>(null);

  const data = RADAR_DATA_MAP[subject] || RADAR_DATA_MAP['全科'];
  const { labels, scores } = data;

  const center = 60;
  const radius = 34;

  const getPoint = (index: number, score: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
    const x = center + radius * score * Math.cos(angle);
    const y = center + radius * score * Math.sin(angle);
    return { x, y };
  };

  const currentPointsStr = scores.map((s, i) => {
    const p = getPoint(i, s);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');

  // GSAP Morph / Scale effect on subject change
  useEffect(() => {
    if (polyRef.current) {
      gsap.fromTo(
        polyRef.current,
        { scale: 0.1, transformOrigin: '60px 60px', opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }
      );
    }
  }, [subject]);

  // Radar beam rotation
  useEffect(() => {
    if (sweepRef.current) {
      const sweepAnim = gsap.to(sweepRef.current, {
        rotation: 360,
        transformOrigin: '60px 60px',
        duration: 4.5,
        repeat: -1,
        ease: 'none'
      });
      return () => {
        sweepAnim.kill();
      };
    }
  }, []);

  const webRings = [0.33, 0.66, 1.0];

  return (
    <div className="relative w-32 h-32 shrink-0 flex items-center justify-center select-none overflow-hidden">
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-hidden">
        <defs>
          <radialGradient id="radarBgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="polyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="sweepSectorGrad" cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Background Glow */}
        <circle cx={center} cy={center} r={radius} fill="url(#radarBgGrad)" />

        {/* Web Rings */}
        {webRings.map((rRatio, rIdx) => {
          const ringPoints = Array.from({ length: 5 }).map((_, i) => {
            const p = getPoint(i, rRatio);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(' ');

          return (
            <polygon
              key={rIdx}
              points={ringPoints}
              fill="none"
              stroke="#A7F3D0"
              strokeWidth={rIdx === 2 ? '1.2' : '0.6'}
              strokeDasharray={rIdx === 1 ? '2 2' : 'none'}
              opacity={0.5 + rIdx * 0.2}
            />
          );
        })}

        {/* Radial Axis Lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const outerP = getPoint(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerP.x}
              y2={outerP.y}
              stroke="#A7F3D0"
              strokeWidth="0.8"
              opacity="0.45"
            />
          );
        })}

        {/* Radar Sweep Beam Line strictly bound within radius */}
        <g ref={sweepRef}>
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius}
            stroke="#FBBF24"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* Animated Data Polygon */}
        <polygon
          ref={polyRef}
          points={currentPointsStr}
          fill="url(#polyGrad)"
          stroke="#FBBF24"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Vertex Dots & Cute Dimension Labels */}
        {scores.map((s, i) => {
          const p = getPoint(i, s);
          const labelP = getPoint(i, 1.32);
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="2.8"
                fill="#FFFFFF"
                stroke="#F59E0B"
                strokeWidth="1.5"
              />
              <text
                x={labelP.x}
                y={labelP.y + 3}
                fill="#FDE68A"
                fontSize="8"
                fontWeight="800"
                textAnchor="middle"
                className="drop-shadow-xs"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// PRD Chapter 13 structured weak knowledge point definition
interface WeakKnowledgePointItem {
  id: string;
  name: string;
  cycleQuestions: number;
  cycleAccuracy: number; // percentage e.g. 45
  currentStatus: '概念不足' | '应用不足' | '需复习' | '巩固中';
  recommendAction: '复习概念' | '加强应用' | '重做错题';
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({
  student,
  onNavigateToScreen,
}) => {
  const [subject, setSubject] = useState<string>('全科');
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');

  // PRD 13.5 - 13.9 Factual Calculated Data
  const is7Days = timeRange === '7days';

  const stats = {
    totalQuestions: is7Days ? 42 : 156,
    correctCount: is7Days ? 31 : 122,
    wrongCount: is7Days ? 11 : 34,
    accuracy: is7Days ? 73.8 : 78.2,
    coveredPoints: is7Days ? 18 : 32,
    totalPoints: 45,
    coveragePercent: is7Days ? 40 : 71.1,
  };

  // PRD 13.7 Weak Knowledge Points List sorted by lowest accuracy
  const weakKnowledgePoints: WeakKnowledgePointItem[] = [
    {
      id: 'kp1',
      name: '二次函数顶点与对称轴公式',
      cycleQuestions: 12,
      cycleAccuracy: 41.6,
      currentStatus: '应用不足',
      recommendAction: '重做错题',
    },
    {
      id: 'kp2',
      name: '去括号与系数符号分配律',
      cycleQuestions: 8,
      cycleAccuracy: 50.0,
      currentStatus: '概念不足',
      recommendAction: '复习概念',
    },
    {
      id: 'kp3',
      name: '切线方程与导数几何意义',
      cycleQuestions: 6,
      cycleAccuracy: 50.0,
      currentStatus: '需复习',
      recommendAction: '加强应用',
    },
  ];

  // PRD 13.8 Error Cause Distribution
  const errorDistribution = [
    { category: '计算错误', count: 5, percent: 45.5, color: 'bg-rose-500' },
    { category: '概念没理解', count: 3, percent: 27.3, color: 'bg-amber-500' },
    { category: '审题遗漏', count: 2, percent: 18.2, color: 'bg-blue-500' },
    { category: '知识点混淆', count: 1, percent: 9.0, color: 'bg-purple-500' },
    { category: '推理跳步', count: 0, percent: 0, color: 'bg-slate-300' },
  ];

  return (
    <div className="px-4 pt-3 pb-32 space-y-3.5 animate-fade-in">
      {/* 1. Header Bar: Clean Title & Time Range Pill Switch */}
      <div className="bg-white p-3.5 rounded-2xl card-shadow border border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/80 flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <h2 className="text-base font-black text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {student.name} 的学习诊断
          </h2>
        </div>

        {/* Time Period Switch Segmented Control */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          {(['7days', '30days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range === '7days' ? '近7天' : '近30天'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Full Subject Scrollable Pill Bar (全科, 数学, 物理...) */}
      <div className="bg-white p-2.5 rounded-2xl card-shadow border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1 font-bold text-slate-700">
          <span>全科诊断维度</span>
          <span className="text-[10px] text-slate-400 font-normal">点击切换查看学科诊断</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          {ALL_SUBJECT_OPTIONS.map((sub) => {
            const isActive = subject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. AI Diagnostic Primary Banner with Animated Radar Chart */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 rounded-3xl p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-bold text-amber-300 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>开窍 AI 诊断报告 · {subject}</span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs text-emerald-100 font-medium">综合击破度</div>
            <div className="text-3xl font-black text-amber-300 tracking-tight drop-shadow-sm">
              {stats.accuracy}<span className="text-base font-bold ml-0.5">%</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-100/90 font-medium leading-tight">
            根据{timeRange === '7days' ? '近 7 天' : '近 30 天'} {stats.totalQuestions} 道有效答题题目综合计算归因
          </p>
        </div>

        {/* Embedded Dynamic Radar Frame */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shrink-0 shadow-inner">
          <RadarChartGraphic subject={subject} />
        </div>
      </div>

      {/* 4. 3 Metric Cards matching HomeView design system */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl card-shadow border border-slate-200/80 text-center">
          <span className="text-[11px] text-slate-500 font-medium">答题总量</span>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            {stats.totalQuestions}<span className="text-xs text-slate-400 font-normal ml-0.5">题</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl card-shadow border border-slate-200/80 text-center">
          <span className="text-[11px] text-slate-500 font-medium">正确率</span>
          <div className="mt-1 text-lg font-extrabold text-emerald-600">
            {stats.accuracy}<span className="text-xs text-slate-400 font-normal ml-0.5">%</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl card-shadow border border-slate-200/80 text-center">
          <span className="text-[11px] text-slate-500 font-medium">知识覆盖</span>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            {stats.coveredPoints}<span className="text-xs text-slate-400 font-normal">/{stats.totalPoints}</span>
          </div>
        </div>
      </div>

      {/* PRD 13.6: Knowledge Coverage Metric */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-2.5">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            知识覆盖度
          </h3>
          <span className="text-xs font-bold text-emerald-700">
            {stats.coveredPoints} / {stats.totalPoints} 知识点 ({stats.coveragePercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.coveragePercent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400">
          基于当前年级【{student.grade} {subject}】全量知识点大纲统计
        </p>
      </div>

      {/* Weak Knowledge Points Section */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            薄弱知识点清单
          </h3>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
            需优先突破
          </span>
        </div>

        <div className="space-y-2.5">
          {weakKnowledgePoints.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug flex-1">
                  {item.name}
                </h4>
                <button
                  onClick={() => onNavigateToScreen('knowledge_study')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shrink-0 active:scale-95 transition-all shadow-2xs"
                >
                  {item.recommendAction}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                <span className="text-slate-600">
                  题量：<span className="font-semibold text-slate-800">{item.cycleQuestions} 题</span>
                </span>
                <span className="text-slate-600">
                  正确率：<span className="font-bold text-rose-600">{item.cycleAccuracy}%</span>
                </span>
                <span className="inline-flex items-center bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200/60">
                  状态：{item.currentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Distribution Section */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-emerald-600" />
          错因分布统计
        </h3>

        <div className="space-y-2 text-xs">
          {errorDistribution.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-700">
                <span>{item.category} ({item.count} 次)</span>
                <span className="font-bold text-slate-900">{item.percent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200 space-y-2">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI 诊断总结</span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-medium">
          根据{timeRange === '7days' ? '近7天' : '近30天'}共 {stats.totalQuestions} 道有效答题记录：你对【{subject}】的知识点覆盖度为 {stats.coveragePercent}%。主要的失分归因集中在<span className="text-rose-600 font-bold">【计算错误】(45.5%)</span> 与 <span className="text-amber-600 font-bold">【概念没理解】(27.3%)</span>。特别在【二次函数顶点与对称轴公式】相关题目中正确率较低 ({weakKnowledgePoints[0].cycleAccuracy}%)。
        </p>
      </div>

      {/* Subsequent Learning Actions */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          后续推荐学习
        </h3>

        <div className="space-y-2">
          {/* Priority 1: 复习最新错题 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">1. 复习最新错题</span>
              <p className="text-[11px] text-slate-500 mt-0.5">针对近期错题本中的去括号计算失误进行强化</p>
            </div>
            <button
              onClick={() => onNavigateToScreen('instant_learning')}
              className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full hover:bg-emerald-700 flex items-center gap-1 shrink-0"
            >
              错题强化 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Priority 2: 补学概念薄弱 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">2. 补学概念薄弱</span>
              <p className="text-[11px] text-slate-500 mt-0.5">重新学习【二次函数顶点与对称轴公式】</p>
            </div>
            <button
              onClick={() => onNavigateToScreen('knowledge_study')}
              className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full hover:bg-emerald-700 flex items-center gap-1 shrink-0"
            >
              概念补学 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Priority 3: 练习应用薄弱 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">3. 专项题目巩固</span>
              <p className="text-[11px] text-slate-500 mt-0.5">前往题库进行二次函数精选题练习</p>
            </div>
            <button
              onClick={() => onNavigateToScreen('practice_quiz')}
              className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full hover:bg-emerald-700 flex items-center gap-1 shrink-0"
            >
              精选练习 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

