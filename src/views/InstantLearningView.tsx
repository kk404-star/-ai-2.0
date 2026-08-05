import React, { useMemo, useState } from 'react';
import { BookOpenCheck, CheckCircle2, Sparkles, XCircle } from 'lucide-react';
import { ScreenType, SubjectType, WrongQuestion } from '../types';

interface InstantLearningViewProps {
  wrongItem?: WrongQuestion | null;
  onNavigateToScreen: (screen: ScreenType) => void;
  onReturnHome: () => void;
  isDue: boolean;
  onCompleteReview: (itemId: string, originalCorrect: boolean, variantCorrect: boolean) => void;
}

const variantBank: Record<SubjectType, { question: string; options: { key: string; text: string }[]; answer: string }> = {
  数学: { question: '同类变式：若二次函数 g(x) = (a - 1)x² - 4x + 3 的图像开口向下，则（ ）', options: [{ key: 'A', text: 'a > 1' }, { key: 'B', text: 'a < 1' }, { key: 'C', text: 'a = 1' }, { key: 'D', text: 'a ≥ 1' }], answer: 'B' },
  物理: { question: '同类变式：物体保持静止时，水平方向各力应满足（ ）', options: [{ key: 'A', text: '合力为零' }, { key: 'B', text: '只受摩擦力' }, { key: 'C', text: '速度持续增大' }, { key: 'D', text: '一定没有摩擦力' }], answer: 'A' },
  化学: { question: '同类变式：置换反应的反应物和生成物通常是（ ）', options: [{ key: 'A', text: '两种化合物' }, { key: 'B', text: '单质与化合物各一种' }, { key: 'C', text: '一种物质' }, { key: 'D', text: '两种单质' }], answer: 'B' },
  生物: { question: '同类变式：解决生物概念题时，最可靠的第一步是（ ）', options: [{ key: 'A', text: '核对概念适用条件' }, { key: 'B', text: '凭印象选择' }, { key: 'C', text: '忽略题干限定词' }, { key: 'D', text: '只看选项长度' }], answer: 'A' },
  英语: { question: '同类变式：完成语法题时，应优先判断（ ）', options: [{ key: 'A', text: '句子结构和语境' }, { key: 'B', text: '单词长度' }, { key: 'C', text: '选项顺序' }, { key: 'D', text: '标点数量' }], answer: 'A' },
  语文: { question: '同类变式：阅读题作答前，应先明确（ ）', options: [{ key: 'A', text: '题目要求与文本依据' }, { key: 'B', text: '答案字数越多越好' }, { key: 'C', text: '只写个人感受' }, { key: 'D', text: '跳过关键词' }], answer: 'A' },
  历史: { question: '同类变式：分析历史事件时，应优先结合（ ）', options: [{ key: 'A', text: '时间、背景与史料' }, { key: 'B', text: '现代经验直接推断' }, { key: 'C', text: '单一结论' }, { key: 'D', text: '人物姓名长度' }], answer: 'A' },
  地理: { question: '同类变式：读图题中判断区域特征，应先查看（ ）', options: [{ key: 'A', text: '图例、比例尺和位置' }, { key: 'B', text: '图片颜色是否好看' }, { key: 'C', text: '题目页码' }, { key: 'D', text: '选项数量' }], answer: 'A' },
  政治: { question: '同类变式：材料题判断观点时，应重点比对（ ）', options: [{ key: 'A', text: '材料关键词与概念边界' }, { key: 'B', text: '句子长短' }, { key: 'C', text: '个人偏好' }, { key: 'D', text: '选项位置' }], answer: 'A' },
};

export const InstantLearningView: React.FC<InstantLearningViewProps> = ({
  wrongItem,
  onNavigateToScreen,
  onReturnHome,
  isDue,
  onCompleteReview,
}) => {
  const [originalChoice, setOriginalChoice] = useState<string | null>(null);
  const [variantChoice, setVariantChoice] = useState<string | null>(null);
  const [originalResult, setOriginalResult] = useState<boolean | null>(null);
  const [variantResult, setVariantResult] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const original = useMemo(() => {
    if (!wrongItem) return null;
    if (wrongItem.options?.length) {
      const answer = wrongItem.options.find((option) => wrongItem.correctAnswer.startsWith(option.key) || wrongItem.correctAnswer.includes(`${option.key}.`))?.key || 'B';
      return { options: wrongItem.options, answer };
    }
    return {
      options: [
        { key: 'A', text: wrongItem.userAnswer },
        { key: 'B', text: wrongItem.correctAnswer },
        { key: 'C', text: '题目信息不足，无法判断' },
        { key: 'D', text: '以上答案均不正确' },
      ],
      answer: 'B',
    };
  }, [wrongItem]);

  if (!wrongItem || !original) {
    return (
      <div className="px-5 py-12 text-center">
        <BookOpenCheck className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-bold text-slate-700">请先从今日复习或错题本选择一道题</p>
        <button onClick={onReturnHome} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">返回首页</button>
      </div>
    );
  }

  const variant = variantBank[wrongItem.subject];
  const finishReview = (nextOriginal: boolean | null, nextVariant: boolean | null) => {
    if (nextOriginal === null || nextVariant === null || completed) return;
    onCompleteReview(wrongItem.id, nextOriginal, nextVariant);
    setCompleted(true);
  };

  const renderOptions = (
    options: { key: string; text: string }[],
    choice: string | null,
    setChoice: (key: string) => void,
    locked: boolean,
    accent: 'emerald' | 'amber',
  ) => options.map((option) => {
    const selected = choice === option.key;
    return (
      <button key={option.key} disabled={locked} onClick={() => setChoice(option.key)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs transition-all ${selected ? accent === 'emerald' ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-amber-500 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-50 text-slate-700'} disabled:cursor-default`}>
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selected ? accent === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white' : 'border border-slate-300 bg-white'}`}>{option.key}</span>
        <span className="font-medium leading-relaxed">{option.text}</span>
      </button>
    );
  });

  return (
    <div className="space-y-4 px-5 pb-32 pt-4 animate-fade-in">
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 card-shadow">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-900"><BookOpenCheck className="h-4 w-4 text-emerald-600" />1. 遮住答案，独立重做原题</h3>
        <p className="rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-xs font-medium leading-relaxed text-slate-800">{wrongItem.questionText}</p>
        <div className="space-y-2">{renderOptions(original.options, originalChoice, setOriginalChoice, originalResult !== null, 'emerald')}</div>
        {originalResult !== null ? (
          <div className={`flex items-start gap-2 rounded-xl border p-3 text-xs font-bold ${originalResult ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
            {originalResult ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
            <span>{originalResult ? '原题回答正确。' : `原题未通过。正确答案：${wrongItem.correctAnswer}`}</span>
          </div>
        ) : (
          <button disabled={!originalChoice} onClick={() => { const result = originalChoice === original.answer; setOriginalResult(result); finishReview(result, variantResult); }} className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white disabled:bg-slate-200 disabled:text-slate-400">提交原题</button>
        )}
      </section>

      <section className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-900"><Sparkles className="h-4 w-4 text-emerald-600" />解析</h3>
        <div className="space-y-2 text-xs font-medium leading-relaxed text-slate-700">
          {wrongItem.steps?.length ? wrongItem.steps.map((step, index) => <p key={index}>{step}</p>) : <p>围绕“{wrongItem.topic}”的关键条件逐步判断，正确答案为：{wrongItem.correctAnswer}。</p>}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-amber-200 bg-white p-4 card-shadow">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-900"><Sparkles className="h-4 w-4 text-amber-500" />2. 举一反三</h3>
        <p className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-3 text-xs font-medium leading-relaxed text-slate-800">{variant.question}</p>
        <div className="space-y-2">{renderOptions(variant.options, variantChoice, setVariantChoice, variantResult !== null, 'amber')}</div>
        {variantResult !== null ? (
          <div className={`flex items-start gap-2 rounded-xl border p-3 text-xs font-bold ${variantResult ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
            {variantResult ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
            <span>{variantResult ? '变式题回答正确。' : '变式题未通过，请结合错因和解析重新理解；系统会在次日重排本轮。'}</span>
          </div>
        ) : (
          <button disabled={!variantChoice} onClick={() => { const result = variantChoice === variant.answer; setVariantResult(result); finishReview(originalResult, result); }} className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white disabled:bg-slate-200 disabled:text-slate-400">提交变式题</button>
        )}
      </section>

      {completed && (
        <div className={`rounded-2xl p-4 text-white shadow-md ${originalResult && variantResult ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>
          <h4 className="text-sm font-bold">{originalResult && variantResult ? (isDue && wrongItem.reviewStage === 2 ? '两轮验证完成，已掌握' : '本轮复习通过') : '本轮暂未通过'}</h4>
          <p className="mt-1 text-xs text-white/80">{originalResult && variantResult ? (isDue ? (wrongItem.reviewStage === 2 ? '该错题已归档，可随时在错题本回看。' : '第 3 天将安排第二轮验证。') : '已记录本次自由练习。') : (isDue ? '查看讲解后，系统将在明天重新安排当前轮次。' : '已记录本次自由练习。')}</p>
        </div>
      )}
    </div>
  );
};
