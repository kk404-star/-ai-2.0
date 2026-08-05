import React, { useState } from 'react';
import { 
  Award, 
  UserRound, 
  MessageSquare, 
  Info, 
  ChevronRight, 
  Edit, 
  Key,
  LogOut,
  X,
  CheckCircle2,
  BadgeCheck,
  Zap,
  CreditCard,
  UserCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { StudentProfile, ScreenType, TokenBoosterPack } from '../types';

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
  // Modal states
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showBoosterModal, setShowBoosterModal] = useState(false);

  // B2B Code Activation states
  const [inputCode, setInputCode] = useState(student.activatedAuthorizationCode || '');
  const [codeSuccessMsg, setCodeSuccessMsg] = useState('');
  const [codeErrMsg, setCodeErrorMsg] = useState('');

  // B2C Booster purchase states
  const [selectedPack, setSelectedPack] = useState<TokenBoosterPack>(BOOSTER_PACKS[1]);
  const [payAccount, setPayAccount] = useState<'student' | 'parent'>('student');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [boosterSuccessMsg, setBoosterSuccessMsg] = useState('');

  const totalTokensAvailable = student.monthlyTokenRemaining + student.boosterTokenRemaining;
  const monthlyPercent = Math.min(
    100,
    Math.round((student.monthlyTokenRemaining / student.monthlyTokenLimit) * 100)
  );

  const handleApplyCode = () => {
    setCodeErrorMsg('');
    setCodeSuccessMsg('');

    if (!inputCode || inputCode.replace(/[^a-zA-Z0-9]/g, '').length < 8) {
      setCodeErrorMsg('请输入正确的 12 位授权码');
      return;
    }

    const success = onActivateCode(inputCode);
    if (success) {
      setCodeSuccessMsg('🎉 激活成功！已延长 AI 服务并增加月度额度');
      setTimeout(() => {
        setShowCodeModal(false);
        setInputCode(inputCode.trim());
        setCodeSuccessMsg('');
      }, 1500);
    } else {
      setCodeErrorMsg('授权码不存在或已被使用，请核对后重试');
    }
  };

  const handleConfirmBoosterPay = () => {
    setIsProcessingPay(true);
    setBoosterSuccessMsg('');

    setTimeout(() => {
      onBuyBoosterPack(selectedPack.tokens);
      setIsProcessingPay(false);
      setBoosterSuccessMsg(`🎉 充值成功！已到账 ${selectedPack.tokens.toLocaleString()} 永久 Token`);

      setTimeout(() => {
        setShowBoosterModal(false);
        setBoosterSuccessMsg('');
      }, 1600);
    }, 1200);
  };

  return (
    <div className="px-5 pt-4 pb-28 space-y-4 animate-fade-in">
      {/* Student Avatar & Basic Profile Card */}
      <div
        onClick={() => onNavigateToScreen('profile_details')}
        className="flex items-center gap-4 bg-white p-4.5 rounded-2xl card-shadow border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="relative w-14 h-14 shrink-0">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-full h-full rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
            <Edit className="w-3 h-3" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-900">{student.name}</h2>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
              {student.school}
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
              {student.className}
            </span>
          </div>
        </div>
      </div>

      {/* Service Center Card - Refined Light Aesthetic without artificial side border or heavy black block */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-200/80 p-4.5 space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <h3 className="text-sm font-extrabold text-slate-900">学习服务中心</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">{student.aiPackageName}</p>
          </div>

          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200/60 shrink-0 whitespace-nowrap">
            有效期至 {student.aiPackageExpiry}
          </span>
        </div>

        {/* Platform Token Meter Box */}
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>可用余额</span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                {totalTokensAvailable.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-sans ml-1">Token</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full overflow-hidden bg-emerald-100 p-0.5">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${monthlyPercent}%` }}
              />
            </div>
          </div>

          {/* Asset Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-xl border border-emerald-100 bg-white/90 p-2.5">
              <span className="text-[10px] text-slate-500 font-medium block">月度套餐额度</span>
              <div className="font-extrabold font-mono text-emerald-800 text-xs mt-0.5">
                {(student.monthlyTokenRemaining / 1000).toFixed(0)}k
                <span className="text-[10px] text-slate-400 font-sans font-normal"> / {(student.monthlyTokenLimit / 1000).toFixed(0)}k</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white/90 p-2.5">
              <span className="text-[10px] text-slate-500 font-medium block">加油包永久 Token</span>
              <div className="font-extrabold font-mono text-emerald-800 text-xs mt-0.5">
                {(student.boosterTokenRemaining / 1000).toFixed(0)}k
                <span className="text-[10px] text-slate-400 font-sans font-normal"> (永久有效)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            onClick={() => {
              setInputCode(student.activatedAuthorizationCode || '');
              setShowCodeModal(true);
            }}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 border border-slate-200/60"
          >
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span>激活授权码</span>
          </button>

          <button
            onClick={() => setShowBoosterModal(true)}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>充值加油包</span>
          </button>
        </div>
      </div>

      {/* Function Menu List */}
      <div className="bg-white rounded-2xl card-shadow divide-y divide-slate-100 overflow-hidden border border-slate-200/80">
        {/* Parent & Student Dual Binding Code Entry */}
        <div
          onClick={() => onNavigateToScreen('parent_binding')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/90 flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.5 13.5A7.5 7.5 0 1 1 12 4.5" />
                <path d="M8.5 12.5l2.5 2.5 5-5" />
                <path d="M19 2.5l0.7 1.4 1.4 0.7-1.4 0.7-0.7 1.4-0.7-1.4-1.4-0.7 1.4-0.7z" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">家长绑定</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{student.isParentBound ? `已绑定${student.parentName || '家长'}` : '绑定后可查看学习情况'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                student.isParentBound
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/60'
              }`}
            >
              {student.isParentBound ? '已绑定' : '未绑定'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </div>
        </div>

        {/* Personal profile */}
        <div
          onClick={() => onNavigateToScreen('profile_details')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">个人资料</p>
              <p className="text-xs text-slate-500 mt-0.5">头像、昵称与学校</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
        </div>

        {/* Feedback */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">意见反馈</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
        </div>

        {/* About Us */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">关于开窍</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
        </div>
      </div>

      {/* Logout Button */}
      <button className="w-full py-3 text-rose-600 font-bold text-sm bg-white rounded-2xl border border-rose-200/80 hover:bg-rose-50/50 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-2xs">
        <LogOut className="w-4 h-4" />
        退出登录
      </button>

      {/* 1. B2B Activate Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-700" />
                授权码
              </h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              输入授权码后即可激活学习服务与额度。
            </p>

            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="请输入授权码..."
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {codeErrMsg && (
              <p className="text-xs font-bold text-rose-600">{codeErrMsg}</p>
            )}

            {codeSuccessMsg && (
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {codeSuccessMsg}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCodeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleApplyCode}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
              >
                立即激活
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. B2C Token Booster Purchase Modal */}
      {showBoosterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-up border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-xl">
                  <Zap className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">B2C Token 加油包</h3>
                  <p className="text-[10px] text-slate-500 font-medium">开窍 AI 统一平台 Token 增值服务</p>
                </div>
              </div>
              <button
                onClick={() => setShowBoosterModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booster Packs Selection Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">选择充值规格（加油包 Token 永久有效）：</span>
              <div className="grid grid-cols-3 gap-2.5">
                {BOOSTER_PACKS.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack)}
                      className={`relative p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-sm scale-102 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pack.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold tracking-tight whitespace-nowrap shadow-xs">
                          推荐规格
                        </span>
                      )}
                      <div className="text-xs font-extrabold text-slate-900 mt-1">
                        {(pack.tokens / 10000).toFixed(0)}万 Token
                      </div>
                      <div className="text-base font-black text-emerald-700 mt-1">
                        ¥{pack.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Account Selector */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>选择付款账号与受益人：</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPayAccount('student')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    payAccount === 'student'
                      ? 'bg-white border-emerald-600 text-emerald-800 shadow-2xs'
                      : 'bg-slate-100/80 border-transparent text-slate-600'
                  }`}
                >
                  👦 学生本人支付
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">受益人: {student.name}</span>
                </button>

                <button
                  onClick={() => setPayAccount('parent')}
                  aria-label="选择家长账号支付"
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    payAccount === 'parent'
                      ? 'bg-white border-emerald-600 text-emerald-800 shadow-2xs'
                      : 'bg-slate-100/80 border-transparent text-slate-600'
                  }`}
                >
                  👨‍👩‍👦 关联家长支付
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                    {student.isParentBound ? '已绑定主监护人' : '需已关联监护人'}
                  </span>
                </button>
              </div>
            </div>

            {/* Policy Note */}
            <div className="text-[10px] text-slate-500 leading-relaxed bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                加油包 Token 充值到受益学生账户后永久有效，与月度套餐分开独立建账。基础服务到期后剩余加油包 Token 暂冻结，重新获得基础服务后自动恢复使用。
              </span>
            </div>

            {boosterSuccessMsg && (
              <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {boosterSuccessMsg}
              </p>
            )}

            {/* Submit Payment Button */}
            <button
              disabled={isProcessingPay}
              onClick={handleConfirmBoosterPay}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {isProcessingPay ? '微信支付处理中...' : `确认支付 ¥${selectedPack.price} 充值 Token`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
