"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [major, setMajor] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [gpa, setGpa] = useState("");
  const [courses, setCourses] = useState("");
  const [direction, setDirection] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          major,
          academic_level: academicLevel,
          gpa,
          courses,
          direction,
          skills,
          experience,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("تم إنشاء الحساب بنجاح");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);

    setLoading(false);
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-[#D7E1F5] bg-white/70 px-4 text-sm font-semibold text-[#071D4B] shadow-[inset_0_1px_8px_rgba(7,29,75,0.03)] outline-none transition placeholder:text-[#A8B5D6] focus:border-[#1B4FD8] focus:bg-white focus:ring-4 focus:ring-[#1B4FD8]/10";

  const selectClass =
    "h-12 w-full rounded-xl border border-[#D7E1F5] bg-white/70 px-4 text-sm font-semibold text-[#071D4B] outline-none transition focus:border-[#1B4FD8] focus:bg-white focus:ring-4 focus:ring-[#1B4FD8]/10";

  return (
    <main
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#F4F7FF] px-5 py-8 text-[#071D4B]"
    >
      <img
        src="/images/mern-hero-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
      />

      <div className="absolute inset-0 bg-white/20" />

      <section className="relative z-10 flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <div className="w-full max-w-3xl rounded-[36px] border border-white/70 bg-white/58 px-7 py-8 shadow-[0_30px_90px_rgba(7,29,75,0.16)] backdrop-blur-2xl md:px-10">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#DCE6FA] bg-white/70 shadow-[0_12px_35px_rgba(7,29,75,0.12)]">
              <span className="text-2xl">🎓</span>
            </div>

            <h1 className="text-3xl font-black md:text-4xl">
              إنشاء حساب جديد
            </h1>

            <p className="mt-3 text-base font-medium text-[#6B7AA8]">
              ابدأ رحلتك المهنية بخطوات أوضح
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-[#D7E1F5]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1554D1]" />
              <span className="h-px w-9 bg-[#D7E1F5]" />
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  placeholder="اكتب اسمك الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  المستوى الجامعي
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">اختر مستواك الجامعي</option>
                  <option value="السنة الأولى">السنة الأولى</option>
                  <option value="السنة الثانية">السنة الثانية</option>
                  <option value="السنة الثالثة">السنة الثالثة</option>
                  <option value="السنة الرابعة">السنة الرابعة</option>
                  <option value="حديث تخرج">حديث تخرج</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  التخصص
                </label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">اختر تخصصك</option>
                  <option value="إدارة أعمال">إدارة أعمال</option>
                  <option value="هندسة">هندسة</option>
                  <option value="تقنية معلومات">تقنية معلومات</option>
                  <option value="علوم حاسب">علوم حاسب</option>
                  <option value="تسويق">تسويق</option>
                  <option value="تصميم">تصميم</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  المعدل
                </label>
                <input
                  type="text"
                  placeholder="مثال: 4.50 من 5"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  أهم الدورات التي حصلت عليها
                </label>
                <input
                  type="text"
                  placeholder="اذكر أبرز الدورات التي حصلت عليها"
                  value={courses}
                  onChange={(e) => setCourses(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                توجه المستخدم
              </label>
              <input
                type="text"
                placeholder="ما هو توجهك الأكاديمي والمهني؟"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                المهارات الحالية
              </label>
              <input
                type="text"
                placeholder="اذكر المهارات التي تمتلكها حاليًا"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                الخبرات السابقة
              </label>
              <input
                type="text"
                placeholder="اكتب عن أي خبرات أو أعمال سابقة لديك"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={inputClass}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                {success}
              </div>
            )}

            <div className="pt-3 text-center">
              <button
                type="submit"
                disabled={loading}
                className="mx-auto h-14 min-w-[280px] rounded-2xl bg-[#071D8F] px-10 text-base font-black text-white shadow-[0_18px_42px_rgba(7,29,143,0.35)] transition hover:-translate-y-1 hover:bg-[#0A2AAD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>

              <p className="mt-5 text-sm font-semibold text-[#6575A6]">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="font-black text-[#0A43D1]">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}