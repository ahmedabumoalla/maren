import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { analyzeMernProfile } from "@/lib/ai/mern-analyzer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "الرسالة غير صالحة" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "لم يتم العثور على جلسة المستخدم" },
        { status: 401 }
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
        { error: "لم يتم العثور على جلسة المستخدم" },
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
      .eq("user_id", user.id);

    const { data: memory } = await supabase
      .from("ai_user_memory")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const analysis = analyzeMernProfile(profile, completions || []);

    const systemPrompt = `
أنت مساعد مرن الذكي، مساعد إرشاد مهني للطلبة الجامعيين فقط.

مهمتك:
- الرد بشكل طبيعي وذكي على المستخدم.
- لو قال السلام عليكم أو مرحبا، رد بتحية طبيعية واسأله كيف تساعده في مساره المهني.
- لا تكرر تعريفك في كل مرة.
- اعتمد على بيانات الطالب والتحليل الموجودين في السياق.
- ساعده في: المسار المهني، المهارات، الدورات، الفرص، تنظيم الوقت، الخبرة، السيرة الذاتية، المقابلات، العمل الافتراضي.
- إذا سأل سؤال خارج الإرشاد المهني، اعتذر بلطف وارجعه لمجال مرن.
- لا تخترع بيانات غير موجودة.
- قدم إجابة مختصرة وواضحة وعملية.
- إذا احتاج خطة، اعطه خطوات مرتبة.
- لا تستخدم تنسيق معقد.
`.trim();

    const context = {
      studentProfile: {
        fullName: profile.full_name,
        major: profile.major,
        academicLevel: profile.academic_level,
        gpa: profile.gpa,
        courses: profile.courses,
        direction: profile.direction,
        skills: profile.skills,
        experience: profile.experience,
        targetRole: profile.target_role,
        experienceHours: profile.experience_hours,
      },
      analysis: {
        readinessScore: analysis.readinessScore,
        diagnosis: analysis.diagnosis,
        nextStep: analysis.nextStep,
        weakSkills: analysis.weakSkills,
        mediumSkills: analysis.mediumSkills,
        strongSkills: analysis.strongSkills,
        careerPaths: analysis.careerPaths,
        recommendedCourses: analysis.recommendedCourses,
        recommendedOpportunities: analysis.recommendedOpportunities,
        recommendations: analysis.recommendations,
      },
      memory: memory || null,
    };

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions: systemPrompt,
      input: [
        {
          role: "user",
          content: `
هذه بيانات وتحليل الطالب داخل منصة مرن:
${JSON.stringify(context, null, 2)}

رسالة الطالب:
${message}

اكتب الرد بالعربية وبأسلوب مهني طبيعي.
`.trim(),
        },
      ],
    });

    const reply =
      response.output_text ||
      "أقدر أساعدك في مسارك المهني، لكن احتاج توضح سؤالك أكثر.";

    await supabase.from("ai_interactions").insert({
      user_id: user.id,
      user_message: message,
      assistant_reply: reply,
    });

    await supabase.from("ai_user_memory").upsert(
      {
        user_id: user.id,
        preferred_path: analysis.careerPaths[0]?.title || null,
        weak_skills: analysis.weakSkills.map((skill) => skill.name),
        interests: [
          profile.direction || "",
          profile.major || "",
          profile.target_role || "",
        ].filter(Boolean),
        notes: `آخر سؤال من المستخدم: ${message}`,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء تشغيل المساعد الذكي" },
      { status: 500 }
    );
  }
}