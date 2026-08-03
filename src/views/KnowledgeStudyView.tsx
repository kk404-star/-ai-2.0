import React, { useState, useRef } from 'react';
import { 
  Send, 
  Camera, 
  Bot, 
  User, 
  ArrowRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, KnowledgePoint } from '../types';

interface KnowledgeStudyViewProps {
  knowledgePoint: KnowledgePoint;
  onNavigateToQuiz: () => void;
}

export const KnowledgeStudyView: React.FC<KnowledgeStudyViewProps> = ({
  knowledgePoint,
  onNavigateToQuiz,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [masteryProgress, setMasteryProgress] = useState(knowledgePoint.progressPercent || 45);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: '你好！我是你的 AI 学习导师。在开始深入讲解前，先回答一个小问题检测一下你的概念基础：\n\n已知函数 $y = (m-1)x^2 + 2x + 1$ 是二次函数，参数 $m$ 需要满足什么条件？',
      timestamp: '14:20',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'm 不能等于 1 吧，因为如果 m 是 1，x² 前面的系数就变成 0 了。',
      timestamp: '14:21',
    },
    {
      id: 'm3',
      sender: 'ai',
      text: '✅ **回答完全正确！**\n\n二次函数的一般形式是 $y = ax^2 + bx + c (a \\neq 0)$，最核心的约束就是二次项系数 $a \\neq 0$。\n\n接着我们重点看顶点坐标公式：\n顶点坐标为 $(-\\frac{b}{2a}, \\frac{4ac-b^2}{4a})$，对称轴为直线 $x = -\\frac{b}{2a}$。\n\n请试着用自己的话讲一遍：决定二次函数图像开口方向和开口大小的要素分别是什么？',
      timestamp: '14:21',
    },
  ]);

  const handleSend = async () => {
    if (!inputVal.trim() || isSending) return;

    const userText = inputVal.trim();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: 'um-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: '刚才',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: knowledgePoint.title,
          message: userText,
          history: messages.map((m) => `${m.sender}: ${m.text}`),
          subject: knowledgePoint.subject,
        }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'aim-' + Date.now(),
        sender: 'ai',
        text: data.reply || `回答得很好！你的理解很准确。让我们再来看一道实际应用的例题：\n\n求函数 $y = 2x^2 - 4x + 5$ 的顶点坐标与对称轴。`,
        timestamp: '刚才',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setMasteryProgress((prev) => Math.min(100, prev + 12));
    } catch {
      const fallbackAiMsg: ChatMessage = {
        id: 'aim-fallback-' + Date.now(),
        sender: 'ai',
        text: `理解很到位！我们接着看应用：\n当 $a > 0$ 时开口向上，有最小值；$a < 0$ 时开口向下，有最大值。\n试试回答：若利润函数 $y = -2x^2 + 120x - 1000$，求获取最大利润时的售价 $x$。`,
        timestamp: '刚才',
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
      setMasteryProgress((prev) => Math.min(100, prev + 12));
    } finally {
      setIsSending(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const defaultSampleImg = 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=60';
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = (event.target?.result as string) || defaultSampleImg;
        sendPhotoMessage(imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      sendPhotoMessage(defaultSampleImg);
    }
  };

  const sendPhotoMessage = (imageUrl: string) => {
    const photoUserMsg: ChatMessage = {
      id: 'um-photo-' + Date.now(),
      sender: 'user',
      text: '📷 [上传了草稿解题图] 请 AI 导师帮我看看步骤是否规范。',
      timestamp: '刚才',
      imageUrl: imageUrl,
    };

    setMessages((prev) => [...prev, photoUserMsg]);
    setIsSending(true);

    setTimeout(() => {
      const aiPhotoAnalysisMsg: ChatMessage = {
        id: 'aim-photo-' + Date.now(),
        sender: 'ai',
        text: '📸 **AI 导师点评**：\n1. **做得棒的地方**：代入顶点坐标公式求对称轴 `-b / (2a)` 思路清晰！\n2. **细节提醒**：第 3 步去括号时，变号遗漏导致算常数项 c 有偏差。\n3. **建议**：把算出的 $x$ 值带回原式检验一下。',
        timestamp: '刚才',
      };
      setMessages((prev) => [...prev, aiPhotoAnalysisMsg]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="px-5 pt-4 pb-36 space-y-4 animate-fade-in">
      {/* Knowledge Title & Mastery Header */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900 text-sm">{knowledgePoint.title}</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
            {knowledgePoint.masteryState} · 学习进度 {masteryProgress}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${masteryProgress}%` }}
          />
        </div>


      </div>

      {/* Chat Dialogue */}
      <div className="space-y-3.5 pt-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-start'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[82%] space-y-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-none card-shadow'
                }`}
              >
                {/* Image attachment if uploaded */}
                {msg.imageUrl && (
                  <div className="mt-2 mb-1">
                    <img
                      src={msg.imageUrl}
                      alt="上传图片"
                      className="max-w-[200px] max-h-[160px] object-cover rounded-xl border border-white/20 shadow-xs"
                    />
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-2 items-center text-xs text-slate-500 font-medium italic animate-pulse">
            <Bot className="w-4 h-4 text-emerald-600" />
            AI 导师正在思考中...
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Bar & Primary CTA */}
      <div className="mobile-fixed-footer space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的想法或回答..."
            className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim() || isSending}
            className="w-10 h-11 bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={handleCameraClick}
            title="拍照上传答题草稿"
            className="w-10 h-11 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-all"
          >
            <Camera className="w-4 h-4 text-slate-700" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onNavigateToQuiz}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            进入题目练习巩固 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
