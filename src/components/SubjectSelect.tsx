import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, BookOpen } from 'lucide-react';
import { SubjectType } from '../types';

interface SubjectSelectProps {
  value: SubjectType;
  onChange?: (subject: SubjectType) => void;
  options?: SubjectType[];
  className?: string;
  size?: 'sm' | 'md';
}

const DEFAULT_SUBJECTS: SubjectType[] = [
  '数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'
];

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  value,
  onChange,
  options = DEFAULT_SUBJECTS,
  className = '',
  size = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-800 font-extrabold rounded-xl border border-emerald-200/80 shadow-2xs transition-all active:scale-95 ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
        <span>{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-emerald-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in max-h-60 overflow-y-auto hide-scrollbar ring-1 ring-slate-900/5">
          <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span>选择学科</span>
            <span className="text-[9px] font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">{options.length} 门</span>
          </div>
          {options.map((subject) => {
            const isSelected = subject === value;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => {
                  if (onChange) onChange(subject);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{subject}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface OptionItem {
  value: string;
  label: string;
}

interface CustomDropdownSelectProps {
  value: string;
  options: (string | OptionItem)[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomDropdownSelect: React.FC<CustomDropdownSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = '请选择',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions: OptionItem[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedItem = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  return (
    <div ref={containerRef} className={`relative inline-block text-left w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 px-3 flex items-center justify-between rounded-xl border border-slate-200/90 hover:border-emerald-300 bg-white text-xs font-bold text-slate-800 transition-all active:scale-[0.98] shadow-2xs focus:ring-2 focus:ring-emerald-500/20"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in max-h-56 overflow-y-auto hide-scrollbar ring-1 ring-slate-900/5">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
