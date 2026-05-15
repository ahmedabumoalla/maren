import { NextResponse } from "next/server";

type Skill = {
  name: string;
  value: number;
};

type Opportunity = {
  id: string;
  title: string;
  company: string;
  type: string;
  match: number;
  hours: string;
  skills: string[];
  description: string;
  tasks: string[];
  outcomes: string[];
  requirements: string[];
  location: string;
  duration: string;
  level: string;
};

function fallbackOpportunities(
  weakSkills: Skill[] = [],
  targetRole = ""
): Opportunity[] {
  const firstSkill = weakSkills[0]?.name || "التواصل المهني";

  return [
    {
      id: "fallback-1",
      title: targetRole || "متدرب تطوير أعمال",
      company: "شركة تقنية سعودية",
      type: "تدريب افتراضي",
      match: 89,
      hours: "120 ساعة",
      skills: [firstSkill, "التواصل", "حل المشكلات"],
      description:
        "تجربة افتراضية تساعد الطالب على تطوير مهاراته العملية وربطها بسوق العمل الحقيقي.",
      tasks: [
        "تحليل بيانات ومهام عملية",
        "إعداد تقارير أسبوعية",
        "المشاركة في اجتماعات العمل",
      ],
      outcomes: [
        "رفع الجاهزية المهنية",
        "اكتساب خبرة عملية",
        "بناء ملف مهني أقوى",
      ],
      requirements: [
        "أساسيات الحاسب",
        "الالتزام الأسبوعي",
        "القدرة على التعلم",
      ],
      location: "عن بعد",
      duration: "6 أسابيع",
      level: "متوسط",
    },
  ];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      profile,
      readinessScore,
      skills = [],
      weakSkills = [],
      mediumSkills = [],
      strongSkills = [],
      careerPaths = [],
      targetRole,
      major,
      currentSkills,
      experienceHours,
    } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        opportunities: fallbackOpportunities(
          weakSkills,
          targetRole || profile?.target_role
        ),
        source: "fallback",
      });
    }

    const prompt = `
أنت نظام ذكاء اصطناعي داخل منصة مرن.

المطلوب:
اقترح فرص عملية وتدريبية وتجارب افتراضية مناسبة جدًا للطالب حسب بياناته الفعلية.
يجب أن تكون الفرص مرتبطة بالمسار المهني والمهارات الحالية ونقاط الضعف.
اجعل النتائج واقعية ومناسبة لسوق العمل السعودي والخليجي.
أعد JSON فقط بدون أي شرح.

بيانات الطالب:

الاسم:
${profile?.full_name || ""}

التخصص:
${major || profile?.major || ""}

المسار المهني:
${targetRole || profile?.target_role || profile?.direction || ""}

الجاهزية:
${readinessScore || 0}%

المهارات:
${JSON.stringify(skills)}

المهارات الضعيفة:
${JSON.stringify(weakSkills)}

المهارات المتوسطة:
${JSON.stringify(mediumSkills)}

المهارات القوية:
${JSON.stringify(strongSkills)}

المسارات المهنية المناسبة:
${JSON.stringify(careerPaths)}

المهارات الحالية:
${JSON.stringify(currentSkills || [])}

ساعات الخبرة:
${experienceHours || 0}

أعد النتيجة بهذا الشكل:

{
  "opportunities": [
    {
      "id": "op-1",
      "title": "اسم الفرصة",
      "company": "اسم الشركة",
      "type": "تدريب افتراضي",
      "match": 92,
      "hours": "120 ساعة",
      "skills": ["مهارة", "مهارة"],
      "description": "وصف احترافي",
      "tasks": ["مهمة", "مهمة"],
      "outcomes": ["نتيجة", "نتيجة"],
      "requirements": ["متطلب", "متطلب"],
      "location": "عن بعد",
      "duration": "6 أسابيع",
      "level": "متوسط"
    }
  ]
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "أنت خبير مهني متخصص في تحليل الطلاب واقتراح فرص وتجارب عملية مناسبة لهم. أعد JSON فقط.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error(await response.text());

      return NextResponse.json({
        opportunities: fallbackOpportunities(
          weakSkills,
          targetRole || profile?.target_role
        ),
        source: "fallback",
      });
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        opportunities: fallbackOpportunities(
          weakSkills,
          targetRole || profile?.target_role
        ),
        source: "fallback",
      });
    }

    const parsed = JSON.parse(content);

    const opportunities = Array.isArray(parsed.opportunities)
      ? parsed.opportunities.map(
          (item: Opportunity, index: number): Opportunity => ({
            id: item.id || `op-${index + 1}`,
            title: item.title || "فرصة مهنية",
            company: item.company || "شركة تقنية",
            type: item.type || "تدريب افتراضي",
            match: Math.min(Math.max(item.match || 75, 50), 99),
            hours: item.hours || "80 ساعة",
            skills: Array.isArray(item.skills) ? item.skills : [],
            description:
              item.description ||
              "فرصة تساعد الطالب على تطوير مهاراته العملية.",
            tasks: Array.isArray(item.tasks) ? item.tasks : [],
            outcomes: Array.isArray(item.outcomes) ? item.outcomes : [],
            requirements: Array.isArray(item.requirements)
              ? item.requirements
              : [],
            location: item.location || "عن بعد",
            duration: item.duration || "4 أسابيع",
            level: item.level || "متوسط",
          })
        )
      : fallbackOpportunities(
          weakSkills,
          targetRole || profile?.target_role
        );

    return NextResponse.json({
      opportunities,
      source: "openai",
    });
  } catch (error) {
    console.error("recommend-opportunities route error:", error);

    return NextResponse.json({
      opportunities: fallbackOpportunities(),
      source: "fallback",
    });
  }
}