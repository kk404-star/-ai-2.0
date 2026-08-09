import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:bg-slate-100 md:px-5 md:py-5">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden bg-slate-50 md:min-h-[calc(100vh-2.5rem)] md:rounded-3xl md:border md:border-slate-200/80 md:shadow-[0_24px_70px_-38px_rgba(15,23,42,0.35)]">
        <div className="app-viewport relative flex flex-1 flex-col overflow-y-auto hide-scrollbar md:overflow-visible">
          {children}
        </div>
      </div>
    </div>
  );
};
