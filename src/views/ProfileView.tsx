import React, { useState } from 'react';
import {
  BadgeInfo,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  House,
  Info,
  KeyRound,
  LogOut,
  MessageSquareMore,
  School,
  ShoppingBag,
  Ticket,
  UserRound,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import { ScreenType, StudentProfile, TokenBoosterPack } from '../types';

interface ProfileViewProps {
  student: StudentProfile;
  onNavigateToScreen: (screen: ScreenType) => void;
  onActivateCode: (code: string) => boolean;
  onBuyBoosterPack: (addedTokens: number) => void;
}

const BOOSTER_PACKS: TokenBoosterPack[] = [
  { id: 'bp-100k', name: '10万 Token 加油包', tokens: 100000, price: 9.9 },
  { id: 'bp-500k', name: '50万 Token 加油包', tokens: 500000, price: 39.9, popular: true },
  { id: 'bp-1.2m', name: '120万 Token 加油包', tokens: 1200000, price: 79.9 },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  student,
  onNavigateToScreen,
  onActivateCode,
  onBuyBoosterPack,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showBoosterModal, setShowBoosterModal] = useState(false);
  const [inputCode, setInputCode] = useState(student.activatedAuthorizationCode || '');
  const [codeSuccessMsg, setCodeSuccessMsg] = useState('');
  const [codeErrMsg, setCodeErrorMsg] = useState('');
  const [selectedPack, setSelectedPack] = useState<TokenBoosterPack>(BOOSTER_PACKS[1]);
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [boosterSuccessMsg, setBoosterSuccessMsg] = useState('');

  const totalTokensAvailable = student.monthlyTokenRemaining + student.boosterTokenRemaining;
  const monthlyPercent = Math.min(100, Math.round((student.monthlyTokenRemaining / student.monthlyTokenLimit) * 100));

  const handleApplyCode = () => {
    setCodeErrorMsg('');
    setCodeSuccessMsg('');
    if (!inputCode || inputCode.replace(/[^a-zA-Z0-9]/g, '').length < 8) {
      setCodeErrorMsg('请输入正确的 12 位授权码');
      return;
    }
    if (onActivateCode(inputCode)) {
      setCodeSuccessMsg('激活成功，学习权益已更新');
      window.setTimeout(() => {
        setShowCodeModal(false);
        setCodeSuccessMsg('');
      }, 1200);
    } else {
      setCodeErrorMsg('授权码不存在或已被使用，请核对后重试');
    }
  };

  const handleConfirmBoosterPay = () => {
    setIsProcessingPay(true);
    window.setTimeout(() => {
      onBuyBoosterPack(selectedPack.tokens);
      setIsProcessingPay(false);
      setBoosterSuccessMsg(`已到账 ${selectedPack.tokens.toLocaleString()} 永久 Token`);
      window.setTimeout(() => {
        setShowBoosterModal(false);
        setBoosterSuccessMsg('');
      }, 1400);
    }, 900);
  };

  return (
    <div className="profile-page mx-auto w-full max-w-4xl space-y-3 px-5 pb-24 pt-2 animate-fade-in md:space-y-4 md:px-8 md:pt-6">
      <section className="profile-hero overflow-hidden rounded-2xl border border-emerald-100 px-3 py-2 shadow-[0_10px_28px_-18px_rgba(5,150,105,.45)] md:p-5">
        <div className="relative z-10 flex items-center gap-2.5">
          <button onClick={() => onNavigateToScreen('profile_details')} className="relative shrink-0 rounded-full" aria-label="编辑个人资料">
            <span className="block size-[50px] rounded-full border-2 border-emerald-500 bg-white p-1 shadow-sm md:size-20">
              <img src={student.avatar} alt={student.name} className="size-full rounded-full object-cover" referrerPolicy="no-referrer" />
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm">
              <Edit3 className="size-3" />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-black tracking-tight text-slate-900 md:text-xl">{student.name}</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:mt-2 md:text-xs">
              <School className="size-3 text-slate-500 md:size-4" />{student.school}
            </p>
            <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:mt-1 md:text-xs">
              <UsersRound className="size-3 text-slate-500 md:size-4" />{student.className}
            </p>
          </div>
          <div className="profile-books" aria-hidden="true"><i /><i /><i /><b /></div>
        </div>

      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-[0_8px_24px_-16px_rgba(15,23,42,.3)] md:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,.28)]"><Zap className="size-3.5 fill-white" /></span>
            <div><h3 className="text-[13px] font-black text-slate-900 md:text-base">我的学习权益</h3><p className="text-[9px] text-slate-500 md:text-xs">{student.aiPackageName}</p></div>
          </div>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">有效期至 {student.aiPackageExpiry}</span>
        </div>

        <div className="mt-1.5 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white p-2 md:mt-4 md:p-5">
          <div className="flex items-start justify-between">
            <div><p className="flex items-center gap-1 text-[9px] font-medium text-slate-500 md:text-xs">剩余学习能量 <BadgeInfo className="size-3" /></p><p className="font-mono text-lg font-black tracking-tight text-emerald-700 md:text-3xl">{totalTokensAvailable.toLocaleString()} <span className="font-sans text-[9px] font-medium text-slate-500 md:text-xs">能量值</span></p></div>
            <span className="energy-orb"><Zap className="size-5 fill-emerald-500 text-emerald-500" /></span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${monthlyPercent}%` }} /></div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 md:mt-4 md:gap-3">
            <div className="h-11 rounded-lg border border-slate-200 bg-white/90 px-2 py-1 md:h-auto md:p-3"><p className="text-[8px] text-slate-500 md:text-xs">月度套餐额度</p><strong className="block font-mono text-xs text-emerald-700 md:mt-1 md:text-lg">{(student.monthlyTokenRemaining / 1000).toFixed(0)}k <span className="text-[8px] font-normal text-slate-400 md:text-xs">/ {(student.monthlyTokenLimit / 1000).toFixed(0)}k</span></strong></div>
            <div className="h-11 rounded-lg border border-slate-200 bg-white/90 px-2 py-1 md:h-auto md:p-3"><p className="text-[8px] text-slate-500 md:text-xs">加油包余额</p><strong className="block font-mono text-xs text-emerald-700 md:mt-1 md:text-lg">{(student.boosterTokenRemaining / 1000).toFixed(0)}k <span className="font-sans text-[7px] font-normal text-slate-400 md:text-xs">（永久有效）</span></strong></div>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <button onClick={() => setShowCodeModal(true)} className="flex h-7 items-center justify-center gap-1 rounded-lg border border-emerald-600 bg-white text-[10px] font-bold text-emerald-700 transition active:scale-[.98] md:h-10 md:text-xs"><Ticket className="size-2.5 md:size-4" />激活授权码</button>
            <button onClick={() => setShowBoosterModal(true)} className="flex h-7 items-center justify-center gap-1 rounded-lg bg-emerald-600 text-[10px] font-bold text-white shadow-sm transition active:scale-[.98] md:h-10 md:text-xs"><ShoppingBag className="size-2.5 md:size-4" />充值加油包</button>
          </div>
        </div>
      </section>

      <button onClick={() => onNavigateToScreen('parent_binding')} className="parent-card relative flex w-full items-center gap-2 overflow-hidden rounded-2xl border border-amber-200/80 bg-white px-3 py-1.5 text-left shadow-sm md:min-h-20 md:p-4">
        <span className="parent-family-illustration flex h-10 w-14 shrink-0 items-end justify-center" aria-hidden="true">
          <img src="/images/parent-binding-family.png" alt="" />
        </span>
        <span className="min-w-0 flex-1"><strong className="block text-[13px] text-slate-900">家长绑定</strong><small className="block truncate text-[9px] text-slate-500">绑定后可查看学习情况、报告与成长趋势</small></span>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${student.isParentBound ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{student.isParentBound ? '已绑定' : '未绑定'}</span>
        <ChevronRight className="size-3.5 text-slate-500" />
      </button>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-3 shadow-sm md:px-5">
        <MenuItem icon={<ChartNoAxesCombined />} tone="green" title="学习诊断报告" subtitle="查看学习表现、薄弱点与成长趋势" onClick={() => onNavigateToScreen('diagnostic_report')} />
        <MenuItem icon={<UserRound />} tone="green" title="个人资料" subtitle="头像、昵称与学校" onClick={() => onNavigateToScreen('profile_details')} />
        <MenuItem icon={<MessageSquareMore />} tone="blue" title="意见反馈" subtitle="你的建议会帮助我们做得更好" />
        <MenuItem icon={<Info />} tone="violet" title="关于开窍" subtitle="产品介绍与版本信息" />
      </section>

      <button className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white text-xs font-bold text-rose-600 transition hover:bg-rose-50 md:h-11"><LogOut className="size-3.5" />退出登录</button>

      {showCodeModal && (
        <Modal onClose={() => setShowCodeModal(false)} title="激活授权码" icon={<KeyRound className="size-5" />}>
          <p className="text-xs leading-5 text-slate-500">输入机构提供的授权码，即可激活学习服务与额度。</p>
          <input autoFocus value={inputCode} onChange={(event) => setInputCode(event.target.value)} placeholder="请输入授权码" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          {codeErrMsg && <p className="text-xs font-bold text-rose-600">{codeErrMsg}</p>}
          {codeSuccessMsg && <p className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="size-4" />{codeSuccessMsg}</p>}
          <div className="grid grid-cols-2 gap-2"><button onClick={() => setShowCodeModal(false)} className="h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">取消</button><button onClick={handleApplyCode} className="h-10 rounded-xl bg-emerald-600 text-xs font-bold text-white">立即激活</button></div>
        </Modal>
      )}

      {showBoosterModal && (
        <Modal onClose={() => setShowBoosterModal(false)} title="充值加油包" icon={<Zap className="size-5 fill-current" />}>
          <p className="text-xs text-slate-500">加油包能量永久有效，请选择充值规格：</p>
          <div className="grid grid-cols-3 gap-2">
            {BOOSTER_PACKS.map((pack) => <button key={pack.id} onClick={() => setSelectedPack(pack)} className={`relative rounded-xl border p-2.5 text-center ${selectedPack.id === pack.id ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100' : 'border-slate-200 bg-slate-50'}`}>{pack.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold text-white">推荐</span>}<strong className="block text-xs text-slate-800">{pack.tokens / 10000}万</strong><b className="mt-1 block text-sm text-emerald-700">¥{pack.price}</b></button>)}
          </div>
          {boosterSuccessMsg && <p className="text-center text-xs font-bold text-emerald-600">{boosterSuccessMsg}</p>}
          <button disabled={isProcessingPay} onClick={handleConfirmBoosterPay} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white disabled:opacity-60"><CreditCard className="size-4" />{isProcessingPay ? '支付处理中…' : `确认支付 ¥${selectedPack.price}`}</button>
        </Modal>
      )}
    </div>
  );
};

const MenuItem = ({ icon, tone, title, subtitle, onClick }: { icon: React.ReactNode; tone: 'green' | 'blue' | 'violet'; title: string; subtitle: string; onClick?: () => void }) => (
  <button onClick={onClick} className="flex w-full items-center gap-2.5 border-b border-slate-100 py-2 text-left last:border-0 md:gap-3 md:py-3.5">
    <span className={`menu-icon menu-icon-${tone}`}>{icon}</span><span className="flex-1"><strong className="block text-xs text-slate-900 md:text-sm">{title}</strong><small className="block text-[9px] text-slate-500 md:mt-0.5 md:text-xs">{subtitle}</small></span><ChevronRight className="size-3.5 text-slate-400 md:size-4" />
  </button>
);

const Modal = ({ children, onClose, title, icon }: { children: React.ReactNode; onClose: () => void; title: string; icon: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm">
    <div className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
      <div className="flex items-center gap-2 text-emerald-700">{icon}<h3 className="flex-1 text-base font-black text-slate-900">{title}</h3><button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="size-5" /></button></div>
      {children}
    </div>
  </div>
);
