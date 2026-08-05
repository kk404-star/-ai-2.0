import React, { useState } from 'react';
import { Check, Copy, Users } from 'lucide-react';
import { StudentProfile } from '../types';

interface ParentBindingViewProps {
  student: StudentProfile;
  onToggleParentBinding: (bound: boolean) => void;
}

export const ParentBindingView: React.FC<ParentBindingViewProps> = ({
  student,
  onToggleParentBinding,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(student.parentBindingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-5 pt-4 pb-28 animate-fade-in">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center card-shadow">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="mt-3 text-base font-extrabold text-slate-900">家长绑定邀请码</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">将邀请码发送给家长，完成账号绑定。</p>

        <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="font-mono text-base font-black tracking-wider text-slate-900">{student.parentBindingCode}</span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-500 shadow-2xs transition-all hover:text-emerald-700 active:scale-95"
            title="复制邀请码"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${student.isParentBound ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span className="font-medium text-slate-500">{student.isParentBound ? `已绑定：${student.parentName || '家长'}` : '暂未绑定家长'}</span>
        </div>
        {student.isParentBound && (
          <button
            type="button"
            onClick={() => onToggleParentBinding(false)}
            className="mt-3 text-xs font-bold text-slate-400 transition-colors hover:text-slate-700"
          >
            解除绑定
          </button>
        )}
      </section>
    </div>
  );
};
