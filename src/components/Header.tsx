import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  screenTitle?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  screenTitle,
  onBack,
}) => {
  const isTabScreen = currentScreen === 'tab';
  const resolvedTitle = screenTitle ?? '开窍 AI 学伴';
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-100 bg-white/95 px-5 glass-nav">
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

        {resolvedTitle && (
          <h1 className="text-base font-extrabold tracking-tight text-slate-900">
            {resolvedTitle}
          </h1>
        )}
      </div>

      {/* Right side: Student avatar */}
      <div className="flex items-center gap-2">
        {/* Student Avatar - AI Robot */}
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-400/80 bg-emerald-50 p-0.5 shadow-2xs">
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
