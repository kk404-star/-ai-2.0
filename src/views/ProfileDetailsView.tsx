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
    <div className="px-5 pt-5 pb-28 space-y-4 animate-fade-in">
      <section className="bg-white rounded-2xl border border-slate-200/80 card-shadow p-5">
        <div className="flex flex-col items-center">
          <label className="relative w-24 h-24 cursor-pointer group">
            <img src={avatar} alt="个人头像" className="w-full h-full rounded-full object-cover border-2 border-emerald-500 p-0.5 bg-white" referrerPolicy="no-referrer" />
            <span className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
              <Camera className="w-4 h-4" />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
          <p className="mt-3 text-xs text-slate-500">点击头像更换图片</p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-800">昵称</span>
            <input value={name} maxLength={16} onChange={(event) => setName(event.target.value)} className="mt-2 w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-800">学校</span>
            <input value={school} maxLength={30} onChange={(event) => setSchool(event.target.value)} className="mt-2 w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 card-shadow p-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-extrabold text-slate-900">学籍信息</h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3"><p className="text-xs text-slate-500">学段</p><p className="mt-1 text-sm font-extrabold text-slate-800">初中</p></div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3"><p className="text-xs text-slate-500">年级</p><p className="mt-1 text-sm font-extrabold text-slate-800">{student.grade}</p></div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><School className="w-4 h-4 text-blue-600" />已开通学科</div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SUBJECTS.map((subject) => <span key={subject} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">{subject}</span>)}
          </div>
        </div>
      </section>

      <button onClick={handleSave} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        {saved ? <><Check className="w-4 h-4" />已保存</> : <><UserRound className="w-4 h-4" />保存资料</>}
      </button>
    </div>
  );
};
