import { NextResponse } from "next/server";

type Skill = {
  name: string;
  value: number;
  status?: string;
};

type RecommendedCourse = {
  id: string;
  title: string;
  provider: string;
  skill: string;
  priority: "عالية" | "متوسطة";
  reason: string;
  url: string;
};

function fallbackCourses(weakSkills: Skill[] = []): RecommendedCourse[] {
  const skills = weakSkills.length > 0 ? weakSkills.slice(0, 4) : [
    { name: "تحليل البيانات", value: 45 },
    { name: "التواصل المهني", value: 55 },
    { name: "إدارة المشاريع", value: 50 },
  ];

  return skills.map((skill, index) => ({
    id: `fallback-${index + 1}-${skill.name}`,
    title: `دورة تطوير مهارة ${skill.name}`,
    provider: "Coursera",
    skill: skill.name,
    priority: index < 2 ? "عالية" : "متوسطة",
    reason: `هذه الدورة مقترحة لأن مستوى مهارة ${skill.name} يحتاج إلى تطوير حسب تحليل بياناتك.`,
    url: "https://www.coursera.org/search?query=" + encodeURIComponent(skill.name),
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      profile,
      completions = [],
      weakSkills = [],
      mediumSkills = [],
      careerPaths = [],
      targetRole,
      major,
      currentSkills,
      interests,
      experienceHours,
    } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        courses: fallbackCourses(weakSkills),
        source: "fallback",
      });
    }

    const prompt = `
أنت مستشار مهني ذكي داخل منصة مرن.

المطلوب:
اقترح 6 دورات حقيقية ومناسبة للطالب بناءً على بياناته الفعلية.
يجب أن تكون الدورات مرتبطة بالمهارات الضعيفة أو المتوسطة والمسار المهني المستهدف.
استخدم مزودين معروفين مثل Coursera أو edX أو Google Skillshop أو Microsoft Learn أو Udemy أو LinkedIn Learning أو IBM SkillsBuild.
لا تقترح دورة عامة جدًا.
أعد النتيجة JSON فقط بدون أي شرح خارج JSON.

بيانات الطالب:
الاسم: ${profile?.full_name || "غير محدد"}
التخصص: ${major || profile?.major || "غير محدد"}
المسار المستهدف: ${targetRole || "غير محدد"}
المهارات الحالية: ${JSON.stringify(currentSkills || profile?.skills || [])}
الاهتمامات: ${JSON.stringify(interests || profile?.interests || [])}
ساعات الخبرة: ${experienceHours || 0}
الدورات المكتملة: ${JSON.stringify(completions)}
المهارات الضعيفة: ${JSON.stringify(weakSkills)}
المهارات المتوسطة: ${JSON.stringify(mediumSkills)}
المسارات المهنية المناسبة: ${JSON.stringify(careerPaths)}

صيغة JSON المطلوبة:
{
  "courses": [
    {
      "id": "unique-course-id",
      "title": "اسم الدورة الحقيقي",
      "provider": "اسم الجهة",
      "skill": "المهارة المستهدفة",
      "priority": "عالية أو متوسطة",
      "reason": "سبب مختصر ومخصص للطالب",
      "url": "رابط بحث أو رابط مباشر للدورة"
    }
  ]
}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "أنت مساعد مهني متخصص في اقتراح دورات حقيقية ومناسبة للطلاب بناءً على بياناتهم. أعد JSON صالح فقط.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("OpenAI error:", await response.text());

      return NextResponse.json({
        courses: fallbackCourses(weakSkills),
        source: "fallback",
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        courses: fallbackCourses(weakSkills),
        source: "fallback",
      });
    }

    const parsed = JSON.parse(content);

    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.map((course: RecommendedCourse, index: number) => ({
          id: course.id || `ai-course-${index + 1}`,
          title: course.title,
          provider: course.provider,
          skill: course.skill,
          priority: course.priority === "عالية" ? "عالية" : "متوسطة",
          reason: course.reason,
          url:
            course.url ||
            "https://www.coursera.org/search?query=" +
              encodeURIComponent(course.skill || course.title),
        }))
      : fallbackCourses(weakSkills);

    return NextResponse.json({
      courses,
      source: "openai",
    });
  } catch (error) {
    console.error("recommend-courses route error:", error);

    return NextResponse.json({
      courses: fallbackCourses(),
      source: "fallback",
    });
  }
}