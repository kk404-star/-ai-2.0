import React, { useState } from 'react';
import { QrCode, Users, ShieldCheck, Eye, Copy, Check, Lock, UserCheck, Smartphone } from 'lucide-react';
import { StudentProfile } from '../types';

interface ParentBindingViewProps {
  student: StudentProfile;
  onToggleParentBinding: (bound: boolean) => void;
}

export const ParentBindingView: React.FC<ParentBindingViewProps> = ({
  student,
  onToggleParentBinding,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'student' | 'parent'>('student');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isParentPreviewMode, setIsParentPreviewMode] = useState(false);

  const handleCopyCode = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in">
      {/* Parent View Toggle Mode Notice */}
      {isParentPreviewMode && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between text-xs text-amber-800 font-bold shadow-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600" />
            <span>当前为【家长监督视角】(只读模式)</span>
          </div>
          <button
            onClick={() => setIsParentPreviewMode(false)}
            className="text-xs text-emerald-700 underline"
          >
            退出只读
          </button>
        </div>
      )}

      {/* Binding Status Header */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              student.isParentBound ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">监护关系与账号绑定</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {student.isParentBound
                ? `已绑定主监护人：李爸爸`
                : '未绑定家长，扫码绑定可开启家长端只读监督'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleParentBinding(!student.isParentBound)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            student.isParentBound
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {student.isParentBound ? '解除绑定' : '模拟绑定'}
        </button>
      </div>

      {/* Code Tab Switcher (孩子专属码 VS 家长绑定码) */}
      <div className="bg-slate-200/70 p-1 rounded-2xl flex text-xs font-bold">
        <button
          onClick={() => setActiveCodeTab('student')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeCodeTab === 'student'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>孩子专属学生码</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('parent')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeCodeTab === 'parent'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>家长绑定邀请码</span>
        </button>
      </div>

      {/* Code Details Display Card */}
      {activeCodeTab === 'student' ? (
        /* 孩子专属学生码 */
        <div className="bg-white p-5 rounded-2xl card-shadow border border-slate-200/80 space-y-4 text-center">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              学籍与个人专属标识
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5 pt-1">
              <QrCode className="w-4 h-4 text-emerald-600" />
              {student.name} 的孩子专属学生码
            </h3>
            <p className="text-xs text-slate-500">
              用于机构老师/学校管理员现场扫码识别学生档案、核销讲义与划拨点数
            </p>
          </div>

          {/* QR Box */}
          <div className="w-44 h-44 bg-slate-50 border-2 border-emerald-500 rounded-2xl mx-auto flex flex-col items-center justify-center p-3 relative shadow-inner">
            <QrCode className="w-32 h-32 text-slate-800" />
            <span className="text-[10px] text-emerald-700 font-mono font-bold mt-1">学生端专属 UID</span>
          </div>

          {/* Student Code Text Box */}
          <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 max-w-xs mx-auto">
            <span className="font-mono text-base font-black text-slate-900 tracking-wider">
              {student.studentCode}
            </span>
            <button
              onClick={() => handleCopyCode(student.studentCode, 'student')}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-500 hover:text-slate-800 shadow-xs active:scale-95 transition-all"
              title="复制学生码"
            >
              {copiedType === 'student' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 text-left space-y-1 border border-slate-200/80">
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 孩子专属码用途：
            </p>
            <p className="leading-relaxed">
              此专属码绑定于学生个人学籍（{student.school} · {student.className}），机构发放线下讲义、分派学习点数时可直接扫描出此码进行确认。
            </p>
          </div>
        </div>
      ) : (
        /* 家长绑定邀请码 */
        <div className="bg-white p-5 rounded-2xl card-shadow border border-slate-200/80 space-y-4 text-center">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
              监护绑定与关联码
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5 pt-1">
              <QrCode className="w-4 h-4 text-emerald-600" />
              家长监督绑定邀请码
            </h3>
            <p className="text-xs text-slate-500">
              请家长使用微信扫描下方二维码，或输入 12 位绑定邀请码
            </p>
          </div>

          {/* QR Box */}
          <div className="w-44 h-44 bg-slate-50 border-2 border-dashed border-emerald-500 rounded-2xl mx-auto flex flex-col items-center justify-center p-3 relative group shadow-inner">
            <QrCode className="w-32 h-32 text-emerald-800" />
            <span className="text-[10px] text-slate-400 font-mono mt-1">微信扫码绑定</span>
          </div>

          {/* Parent Code Text Box */}
          <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 max-w-xs mx-auto">
            <span className="font-mono text-base font-black text-emerald-800 tracking-wider">
              {student.parentBindingCode}
            </span>
            <button
              onClick={() => handleCopyCode(student.parentBindingCode, 'parent')}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-500 hover:text-slate-800 shadow-xs active:scale-95 transition-all"
              title="复制绑定码"
            >
              {copiedType === 'parent' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-xl text-[11px] text-blue-900 text-left space-y-1 border border-blue-100">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> 监护权限保护规则：
            </p>
            <p className="leading-relaxed text-slate-600 font-medium">
              家长扫码后需选择监护关系（如父亲/母亲），确认后即可建立纯只读监督视图，实时关注孩子的答题诊断与学习进度。
            </p>
          </div>
        </div>
      )}

      {/* Parent Read-Only View Switcher Button */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-900">预览家长端只读视角</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          点击下方按钮可以体验家长端纯只读监督页面（防替答题与保护机制）。
        </p>

        <button
          onClick={() => setIsParentPreviewMode(!isParentPreviewMode)}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
        >
          <Eye className="w-4 h-4" />
          {isParentPreviewMode ? '恢复学生端主视图' : '切换至家长监督只读视角'}
        </button>
      </div>

      {/* Parent Mode Restrictions Notice */}
      {isParentPreviewMode && (
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 space-y-2 text-xs text-rose-600 font-medium">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <Lock className="w-4 h-4" />
            <span>只读约束受控状态生效中</span>
          </div>
          <p className="leading-relaxed">
            家长端屏蔽一切提交答案、修改错题复习状态、重设年级学科功能，仅提供图表只读展示。
          </p>
        </div>
      )}
    </div>
  );
};

