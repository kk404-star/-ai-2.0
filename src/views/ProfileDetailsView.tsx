import React, { ChangeEvent, useEffect, useState } from 'react';
import { Camera, Check, GraduationCap, School, UserRound } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileDetailsViewProps {
  student: StudentProfile;
  onSave: (changes: Pick<StudentProfile, 'name' | 'avatar' | 'school'>) => void;
}

const SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

export const ProfileDetailsView: React.FC<ProfileDetailsViewProps> = ({ student, onSave }) => {
  const [name, setName] = useState(student.name);
  const [school, setSchool] = useState(student.school);
  const [avatar, setAvatar] = useState(student.avatar);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(student.name);
    setSchool(student.school);
    setAvatar(student.avatar);
  }, [student]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedSchool = school.trim();
    if (!trimmedName || !trimmedSchool) return;
    onSave({ name: trimmedName, school: trimmedSchool, avatar });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="space-y-3 px-5 pb-24 pt-3 animate-fade-in">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-3.5 card-shadow">
        <div className="flex flex-col items-center">
          <label className="relative size-[68px] cursor-pointer group">
            <img src={avatar} alt="个人头像" className="w-full h-full rounded-full object-cover border-2 border-emerald-500 p-0.5 bg-white" referrerPolicy="no-referrer" />
            <span className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm transition-transform group-active:scale-95">
              <Camera className="size-3" />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
          <p className="mt-1.5 text-[10px] text-slate-500">点击头像更换图片</p>
        </div>

        <div className="mt-4 space-y-2.5">
          <label className="block">
            <span className="text-xs font-bold text-slate-800">昵称</span>
            <input value={name} maxLength={16} onChange={(event) => setName(event.target.value)} className="mt-1 w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-slate-800">学校</span>
            <input value={school} maxLength={30} onChange={(event) => setSchool(event.target.value)} className="mt-1 w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-3.5 card-shadow">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-blue-600" />
          <h2 className="text-sm font-extrabold text-slate-900">学籍信息</h2>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2"><p className="text-[10px] text-slate-500">学段</p><p className="mt-0.5 text-xs font-extrabold text-slate-800">初中</p></div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2"><p className="text-[10px] text-slate-500">年级</p><p className="mt-0.5 text-xs font-extrabold text-slate-800">{student.grade}</p></div>
        </div>
        <div className="mt-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800"><School className="size-3.5 text-blue-600" />已开通学科</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUBJECTS.map((subject) => <span key={subject} className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{subject}</span>)}
          </div>
        </div>
      </section>

      <button onClick={handleSave} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]">
        {saved ? <><Check className="size-3.5" />已保存</> : <><UserRound className="size-3.5" />保存资料</>}
      </button>
    </div>
  );
};
