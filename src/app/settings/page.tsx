"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/ai/mern-analyzer";

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [gpa, setGpa] = useState("");
  const [courses, setCourses] = useState("");
  const [direction, setDirection] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceHours, setExperienceHours] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !data) {
        console.error(profileError);
        setError("لم يتم العثور على بيانات الحساب");
        setLoading(false);
        return;
      }

      const userProfile = data as UserProfile;

      setProfile(userProfile);
      setFullName(userProfile.full_name || "");
      setEmail(userProfile.email || user.email || "");
      setMajor(userProfile.major || "");
      setAcademicLevel(userProfile.academic_level || "");
      setGpa(userProfile.gpa || "");
      setCourses(userProfile.courses || "");
      setDirection(userProfile.direction || "");
      setSkills(userProfile.skills || "");
      setExperience(userProfile.experience || "");
      setTargetRole(userProfile.target_role || userProfile.direction || "");
      setExperienceHours(String(userProfile.experience_hours || 0));

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile) return;

    setSaving(true);
    setSuccess("");
    setError("");

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        full_name: fullName,
        email,
        major,
        academic_level: academicLevel,
        gpa,
        courses,
        direction,
        skills,
        experience,
        target_role: targetRole,
        experience_hours: Number(experienceHours) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error(updateError);
      setError("حدث خطأ أثناء حفظ التغييرات");
      setSaving(false);
      return;
    }

    setSuccess("تم حفظ التغييرات بنجاح");
    setSaving(false);
    router.refresh();
  }

  const inputClass =
    "h-13 w-full rounded-2xl border border-[#D7E1F5] bg-white px-5 text-sm font-semibold text-[#071D4B] outline-none transition placeholder:text-[#A8B5D6] focus:border-[#1554D1] focus:ring-4 focus:ring-[#1554D1]/10";

  const textareaClass =
    "min-h-28 w-full resize-none rounded-2xl border border-[#D7E1F5] bg-white px-5 py-4 text-sm font-semibold leading-7 text-[#071D4B] outline-none transition placeholder:text-[#A8B5D6] focus:border-[#1554D1] focus:ring-4 focus:ring-[#1554D1]/10";

  if (loading) {
    return (
      <main
        dir="rtl"
        className="grid min-h-dvh place-items-center bg-[#F6F9FF] text-[#071D4B]"
      >
        <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 px-8 py-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)]">
          <p className="text-lg font-black">جاري تحميل الإعدادات...</p>
          <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
            يتم استدعاء بيانات حسابك من قاعدة البيانات
          </p>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-dvh bg-[#F6F9FF] text-[#071D4B]">
      <div className="flex min-h-dvh">
        <DashboardSidebar />

<section className="min-h-dvh flex-1 lg:mr-[240px]">
          <header className="sticky top-0 z-20 border-b border-[#E7EEFC] bg-white/75 px-5 py-5 backdrop-blur-2xl md:px-8">
            <h1 className="text-2xl font-black">الإعدادات</h1>
            <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
              إدارة حسابك وتحديث بياناتك المهنية داخل منصة مرن
            </p>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[8%] top-[4%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/70 blur-3xl" />
              <div className="absolute bottom-[10%] right-[18%] h-[360px] w-[360px] rounded-full bg-[#FFF1B8]/40 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto grid max-w-6xl gap-5 lg:grid-cols-[320px_1fr]">
              <aside className="h-fit rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#F5B700] bg-[#EEF4FF]">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      email || fullName || "Mern"
                    )}`}
                    alt="صورة المستخدم"
                    className="h-full w-full object-cover"
                  />
                </div>

                <h2 className="mt-5 text-center text-xl font-black">
                  {fullName || "طالب مرن"}
                </h2>

                <p className="mt-1 text-center text-sm font-semibold text-[#7A89B7]">
                  {major || "طالب جامعي"}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-[#F8FAFF] p-4">
                    <p className="text-xs font-black text-[#7A89B7]">
                      المسار المستهدف
                    </p>
                    <p className="mt-2 text-sm font-black">
                      {targetRole || direction || "غير محدد"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8FAFF] p-4">
                    <p className="text-xs font-black text-[#7A89B7]">
                      ساعات الخبرة
                    </p>
                    <p className="mt-2 text-sm font-black">
                      {experienceHours || 0} ساعة
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-6 h-12 w-full rounded-2xl bg-[#071D8F] text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0A2AAD]"
                >
                  تسجيل الخروج
                </button>
              </aside>

              <div className="space-y-5">
                <form
                  onSubmit={handleSave}
                  className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-xl font-black">معلومات الحساب</h2>
                      <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
                        هذه البيانات يستخدمها مرن في تحليل المسارات والمهارات
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="h-12 rounded-2xl bg-[#071D8F] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0A2AAD] disabled:opacity-60"
                    >
                      {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-black">
                        الاسم الكامل
                      </label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="اكتب اسمك الكامل"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        التخصص
                      </label>
                      <input
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="مثال: نظم معلومات"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        المستوى الجامعي
                      </label>
                      <select
                        value={academicLevel}
                        onChange={(e) => setAcademicLevel(e.target.value)}
                        className={inputClass}
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
                        المعدل
                      </label>
                      <input
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="مثال: 4.50 من 5"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        ساعات الخبرة
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={experienceHours}
                        onChange={(e) => setExperienceHours(e.target.value)}
                        placeholder="مثال: 40"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        المسار المستهدف
                      </label>
                      <input
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="مثال: محلل بيانات"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        توجه المستخدم
                      </label>
                      <input
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        placeholder="ما هو توجهك الأكاديمي والمهني؟"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-black">
                        الدورات السابقة
                      </label>
                      <textarea
                        value={courses}
                        onChange={(e) => setCourses(e.target.value)}
                        placeholder="اذكر الدورات التي حصلت عليها"
                        className={textareaClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        المهارات الحالية
                      </label>
                      <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="اذكر المهارات التي تمتلكها حاليًا"
                        className={textareaClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black">
                        الخبرات السابقة
                      </label>
                      <textarea
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="اكتب عن أي خبرات أو أعمال سابقة لديك"
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </form>

                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="text-xl font-black">تفضيلات التوصيات</h2>

                  <div className="mt-5 space-y-4">
                    {[
                      "اقتراح فرص مهنية مناسبة تلقائيًا",
                      "اقتراح دورات مجانية حسب المهارات الضعيفة",
                      "إظهار تنبيهات تحسين الجاهزية المهنية",
                      "استخدام بياناتي لتحسين دقة التحليل",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between rounded-2xl bg-[#F8FAFF] p-4"
                      >
                        <span className="text-sm font-bold">{item}</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-5 w-5 accent-[#071D8F]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}