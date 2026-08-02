import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight,
  Home,
  Sparkles,
  CheckSquare,
  ArrowLeft,
  XCircle,
  FileText
} from 'lucide-react';
import { ScreenType, WrongQuestion } from '../types';

interface InstantLearningViewProps {
  wrongItem?: WrongQuestion | null;
  onNavigateToScreen: (screen: ScreenType) => void;
  onReturnHome: () => void;
}

export const InstantLearningView: React.FC<InstantLearningViewProps> = ({
  wrongItem,
  onNavigateToScreen,
  onReturnHome,
}) => {
  const [redoSelectedOption, setRedoSelectedOption] = useState<string | null>(null);
  const [variantSelectedOption, setVariantSelectedOption] = useState<string | null>(null);
  const [redoStatus, setRedoStatus] = useState<'pending' | 'passed' | 'failed'>('pending');
  const [variantStatus, setVariantStatus] = useState<'pending' | 'passed' | 'failed'>('pending');
  const [masteryUpdated, setMasteryUpdated] = useState(false);

  const redoOptions = [
    { key: 'A', text: 'x = 2' },
    { key: 'B', text: 'x = 4' },
    { key: 'C', text: 'x = -2' },
    { key: 'D', text: 'x = 0' },
  ];

  const variantOptions = [
    { key: 'A', text: 'a > 1' },
    { key: 'B', text: 'a < 1' },
    { key: 'C', text: 'a = 1' },
    { key: 'D', text: 'a ≤ 1' },
  ];

  const handleRedoSubmit = () => {
    if (!redoSelectedOption) return;
    if (redoSelectedOption === 'B') {
      setRedoStatus('passed');
    } else {
      setRedoStatus('failed');
    }
  };

  const handleVariantSubmit = () => {
    if (!variantSelectedOption) return;
    if (variantSelectedOption === 'B') {
      setVariantStatus('passed');
      setMasteryUpdated(true);
    } else {
      setVariantStatus('failed');
    }
  };

  const subject = wrongItem?.subject || '数学';
  const topic = wrongItem?.topic || '二次函数与方程';
  const questionText = wrongItem?.questionText || '已知函数 f(x) = ax² + bx + c 图像在 x = 2 处取得极值，且过点 (1,0)...';
  const errorCategory = wrongItem?.errorCategory || '计算错误';

  return (
    <div className="px-5 pt-4 pb-32 space-y-4 animate-fade-in">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateToScreen('tab')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 card-shadow transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>返回错题本</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          AI 错因强化闭环
        </span>
      </div>

      {/* AI Smart Diagnosis Header Banner */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-4 rounded-2xl text-white shadow-md space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold shrink-0">
              {subject}
            </span>
            <span className="text-xs font-bold text-emerald-100 truncate">
              考点：{wrongItem?.knowledgePoints?.join('、') || topic}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/90 text-white text-[10px] font-bold shrink-0 whitespace-nowrap shadow-2xs">
            原错因：{errorCategory}
          </span>
        </div>

        <p className="text-xs text-emerald-100 font-medium leading-relaxed">
          💡 <span className="font-bold text-white">AI 强化策略：</span>先完成同类题巩固，再通过变式拓展验证，彻底消除“{errorCategory}”漏洞。
        </p>
      </div>
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>1. 原题重做 / 同类强化练习</span>
          </h3>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
            基础巩固
          </span>
        </div>

        <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/50">
          已知方程 3(x - 2) - 2(2x - 5) = 4，求未知数 x 的值（ ）
        </p>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {redoOptions.map((opt) => {
            const isSelected = redoSelectedOption === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  if (redoStatus !== 'passed') {
                    setRedoSelectedOption(opt.key);
                    setRedoStatus('pending');
                  }
                }}
                className={`w-full p-3 rounded-xl text-xs flex items-center gap-3 border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="leading-tight font-medium">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {redoStatus === 'passed' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>回答正确！去括号与移项符号处理完全正确！</span>
          </div>
        )}

        {redoStatus === 'failed' && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>回答错误，请仔细计算后重新选择！</span>
          </div>
        )}

        {redoStatus !== 'passed' && (
          <button
            onClick={handleRedoSubmit}
            disabled={!redoSelectedOption}
            className={`w-full py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 ${
              redoSelectedOption
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            提交同类练习
          </button>
        )}
      </div>

      {/* Variant Practice: 举一反三 */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-amber-200/80 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>2. 举一反三 (变式提高)</span>
          </h3>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
            变式拓展
          </span>
        </div>

        <p className="text-xs text-slate-800 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/40">
          若二次函数 g(x) = (a - 1)x² - 4x + 3 图像开口向下，求参数 a 的取值范围（ ）
        </p>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {variantOptions.map((opt) => {
            const isSelected = variantSelectedOption === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  if (variantStatus !== 'passed') {
                    setVariantSelectedOption(opt.key);
                    setVariantStatus('pending');
                  }
                }}
                className={`w-full p-3 rounded-xl text-xs flex items-center gap-3 border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-white'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="leading-tight font-medium">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {variantStatus === 'passed' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>举一反三通关！该知识漏洞已彻底解决！</span>
          </div>
        )}

        {variantStatus === 'failed' && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>回答错误，提示：二次函数开口向下，最高次项系数小于0。</span>
          </div>
        )}

        {variantStatus !== 'passed' && (
          <button
            onClick={handleVariantSubmit}
            disabled={!variantSelectedOption}
            className={`w-full py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 ${
              variantSelectedOption
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            提交变式练习
          </button>
        )}
      </div>

      {/* Updated Mastery Banner */}
      {masteryUpdated && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md space-y-1 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-200" />
              掌握度已升级
            </h4>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              状态：稳定掌握
            </span>
          </div>
          <p className="text-xs text-emerald-100 font-medium leading-relaxed">
            【{topic}】已成功升入稳定掌握区！
          </p>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="mobile-fixed-footer flex gap-2.5">
        <button
          onClick={onReturnHome}
          className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          返回首页
        </button>

        <button
          onClick={() => onNavigateToScreen('practice_quiz')}
          className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span>前往真题练习</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
