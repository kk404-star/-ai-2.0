import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  screenTitle?: string;
  onBack?: () => void;
  onOpenReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  screenTitle,
  onBack,
  onOpenReport,
}) => {
  const isTabScreen = currentScreen === 'tab';

  return (
    <header className="sticky top-0 z-40 glass-nav flex justify-between items-center px-5 h-14 bg-white/95 border-b border-slate-100">
      {/* Left side */}
      <div className="flex items-center gap-2">
        {!isTabScreen && onBack ? (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : null}

        <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
          {screenTitle || '开窍 AI 学伴'}
        </h1>
      </div>

      {/* Right side: Diagnostic button, Avatar */}
      <div className="flex items-center gap-2">
        {/* Diagnostic Button */}
        {isTabScreen && onOpenReport && (
          <button
            onClick={onOpenReport}
            title="查看 AI 学习报告"
            className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold border border-emerald-200/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>诊断</span>
          </button>
        )}

        {/* Student Avatar - AI Robot */}
        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-400/80 shadow-2xs flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="26" width="68" height="56" rx="24" fill="#E6F4EA" stroke="#10B981" strokeWidth="3" />
            <rect x="34" y="35" width="52" height="38" rx="16" fill="#022C22" />
            <circle cx="48" cy="52" r="5" fill="#38BDF8" />
            <circle cx="72" cy="52" r="5" fill="#38BDF8" />
            <circle cx="48" cy="52" r="9" fill="none" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="72" cy="52" r="9" fill="none" stroke="#FBBF24" strokeWidth="2" />
            <line x1="57" y1="52" x2="63" y2="52" stroke="#FBBF24" strokeWidth="2" />
            <path d="M 55 63 Q 60 67 65 63" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
    </header>
  );
};
