import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleCheck,
  Clock3,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { HomeRecommendation } from '../utils/homeRecommendations';

interface HomeViewProps {
  student: StudentProfile;
  todayTaskCompleted: number;
  todayTaskTotal: number;
  recommendations: HomeRecommendation[];
  onStartTodayLearning: () => void;
  onOpenKnowledgePoint: (title: string, code: string) => void;
  onPracticeKnowledgePoint: (title: string, code: string) => void;
  onOpenStudyCatalog: () => void;
}

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];
const STUDY_MINUTES = [28, 42, 36, 31, 0, 0, 0];

const recommendationCopy = (item: HomeRecommendation) => {
  if (item.masteryState === '学习中') {
    return {
      badge: '学习中',
      action: '继续学习',
      detail: `已经开始建立概念，接着完成这一节`,
      icon: <RotateCcw className="h-4 w-4" />,
      tone: 'emerald',
    };
  }

  if (item.masteryState === '已学习') {
    return {
      badge: '待练习',
      action: '去练习',
      detail: `还有 ${item.unpracticedQuestionCount} 道关联题可以验证掌握`,
      icon: <BookOpen className="h-4 w-4" />,
      tone: 'amber',
    };
  }

  return {
    badge: '未学习',
    action: '开始学习',
    detail: `从一条入门示例开始理解这个知识点`,
    icon: <ArrowRight className="h-4 w-4" />,
    tone: 'slate',
  };
};

export const HomeView: React.FC<HomeViewProps> = ({
  student,
  todayTaskCompleted,
  todayTaskTotal,
  recommendations,
  onStartTodayLearning,
  onOpenKnowledgePoint,
  onPracticeKnowledgePoint,
  onOpenStudyCatalog,
}) => {
  const mascotRef = useRef<HTMLDivElement>(null);
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const completionPercent = todayTaskTotal > 0
    ? Math.round((todayTaskCompleted / todayTaskTotal) * 100)
    : 0;
  const weeklyGrowth = 12;

  const days = useMemo(() => WEEK_DAYS.map((label, index) => ({
    label,
    index,
    isPast: index < currentDayIndex,
    isToday: index === currentDayIndex,
    minutes: index < currentDayIndex ? STUDY_MINUTES[index] : 0,
  })), [currentDayIndex]);

  useEffect(() => {
    if (!mascotRef.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const entrance = gsap.fromTo(
        mascotRef.current,
        { opacity: 0, scale: 0.88, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)' },
      );
      const float = gsap.to(mascotRef.current, {
        y: -4,
        duration: 2.4,
        delay: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      return () => {
        entrance.kill();
        float.kill();
      };
    });
    return () => media.revert();
  }, []);

  const handleRecommendation = (item: HomeRecommendation) => {
    if (item.masteryState === '已学习') {
      onPracticeKnowledgePoint(item.title, item.code);
      return;
    }
    onOpenKnowledgePoint(item.title, item.code);
  };

  return (
    <div className="min-h-full space-y-4 px-4 pb-28 pt-3 animate-fade-in">
      <section className="relative overflow-hidden rounded-[26px] border border-emerald-100 bg-[linear-gradient(135deg,#edf9f2_0%,#ddf3e8_62%,#c8eadb_100%)] px-5 pb-5 pt-5 shadow-[0_12px_34px_-24px_rgba(5,150,105,0.42)]">
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border border-emerald-300/35" />
        <div className="absolute -right-5 -top-6 h-28 w-28 rounded-full bg-white/35" />

        <div className="relative z-10 max-w-[72%]">
          <h1 className="text-[25px] font-black leading-[1.18] tracking-tight text-slate-950">
            今天，先从<br />
            <span className="text-emerald-700">一个好问题</span>开始。
          </h1>
          <p className="mt-3 text-[11px] font-medium leading-5 text-slate-600">
            学伴已结合你的错题和进度，准备好一次约 25 分钟的专注学习。
          </p>
        </div>

        <div ref={mascotRef} className="absolute right-3 top-[52px] z-10 grid h-[94px] w-[94px] place-items-center" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-emerald-500/35" />
          <div className="absolute inset-2 rounded-full bg-white/55" />
          <svg viewBox="0 0 120 120" className="relative h-[86px] w-[86px] drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="homeRobotHeadGrad" x1="20" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E6F4EA" />
              </linearGradient>
              <linearGradient id="homeRobotVisorGrad" x1="30" y1="35" x2="90" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#022C22" />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="18" rx="16" ry="4" stroke="#FBBF24" strokeWidth="2" />
            <polygon points="60,11 80,17 60,23 40,17" fill="#047857" />
            <rect x="58" y="9" width="4" height="4" fill="#FBBF24" />
            <path d="M76 18 82 27" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="20" y="44" width="8" height="20" rx="4" fill="#10B981" />
            <rect x="92" y="44" width="8" height="20" rx="4" fill="#10B981" />
            <circle cx="24" cy="54" r="2.5" fill="#34D399" />
            <circle cx="96" cy="54" r="2.5" fill="#34D399" />
            <rect x="26" y="26" width="68" height="56" rx="24" fill="url(#homeRobotHeadGrad)" stroke="#10B981" strokeWidth="2.5" />
            <rect x="34" y="35" width="52" height="38" rx="16" fill="url(#homeRobotVisorGrad)" />
            <path d="M38 40c12-3 32-3 44 0-10 3-34 3-44 0Z" fill="#FFFFFF" opacity=".15" />
            <ellipse cx="48" cy="52" rx="5" ry="6" fill="#38BDF8" />
            <circle cx="49" cy="50" r="2" fill="#FFFFFF" />
            <ellipse cx="72" cy="52" rx="5" ry="6" fill="#38BDF8" />
            <circle cx="73" cy="50" r="2" fill="#FFFFFF" />
            <circle cx="48" cy="52" r="9" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="72" cy="52" r="9" stroke="#FBBF24" strokeWidth="2" />
            <path d="M57 52h6M39 51l-6-2M81 51l6-2" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <path d="M55 63q5 4 10 0" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 84h32l-6 18H50l-6-18Z" fill="#059669" />
            <circle cx="60" cy="92" r="3.5" fill="#FBBF24" />
            <path d="m52 84 8 8 8-8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
          </svg>
        </div>

        <button
          type="button"
          onClick={todayTaskTotal > 0 ? onStartTodayLearning : onOpenStudyCatalog}
          className="relative z-10 mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-black text-white shadow-[0_10px_22px_-12px_rgba(4,120,87,0.85)] transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{todayTaskTotal > 0 ? '开启今日学习' : '浏览学习内容'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
        {todayTaskTotal > 0 && (
          <div className="absolute bottom-5 right-4 z-10 text-right">
            <p className="text-lg font-black text-emerald-800">{completionPercent}%</p>
            <p className="text-[9px] font-bold text-emerald-800/55">今日完成</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.15em] text-emerald-700/65">本周学习进程</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">稳稳地推进</h2>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-emerald-700">+{weeklyGrowth}</p>
            <p className="text-[9px] font-bold text-slate-400">本周成长</p>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="absolute left-[5%] right-[5%] top-[7px] h-px bg-emerald-100" />
          <div className="relative grid grid-cols-7">
            {days.map((day) => (
              <div key={day.label} className="flex min-w-0 flex-col items-center">
                <span className={`relative z-10 h-3.5 w-3.5 rounded-full border-[3px] ${
                  day.isToday
                    ? 'scale-125 border-emerald-100 bg-blue-500 ring-2 ring-emerald-200'
                    : day.isPast
                      ? 'border-white bg-emerald-500'
                      : 'border-white bg-emerald-100'
                }`} />
                <span className={`mt-2 text-[10px] font-bold ${day.isToday ? 'text-emerald-700' : 'text-slate-400'}`}>{day.label}</span>
                <span className={`mt-1 text-[9px] font-black ${day.isPast ? 'text-emerald-700/75' : 'text-transparent'}`}>
                  {day.minutes > 0 ? `${day.minutes}m` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-500">
            <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />
            连续学习 <span className="text-emerald-700">{student.studyDays} 天</span>
          </div>
          <span className="font-medium text-slate-400">比上周多坚持 2 天</span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-24px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.1em] text-emerald-700/65">学伴为你推荐知识点</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">今天从哪里继续</h2>
          </div>
          <button
            type="button"
            onClick={onOpenStudyCatalog}
            className="mt-1 text-[11px] font-black text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            更多
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div className="mx-4 mb-4 rounded-xl bg-emerald-50 p-4 text-center">
            <p className="text-xs font-bold text-slate-700">当前学科还没有待推进的知识点</p>
            <button type="button" onClick={onOpenStudyCatalog} className="mt-2 text-xs font-black text-emerald-700">
              查看知识点目录 <ChevronRight className="inline h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recommendations.map((item, index) => {
              const copy = recommendationCopy(item);
              const iconTone = copy.tone === 'emerald'
                ? 'bg-emerald-100 text-emerald-700'
                : copy.tone === 'amber'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600';
              const badgeTone = copy.tone === 'emerald'
                ? 'bg-emerald-50 text-emerald-700'
                : copy.tone === 'amber'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-500';

              return (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => handleRecommendation(item)}
                  className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 active:bg-emerald-50/60"
                  aria-label={`${copy.action}：${item.title}`}
                >
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconTone}`}>
                    <span className="text-base font-black">{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-700/70">{item.subject} · {item.sectionTitle}</span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${badgeTone}`}>{copy.badge}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[14px] font-black leading-5 text-slate-900">{item.title}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Clock3 className="h-3 w-3" />
                      <span className="truncate">{copy.detail}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-2 text-[10px] font-black text-emerald-700 transition group-hover:bg-emerald-100">
                    {copy.icon}
                    <span className="hidden min-[370px]:inline">{copy.action}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
