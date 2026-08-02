import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 py-0 md:py-6 flex flex-col items-center justify-start text-slate-900">
      {/* View Switcher Controls (Desktop Floating Badge) */}
      <div className="hidden md:flex items-center gap-2 mb-4 bg-slate-800/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/60 shadow-lg text-xs text-slate-300 z-50">
        <span className="font-bold text-emerald-400">开窍 AI 学伴 · 移动端视图</span>
        <div className="h-3 w-[1px] bg-slate-700 mx-1" />
        <button
          onClick={() => setIsMobileDeviceView(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
            isMobileDeviceView ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          手机视图
        </button>
        <button
          onClick={() => setIsMobileDeviceView(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
            !isMobileDeviceView ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          全屏适应
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileDeviceView
            ? 'max-w-[390px] min-h-[720px] md:h-[720px] bg-slate-50 md:rounded-[40px] md:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] md:border-[8px] md:border-slate-800 relative overflow-hidden flex flex-col'
            : 'max-w-4xl min-h-screen bg-slate-50 md:rounded-2xl md:shadow-2xl relative overflow-hidden flex flex-col'
        }`}
      >
        {/* Smartphone Hardware Notch Header (Only in Mobile Device View) */}
        {isMobileDeviceView && (
          <div className="hidden md:flex justify-between items-center px-6 pt-3 pb-1 text-[11px] font-semibold text-slate-800 bg-white/90 backdrop-blur-md border-b border-slate-200/60 z-50 select-none">
            <span className="font-mono">09:41</span>
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-4 h-2.5 border border-slate-800 rounded-xs p-[1px] flex">
                <div className="w-full h-full bg-slate-800" />
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
