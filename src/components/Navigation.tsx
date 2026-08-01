import React from 'react';
import { Home, BookOpen, Layers, User } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  unreviewedWrongCount?: number;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  unreviewedWrongCount = 0,
  onTabChange,
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
    <nav className="sticky bottom-0 left-0 right-0 w-full z-40 flex justify-around items-center pt-2 pb-2.5 px-4 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-slate-100">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'text-emerald-700 font-bold scale-105'
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
    </nav>
  );
};

