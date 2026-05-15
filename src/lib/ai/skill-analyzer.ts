export type UserSkill = {
  name: string;
  level: number;
};

export type UserProfileForAnalysis = {
  major: string;
  targetRole: string;
  skills: UserSkill[];
  interests: string[];
  gpa?: number;
  experienceHours?: number;
};

export type RecommendedCourse = {
  title: string;
  provider: string;
  url: string;
  skill: string;
  reason: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  priority: "عالية" | "متوسطة" | "منخفضة";
};

const openFreeCourses: RecommendedCourse[] = [
  {
    title: "SQL Tutorial",
    provider: "W3Schools",
    url: "https://www.w3schools.com/sql/",
    skill: "SQL",
    reason: "يقوي أساسيات قواعد البيانات والاستعلامات المطلوبة في تحليل البيانات.",
    level: "مبتدئ",
    priority: "عالية",
  },
  {
    title: "Intro to SQL",
    provider: "Kaggle Learn",
    url: "https://www.kaggle.com/learn/intro-to-sql",
    skill: "SQL",
    reason: "مناسب للتطبيق العملي على البيانات ورفع الجاهزية لمسار تحليل البيانات.",
    level: "مبتدئ",
    priority: "عالية",
  },
  {
    title: "Python for Everybody",
    provider: "freeCodeCamp",
    url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    skill: "Python",
    reason: "يساعدك على بناء أساس برمجي قوي للتحليل والأتمتة.",
    level: "مبتدئ",
    priority: "عالية",
  },
  {
    title: "Data Analysis with Python",
    provider: "freeCodeCamp",
    url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
    skill: "تحليل البيانات",
    reason: "يربط مهارات Python بالتعامل مع البيانات وتحليلها.",
    level: "متوسط",
    priority: "عالية",
  },
  {
    title: "Power BI Learning",
    provider: "Microsoft Learn",
    url: "https://learn.microsoft.com/training/powerplatform/power-bi",
    skill: "Power BI",
    reason: "يقوي مهارة عرض البيانات وبناء لوحات متابعة احترافية.",
    level: "متوسط",
    priority: "متوسطة",
  },
  {
    title: "Google Data Analytics Resources",
    provider: "Google Skillshop",
    url: "https://skillshop.exceedlms.com/student/catalog",
    skill: "تحليل البيانات",
    reason: "مصدر مناسب لفهم التفكير التحليلي وربط البيانات بالقرار.",
    level: "مبتدئ",
    priority: "متوسطة",
  },
  {
    title: "Excel for Data Analysis",
    provider: "Microsoft Learn",
    url: "https://learn.microsoft.com/training/",
    skill: "Excel",
    reason: "مفيد للطلاب في تنظيم البيانات وبناء تقارير أولية.",
    level: "مبتدئ",
    priority: "متوسطة",
  },
  {
    title: "Communication Skills",
    provider: "Doroob",
    url: "https://www.doroob.sa/",
    skill: "التواصل",
    reason: "يقوي مهارات التواصل المطلوبة في بيئات العمل الافتراضية والحقيقية.",
    level: "مبتدئ",
    priority: "متوسطة",
  },
  {
    title: "Project Management Basics",
    provider: "OpenLearn",
    url: "https://www.open.edu/openlearn/",
    skill: "إدارة المشاريع",
    reason: "يساعدك على فهم تنظيم المهام والتخطيط والمتابعة.",
    level: "مبتدئ",
    priority: "متوسطة",
  },
];

export function analyzeUserSkills(profile: UserProfileForAnalysis) {
  const weakSkills = profile.skills
    .filter((skill) => skill.level < 65)
    .sort((a, b) => a.level - b.level);

  const mediumSkills = profile.skills
    .filter((skill) => skill.level >= 65 && skill.level < 80)
    .sort((a, b) => a.level - b.level);

  const strongSkills = profile.skills.filter((skill) => skill.level >= 80);

  const recommendedCourses = openFreeCourses
    .filter((course) => {
      const weakMatch = weakSkills.some((skill) =>
        course.skill.includes(skill.name) || skill.name.includes(course.skill)
      );

      const targetRoleMatch =
        profile.targetRole.includes("تحليل") &&
        ["SQL", "Python", "Power BI", "تحليل البيانات", "Excel"].includes(
          course.skill
        );

      return weakMatch || targetRoleMatch;
    })
    .slice(0, 6);

  const readinessScore = Math.round(
    profile.skills.reduce((sum, skill) => sum + skill.level, 0) /
      profile.skills.length
  );

  const diagnosis =
    readinessScore >= 80
      ? "جاهز بشكل جيد، تحتاج فقط إلى بناء مشاريع تطبيقية ورفع قوة ملفك المهني."
      : readinessScore >= 65
        ? "جاهزيتك متوسطة، تحتاج إلى تقوية بعض المهارات الأساسية قبل التقديم على فرص متقدمة."
        : "تحتاج إلى خطة تطوير واضحة تبدأ من المهارات الأساسية ثم التطبيق العملي.";

  const nextStep =
    weakSkills.length > 0
      ? `ابدأ بتطوير مهارة ${weakSkills[0].name} لأنها الأقل في تقييمك الحالي.`
      : "ابدأ ببناء مشروع تطبيقي يعرض مهاراتك الحالية للشركات.";

  return {
    readinessScore,
    diagnosis,
    nextStep,
    weakSkills,
    mediumSkills,
    strongSkills,
    recommendedCourses,
  };
}