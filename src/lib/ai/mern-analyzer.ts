export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  major: string | null;
  academic_level: string | null;
  gpa: string | null;
  courses: string | null;
  direction: string | null;
  skills: string | null;
  experience: string | null;
  target_role: string | null;
  experience_hours: number | null;
  readiness_score?: number | null;
};

export type CourseCompletion = {
  id?: string;
  user_id?: string;
  course_id: string;
  course_title: string;
  provider: string | null;
  skill: string | null;
  certificate_url: string | null;
  completed_at?: string;
};

export type SkillResult = {
  name: string;
  value: number;
  status: "قوية" | "متوسطة" | "تحتاج تطوير";
};

export type RecommendedCourse = {
  id: string;
  title: string;
  provider: string;
  skill: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  url: string;
  reason: string;
  priority: "عالية" | "متوسطة" | "منخفضة";
};

export type RecommendedOpportunity = {
  id: string;
  title: string;
  company: string;
  type: string;
  match: number;
  hours: string;
  skills: string[];
  location: string;
  duration: string;
  level: string;
  description: string;
  tasks: string[];
  outcomes: string[];
  requirements: string[];
};

const freeCourses: RecommendedCourse[] = [
  {
    id: "sql-kaggle",
    title: "Intro to SQL",
    provider: "Kaggle Learn",
    skill: "SQL",
    level: "مبتدئ",
    url: "https://www.kaggle.com/learn/intro-to-sql",
    reason: "يقوي أساسيات SQL المطلوبة في تحليل البيانات وبناء التقارير.",
    priority: "عالية",
  },
  {
    id: "sql-w3schools",
    title: "SQL Tutorial",
    provider: "W3Schools",
    skill: "SQL",
    level: "مبتدئ",
    url: "https://www.w3schools.com/sql/",
    reason: "مناسب لبناء أساس سريع في قواعد البيانات والاستعلامات.",
    priority: "عالية",
  },
  {
    id: "python-freecodecamp",
    title: "Scientific Computing with Python",
    provider: "freeCodeCamp",
    skill: "Python",
    level: "مبتدئ",
    url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    reason: "يساعدك على فهم البرمجة والتحليل باستخدام Python.",
    priority: "عالية",
  },
  {
    id: "data-analysis-python",
    title: "Data Analysis with Python",
    provider: "freeCodeCamp",
    skill: "تحليل البيانات",
    level: "متوسط",
    url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
    reason: "ينقلك من الأساسيات إلى تحليل البيانات بشكل تطبيقي.",
    priority: "عالية",
  },
  {
    id: "power-bi-ms",
    title: "Power BI Learning Path",
    provider: "Microsoft Learn",
    skill: "Power BI",
    level: "متوسط",
    url: "https://learn.microsoft.com/training/powerplatform/power-bi/",
    reason: "يقوي بناء لوحات البيانات والتقارير المهنية.",
    priority: "متوسطة",
  },
  {
    id: "excel-ms",
    title: "Excel for Beginners",
    provider: "Microsoft Learn",
    skill: "Excel",
    level: "مبتدئ",
    url: "https://learn.microsoft.com/training/",
    reason: "مهم لتنظيم البيانات وبناء تقارير أولية.",
    priority: "متوسطة",
  },
  {
    id: "communication-doroob",
    title: "مهارات التواصل في بيئة العمل",
    provider: "Doroob",
    skill: "التواصل",
    level: "مبتدئ",
    url: "https://www.doroob.sa/",
    reason: "يساعدك على تحسين التواصل في بيئات العمل الافتراضية والحقيقية.",
    priority: "متوسطة",
  },
  {
    id: "project-management-openlearn",
    title: "Project Management Basics",
    provider: "OpenLearn",
    skill: "إدارة المشاريع",
    level: "مبتدئ",
    url: "https://www.open.edu/openlearn/",
    reason: "يعطيك أساسيات تنظيم المشاريع والمتابعة وإدارة المهام.",
    priority: "متوسطة",
  },
  {
    id: "business-analysis-openlearn",
    title: "Getting Started with Business Analysis",
    provider: "OpenLearn",
    skill: "تحليل الأعمال",
    level: "مبتدئ",
    url: "https://www.open.edu/openlearn/",
    reason: "مناسب لفهم احتياج الأعمال وتحويله إلى قرارات وتوصيات.",
    priority: "متوسطة",
  },
];

const opportunitiesBase: Omit<RecommendedOpportunity, "match">[] = [
  {
    id: "data-analyst-junior",
    title: "محلل بيانات مبتدئ",
    company: "شركة حلول مستقبلية",
    type: "تجربة عمل افتراضية",
    hours: "36 ساعة",
    skills: ["SQL", "Excel", "تحليل البيانات", "Power BI"],
    location: "عن بُعد",
    duration: "3 أسابيع",
    level: "مبتدئ",
    description:
      "تجربة عمل افتراضية تمنحك فرصة التعامل مع بيانات أعمال حقيقية وتنفيذ تقارير تحليلية تساعد الشركة على فهم الأداء واتخاذ قرارات أفضل.",
    tasks: [
      "تنظيف بيانات أولية وتنظيمها في جداول واضحة.",
      "استخدام SQL لاستخراج مؤشرات مهمة من البيانات.",
      "بناء تقرير مختصر يوضح النتائج والتوصيات.",
      "عرض النتائج بطريقة مهنية قابلة للفهم.",
    ],
    outcomes: [
      "إضافة ساعات خبرة إلى ملفك المهني.",
      "تنفيذ مشروع تطبيقي قابل للعرض في البروفايل.",
      "تحسين جاهزيتك لمسار تحليل البيانات.",
    ],
    requirements: [
      "معرفة أولية ببرنامج Excel.",
      "فهم أساسيات قواعد البيانات.",
      "القدرة على قراءة الأرقام وتحويلها إلى استنتاجات.",
    ],
  },
  {
    id: "business-analyst-assistant",
    title: "مساعد تحليل أعمال",
    company: "منصة نمو الأعمال",
    type: "مساحة عمل افتراضية",
    hours: "42 ساعة",
    skills: ["تحليل الأعمال", "التواصل", "التقارير", "Excel"],
    location: "عن بُعد",
    duration: "4 أسابيع",
    level: "مبتدئ إلى متوسط",
    description:
      "مساحة عمل افتراضية تساعدك على ممارسة مهام تحليل الأعمال مثل فهم الاحتياج، إعداد التقارير، وتحويل البيانات إلى توصيات عملية.",
    tasks: [
      "تحليل احتياج مشروع رقمي.",
      "إعداد تقرير مبسط عن المشكلة والفرصة.",
      "تنظيم المتطلبات في جدول واضح.",
      "اقتراح تحسينات قابلة للتنفيذ.",
    ],
    outcomes: [
      "اكتساب خبرة عملية في تحليل الأعمال.",
      "تطوير مهارات التقارير والتواصل.",
      "رفع جاهزيتك لمسارات الأعمال والاستشارات.",
    ],
    requirements: [
      "مهارة تواصل جيدة.",
      "قدرة على التحليل وكتابة الملاحظات.",
      "اهتمام بالأعمال وحل المشكلات.",
    ],
  },
  {
    id: "project-coordinator",
    title: "منسق مشاريع افتراضي",
    company: "مركز التحول الرقمي",
    type: "تجربة مهنية",
    hours: "40 ساعة",
    skills: ["إدارة المشاريع", "إدارة الوقت", "التواصل"],
    location: "عن بُعد",
    duration: "4 أسابيع",
    level: "مبتدئ",
    description:
      "تجربة تساعدك على ممارسة تنسيق المشاريع اليومية مثل متابعة المهام، تحديث الحالة، وتنظيم الاجتماعات والتقارير.",
    tasks: [
      "تجهيز خطة أسبوعية للمهام.",
      "متابعة تقدم الفريق وتحديث حالة المهام.",
      "إعداد تقرير إنجاز أسبوعي مختصر.",
      "اقتراح تحسينات على سير العمل.",
    ],
    outcomes: [
      "اكتساب خبرة في بيئة مشاريع حقيقية.",
      "تطوير مهارات التنظيم والمتابعة.",
      "رفع جاهزيتك لمسارات إدارة المشاريع والعمليات.",
    ],
    requirements: [
      "قدرة على تنظيم الوقت.",
      "اهتمام بالعمل الجماعي.",
      "مهارة متابعة وكتابة تقارير.",
    ],
  },
  {
    id: "product-assistant",
    title: "مساعد تطوير منتجات",
    company: "شركة تقنية ناشئة",
    type: "مشروع تطبيقي",
    hours: "32 ساعة",
    skills: ["تطوير المنتجات", "تحليل السوق", "التواصل"],
    location: "هجين",
    duration: "3 أسابيع",
    level: "متوسط",
    description:
      "مشروع تطبيقي يركز على فهم احتياج المستخدم، تحليل السوق، والمساهمة في تحسين منتج رقمي.",
    tasks: [
      "تحليل مبسط للسوق والمنافسين.",
      "كتابة ملاحظات عن تجربة المستخدم.",
      "اقتراح تحسينات على المنتج.",
      "إعداد عرض مختصر للتوصيات.",
    ],
    outcomes: [
      "اكتساب خبرة في تطوير المنتجات.",
      "بناء نموذج تحليل سوق قابل للعرض.",
      "رفع جاهزيتك لمسارات المنتج والأعمال.",
    ],
    requirements: [
      "اهتمام بالمنتجات الرقمية.",
      "قدرة على البحث والتحليل.",
      "مهارة عرض وكتابة جيدة.",
    ],
  },
];

function normalizeText(...values: Array<string | null | undefined>) {
  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word.toLowerCase()));
}

function getSkillStatus(value: number): SkillResult["status"] {
  if (value >= 80) return "قوية";
  if (value >= 65) return "متوسطة";
  return "تحتاج تطوير";
}

function clampScore(value: number) {
  return Math.max(35, Math.min(100, Math.round(value)));
}

export function analyzeMernProfile(
  profile: UserProfile,
  completions: CourseCompletion[] = []
) {
  const text = normalizeText(
    profile.major,
    profile.academic_level,
    profile.gpa,
    profile.courses,
    profile.direction,
    profile.skills,
    profile.experience,
    profile.target_role
  );

  const completedSkills = completions
    .map((item) => item.skill || "")
    .filter(Boolean);

  const completedCourseBoost = Math.min(completions.length * 4, 16);
  const experienceBoost = Math.min(profile.experience_hours || 0, 120) / 8;

  const skills: SkillResult[] = [
    {
      name: "SQL",
      value: clampScore(
        (includesAny(text, ["sql", "قواعد البيانات", "database"]) ? 68 : 42) +
          completedCourseBoost +
          experienceBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "Python",
      value: clampScore(
        (includesAny(text, ["python", "بايثون", "برمجة"]) ? 66 : 48) +
          completedCourseBoost +
          experienceBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "Power BI",
      value: clampScore(
        (includesAny(text, ["power bi", "باور", "لوحات", "dashboard"])
          ? 70
          : 50) +
          completedCourseBoost +
          experienceBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "تحليل البيانات",
      value: clampScore(
        (includesAny(text, ["تحليل البيانات", "data", "بيانات", "تحليل"])
          ? 78
          : 55) +
          completedCourseBoost +
          experienceBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "تحليل الأعمال",
      value: clampScore(
        (includesAny(text, ["تحليل الأعمال", "business", "أعمال", "تقارير"])
          ? 75
          : 58) +
          completedCourseBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "التواصل",
      value: clampScore(
        (includesAny(text, ["تواصل", "عرض", "presentation", "إلقاء"])
          ? 78
          : 62) + completedCourseBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "إدارة الوقت",
      value: clampScore(
        (includesAny(text, ["إدارة الوقت", "تنظيم", "مهام"]) ? 80 : 64) +
          completedCourseBoost
      ),
      status: "تحتاج تطوير",
    },
    {
      name: "إدارة المشاريع",
      value: clampScore(
        (includesAny(text, ["مشاريع", "project", "pmp", "إدارة"]) ? 76 : 58) +
          completedCourseBoost
      ),
      status: "تحتاج تطوير",
    },
  ].map((skill) => {
    const certificateBoost = completedSkills.some((completedSkill) =>
      completedSkill.includes(skill.name)
    )
      ? 10
      : 0;

    const finalValue = clampScore(skill.value + certificateBoost);

    return {
      ...skill,
      value: finalValue,
      status: getSkillStatus(finalValue),
    };
  });

  const weakSkills = skills
    .filter((skill) => skill.value < 65)
    .sort((a, b) => a.value - b.value);

  const mediumSkills = skills
    .filter((skill) => skill.value >= 65 && skill.value < 80)
    .sort((a, b) => a.value - b.value);

  const strongSkills = skills
    .filter((skill) => skill.value >= 80)
    .sort((a, b) => b.value - a.value);

  const readinessScore = clampScore(
    skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length
  );

  const careerPaths = [
    {
      title: "تحليل البيانات",
      percent: clampScore(
        (includesAny(text, ["تحليل", "بيانات", "data", "sql", "excel"])
          ? 90
          : 72) +
          completedCourseBoost / 2
      ),
      level: "مناسب جدًا",
      icon: "▥",
    },
    {
      title: "تحليل الأعمال",
      percent: clampScore(
        (includesAny(text, ["أعمال", "business", "تقارير", "تواصل"])
          ? 84
          : 70) +
          completedCourseBoost / 2
      ),
      level: "مناسب",
      icon: "⬡",
    },
    {
      title: "إدارة المشاريع",
      percent: clampScore(
        (includesAny(text, ["مشاريع", "تنظيم", "إدارة الوقت", "project"])
          ? 82
          : 68) +
          completedCourseBoost / 3
      ),
      level: "قابل للتطوير",
      icon: "✧",
    },
  ].sort((a, b) => b.percent - a.percent);

  const recommendedCourses = freeCourses
    .filter((course) => {
      const needsSkill = weakSkills.some((skill) => skill.name === course.skill);
      const pathNeed =
        careerPaths[0]?.title === "تحليل البيانات" &&
        ["SQL", "Python", "Power BI", "تحليل البيانات", "Excel"].includes(
          course.skill
        );

      const notCompleted = !completions.some(
        (completion) => completion.course_id === course.id
      );

      return (needsSkill || pathNeed) && notCompleted;
    })
    .slice(0, 6);

  const recommendedOpportunities = opportunitiesBase
    .map((opportunity) => {
      const matchCount = opportunity.skills.filter((skill) =>
        skills.some(
          (userSkill) => userSkill.name === skill && userSkill.value >= 55
        )
      ).length;

      const match = clampScore(
        58 +
          (matchCount / opportunity.skills.length) * 34 +
          completedCourseBoost / 3
      );

      return {
        ...opportunity,
        match,
      };
    })
    .sort((a, b) => b.match - a.match);

  const diagnosis =
    readinessScore >= 80
      ? "جاهزيتك المهنية قوية، ركّز الآن على بناء مشاريع تطبيقية والتقديم على فرص أعلى."
      : readinessScore >= 65
        ? "جاهزيتك المهنية متوسطة، تحتاج إلى تطوير بعض المهارات وربطها بتجارب عملية."
        : "جاهزيتك تحتاج خطة تأسيس واضحة تبدأ من المهارات الأساسية ثم تطبيق عملي بسيط.";

  const nextStep = weakSkills[0]
    ? `ابدأ بتطوير مهارة ${weakSkills[0].name} لأنها الأقل في تقييمك الحالي.`
    : `ابدأ بفرصة عملية في مسار ${careerPaths[0]?.title || "مهني مناسب"} لرفع خبرتك.`;

  const recommendations = [
    weakSkills[0]
      ? {
          title: `طوّر مهارة ${weakSkills[0].name}`,
          desc: `هذه المهارة هي الأقل حاليًا في تحليلك، ورفعها سيحسن جاهزيتك المهنية.`,
          tag: "أولوية عالية",
        }
      : {
          title: "ابدأ بمشروع تطبيقي",
          desc: "مستوى مهاراتك جيد، والخطوة الأفضل الآن هي بناء مشروع قابل للعرض.",
          tag: "أولوية عالية",
        },
    {
      title: "ارفع شهادات الدورات المكتملة",
      desc: "الشهادات المكتملة ترفع تقييمك داخل مرن وتدعم ملفك أمام الشركات.",
      tag: "تطوير مهم",
    },
    {
      title: `ركّز على مسار ${careerPaths[0]?.title}`,
      desc: `هذا المسار هو الأعلى توافقًا مع بياناتك الحالية بنسبة ${careerPaths[0]?.percent}%.`,
      tag: "توصية ذكية",
    },
    {
      title: "اختر فرصة عملية واحدة هذا الأسبوع",
      desc: "التجارب العملية تزيد ساعات الخبرة وتساعدك في بناء ملف مهني أقوى.",
      tag: "تطبيق عملي",
    },
  ];

  return {
    readinessScore,
    diagnosis,
    nextStep,
    skills,
    weakSkills,
    mediumSkills,
    strongSkills,
    careerPaths,
    recommendedCourses,
    recommendedOpportunities,
    recommendations,
  };
}