import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleCheck,
  Clock3,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { StudentProfile, WrongQuestion } from '../types';
import { HomeRecommendation } from '../utils/homeRecommendations';
import { CheckInCalendarModal } from '../components/CheckInCalendarModal';

interface HomeViewProps {
  student: StudentProfile;
  todayTaskCompleted: number;
  todayTaskTotal: number;
  recommendations: HomeRecommendation[];
  wrongQuestions: WrongQuestion[];
  onStartTodayLearning: () => void;
  onOpenKnowledgePoint: (title: string, code: string) => void;
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

  if (item.masteryState === '已练习') {
    return {
      badge: '已练习',
      action: '举一反三',
      detail: `已完成 ${item.practicedQuestionCount} 道，继续巩固薄弱环节`,
      icon: <RotateCcw className="h-4 w-4" />,
      tone: 'emerald',
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
  wrongQuestions,
  onStartTodayLearning,
  onOpenKnowledgePoint,
  onOpenStudyCatalog,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeakPointsOpen, setIsWeakPointsOpen] = useState(false);
  const [expandedRecommendationCode, setExpandedRecommendationCode] = useState<string | null>(null);
  const [visibleWrongCode, setVisibleWrongCode] = useState<string | null>(null);
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

  const normalizeTitle = (value: string) => value.replace(/[\s的与及·、（）()Δ]/g, '').toLowerCase();
  const getRelatedWrongQuestions = (item: HomeRecommendation) => {
    const target = normalizeTitle(item.title);
    return wrongQuestions.filter((question) => {
      if (question.subject !== item.subject) return false;
      const points = question.knowledgePoints?.length ? question.knowledgePoints : [question.topic];
      return points.some((point) => {
        const normalizedPoint = normalizeTitle(point);
        return target.includes(normalizedPoint) || normalizedPoint.includes(target)
          || (normalizedPoint.length >= 4 && Array.from({ length: normalizedPoint.length - 1 }, (_, index) => normalizedPoint.slice(index, index + 2))
            .filter((gram) => target.includes(gram)).length >= 2);
      });
    });
  };

  const getRelatedWrongCount = (item: HomeRecommendation) => getRelatedWrongQuestions(item).length;

  const totalRelatedWrongCount = recommendations.reduce((sum, item) => sum + getRelatedWrongCount(item), 0);

  return (
    <div className="min-h-full space-y-4 px-4 pb-28 pt-3 animate-fade-in md:grid md:grid-cols-12 md:items-stretch md:gap-5 md:space-y-0 md:px-8 md:pt-6 lg:px-10">
      <section className="relative overflow-hidden rounded-[26px] border border-emerald-100 bg-[linear-gradient(135deg,#edf9f2_0%,#ddf3e8_62%,#c8eadb_100%)] px-5 pb-5 pt-5 shadow-[0_12px_34px_-24px_rgba(5,150,105,0.42)] md:col-span-7 md:min-h-[248px] md:px-8 md:py-7">
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

      <button
        type="button"
        onClick={() => setIsCalendarOpen(true)}
        aria-label="查看打卡日历与学习诊断"
        className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_-24px_rgba(15,23,42,0.35)] transition hover:border-emerald-200 hover:shadow-[0_12px_34px_-24px_rgba(5,150,105,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.99] md:col-span-5 md:min-h-[248px] md:p-6"
      >
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
      </button>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-24px_rgba(15,23,42,0.35)] md:col-span-12 md:mt-0">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.1em] text-emerald-700/65">学伴为你推荐知识点</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">今天从哪里继续</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsWeakPointsOpen(true)}
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
              const isExpanded = expandedRecommendationCode === item.code;
              const isShowingWrongQuestions = visibleWrongCode === item.code;
              const relatedWrongQuestions = getRelatedWrongQuestions(item);

              return (
                <div key={item.code} className={`transition-colors ${isExpanded ? 'bg-emerald-50/35' : ''}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedRecommendationCode(isExpanded ? null : item.code);
                      if (isExpanded) setVisibleWrongCode(null);
                    }}
                    aria-expanded={isExpanded}
                    className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 active:bg-emerald-50/60"
                    aria-label={`打开知识点：${item.title}`}
                  >
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconTone}`}>
                      <span className="text-base font-black">{index + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700/70">{item.subject} · {item.sectionTitle}</span>
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${badgeTone}`}>{copy.badge}</span>
                        <span className="text-[9px] font-bold text-rose-500">关联错题 {relatedWrongQuestions.length} 道</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[14px] font-black leading-5 text-slate-900">{item.title}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock3 className="h-3 w-3" />
                        <span className="truncate">{copy.detail}</span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 text-emerald-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 border-t border-emerald-100 px-4 pb-4 pt-3 animate-fade-in">
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => onOpenKnowledgePoint(item.title, item.code)} className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black text-white transition hover:bg-emerald-700 active:scale-[0.98]"><BookOpen className="h-4 w-4" />学习</button>
                        <button type="button" onClick={() => setVisibleWrongCode(isShowingWrongQuestions ? null : item.code)} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white text-xs font-black text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98]"><CircleCheck className="h-4 w-4" />{isShowingWrongQuestions ? '收起错题' : '查看错题'}</button>
                      </div>
                      {isShowingWrongQuestions && (
                        <div className="space-y-2">
                          {relatedWrongQuestions.map((question, wrongIndex) => (
                            <div key={question.id} className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black text-rose-500">错题 {wrongIndex + 1}</span><span className="text-[9px] font-bold text-slate-400">{question.errorCategory}</span></div>
                              <p className="mt-1.5 line-clamp-3 text-xs font-bold leading-5 text-slate-800">{question.questionText}</p>
                              <p className="mt-1 text-[10px] font-medium text-emerald-700">正确答案：{question.correctAnswer}</p>
                            </div>
                          ))}
                          {relatedWrongQuestions.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs font-medium text-slate-400">该知识点暂时没有已收录错题</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
      <CheckInCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        student={student}
      />
      {isWeakPointsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/40 px-0 backdrop-blur-[2px] md:items-center md:p-6" role="presentation" onMouseDown={() => setIsWeakPointsOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="weak-points-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-[82vh] w-full overflow-hidden rounded-t-[28px] bg-white shadow-2xl animate-fade-in md:max-w-3xl md:rounded-[28px]"
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-200 md:hidden" />
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-5 md:px-7">
              <div>
                <p className="text-[10px] font-black tracking-[0.12em] text-emerald-700/65">根据错题自动归纳</p>
                <h2 id="weak-points-title" className="mt-1 text-xl font-black text-slate-950">全部薄弱知识点</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">共 {recommendations.length} 个知识点，关联错题 {totalRelatedWrongCount} 道</p>
              </div>
              <button type="button" onClick={() => setIsWeakPointsOpen(false)} aria-label="关闭薄弱知识点" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[calc(82vh-102px)] divide-y divide-slate-100 overflow-y-auto overscroll-contain px-2 pb-[max(16px,env(safe-area-inset-bottom))] md:px-4">
              {recommendations.map((item, index) => {
                const isExpanded = expandedRecommendationCode === item.code;
                const isShowingWrongQuestions = visibleWrongCode === item.code;
                const relatedWrongQuestions = getRelatedWrongQuestions(item);
                return (
                  <div key={`weak-${item.code}`} className={`rounded-xl transition-colors ${isExpanded ? 'bg-emerald-50/50' : ''}`}>
                    <button type="button" onClick={() => { setExpandedRecommendationCode(isExpanded ? null : item.code); if (isExpanded) setVisibleWrongCode(null); }} aria-expanded={isExpanded} className="group flex w-full items-center gap-3 rounded-xl px-3 py-4 text-left hover:bg-emerald-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-base font-black text-emerald-700">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-emerald-700/70">{item.subject} · {item.sectionTitle}<span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] text-rose-500">关联错题 {relatedWrongQuestions.length} 道</span></span>
                        <span className="mt-1 block truncate text-sm font-black text-slate-900">{item.title}</span>
                      </span>
                      <ChevronRight className={`h-4 w-4 shrink-0 text-emerald-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="space-y-3 border-t border-emerald-100 px-3 pb-4 pt-3 animate-fade-in">
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => { setIsWeakPointsOpen(false); onOpenKnowledgePoint(item.title, item.code); }} className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black text-white"><BookOpen className="h-4 w-4" />学习</button>
                          <button type="button" onClick={() => setVisibleWrongCode(isShowingWrongQuestions ? null : item.code)} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white text-xs font-black text-emerald-700"><CircleCheck className="h-4 w-4" />{isShowingWrongQuestions ? '收起错题' : '查看错题'}</button>
                        </div>
                        {isShowingWrongQuestions && (
                          <div className="space-y-2">
                            {relatedWrongQuestions.map((question, wrongIndex) => (
                              <div key={`drawer-${question.id}`} className="rounded-xl border border-slate-200 bg-white p-3">
                                <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black text-rose-500">错题 {wrongIndex + 1}</span><span className="text-[9px] font-bold text-slate-400">{question.errorCategory}</span></div>
                                <p className="mt-1.5 line-clamp-3 text-xs font-bold leading-5 text-slate-800">{question.questionText}</p>
                                <p className="mt-1 text-[10px] font-medium text-emerald-700">正确答案：{question.correctAnswer}</p>
                              </div>
                            ))}
                            {relatedWrongQuestions.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs font-medium text-slate-400">该知识点暂时没有已收录错题</div>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
