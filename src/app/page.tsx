import Link from "next/link";

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-dvh overflow-hidden bg-[#F4F7FF]">
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
        <img
          src="/images/mern-hero-bg.png"
          alt="Mern background"
          className="absolute inset-0 h-full w-full object-fill"
        />

        <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex flex-col items-center">
  <img
    src="/images/mern-logo.png"
    alt="Mern Logo"
    className="mb-4 w-[280px] object-contain md:w-[360px]"
    draggable={false}
  />

  <p className="mt-2 text-base font-black text-[#071D4B] md:text-lg">
    خطواتك اليوم، مستقبلك غدًا
  </p>

  <div className="mt-5 flex items-center justify-center gap-2">
    <span className="h-px w-10 bg-[#C8D6F2]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#F5B700]" />
    <span className="h-px w-10 bg-[#C8D6F2]" />
  </div>
</div>

          <Link
            href="/register"
            className="group inline-flex items-center gap-4 rounded-2xl bg-[#071D63] px-10 py-4 text-base font-black text-white shadow-[0_18px_45px_rgba(7,29,99,0.35)] transition hover:-translate-y-1 hover:bg-[#092879]"
          >
            <span>ابدأ رحلتك</span>
            <span className="text-xl transition group-hover:-translate-x-1">
              ←
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}