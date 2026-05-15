"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/lib/supabase/client";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AiAssistantPage() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "أهلًا بك 👋 أنا مساعد مرن الذكي. اسألني عن مسارك المهني، مهاراتك، الدورات المناسبة لك، الفرص، أو كيف ترتب وقتك بين الدراسة والعمل الافتراضي.",
    },
  ]);

  useEffect(() => {
    async function checkUserSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCheckingSession(false);
    }

    checkUserSession();
  }, [router]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || sending) return;

    const userMessage: Message = {
      role: "user",
      text: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: trimmedInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "حدث خطأ أثناء تشغيل المساعد");
      }

      const assistantMessage: Message = {
        role: "assistant",
        text:
          data.reply ||
          "أقدر أساعدك، لكن احتاج منك توضح سؤالك أكثر حتى أعطيك توجيه مناسب.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "صار خطأ بسيط أثناء تشغيل المساعد. تأكد من إعداد مفتاح OpenAI ثم جرّب مرة ثانية.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function useSuggestedQuestion(question: string) {
    setInput(question);
  }

  if (checkingSession) {
    return (
      <main
        dir="rtl"
        className="grid min-h-dvh place-items-center bg-[#F6F9FF] text-[#071D4B]"
      >
        <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 px-8 py-6 text-center shadow-[0_18px_55px_rgba(7,29,75,0.07)]">
          <p className="text-lg font-black">جاري تجهيز المساعد الذكي...</p>
          <p className="mt-2 text-sm font-semibold text-[#7A89B7]">
            يتم التحقق من جلسة المستخدم
          </p>
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
            <h1 className="text-2xl font-black">المساعد الذكي</h1>
            <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
              مساعد مهني يقرأ بياناتك داخل مرن ويعطيك توجيه مخصص
            </p>
          </header>

          <div className="relative flex min-h-[calc(100dvh-81px)] flex-col px-5 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[12%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#DDE8FF]/70 blur-3xl" />
              <div className="absolute bottom-[8%] right-[20%] h-[360px] w-[360px] rounded-full bg-[#FFF1B8]/40 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 gap-5 xl:grid-cols-[1fr_300px]">
              <div className="flex min-h-[620px] flex-col rounded-[34px] border border-[#DCE6FA] bg-white/78 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                <div className="border-b border-[#E7EEFC] p-5">
                  <h2 className="text-lg font-black">جلسة إرشاد مهنية</h2>
                  <p className="mt-1 text-sm font-semibold text-[#7A89B7]">
                    اسأل بشكل طبيعي، والمساعد بيرد عليك حسب بياناتك وتحليلك
                  </p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[82%] whitespace-pre-line rounded-[24px] px-5 py-4 text-sm font-semibold leading-7 ${
                          message.role === "user"
                            ? "bg-[#071D8F] text-white"
                            : "bg-[#F5F8FF] text-[#071D4B] ring-1 ring-[#E3EBFC]"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {sending && (
                    <div className="flex justify-end">
                      <div className="rounded-[24px] bg-[#F5F8FF] px-5 py-4 text-sm font-bold text-[#7A89B7] ring-1 ring-[#E3EBFC]">
                        مساعد مرن يكتب الآن...
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex gap-3 border-t border-[#E7EEFC] p-5"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="مثال: وش أفضل مسار مهني مناسب لي؟"
                    className="h-14 flex-1 rounded-2xl border border-[#D7E1F5] bg-white px-5 text-sm font-semibold text-[#071D4B] outline-none placeholder:text-[#A8B5D6] focus:border-[#1554D1] focus:ring-4 focus:ring-[#1554D1]/10"
                  />

                  <button
                    disabled={sending || !input.trim()}
                    className="h-14 rounded-2xl bg-[#071D8F] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,29,143,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0A2AAD] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? "..." : "إرسال"}
                  </button>
                </form>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[30px] border border-[#DCE6FA] bg-white/80 p-6 shadow-[0_18px_55px_rgba(7,29,75,0.07)] backdrop-blur-2xl">
                  <h2 className="text-lg font-black">جرّب تسأله</h2>

                  <div className="mt-4 space-y-3">
                    {[
                      "السلام عليكم",
                      "وش أفضل مسار مهني مناسب لي؟",
                      "ما المهارات التي أحتاج أطورها؟",
                      "اقترح لي دورات مجانية مناسبة",
                      "كيف أرتب وقتي بين الدراسة والعمل الافتراضي؟",
                      "ساعدني أجهز نفسي لأول فرصة مهنية",
                    ].map((question) => (
                      <button
                        key={question}
                        onClick={() => useSuggestedQuestion(question)}
                        className="w-full rounded-2xl bg-[#F8FAFF] px-4 py-3 text-right text-xs font-bold text-[#071D4B] ring-1 ring-[#E7EEFC] transition hover:bg-[#EEF4FF]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] bg-[#071D8F] p-6 text-white shadow-[0_18px_55px_rgba(7,29,143,0.22)]">
                  <h2 className="text-lg font-black">نطاق المساعد</h2>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
                    مساعد مرن مخصص للإرشاد المهني فقط: المسارات، المهارات،
                    الدورات، الفرص، تنظيم الوقت، السيرة الذاتية، والمقابلات.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}