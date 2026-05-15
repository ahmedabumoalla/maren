"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
        return;
      }

      setCheckingSession(false);
    }

    checkSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    setSuccess("تم تسجيل الدخول بنجاح");

    router.refresh();

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);

    setLoading(false);
  }

  async function handleResetPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("اكتب بريدك الإلكتروني أولًا لإرسال رابط استعادة كلمة المرور");
      return;
    }

    setResetLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
      }
    );

    if (resetError) {
      setError("تعذر إرسال رابط استعادة كلمة المرور، تأكد من البريد الإلكتروني");
      setResetLoading(false);
      return;
    }

    setSuccess("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني");
    setResetLoading(false);
  }

  if (checkingSession) {
    return (
      <main
        dir="rtl"
        className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#F4F7FF] px-5 py-8 text-[#071D4B]"
      >
        <img
          src="/images/mern-hero-bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
        />
        <div className="absolute inset-0 bg-white/25" />

        <div className="relative z-10 rounded-[30px] border border-white/70 bg-white/70 px-8 py-6 text-center shadow-[0_30px_90px_rgba(7,29,75,0.16)] backdrop-blur-2xl">
          <p className="text-lg font-black">جاري التحقق من الجلسة...</p>
          <p className="mt-2 text-sm font-semibold text-[#6B7AA8]">
            لحظات ويتم توجيهك تلقائيًا
          </p>
        </div>
      </main>
    );
  }

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
        <div className="w-full max-w-xl rounded-[36px] border border-white/70 bg-white/58 px-7 py-9 shadow-[0_30px_90px_rgba(7,29,75,0.16)] backdrop-blur-2xl md:px-10">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#DCE6FA] bg-white/70 shadow-[0_12px_35px_rgba(7,29,75,0.12)]"
            >
              <span className="text-2xl font-black text-[#071D8F]">م</span>
            </Link>

            <h1 className="text-3xl font-black md:text-4xl">تسجيل الدخول</h1>

            <p className="mt-3 text-base font-medium text-[#6B7AA8]">
              أكمل رحلتك المهنية من حيث توقفت
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-[#D7E1F5]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1554D1]" />
              <span className="h-px w-9 bg-[#D7E1F5]" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-13 w-full rounded-xl border border-[#D7E1F5] bg-white/75 px-4 text-sm font-semibold text-[#071D4B] shadow-[inset_0_1px_8px_rgba(7,29,75,0.03)] outline-none transition placeholder:text-[#A8B5D6] focus:border-[#1B4FD8] focus:bg-white focus:ring-4 focus:ring-[#1B4FD8]/10"
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
                className="h-13 w-full rounded-xl border border-[#D7E1F5] bg-white/75 px-4 text-sm font-semibold text-[#071D4B] shadow-[inset_0_1px_8px_rgba(7,29,75,0.03)] outline-none transition placeholder:text-[#A8B5D6] focus:border-[#1B4FD8] focus:bg-white focus:ring-4 focus:ring-[#1B4FD8]/10"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 font-semibold text-[#6575A6]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#D7E1F5] accent-[#071D8F]"
                />
                تذكرني
              </label>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="font-black text-[#0A43D1] transition hover:text-[#071D8F] disabled:opacity-60"
              >
                {resetLoading ? "جاري الإرسال..." : "نسيت كلمة المرور؟"}
              </button>
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
                className="mx-auto h-14 w-full rounded-2xl bg-[#071D8F] px-10 text-base font-black text-white shadow-[0_18px_42px_rgba(7,29,143,0.35)] transition hover:-translate-y-1 hover:bg-[#0A2AAD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>

              <p className="mt-5 text-sm font-semibold text-[#6575A6]">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="font-black text-[#0A43D1]">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}