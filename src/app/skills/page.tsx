"use client";

import Link from "next/link";
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

export default function SkillsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCourseId, setSavingCourseId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSkillsData() {
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

    loadSkillsData();
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
      alert("هذه الدورة محفوظة بالفعل");
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
      alert("تم حفظ الدورة والشهادة بنجاح، وسيتم احتسابها في تقييمك");
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
          <p className="text-lg font-black">جاري تحليل المهارات...</p>
          <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
            يتم بناء خريطة المهارات حسب بياناتك
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
    <main
      dir="rtl"
      className="min-h-dvh overflow-hidden bg-[#F6F9FF] text-[#071D4B]"
    >
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <section className="min-h-dvh flex-1 lg:mr-[92px]">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#E7EEFC] bg-white/75 px-5 backdrop-blur-2xl md:px-8">
            <div>
              <h1 className="text-xl font-black md:text-2xl">
                مهاراتك وتوصيات التطوير
              </h1>
              <p className="mt-1 text-xs font-semibold text-[#7A89B7] md:text-sm">
                تحليل ذكي لمهاراتك مع اقتراح دورات مجانية ومصادر مفتوحة مناسبة لك
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-2xl bg-[#071D8F] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)]"
            >
              العودة للرئيسية
            </Link>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[8%] top-[4%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/60 blur-3xl" />
              <div className="absolute bottom-[10%] right-[18%] h-[360px] w-[360px] rounded-full bg-[#F7E7A8]/20 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-5 xl:grid-cols-[340px_1fr]">
              <aside className="space-y-5">
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/78 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <p className="text-sm font-black text-[#7A89B7]">
                    نتيجة التحليل
                  </p>

                  <div
                    className="mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full p-3"
                    style={{
                      background: `conic-gradient(#1554D1 0 ${analysis.readinessScore}%, #F5B700 ${analysis.readinessScore}% ${Math.min(
                        analysis.readinessScore + 14,
                        100
                      )}%, #E8EFFD ${Math.min(
                        analysis.readinessScore + 14,
                        100
                      )}% 100%)`,
                    }}
                  >
                    <div className="grid h-full w-full place-items-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-4xl font-black">
                          {analysis.readinessScore}%
                        </p>
                        <p className="mt-1 text-xs font-black text-[#7A89B7]">
                          جاهزية المهارات
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F5F8FF] p-4">
                    <p className="text-sm font-black text-[#071D63]">
                      تشخيص الذكاء الاصطناعي
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-[#6B7AA8]">
                      {analysis.diagnosis}
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-[#DCE6FA] bg-white/70 p-4">
                    <p className="text-sm font-black text-[#071D63]">
                      الخطوة التالية
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-[#6B7AA8]">
                      {analysis.nextStep}
                    </p>
                  </div>
                </div>

                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/78 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="text-lg font-black">ملخص الطالب</h2>

                  <div className="mt-5 space-y-3 text-sm font-bold text-[#6B7AA8]">
                    <div className="flex justify-between">
                      <span>الاسم</span>
                      <span className="text-[#071D4B]">
                        {profile.full_name || "غير محدد"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>التخصص</span>
                      <span className="text-[#071D4B]">
                        {profile.major || "غير محدد"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>المسار المستهدف</span>
                      <span className="text-[#071D4B]">
                        {profile.target_role || profile.direction || "غير محدد"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>ساعات الخبرة</span>
                      <span className="text-[#071D4B]">
                        {profile.experience_hours || 0} ساعة
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>الدورات المكتملة</span>
                      <span className="text-[#071D4B]">
                        {completions.length}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>المعدل</span>
                      <span className="text-[#071D4B]">
                        {profile.gpa || "غير محدد"}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="space-y-5">
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/78 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black">خريطة المهارات</h2>
                      <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
                        مستوى كل مهارة بناءً على بيانات الطالب والدورات المكتملة
                      </p>
                    </div>

                    <span className="rounded-full bg-[#EEF4FF] px-4 py-2 text-xs font-black text-[#0A43D1]">
                      AI Skills Scan
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {analysis.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="rounded-[24px] border border-[#E3EBFC] bg-[#FBFCFF] p-5"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-black">{skill.name}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              skill.status === "تحتاج تطوير"
                                ? "bg-orange-50 text-orange-600"
                                : skill.status === "متوسطة"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-600"
                            }`}
                          >
                            {skill.status}
                          </span>
                        </div>

                        <div className="mb-2 flex justify-between text-xs font-black text-[#7A89B7]">
                          <span>المستوى الحالي</span>
                          <span>{skill.value}%</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-[#EEF3FF]">
                          <div
                            className={`h-full rounded-full ${
                              skill.status === "تحتاج تطوير"
                                ? "bg-orange-500"
                                : skill.status === "متوسطة"
                                  ? "bg-[#F5B700]"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/78 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black">
                        دورات مجانية مقترحة لك
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
                        تم اقتراحها بناءً على المهارات الأضعف والمسار المهني المستهدف
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFF7D8] px-4 py-2 text-xs font-black text-[#9A7600]">
                      مصادر مفتوحة
                    </span>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    {analysis.recommendedCourses.map((course) => {
                      const completed = completions.some(
                        (item) => item.course_id === course.id
                      );

                      return (
                        <div
                          key={course.id}
                          className="group rounded-[24px] border border-[#E3EBFC] bg-[#FBFCFF] p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,29,75,0.10)]"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${
                                course.priority === "عالية"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-yellow-50 text-yellow-700"
                              }`}
                            >
                              أولوية {course.priority}
                            </span>

                            <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-black text-[#0A43D1]">
                              {course.provider}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-[#071D4B]">
                            {course.title}
                          </h3>

                          <p className="mt-2 text-sm font-bold text-[#1554D1]">
                            تقوية مهارة: {course.skill}
                          </p>

                          <p className="mt-3 text-sm font-semibold leading-7 text-[#6B7AA8]">
                            {course.reason}
                          </p>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-black text-[#071D8F] transition group-hover:-translate-x-1"
                            >
                              فتح المصدر ←
                            </a>

                            <button
                              onClick={() => handleCompleteCourse(course)}
                              disabled={completed || savingCourseId === course.id}
                              className={`h-10 rounded-xl px-4 text-xs font-black transition ${
                                completed
                                  ? "cursor-not-allowed bg-green-50 text-green-600"
                                  : "bg-[#071D8F] text-white hover:bg-[#0A2AAD]"
                              } disabled:opacity-70`}
                            >
                              {completed
                                ? "تم إنهاء الدورة"
                                : savingCourseId === course.id
                                  ? "جاري الحفظ..."
                                  : "إنهاء ورفع شهادة"}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {analysis.recommendedCourses.length === 0 && (
                      <div className="rounded-[24px] border border-[#E3EBFC] bg-[#FBFCFF] p-6 text-center xl:col-span-2">
                        <h3 className="text-lg font-black">
                          لا توجد دورات جديدة حاليًا
                        </h3>
                        <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
                          يبدو أنك أنهيت الدورات المقترحة أو أن مهاراتك الحالية جيدة.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {completions.length > 0 && (
                  <div className="rounded-[30px] border border-[#DCE6FA] bg-white/78 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
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

                <div className="rounded-[30px] border border-[#DCE6FA] bg-[#071D8F] p-6 text-white shadow-[0_18px_55px_rgba(7,29,143,0.20)]">
                  <h2 className="text-xl font-black">
                    كيف يعمل مودل مرن الذكي؟
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm font-semibold leading-8 text-white/75">
                    يقوم المودل بقراءة بيانات الطالب مثل التخصص، المسار المستهدف،
                    المهارات الحالية، ساعات الخبرة، والدورات المكتملة. بعدها يحدد
                    المهارات الضعيفة والمتوسطة والقوية، ثم يقترح مصادر تعلم مجانية
                    ومفتوحة تساعد الطالب على رفع جاهزيته المهنية خطوة بخطوة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}