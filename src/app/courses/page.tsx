"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/lib/supabase/client";
import {
  analyzeMernProfile,
  type CourseCompletion,
  type RecommendedCourse,
  type UserProfile,
} from "@/lib/ai/mern-analyzer";

export default function CoursesPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCourseId, setSavingCourseId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoursesData() {
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
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      setProfile(profileData as UserProfile);
      setCompletions((completedCourses || []) as CourseCompletion[]);
      setLoading(false);
    }

    loadCoursesData();
  }, [router]);

  const analysis = useMemo(() => {
    if (!profile) return null;
    return analyzeMernProfile(profile, completions);
  }, [profile, completions]);

  async function handleCompleteCourse(course: RecommendedCourse) {
    setSavingCourseId(course.id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("يجب تسجيل الدخول أولًا");
      router.push("/login");
      setSavingCourseId(null);
      return;
    }

    const alreadyCompleted = completions.some(
      (item) => item.course_id === course.id
    );

    if (alreadyCompleted) {
      alert("هذه الدورة محفوظة بالفعل ضمن الدورات المكتملة");
      setSavingCourseId(null);
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.png,.jpg,.jpeg";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];

      let certificateUrl = "";

      if (file) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${course.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("certificates")
          .upload(filePath, file);

        if (uploadError) {
          console.error(uploadError);
          alert("حدث خطأ أثناء رفع الشهادة");
          setSavingCourseId(null);
          return;
        }

        const { data } = supabase.storage
          .from("certificates")
          .getPublicUrl(filePath);

        certificateUrl = data.publicUrl;
      }

      const { data: insertedCourse, error } = await supabase
        .from("course_completions")
        .insert({
          user_id: user.id,
          course_id: course.id,
          course_title: course.title,
          provider: course.provider,
          skill: course.skill,
          certificate_url: certificateUrl,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("حدث خطأ أثناء حفظ إنجاز الدورة");
        setSavingCourseId(null);
        return;
      }

      setCompletions((prev) => [insertedCourse as CourseCompletion, ...prev]);
      alert("تم حفظ إنجاز الدورة بنجاح وسيتم احتسابها في تقييمك");
      setSavingCourseId(null);
    };

    fileInput.oncancel = () => {
      setSavingCourseId(null);
    };

    fileInput.click();
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="grid min-h-dvh place-items-center bg-[#F6F9FF] text-[#071D4B]"
      >
        <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 px-8 py-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)]">
          <p className="text-lg font-black">جاري تجهيز الدورات...</p>
          <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
            يتم اقتراح الدورات بناءً على بياناتك وتحليلك
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

  return (
    <main dir="rtl" className="min-h-dvh bg-[#F6F9FF] text-[#071D4B]">
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <section className="min-h-dvh flex-1 lg:mr-[92px]">
          <header className="sticky top-0 z-20 border-b border-[#E7EEFC] bg-white/75 px-5 py-5 backdrop-blur-2xl md:px-8">
            <h1 className="text-2xl font-black">الدورات المقترحة</h1>
            <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
              دورات مجانية ومفتوحة مقترحة حسب تحليل مهاراتك واحتياجك الحالي
            </p>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[8%] top-[4%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/70 blur-3xl" />
              <div className="absolute bottom-[10%] right-[18%] h-[360px] w-[360px] rounded-full bg-[#FFF1B8]/40 blur-3xl" />
            </div>

            <div className="relative z-10 mb-5 grid gap-5 lg:grid-cols-3">
              <div className="rounded-[28px] border border-[#DCE6FA] bg-white/80 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <p className="text-sm font-black text-[#7A89B7]">
                  جاهزية المهارات
                </p>
                <h2 className="mt-3 text-4xl font-black">
                  {analysis.readinessScore}%
                </h2>
              </div>

              <div className="rounded-[28px] border border-[#DCE6FA] bg-white/80 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <p className="text-sm font-black text-[#7A89B7]">
                  دورات مكتملة
                </p>
                <h2 className="mt-3 text-4xl font-black">
                  {completions.length}
                </h2>
              </div>

              <div className="rounded-[28px] border border-[#DCE6FA] bg-white/80 p-5 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <p className="text-sm font-black text-[#7A89B7]">
                  أولوية التطوير
                </p>
                <h2 className="mt-3 text-xl font-black">
                  {analysis.weakSkills[0]?.name || "مشروع تطبيقي"}
                </h2>
              </div>
            </div>

            <div className="relative z-10 grid gap-5 lg:grid-cols-2">
              {analysis.recommendedCourses.map((course) => {
                const completed = completions.some(
                  (item) => item.course_id === course.id
                );

                return (
                  <div
                    key={course.id}
                    className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,29,75,0.12)]"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <span className="rounded-full bg-[#EEF4FF] px-4 py-2 text-xs font-black text-[#1554D1]">
                        {course.provider}
                      </span>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-black ${
                          course.priority === "عالية"
                            ? "bg-green-50 text-green-600"
                            : "bg-[#FFF7D8] text-[#9A7600]"
                        }`}
                      >
                        أولوية {course.priority}
                      </span>
                    </div>

                    <h2 className="text-xl font-black">{course.title}</h2>

                    <p className="mt-3 text-sm font-black text-[#1554D1]">
                      تقوية مهارة: {course.skill}
                    </p>

                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6B7AA8]">
                      {course.reason}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-11 items-center rounded-2xl border border-[#DCE6FA] bg-white px-5 text-sm font-black text-[#071D8F] transition hover:bg-[#F5F8FF]"
                      >
                        فتح الدورة ←
                      </a>

                      <button
                        onClick={() => handleCompleteCourse(course)}
                        disabled={completed || savingCourseId === course.id}
                        className={`h-11 rounded-2xl px-5 text-sm font-black shadow-[0_12px_28px_rgba(7,29,143,0.18)] transition ${
                          completed
                            ? "cursor-not-allowed bg-green-50 text-green-600"
                            : "bg-[#071D8F] text-white hover:-translate-y-0.5 hover:bg-[#0A2AAD]"
                        } disabled:opacity-70`}
                      >
                        {completed
                          ? "تم إنهاء الدورة"
                          : savingCourseId === course.id
                            ? "جاري الحفظ..."
                            : "تم إنهاء الدورة ورفع الشهادة"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {analysis.recommendedCourses.length === 0 && (
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-8 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl lg:col-span-2">
                  <h2 className="text-xl font-black">لا توجد دورات جديدة الآن</h2>
                  <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
                    يبدو أنك أنهيت الدورات المقترحة حاليًا. سيتم تحديث التوصيات
                    بعد إضافة بيانات أو خبرات جديدة.
                  </p>
                </div>
              )}
            </div>

            {completions.length > 0 && (
              <div className="relative z-10 mt-6 rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <h2 className="text-xl font-black">الدورات المكتملة</h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {completions.map((course) => (
                    <div
                      key={course.course_id}
                      className="rounded-[24px] border border-[#E3EBFC] bg-[#FBFCFF] p-5"
                    >
                      <h3 className="text-sm font-black">
                        {course.course_title}
                      </h3>
                      <p className="mt-2 text-xs font-semibold text-[#7A89B7]">
                        {course.provider} — {course.skill}
                      </p>

                      {course.certificate_url && (
                        <a
                          href={course.certificate_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex text-xs font-black text-[#0A43D1]"
                        >
                          عرض الشهادة ←
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}