"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  analyzeMernProfile,
  type CourseCompletion,
  type UserProfile,
} from "@/lib/ai/mern-analyzer";

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      const { data: completedCourses } = await supabase
        .from("course_completions")
        .select("*")
        .eq("user_id", user.id);

      setProfile(profileData as UserProfile);
      setCompletions((completedCourses || []) as CourseCompletion[]);
      setLoading(false);
    }

    loadDashboardData();
  }, [router]);

  const analysis = useMemo(() => {
    if (!profile) return null;
    return analyzeMernProfile(profile, completions);
  }, [profile, completions]);

  const userName = profile?.full_name?.split(" ")[0] || "طالب";
  const readiness = analysis?.readinessScore || 0;
  const today = new Date().toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <main
        dir="rtl"
        className="grid min-h-dvh place-items-center bg-[#F6F9FF] text-[#071D4B]"
      >
        <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 px-8 py-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)]">
          <p className="text-lg font-black">جاري تحليل بياناتك...</p>
          <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
            مرن يجهّز تقريرك الشخصي باستخدام الذكاء الاصطناعي
          </p>
        </div>
      </main>
    );
  }

  if (!profile || !analysis) {
    return (
      <main
        dir="rtl"
        className="grid min-h-dvh place-items-center bg-[#F6F9FF] text-[#071D4B]"
      >
        <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 px-8 py-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)]">
          <p className="text-lg font-black">لم يتم العثور على بيانات الطالب</p>
          <Link
            href="/register"
            className="mt-5 inline-flex rounded-2xl bg-[#071D8F] px-6 py-3 text-sm font-black text-white"
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-dvh overflow-hidden bg-[#F6F9FF] text-[#071D4B]"
    >
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <section className="min-h-dvh flex-1 lg:mr-[240px]">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#E7EEFC] bg-white/75 px-5 backdrop-blur-2xl md:px-8">
            <div>
              <h1 className="text-xl font-black md:text-2xl">
                👋 {userName}، إليك تقريرك الشخصي
              </h1>
              <p className="mt-1 text-xs font-semibold text-[#7A89B7] md:text-sm">
                تم تحليل إجاباتك وبياناتك باستخدام الذكاء الاصطناعي لبناء تقرير مهني دقيق ومخصص لك
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden h-11 rounded-2xl border border-[#DCE6FA] bg-white px-4 text-sm font-black text-[#071D63] shadow-sm md:block">
                🔔
              </button>

              <div className="flex items-center gap-3 rounded-2xl border border-[#DCE6FA] bg-white px-3 py-2 shadow-sm">
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#F5B700] bg-[#EEF4FF]">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      profile.email || userName
                    )}`}
                    alt="صورة المستخدم"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden text-sm font-black md:block">
                  {userName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="h-11 rounded-2xl bg-[#071D8F] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0A2AAD]"
              >
                تسجيل خروج
              </button>
            </div>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[8%] top-[4%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/60 blur-3xl" />
              <div className="absolute bottom-[10%] right-[18%] h-[360px] w-[360px] rounded-full bg-[#F7E7A8]/20 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-5 xl:grid-cols-[280px_1fr]">
              <div className="space-y-5">
                <div className="rounded-[26px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-black text-[#7A89B7]">
                      تاريخ التحليل
                    </p>
                    <p className="text-xs font-black text-[#071D8F]">{today}</p>
                  </div>

                  <div
                    className="mx-auto grid h-32 w-32 place-items-center rounded-full p-3"
                    style={{
                      background: `conic-gradient(#1554D1 0 ${readiness}%, #E8EFFD ${readiness}% 100%)`,
                    }}
                  >
                    <div className="grid h-full w-full place-items-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-2xl font-black">{readiness}%</p>
                        <p className="mt-1 text-[11px] font-black text-[#7A89B7]">
                          جاهزية
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-5 text-center text-base font-black">
                    {readiness >= 80
                      ? "جاهزية قوية"
                      : readiness >= 65
                        ? "جاهزية متوسطة"
                        : "تحتاج إلى تطوير"}
                  </h2>
                  <p className="mt-1 text-center text-xs font-semibold text-[#7A89B7]">
                    {analysis.diagnosis}
                  </p>
                </div>

                <div className="rounded-[26px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="mb-5 text-base font-black">
                    المهارات التي تحتاج تطوير
                  </h2>

                  <div className="space-y-4">
                    {analysis.weakSkills.slice(0, 5).map((skill) => (
                      <div key={skill.name}>
                        <div className="mb-2 flex items-center justify-between text-xs font-black">
                          <span>{skill.name}</span>
                          <span>{skill.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#EEF3FF]">
                          <div
                            className="h-full rounded-full bg-orange-500"
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {analysis.weakSkills.length === 0 && (
                      <p className="rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-600">
                        لا توجد مهارات ضعيفة حاليًا، ركّز على بناء مشاريع تطبيقية.
                      </p>
                    )}
                  </div>

                  <Link
                    href="/skills"
                    className="mt-5 inline-flex text-xs font-black text-[#0A43D1]"
                  >
                    عرض كل المهارات ←
                  </Link>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black">
                      أفضل المسارات المهنية المناسبة لك
                    </h2>
                    <span className="rounded-full bg-[#EEF4FF] px-4 py-2 text-xs font-black text-[#0A43D1]">
                      AI Analysis
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {analysis.careerPaths.slice(0, 3).map((path) => (
                      <div
                        key={path.title}
                        className="rounded-[24px] border border-[#E3EBFC] bg-[#FBFCFF] p-5"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black">{path.title}</h3>
                            <p className="mt-1 text-[11px] font-black text-green-600">
                              {path.level}
                            </p>
                          </div>
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF4FF] text-xl font-black text-[#1554D1]">
                            {path.icon}
                          </div>
                        </div>

                        <p className="text-2xl font-black">{path.percent}%</p>
                        <p className="mt-1 text-xs font-semibold text-[#7A89B7]">
                          نسبة التوافق
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[28px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                    <h2 className="mb-5 text-lg font-black">تفصيل المهارات</h2>

                    <div className="flex items-center justify-center gap-6">
                      <div className="grid h-32 w-32 place-items-center rounded-full bg-[conic-gradient(#20C565_0_45%,#F5B700_45%_75%,#FF7A45_75%_100%)] p-3">
                        <div className="grid h-full w-full place-items-center rounded-full bg-white">
                          <div className="text-center">
                            <p className="text-2xl font-black">
                              {analysis.skills.length}
                            </p>
                            <p className="text-[11px] font-black text-[#7A89B7]">
                              مهارة
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs font-black">
                        <p>
                          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                          قوية: {analysis.strongSkills.length}
                        </p>
                        <p>
                          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-[#F5B700]" />
                          متوسطة: {analysis.mediumSkills.length}
                        </p>
                        <p>
                          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
                          تحتاج تطوير: {analysis.weakSkills.length}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#F5F8FF] p-4">
                      <p className="text-xs font-black text-[#071D63]">
                        نصيحة ذكية 💡
                      </p>
                      <p className="mt-2 text-xs leading-6 text-[#7A89B7]">
                        {analysis.nextStep}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-lg font-black">التوصيات الذكية ✨</h2>
                      <span className="text-xs font-black text-[#F5B700]">
                        {analysis.recommendations.length} توصيات
                      </span>
                    </div>

                    <div className="space-y-3">
                      {analysis.recommendations.map((item, index) => (
                        <div
                          key={item.title}
                          className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-2xl border border-[#E7EEFC] bg-[#FBFCFF] p-3"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-full border border-[#DCE6FA] bg-white text-xs font-black text-[#1554D1]">
                            {index + 1}
                          </div>

                          <div>
                            <h3 className="text-xs font-black">{item.title}</h3>
                            <p className="mt-1 text-[11px] font-semibold text-[#7A89B7]">
                              {item.desc}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black ${
                              index === 0
                                ? "bg-green-50 text-green-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/skills"
                      className="mt-5 inline-flex text-xs font-black text-[#0A43D1]"
                    >
                      عرض جميع التوصيات ←
                    </Link>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black">فرص مقترحة لك</h2>
                    <Link
                      href="/opportunities"
                      className="text-xs font-black text-[#0A43D1]"
                    >
                      عرض المزيد ←
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {analysis.recommendedOpportunities
                      .slice(0, 4)
                      .map((job) => (
                        <div
                          key={job.id}
                          className="rounded-[24px] border border-[#E3EBFC] bg-[#FBFCFF] p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black text-green-600">
                              توافق {job.match}%
                            </span>
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EEF4FF] text-xs font-black text-[#1554D1]">
                              ▥
                            </div>
                          </div>

                          <h3 className="text-sm font-black">{job.title}</h3>
                          <p className="mt-2 text-xs font-semibold text-[#7A89B7]">
                            {job.company}
                          </p>

                          <Link
                            href="/opportunities"
                            className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-[#EEF4FF] text-xs font-black text-[#071D8F] transition hover:bg-[#071D8F] hover:text-white"
                          >
                            عرض التفاصيل
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 rounded-[28px] border border-[#DCE6FA] bg-white/78 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl xl:mr-[300px]">
              <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
                <div>
                  <h2 className="text-lg font-black">
                    استكشف رحلتك المهنية الآن 🚀
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
                    ابدأ تجربة افتراضية مع شركة حقيقية واجمع ساعات خبرة مهنية.
                  </p>
                </div>

                <Link
                  href="/opportunities"
                  className="flex h-12 items-center rounded-2xl bg-[#071D8F] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0A2AAD]"
                >
                  استعراض الفرص العملية
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}