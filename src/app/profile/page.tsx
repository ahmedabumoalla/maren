import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function ProfilePage() {
  return (
    <main dir="rtl" className="min-h-dvh bg-[#F6F9FF] text-[#071D4B]">
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <section className="min-h-dvh flex-1 lg:mr-[92px]">
          <header className="sticky top-0 z-20 border-b border-[#E7EEFC] bg-white/75 px-5 py-5 backdrop-blur-2xl md:px-8">
            <h1 className="text-2xl font-black">الملف المهني</h1>
            <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
              صفحة عرض بروفايل الطالب وساعات الخبرة والمهارات
            </p>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[8%] top-[4%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/70 blur-3xl" />
              <div className="absolute bottom-[10%] right-[18%] h-[360px] w-[360px] rounded-full bg-[#FFF1B8]/40 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-5 lg:grid-cols-[320px_1fr]">
              <aside className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#F5B700] bg-[#EEF4FF]">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=MernStudent"
                    alt="صورة المستخدم"
                    className="h-full w-full object-cover"
                  />
                </div>

                <h2 className="mt-5 text-xl font-black">طالب مرن</h2>
                <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
                  ملف مهني قيد التطوير
                </p>

                <Link
                  href="/settings"
                  className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-[#071D8F] text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)]"
                >
                  تعديل البيانات
                </Link>
              </aside>

              <div className="space-y-5">
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="text-xl font-black">ملخص الملف</h2>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                      ["الجاهزية المهنية", "72%"],
                      ["ساعات الخبرة", "0"],
                      ["الدورات المكتملة", "0"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-[#F8FAFF] p-5"
                      >
                        <p className="text-sm font-bold text-[#7A89B7]">
                          {label}
                        </p>
                        <h3 className="mt-3 text-3xl font-black">{value}</h3>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="text-xl font-black">قريبًا</h2>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#7A89B7]">
                    سيتم هنا عرض الملف المهني الكامل للطالب بناءً على بياناته وتحليل مرن وساعات الخبرة والدورات المكتملة.
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