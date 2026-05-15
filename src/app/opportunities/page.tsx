"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/lib/supabase/client";
import {
  analyzeMernProfile,
  type CourseCompletion,
  type RecommendedOpportunity,
  type UserProfile,
} from "@/lib/ai/mern-analyzer";

export default function OpportunitiesPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<RecommendedOpportunity | null>(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOpportunities, setAiOpportunities] = useState<
    RecommendedOpportunity[]
  >([]);

  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedOpportunityIds, setAppliedOpportunityIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    async function loadOpportunitiesData() {
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

      const { data: applications } = await supabase
        .from("opportunity_applications")
        .select("opportunity_id")
        .eq("user_id", user.id);

      setProfile(profileData as UserProfile);
      setCompletions((completedCourses || []) as CourseCompletion[]);
      setAppliedOpportunityIds(
        (applications || []).map((item) => item.opportunity_id)
      );

      setLoading(false);
    }

    loadOpportunitiesData();
  }, [router]);

  const analysis = useMemo(() => {
    if (!profile) return null;
    return analyzeMernProfile(profile, completions);
  }, [profile, completions]);

  useEffect(() => {
    async function loadAiOpportunities() {
      if (!profile || !analysis) return;

      setAiLoading(true);

      try {
        const response = await fetch("/api/ai/recommend-opportunities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile,
            completions,
            readinessScore: analysis.readinessScore,
            skills: analysis.skills,
            weakSkills: analysis.weakSkills,
            mediumSkills: analysis.mediumSkills,
            strongSkills: analysis.strongSkills,
            careerPaths: analysis.careerPaths,
            targetRole: profile.target_role || profile.direction || "",
            major: profile.major || "",
            currentSkills: profile.skills || "",
            experienceHours: profile.experience_hours || 0,
          }),
        });

        if (!response.ok) {
          setAiOpportunities([]);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data.opportunities)) {
          setAiOpportunities(data.opportunities as RecommendedOpportunity[]);
        }
      } catch (error) {
        console.error("AI opportunities error:", error);
        setAiOpportunities([]);
      } finally {
        setAiLoading(false);
      }
    }

    loadAiOpportunities();
  }, [profile, analysis, completions]);

  async function handleApplyOpportunity(opportunity: RecommendedOpportunity) {
    setApplyingId(opportunity.id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("يجب تسجيل الدخول أولًا");
      router.push("/login");
      setApplyingId(null);
      return;
    }

    const alreadyApplied = appliedOpportunityIds.includes(opportunity.id);

    if (alreadyApplied) {
      alert("تم التقديم على هذه الفرصة مسبقًا");
      setApplyingId(null);
      return;
    }

    const { error } = await supabase.from("opportunity_applications").insert({
      user_id: user.id,
      opportunity_id: opportunity.id,
      opportunity_title: opportunity.title,
      company: opportunity.company,
      match_score: opportunity.match,
      status: "submitted",
    });

    if (error) {
      console.error(error);
      alert("حدث خطأ أثناء التقديم على الفرصة");
      setApplyingId(null);
      return;
    }

    setAppliedOpportunityIds((prev) => [...prev, opportunity.id]);
    setSelectedOpportunity(null);
    setApplyingId(null);

    alert(
      `تم إرسال طلبك بنجاح على فرصة: ${opportunity.title}\nستظهر حالة الطلب قريبًا في لوحة التحكم.`
    );
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="grid min-h-dvh place-items-center bg-[#F6F9FF] text-[#071D4B]"
      >
        <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 px-8 py-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)]">
          <p className="text-lg font-black">جاري تجهيز الفرص...</p>
          <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
            يتم اختيار الفرص بناءً على ملفك وتحليل مهاراتك
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
        </div>
      </main>
    );
  }

  const opportunities =
    aiOpportunities.length > 0
      ? aiOpportunities
      : analysis.recommendedOpportunities;

  const sortedOpportunities = [...opportunities].sort(
    (a, b) => b.match - a.match
  );

  const topOpportunity = sortedOpportunities[0];

  return (
    <main dir="rtl" className="min-h-dvh bg-[#F6F9FF] text-[#071D4B]">
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <section className="min-h-dvh flex-1 lg:mr-[240px]">
          <header className="sticky top-0 z-20 border-b border-[#E7EEFC] bg-white/75 px-5 py-5 backdrop-blur-2xl md:px-8">
            <h1 className="text-2xl font-black">الفرص المهنية</h1>
            <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
              فرص وتجارب افتراضية مخصصة حسب بياناتك ومهاراتك ومسارك المهني
            </p>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[10%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/70 blur-3xl" />
              <div className="absolute bottom-[10%] right-[25%] h-[360px] w-[360px] rounded-full bg-[#FFF1B8]/40 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/78 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-xl font-black">
                        فرص مناسبة لاحتياجك
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
                        تم ترتيب الفرص حسب التوافق مع تخصصك ومهاراتك ونقاط التطوير
                      </p>
                    </div>

                    <button
                      onClick={() => window.location.reload()}
                      className="h-12 rounded-2xl bg-[#071D8F] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)]"
                    >
                      {aiLoading ? "جاري التحديث..." : "تحديث الفرص"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {sortedOpportunities.map((item) => {
                    const alreadyApplied = appliedOpportunityIds.includes(
                      item.id
                    );

                    return (
                      <div
                        key={item.id}
                        className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,29,75,0.12)]"
                      >
                        <div className="mb-5 flex items-start justify-between">
                          <div>
                            <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-black text-[#1554D1]">
                              {item.type}
                            </span>
                            <h3 className="mt-4 text-xl font-black">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
                              {item.company}
                            </p>
                          </div>

                          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#071D8F] text-sm font-black text-white">
                            {item.match}%
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="mb-2 flex justify-between text-xs font-black">
                            <span>مطابقة احتياجك</span>
                            <span>{item.match}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#EEF3FF]">
                            <div
                              className="h-full rounded-full bg-[#1554D1]"
                              style={{ width: `${item.match}%` }}
                            />
                          </div>
                        </div>

                        <div className="mb-5 flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-[#F8FAFF] px-3 py-1 text-xs font-black text-[#6B7AA8] ring-1 ring-[#E3EBFC]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-[#F5A900]">
                            {item.hours}
                          </span>

                          <button
                            onClick={() => setSelectedOpportunity(item)}
                            className="rounded-2xl bg-[#071D8F] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0A2AAD]"
                          >
                            {alreadyApplied ? "عرض حالة الطلب" : "عرض التفاصيل"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="text-lg font-black">ملخص الفرص</h2>

                  <div className="mt-6 space-y-4">
                    {[
                      ["الفرص المناسبة", String(sortedOpportunities.length)],
                      ["أعلى توافق", `${topOpportunity?.match || 0}%`],
                      ["طلبات التقديم", String(appliedOpportunityIds.length)],
                      ["المسار الأقرب", analysis.careerPaths[0]?.title || "-"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl bg-[#F8FAFF] p-4"
                      >
                        <span className="text-sm font-bold text-[#7A89B7]">
                          {label}
                        </span>
                        <span className="text-xl font-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] bg-[#071D8F] p-6 text-white shadow-[0_18px_55px_rgba(7,29,143,0.22)]">
                  <h2 className="text-lg font-black">نصيحة مرن</h2>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
                    {topOpportunity
                      ? `ابدأ بفرصة ${topOpportunity.title} لأنها الأقرب لاحتياجك الحالي وتوافق ملفك بنسبة ${topOpportunity.match}%.`
                      : "أكمل بياناتك في الإعدادات حتى يتم اقتراح فرص أدق."}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071D4B]/35 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto rounded-[34px] border border-white/70 bg-white/95 p-6 shadow-[0_30px_100px_rgba(7,29,75,0.30)] md:p-8">
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-2xl bg-[#F3F6FF] text-lg font-black text-[#071D4B] transition hover:bg-[#E7EEFC]"
            >
              ×
            </button>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#EEF4FF] px-4 py-2 text-xs font-black text-[#1554D1]">
                    {selectedOpportunity.type}
                  </span>
                  <span className="rounded-full bg-[#FFF7D8] px-4 py-2 text-xs font-black text-[#9A7600]">
                    {selectedOpportunity.hours}
                  </span>
                  <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-black text-green-600">
                    توافق {selectedOpportunity.match}%
                  </span>
                </div>

                <h2 className="text-3xl font-black leading-tight">
                  {selectedOpportunity.title}
                </h2>

                <p className="mt-3 text-base font-bold text-[#7A89B7]">
                  {selectedOpportunity.company}
                </p>

                <p className="mt-6 text-sm font-semibold leading-8 text-[#5F6F9F]">
                  {selectedOpportunity.description}
                </p>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="rounded-[26px] border border-[#E1E8F8] bg-[#FBFCFF] p-5">
                    <h3 className="text-lg font-black">المهام المتوقعة</h3>
                    <ul className="mt-4 space-y-3">
                      {selectedOpportunity.tasks.map((task) => (
                        <li
                          key={task}
                          className="flex gap-3 text-sm font-semibold leading-7 text-[#5F6F9F]"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1554D1]" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[26px] border border-[#E1E8F8] bg-[#FBFCFF] p-5">
                    <h3 className="text-lg font-black">مخرجات التجربة</h3>
                    <ul className="mt-4 space-y-3">
                      {selectedOpportunity.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="flex gap-3 text-sm font-semibold leading-7 text-[#5F6F9F]"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F5B700]" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-[26px] border border-[#E1E8F8] bg-[#FBFCFF] p-5">
                  <h3 className="text-lg font-black">المتطلبات المناسبة</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {selectedOpportunity.requirements.map((requirement) => (
                      <div
                        key={requirement}
                        className="rounded-2xl bg-white p-4 text-sm font-bold leading-7 text-[#5F6F9F] ring-1 ring-[#E7EEFC]"
                      >
                        {requirement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[28px] bg-[#071D8F] p-6 text-white shadow-[0_18px_55px_rgba(7,29,143,0.24)]">
                  <p className="text-sm font-bold text-white/70">
                    نسبة توافقك مع الفرصة
                  </p>

                  <div
                    className="mx-auto mt-6 grid h-36 w-36 place-items-center rounded-full p-3"
                    style={{
                      background: `conic-gradient(#F5B700 0 ${selectedOpportunity.match}%, rgba(255,255,255,0.18) ${selectedOpportunity.match}% 100%)`,
                    }}
                  >
                    <div className="grid h-full w-full place-items-center rounded-full bg-[#071D8F]">
                      <div className="text-center">
                        <p className="text-4xl font-black">
                          {selectedOpportunity.match}%
                        </p>
                        <p className="mt-1 text-xs font-bold text-white/65">
                          مناسب جدًا
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-sm font-semibold leading-7 text-white/75">
                    هذه الفرصة متوافقة مع مهاراتك الحالية وتساعدك على تقوية
                    المهارات التي تحتاجها لمسارك المهني.
                  </p>
                </div>

                <div className="rounded-[28px] border border-[#E1E8F8] bg-[#FBFCFF] p-5">
                  <h3 className="text-lg font-black">معلومات الفرصة</h3>

                  <div className="mt-5 space-y-3">
                    {[
                      ["نمط العمل", selectedOpportunity.location],
                      ["المدة", selectedOpportunity.duration],
                      ["المستوى", selectedOpportunity.level],
                      ["ساعات الخبرة", selectedOpportunity.hours],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-[#E7EEFC]"
                      >
                        <span className="text-xs font-black text-[#7A89B7]">
                          {label}
                        </span>
                        <span className="text-sm font-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#E1E8F8] bg-[#FBFCFF] p-5">
                  <h3 className="text-lg font-black">المهارات المرتبطة</h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedOpportunity.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#1554D1] ring-1 ring-[#DCE6FA]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleApplyOpportunity(selectedOpportunity)}
                  disabled={
                    applyingId === selectedOpportunity.id ||
                    appliedOpportunityIds.includes(selectedOpportunity.id)
                  }
                  className={`h-14 w-full rounded-2xl text-sm font-black shadow-[0_14px_34px_rgba(7,29,143,0.28)] transition ${
                    appliedOpportunityIds.includes(selectedOpportunity.id)
                      ? "cursor-not-allowed bg-green-50 text-green-600"
                      : "bg-[#071D8F] text-white hover:-translate-y-0.5 hover:bg-[#0A2AAD]"
                  } disabled:opacity-70`}
                >
                  {appliedOpportunityIds.includes(selectedOpportunity.id)
                    ? "تم التقديم على الفرصة"
                    : applyingId === selectedOpportunity.id
                      ? "جاري التقديم..."
                      : "التقديم على الفرصة"}
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}