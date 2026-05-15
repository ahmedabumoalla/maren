import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || authHeader === "Bearer undefined") {
      return NextResponse.json(
        { error: "جلسة المستخدم غير موجودة" },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "مفتاح OpenAI غير موجود" },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "تعذر التحقق من المستخدم" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "لم يتم العثور على ملف الطالب" },
        { status: 404 }
      );
    }

    const { data: completions } = await supabase
      .from("course_completions")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    const prompt = `
أنت محلل أكاديمي ومهني داخل منصة مرن

مهمتك تحليل بيانات الطالب الحقيقية فقط
لا تستخدم مهارات ثابتة مثل SQL أو Python إلا إذا كانت مناسبة فعلًا لتخصص الطالب أو مساره
لا تقترح دورات عشوائية
اربط كل مهارة ودورة وتوصية بتخصص الطالب وهدفه وبياناته

بيانات الطالب:
${JSON.stringify(profile)}

الدورات المكتملة:
${JSON.stringify(completions || [])}

أرجع JSON فقط بدون markdown بهذا الشكل:
{
  "readinessScore": 55,
  "diagnosis": "تشخيص مختصر وواضح",
  "nextStep": "خطوة عملية تالية",
  "skills": [
    {
      "name": "اسم المهارة",
      "value": 60,
      "status": "قوية أو متوسطة أو تحتاج تطوير"
    }
  ],
  "weakSkills": [
    {
      "name": "اسم المهارة",
      "value": 45,
      "status": "تحتاج تطوير"
    }
  ],
  "mediumSkills": [
    {
      "name": "اسم المهارة",
      "value": 65,
      "status": "متوسطة"
    }
  ],
  "strongSkills": [
    {
      "name": "اسم المهارة",
      "value": 82,
      "status": "قوية"
    }
  ],
  "recommendations": [
    {
      "title": "عنوان التوصية",
      "desc": "وصف قصير",
      "tag": "أولوية عالية أو مهم أو داعم"
    }
  ],
  "recommendedCourses": [
    {
      "id": "course-unique-id",
      "title": "اسم الدورة",
      "provider": "اسم المصدر",
      "skill": "المهارة المرتبطة",
      "url": "رابط مباشر",
      "priority": "عالية أو متوسطة",
      "reason": "سبب الترشيح"
    }
  ],
  "careerPaths": [
    {
      "title": "اسم المسار المناسب",
      "level": "الأقرب أو مناسب أو داعم",
      "percent": 78,
      "icon": "🎓"
    }
  ],
  "recommendedOpportunities": [
    {
      "id": "opportunity-unique-id",
      "title": "اسم الفرصة",
      "company": "جهة افتراضية مناسبة",
      "type": "تدريب أو مشروع تطبيقي أو تجربة افتراضية",
      "match": 80,
      "hours": "20 ساعة",
      "skills": ["مهارة"],
      "description": "وصف الفرصة",
      "tasks": ["مهمة"],
      "outcomes": ["مخرج"],
      "requirements": ["متطلب"],
      "location": "عن بعد",
      "duration": "أسبوعين",
      "level": "مبتدئ أو متوسط أو متقدم"
    }
  ]
}

الشروط:
- skills من 6 إلى 8 مهارات مناسبة لتخصص الطالب
- recommendations عددها 4 فقط
- recommendedCourses عددها 4 إلى 6 فقط
- الروابط يجب أن تكون مفتوحة ومجانية قدر الإمكان من YouTube أو Coursera Free أو edX Audit أو MIT OCW أو Khan Academy أو مصادر تعليمية مفتوحة
- careerPaths عددها 3 فقط
- recommendedOpportunities عددها 4 فقط
- لا تستخدم بيانات غير موجودة عند الطالب إلا كاستنتاج واضح من التخصص أو الهدف
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = response.output_text || "";
    const jsonText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(jsonText);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("FULL_ANALYSIS_ERROR", error);

    return NextResponse.json(
      {
        error: error?.message || "فشل إنشاء التحليل الذكي",
      },
      {
        status: 500,
      }
    );
  }
}