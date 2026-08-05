import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Target, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Zap,
  Share2
} from 'lucide-react';
import { StudentProfile } from '../types';

interface CheckInCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onOpenReport: () => void;
}

interface DailyRecord {
  date: number; // 1 - 31
  checkedIn: boolean;
  studyMinutes: number;
  questionsCount: number;
  accuracy: number;
  scoreGained: number;
  topics: string[];
  aiComment: string;
}

// Sample realistic check-in data for July 2026 (31 days)
const GENERATED_DAILY_RECORDS: Record<number, DailyRecord> = {
  30: {
    date: 30,
    checkedIn: true,
    studyMinutes: 68,
    questionsCount: 24,
    accuracy: 88,
    scoreGained: 150,
    topics: ['二次函数图像与顶点坐标', '一元二次方程根与系数关系'],
    aiComment: '今天在二次函数顶点式转化表现优异！成功突破了中考高频易错点，继续保持攻坚状态！'
  },
  29: {
    date: 29,
    checkedIn: true,
    studyMinutes: 52,
    questionsCount: 18,
    accuracy: 83,
    scoreGained: 120,
    topics: ['相似三角形判定与性质', '圆的切线性质应用'],
    aiComment: '几何证明题思路清晰，构造辅助线十分熟练！'
  },
  28: {
    date: 28,
    checkedIn: true,
    studyMinutes: 45,
    questionsCount: 15,
    accuracy: 90,
    scoreGained: 110,
    topics: ['反比例函数与几何综合', '勾股定理逆定理'],
    aiComment: '高正确率的一天！数形结合思想运用得非常自如。'
  },
  27: {
    date: 27,
    checkedIn: true,
    studyMinutes: 60,
    questionsCount: 22,
    accuracy: 81,
    scoreGained: 135,
    topics: ['分式方程应用题专练', '不等式组无解求参'],
    aiComment: '攻克了容易丢分的不等式边界条件问题，积累很扎实。'
  },
  26: {
    date: 26,
    checkedIn: true,
    studyMinutes: 40,
    questionsCount: 12,
    accuracy: 75,
    scoreGained: 90,
    topics: ['二次根式化简求值', '平移与旋转变式'],
    aiComment: '完成了错题复盘，虽然稍有失误，但纠错总结做得很到位！'
  },
  25: {
    date: 25,
    checkedIn: true,
    studyMinutes: 75,
    questionsCount: 30,
    accuracy: 93,
    scoreGained: 180,
    topics: ['中考数学冲刺综合模考一'],
    aiComment: '模考表现亮眼！整张卷子答题节奏控制得极佳！'
  },
  24: {
    date: 24,
    checkedIn: false,
    studyMinutes: 0,
    questionsCount: 0,
    accuracy: 0,
    scoreGained: 0,
    topics: [],
    aiComment: '当天未进行自学打卡，适当休息也是为了更好地冲刺！'
  },
  23: {
    date: 23,
    checkedIn: true,
    studyMinutes: 50,
    questionsCount: 20,
    accuracy: 85,
    scoreGained: 120,
    topics: ['矩形菱形正方形性质辨析'],
    aiComment: '特殊平行四边形性质记忆清晰，推导迅速。'
  }
};

// Generate default fallback for other dates
const getRecordForDay = (day: number): DailyRecord => {
  if (GENERATED_DAILY_RECORDS[day]) {
    return GENERATED_DAILY_RECORDS[day];
  }
  // Days <= 23 with checkin pattern
  const isChecked = day <= 30 && day % 6 !== 0; // sporadic rest day
  if (isChecked) {
    return {
      date: day,
      checkedIn: true,
      studyMinutes: 35 + (day * 3) % 40,
      questionsCount: 10 + (day * 2) % 15,
      accuracy: 78 + (day * 5) % 18,
      scoreGained: 80 + day * 3,
      topics: ['基础概念强化与随堂测验'],
      aiComment: `第 ${day} 天打卡成功！坚持每天练习，知识记忆更加巩固。`
    };
  }
  return {
    date: day,
    checkedIn: false,
    studyMinutes: 0,
    questionsCount: 0,
    accuracy: 0,
    scoreGained: 0,
    topics: [],
    aiComment: '当天未打卡，继续保持学习节奏哦！'
  };
};

export const CheckInCalendarModal: React.FC<CheckInCalendarModalProps> = ({
  isOpen,
  onClose,
  student,
  onOpenReport,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(30); // Default to today (July 30)
  const [showShareToast, setShowShareToast] = useState(false);

  if (!isOpen) return null;

  const activeRecord = getRecordForDay(selectedDay);

  // July 2026 starts on Wednesday (offset = 2 if Monday is start)
  const daysInJuly = 31;
  const startDayOffset = 2; // Wed

  const handleShareCard = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <div className="fixed md:absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-3 overflow-hidden animate-fade-in">
      <div 
        className="w-full max-w-[420px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92%] sm:max-h-[86%] animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 bg-white/20 rounded-lg backdrop-blur-xs">
              <Calendar className="w-4 h-4 text-amber-300" />
            </span>
            <h2 className="text-base font-extrabold">打卡日历与学习诊断</h2>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 mt-3 bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 text-center">
            <div>
              <div className="text-[10px] text-emerald-100 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>累计打卡</span>
              </div>
              <div className="text-base font-black mt-0.5 text-white">{student.studyDays} <span className="text-[10px] font-normal text-emerald-200">天</span></div>
            </div>

            <div className="border-l border-white/15">
              <div className="text-[10px] text-emerald-100 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>连续打卡</span>
              </div>
              <div className="text-base font-black mt-0.5 text-amber-300">12 <span className="text-[10px] font-normal text-emerald-200">天</span></div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 hide-scrollbar">
          {/* Month Header & Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>2026 年 7 月</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                本月打卡 23 天
              </span>
            </h3>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1.5">
              <span>一</span>
              <span>二</span>
              <span>三</span>
              <span>四</span>
              <span>五</span>
              <span>六</span>
              <span>日</span>
            </div>

            {/* Days Cells */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty offset days */}
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="h-8.5" />
              ))}

              {/* Day 1 to 31 */}
              {Array.from({ length: daysInJuly }).map((_, idx) => {
                const dayNum = idx + 1;
                const rec = getRecordForDay(dayNum);
                const isToday = dayNum === 30;
                const isSelected = dayNum === selectedDay;

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`h-8.5 rounded-lg flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400 ring-offset-1'
                        : rec.checkedIn
                        ? 'bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 border border-emerald-200/60'
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-semibold leading-none">{dayNum}</span>

                    {/* Indicator Dot / Icon */}
                    {rec.checkedIn ? (
                      <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} />
                    ) : (
                      <span className="w-1 h-1 rounded-full mt-0.5 bg-slate-200" />
                    )}

                    {/* Today Badge Glow */}
                    {isToday && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily diagnostic summary */}
          {activeRecord.checkedIn && (
                <div className="rounded-2xl border border-blue-200/70 bg-blue-50/70 p-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                      <Target className="h-3.5 w-3.5 text-blue-600" />
                      <span>学习诊断</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenReport();
                      }}
                      className="flex items-center gap-0.5 text-[10px] font-bold text-blue-700 transition-colors hover:text-blue-900"
                    >
                      查看完整报告
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="rounded-lg bg-white/90 px-1.5 py-2 border border-blue-100">
                      <span className="block text-[9px] font-medium text-slate-400">学习表现</span>
                      <span className={`mt-0.5 block text-[11px] font-black ${activeRecord.accuracy >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {activeRecord.accuracy >= 85 ? '表现稳定' : '需要巩固'}
                      </span>
                    </div>
                    <div className="rounded-lg bg-white/90 px-1.5 py-2 border border-blue-100">
                      <span className="block text-[9px] font-medium text-slate-400">今日错题</span>
                      <span className="mt-0.5 block text-[11px] font-black text-rose-500">
                        {Math.round(activeRecord.questionsCount * (100 - activeRecord.accuracy) / 100)} 题
                      </span>
                    </div>
                    <div className="rounded-lg bg-white/90 px-1.5 py-2 border border-blue-100">
                      <span className="block text-[9px] font-medium text-slate-400">诊断重点</span>
                      <span className="mt-0.5 block truncate text-[11px] font-black text-blue-700">
                        {activeRecord.topics[0] || '保持节奏'}
                      </span>
                    </div>
                  </div>
                </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <button
              onClick={handleShareCard}
              className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs py-2.5 rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>生成打卡海报</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all active:scale-98"
            >
              确定
            </button>
          </div>
        </div>

        {/* Share Toast */}
        {showShareToast && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md animate-fade-in flex items-center gap-1.5 z-20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>打卡成就已成功复制/保存！</span>
          </div>
        )}
      </div>
    </div>
  );
};
