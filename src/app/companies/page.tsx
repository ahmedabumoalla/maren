import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function CompaniesPage() {
  return (
    <main dir="rtl" className="min-h-dvh bg-[#F6F9FF] text-[#071D4B]">
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <section className="min-h-dvh flex-1 lg:mr-[92px]">
          <header className="sticky top-0 z-20 border-b border-[#E7EEFC] bg-white/75 px-5 py-5 backdrop-blur-2xl md:px-8">
            <h1 className="text-2xl font-black">الشركات</h1>
            <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
              صفحة الشركات والجهات الشريكة في منصة مرن
            </p>
          </header>

          <div className="relative px-5 py-6 md:px-8">
            <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-8 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
              <h2 className="text-xl font-black">قريبًا</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#7A89B7]">
                سيتم هنا عرض الشركات والجهات التي توفر مساحات عمل افتراضية وفرص مهنية للطلاب.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}