import React from 'react';
import { Home, BookOpen, Layers, User, Camera } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  unreviewedWrongCount?: number;
  onTabChange: (tab: TabType) => void;
  onScanClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  unreviewedWrongCount = 0,
  onTabChange,
  onScanClick,
}) => {
  const navItems = [
    {
      id: 'home' as TabType,
      label: '首页',
      icon: Home,
    },
    {
      id: 'study' as TabType,
      label: '学习',
      icon: BookOpen,
    },
    {
      id: 'scan',
      label: '拍照批改',
      icon: Camera,
      isCenterAction: true,
    },
    {
      id: 'wrong' as TabType,
      label: '错题本',
      icon: Layers,
      badge: unreviewedWrongCount > 0 ? unreviewedWrongCount : undefined,
    },
    {
      id: 'profile' as TabType,
      label: '我的',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 w-full rounded-t-2xl border-t border-slate-100 bg-white/95 px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md md:bottom-5 md:left-1/2 md:right-auto md:w-[min(620px,calc(100%-2rem))] md:-translate-x-1/2 md:rounded-2xl md:border md:border-slate-200/80 md:px-3 md:py-2 md:shadow-[0_16px_45px_-22px_rgba(15,23,42,0.4)]">
      <div className="grid grid-cols-5 items-end text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCenterAction) {
            return (
              <button
                key="center-scan"
                type="button"
                onClick={onScanClick}
                className="flex flex-col items-center justify-end -mt-3.5 transition-transform active:scale-95 group"
                title="拍照批改 / 搜题"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(5,150,105,0.4)] border-2 border-white flex items-center justify-center transition-all">
                  <Camera className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as TabType)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-emerald-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
