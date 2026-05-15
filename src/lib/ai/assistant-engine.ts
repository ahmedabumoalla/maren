import { analyzeMernProfile, type UserProfile } from "./mern-analyzer";

export function generateCareerAssistantReply(
  message: string,
  profile: UserProfile,
  completions: any[] = []
) {
  const analysis = analyzeMernProfile(profile, completions);
  const text = message.toLowerCase();

  const isCareerRelated =
    text.includes("مهارة") ||
    text.includes("دورة") ||
    text.includes("وظيفة") ||
    text.includes("فرصة") ||
    text.includes("مسار") ||
    text.includes("تخصص") ||
    text.includes("خبرة") ||
    text.includes("مقابلة") ||
    text.includes("سيرة") ||
    text.includes("cv") ||
    text.includes("عمل");

  if (!isCareerRelated) {
    return "أنا مساعد مرن المهني، أقدر أساعدك في المسار المهني، المهارات، الدورات، الفرص، ترتيب وقتك بين الدراسة والتجربة العملية، وتجهيزك لسوق العمل.";
  }

  if (text.includes("دورة") || text.includes("تعلم")) {
    const courses = analysis.recommendedCourses
      .slice(0, 3)
      .map((course) => `- ${course.title} من ${course.provider} لتطوير ${course.skill}`)
      .join("\n");

    return `بناءً على ملفك الحالي، أنصحك بهذه الدورات:\n${courses}\n\nابدأ بالأولى لأنها مرتبطة بأضعف مهارة ظاهرة في تحليلك.`;
  }

  if (text.includes("فرصة") || text.includes("وظيفة")) {
    const opportunities = analysis.recommendedOpportunities
      .slice(0, 3)
      .map((opportunity) => `- ${opportunity.title} لدى ${opportunity.company} بنسبة توافق ${opportunity.match}%`)
      .join("\n");

    return `أفضل الفرص المناسبة لك حاليًا:\n${opportunities}\n\nأنصحك تبدأ بالفرصة الأعلى توافقًا لأنها سترفع ساعات الخبرة وتدعم ملفك المهني.`;
  }

  if (text.includes("مهارة") || text.includes("ضعف")) {
    const weakSkills = analysis.weakSkills
      .slice(0, 3)
      .map((skill) => `- ${skill.name}: مستواك الحالي ${skill.value}%`)
      .join("\n");

    return `المهارات التي تحتاج تطوير حسب تحليلك:\n${weakSkills}\n\nابدأ بالأولى، ثم طبّق عليها مشروع بسيط حتى تظهر في ملفك المهني.`;
  }

  return `تحليلك الحالي يوضح أن جاهزيتك المهنية ${analysis.readinessScore}%. أقرب مسار لك هو ${analysis.careerPaths[0].title} بنسبة توافق ${analysis.careerPaths[0].percent}%. أنصحك بالتركيز على ${analysis.weakSkills[0]?.name || "مشروع تطبيقي"} خلال الفترة القادمة.`;
}