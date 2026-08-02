import React, { useState, useRef } from 'react';
import { Camera, Image, ChevronRight, CheckCircle2, AlertCircle, Sparkles, Edit3, X, Check, ArrowRight } from 'lucide-react';
import { CorrectionRecord, ScreenType, SubjectType } from '../types';

interface PhotoScanViewProps {
  records: CorrectionRecord[];
  onNavigateToDetail: (record: CorrectionRecord) => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  onNavigateToInstantLearning?: (record: CorrectionRecord) => void;
}

const SUBJECTS: SubjectType[] = ['数学', '物理', '化学', '生物', '英语', '语文', '历史', '地理', '政治'];

export const PhotoScanView: React.FC<PhotoScanViewProps> = ({
  records,
  onNavigateToDetail,
  onNavigateToScreen,
  onNavigateToInstantLearning,
}) => {
  const [photoMode, setPhotoMode] = useState<'single' | 'multi'>('single');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('数学');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('图片上传中...');
  
  // OCR Edit Confirmation Modal State
  const [showOcrConfirmModal, setShowOcrConfirmModal] = useState(false);
  const [currentEditingRecord, setCurrentEditingRecord] = useState<CorrectionRecord | null>(null);
  const [ocrQuestionText, setOcrQuestionText] = useState('');
  const [ocrUserAnswer, setOcrUserAnswer] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleStartCaptureProcess = (sampleRecordIndex: number = 0) => {
    const targetRecord = records[sampleRecordIndex] || records[0];
    setIsScanning(true);
    setScanStepText('图片上传与预处理...');

    setTimeout(() => {
      setScanStepText('AI OCR 识别题目与手写解法...');
    }, 600);

    setTimeout(() => {
      setScanStepText('整理题目结构与切分...');
    }, 1200);

    setTimeout(() => {
      setIsScanning(false);
      setCurrentEditingRecord(targetRecord);
      setOcrQuestionText(targetRecord.questionText);
      setOcrUserAnswer(targetRecord.userAnswer);
      setShowOcrConfirmModal(true);
    }, 1800);
  };

  const handleConfirmOcrAndGrade = () => {
    setShowOcrConfirmModal(false);
    if (currentEditingRecord) {
      const updatedRecord = {
        ...currentEditingRecord,
        questionText: ocrQuestionText,
        userAnswer: ocrUserAnswer,
        subject: selectedSubject,
      };
      onNavigateToDetail(updatedRecord);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleStartCaptureProcess(0);
    }
  };

  return (
    <div className="px-5 pt-4 pb-28 space-y-5 animate-fade-in">
      {/* Subject Mandatory Picker */}
      <div className="bg-white p-3.5 rounded-2xl card-shadow border border-slate-200/80 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900">选择题目学科（必选）：</span>
          <span className="text-[11px] text-emerald-600 font-bold">已选：{selectedSubject}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Selector Chips */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200/80 flex shadow-xs">
        <button
          onClick={() => setPhotoMode('single')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            photoMode === 'single'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          一道题 (大题/微小问)
        </button>
        <button
          onClick={() => setPhotoMode('multi')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            photoMode === 'multi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          多道题 (整页练习)
        </button>
      </div>

      {/* Main Camera Capture Area */}
      <div className="relative border-2 border-dashed border-emerald-500/80 rounded-3xl p-8 bg-emerald-50/40 text-center space-y-4 shadow-xs hover:bg-emerald-50/70 transition-all">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {isScanning ? (
          <div className="py-6 space-y-3">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center animate-bounce">
              <Sparkles className="w-8 h-8 text-emerald-700 animate-spin" />
            </div>
            <p className="text-sm font-bold text-emerald-800">{scanStepText}</p>
            <p className="text-xs text-slate-500">根据 PRD 规范，批改前可确认和修正文字</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleStartCaptureProcess(0)}
              className="w-20 h-20 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center mx-auto active:scale-90 transition-all"
            >
              <Camera className="w-9 h-9" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">点击拍照或上传图片</h3>
              <p className="text-xs text-slate-500 mt-1">模式：{photoMode === 'single' ? '一道完整大题' : '多道试题拆分'}</p>
            </div>

            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 shadow-xs"
              >
                <Image className="w-3.5 h-3.5 text-emerald-600" />
                从相册选择
              </button>
            </div>
          </>
        )}
      </div>

      {/* Correction History Records */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">历史批改记录</h3>
          <span className="text-xs font-semibold text-slate-500">全部 {records.length} 篇 ▾</span>
        </div>

        <div className="space-y-2.5">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white p-3.5 rounded-2xl card-shadow border border-slate-200/80 space-y-2.5 hover:border-emerald-500 transition-all"
            >
              <div
                onClick={() => onNavigateToDetail(record)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={record.image}
                  alt={record.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200/80"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {record.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {record.date} {record.time} · {record.subject}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    {record.wrongCount > 0 ? (
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {record.wrongCount} 错{' '}
                        <span className="text-emerald-600">{record.correctCount} 对</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        全对
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>

              {/* Instant learning CTA if wrong */}
              {record.wrongCount > 0 && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (onNavigateToInstantLearning) onNavigateToInstantLearning(record);
                      else onNavigateToScreen('instant_learning');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <span>学习这道错题</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRD 10.10 & 10.11 OCR Recognition Confirmation & Editing Drawer Modal */}
      {showOcrConfirmModal && (
        <div className="fixed md:absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center p-3 overflow-hidden">
          <div className="bg-white w-full max-w-[420px] rounded-3xl p-4 shadow-2xl space-y-3.5 animate-slide-up border-t-4 border-emerald-500 max-h-[90%] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">确认并修正识别结果</h4>
              </div>
              <button
                onClick={() => setShowOcrConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  识别到的题目内容：
                </label>
                <textarea
                  rows={3}
                  value={ocrQuestionText}
                  onChange={(e) => setOcrQuestionText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  识别到的本人解答：
                </label>
                <textarea
                  rows={2}
                  value={ocrUserAnswer}
                  onChange={(e) => setOcrUserAnswer(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowOcrConfirmModal(false)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmOcrAndGrade}
                className="flex-1 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                确认并开始批改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
