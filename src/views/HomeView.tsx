import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Camera, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Lightbulb,
  Bot,
  Calendar,
  Clock,
  Target,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile, TaskItem, ScreenType, SubjectType, WrongQuestion } from '../types';
import { CheckInCalendarModal } from '../components/CheckInCalendarModal';
import { SubjectSelect } from '../components/SubjectSelect';

interface HomeViewProps {
  student: StudentProfile;
  tasks: TaskItem[];
  wrongQuestions?: WrongQuestion[];
  onNavigateToScreen: (screen: ScreenType) => void;
  onOpenReport: () => void;
  onSubjectChange?: (subject: SubjectType) => void;
  onSelectKnowledgePointForPractice?: (title: string) => void;
  onSelectWrongItemForInstantLearning?: (item: WrongQuestion) => void;
}

const SUBJECTS: SubjectType[] = ['数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const HomeView: React.FC<HomeViewProps> = ({
  student,
  tasks,
  wrongQuestions = [],
  onNavigateToScreen,
  onOpenReport,
  onSubjectChange,
  onSelectKnowledgePointForPractice,
  onSelectWrongItemForInstantLearning,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const robotAvatarRef = useRef<HTMLDivElement>(null);
  const robotImgRef = useRef<HTMLDivElement>(null);

  const weakKnowledgeItems = useMemo(() => {
    const knowledgeStats = new Map<string, { wrongCount: number; unreviewedCount: number }>();

    wrongQuestions
      .filter((question) => question.subject === student.currentSubject)
      .forEach((question) => {
        const knowledgePoints = question.knowledgePoints?.length
          ? [...new Set(question.knowledgePoints)]
          : [question.topic];

        knowledgePoints.forEach((title) => {
          const current = knowledgeStats.get(title) || { wrongCount: 0, unreviewedCount: 0 };
          current.wrongCount += 1;
          if (question.reviewStatus === '未复习') current.unreviewedCount += 1;
          knowledgeStats.set(title, current);
        });
      });

    return Array.from(knowledgeStats.entries())
      .map(([title, stats]) => ({ title, ...stats }))
      .sort((a, b) => b.unreviewedCount - a.unreviewedCount || b.wrongCount - a.wrongCount)
      .slice(0, 3);
  }, [student.currentSubject, wrongQuestions]);

  useEffect(() => {
    // GSAP Floating & Entrance Animation for Robot Avatar
    if (robotAvatarRef.current) {
      gsap.fromTo(
        robotAvatarRef.current,
        { scale: 0.8, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }
      );

      const floatAnim = gsap.to(robotAvatarRef.current, {
        y: -5,
        rotate: 1.5,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.7
      });

      return () => {
        floatAnim.kill();
      };
    }
  }, []);

  return (
    <div className="px-4 pt-3 pb-24 space-y-3.5 animate-fade-in relative min-h-full">
      {/* Banner Header Card */}
      <div 
        onClick={() => setIsCalendarOpen(true)}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 rounded-3xl p-4.5 text-white shadow-xs cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group"
      >
        <div className="relative z-10 max-w-[62%] space-y-2">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>你好，{student.name}</span>
              <span className="animate-bounce inline-block">👋</span>
            </h2>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              开窍 AI 智能学伴 · {student.currentSubject}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold leading-snug text-emerald-50">
              已经学习第 <span className="text-amber-300 font-black text-xl drop-shadow-xs">{student.studyDays}</span> 天！
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCalendarOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/25 transition-colors shadow-2xs mt-1"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>打卡日历</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D Smart AI Robot Mascot */}
        <div 
          ref={robotAvatarRef}
          className="absolute -top-1 right-1 bottom-0 w-32 flex flex-col items-center justify-center pointer-events-none select-none z-10"
        >
          <div ref={robotImgRef} className="w-24 h-24 flex items-center justify-center drop-shadow-xl">
            <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="robotHeadGrad" x1="20" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E6F4EA" />
                </linearGradient>
                <linearGradient id="robotVisorGrad" x1="30" y1="35" x2="90" y2="70" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#022C22" />
                </linearGradient>
              </defs>

              {/* Floating Golden Halo */}
              <ellipse cx="60" cy="18" rx="16" ry="4" stroke="#FBBF24" strokeWidth="2" fill="none" className="animate-pulse" />

              {/* Graduation Cap */}
              <polygon points="60,11 80,17 60,23 40,17" fill="#047857" />
              <rect x="58" y="9" width="4" height="4" fill="#FBBF24" />
              <path d="M 76 18 L 82 27" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />

              {/* Earpieces */}
              <rect x="20" y="44" width="8" height="20" rx="4" fill="#10B981" />
              <rect x="92" y="44" width="8" height="20" rx="4" fill="#10B981" />
              <circle cx="24" cy="54" r="2.5" fill="#34D399" />
              <circle cx="96" cy="54" r="2.5" fill="#34D399" />

              {/* Main Capsule Head */}
              <rect x="26" y="26" width="68" height="56" rx="24" fill="url(#robotHeadGrad)" stroke="#10B981" strokeWidth="2.5" />

              {/* Visor Screen */}
              <rect x="34" y="35" width="52" height="38" rx="16" fill="url(#robotVisorGrad)" />
              <path d="M 38 40 C 50 37, 70 37, 82 40 C 72 43, 48 43, 38 40 Z" fill="#FFFFFF" opacity="0.15" />

              {/* Glowing Eyes */}
              <ellipse cx="48" cy="52" rx="5" ry="6" fill="#38BDF8" />
              <circle cx="49" cy="50" r="2" fill="#FFFFFF" />
              
              <ellipse cx="72" cy="52" rx="5" ry="6" fill="#38BDF8" />
              <circle cx="73" cy="50" r="2" fill="#FFFFFF" />

              {/* Glasses */}
              <circle cx="48" cy="52" r="9" fill="none" stroke="#FBBF24" strokeWidth="2" />
              <circle cx="72" cy="52" r="9" fill="none" stroke="#FBBF24" strokeWidth="2" />
              <line x1="57" y1="52" x2="63" y2="52" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
              <line x1="39" y1="51" x2="33" y2="49" stroke="#FBBF24" strokeWidth="1.5" />
              <line x1="81" y1="51" x2="87" y2="49" stroke="#FBBF24" strokeWidth="1.5" />

              {/* Confident Smile */}
              <path d="M 55 63 Q 60 67 65 63" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Collar */}
              <path d="M 44 84 L 76 84 L 70 102 L 50 102 Z" fill="#059669" />
              <circle cx="60" cy="92" r="3.5" fill="#FBBF24" />
              <path d="M 52 84 L 60 92 L 68 84" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
            </svg>
          </div>

          {/* 开窍学伴 Dark Badge */}
          <div className="-mt-1 bg-emerald-950/85 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-400/40 shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>开窍学伴</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: 今日任务 */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>今日任务</span>
          </div>
          <div className="my-1">
            <span className="text-xl font-black text-emerald-600">6</span>
            <span className="text-xs text-slate-400 font-bold ml-0.5">/8</span>
          </div>
          <div className="text-[10px] font-medium text-slate-400">
            完成 75%
          </div>
        </div>

        {/* Card 2: 学习时间 */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>学习时间</span>
          </div>
          <div className="my-1">
            <span className="text-xl font-black text-slate-800">68</span>
            <span className="text-xs text-slate-500 font-bold ml-0.5">分</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-600">
            较昨日 +12 分
          </div>
        </div>

        {/* Card 3: 正确率 */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500">
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            <span>正确率</span>
          </div>
          <div className="my-1">
            <span className="text-xl font-black text-slate-800">85</span>
            <span className="text-xs text-slate-500 font-bold ml-0.5">%</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-600">
            较昨日 +6%
          </div>
        </div>
      </div>

      {/* AI Smart Quiz Card (AI 智能抽题) */}
      <div 
        onClick={() => {
          onSelectKnowledgePointForPractice?.('');
          onNavigateToScreen('practice');
        }}
        className="bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200/60 shadow-2xs cursor-pointer hover:border-emerald-300 transition-all active:scale-[0.99] flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                AI 智能抽题
              </h3>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200/80">
                个性推荐
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              基于你的掌握度，自动生成 5 题随堂测验
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectKnowledgePointForPractice?.('');
            onNavigateToScreen('practice');
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all active:scale-95 shrink-0 flex items-center gap-0.5 shadow-xs"
        >
          <span>立即开始</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weak Knowledge Points Section (薄弱知识点关注榜) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>薄弱知识点关注榜</span>
          </h3>

          {/* Subject Dropdown Select */}
          <SubjectSelect
            value={student.currentSubject}
            onChange={(sub) => onSubjectChange?.(sub)}
          />
        </div>

        <div className="space-y-2">
          {weakKnowledgeItems.map((item) => (
            <div
              key={item.title}
              className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 hover:border-emerald-300 transition-all"
            >
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-slate-900 text-xs truncate">{item.title}</span>
                <span className="text-[10px] font-extrabold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full shrink-0 border border-rose-100">
                  关联错题 {item.wrongCount} 题
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => {
                    onSelectKnowledgePointForPractice?.(item.title);
                    onNavigateToScreen('knowledge_study');
                  }}
                  className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1 shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  <span>学习</span>
                </button>

                <button
                  onClick={() => {
                    if (onSelectKnowledgePointForPractice) {
                      onSelectKnowledgePointForPractice(item.title);
                    }
                    onNavigateToScreen('practice');
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all active:scale-95 shadow-2xs flex items-center gap-0.5"
                >
                  <span>练题</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {weakKnowledgeItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
              <p className="mt-2 text-xs font-bold text-slate-700">暂无关联错题</p>
              <p className="mt-1 text-[11px] text-slate-400">拍照批改或加入错题本后，会自动按知识点统计</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button 
            onClick={() => onNavigateToScreen('knowledge_study')}
            className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 py-0.5"
          >
            <span>查看全部薄弱知识点</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Check-In Calendar & Study Review Modal */}
      <CheckInCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        student={student}
      />
    </div>
  );
};
