# مرن | Mern Platform

منصة ذكية تربط الطلاب بسوق العمل باستخدام الذكاء الاصطناعي عبر تحليل المهارات والاهتمامات والمسارات المهنية وتقديم توصيات ذكية للدورات والفرص المهنية.

---

# فكرة المشروع

مرن هي منصة تعتمد على الذكاء الاصطناعي لمساعدة الطلاب الجامعيين والخريجين في اكتشاف المسارات المهنية المناسبة لهم وتحليل مهاراتهم الحالية وتحديد نقاط القوة والضعف واقتراح دورات وفرص وتجارب عملية تساعدهم على الاستعداد الحقيقي لسوق العمل.

يقوم النظام بتحليل بيانات المستخدم مثل:
- التخصص
- المهارات الحالية
- الاهتمامات المهنية
- الدورات السابقة
- الخبرات
- المسار الوظيفي المستهدف

ثم يستخدم الذكاء الاصطناعي لبناء:
- خريطة مهارات ذكية
- تشخيص الجاهزية المهنية
- اقتراح دورات حقيقية
- اقتراح فرص مهنية مناسبة
- توصيات تطوير شخصية ومهنية

---

# التقنيات المستخدمة

## Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- App Router

## Backend
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

## Artificial Intelligence
- OpenAI GPT-5.5
- OpenAI Responses API
- AI Career Analysis
- AI Skills Mapping
- AI Recommendations Engine

## Other Tools
- Vercel
- GitHub
- npm
- ESLint

---

# مميزات المشروع

- تحليل ذكي لبيانات الطلاب
- بناء خريطة مهارات مخصصة
- اقتراح مسارات مهنية
- اقتراح دورات حقيقية
- اقتراح فرص وتجارب عملية
- مساعد ذكي للإرشاد المهني
- رفع شهادات الدورات
- متابعة جاهزية الطالب لسوق العمل
- واجهات حديثة وتفاعلية
- تصميم عربي RTL كامل
- دعم الذكاء الاصطناعي في جميع التوصيات

---

# طريقة عمل الذكاء الاصطناعي

يقوم النظام بإرسال بيانات الطالب إلى OpenAI API وتحليل:

- مستوى المهارات
- الجاهزية المهنية
- المسارات المناسبة
- نقاط الضعف
- المهارات المطلوبة لسوق العمل

ثم يقوم النظام بتوليد:
- توصيات ذكية
- دورات مناسبة
- فرص تدريب وتجارب عملية
- نصائح مهنية
- تحليل شخصي متكامل

---

# متطلبات التشغيل

قبل تشغيل المشروع تأكد من تثبيت:

- Node.js 20 أو أحدث
- npm
- حساب Supabase
- مفتاح OpenAI API

---

# تحميل المشروع

```bash
git clone https://github.com/USERNAME/mern-platform.git
```

```bash
cd mern-platform
```

---

# تثبيت الحزم

```bash
npm install
```

---

# إنشاء ملف البيئة

أنشئ ملف:

```bash
.env.local
```

وأضف داخله:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

---

# تشغيل المشروع محليًا

```bash
npm run dev
```

بعد التشغيل افتح:

```bash
http://localhost:3000
```

---

# بناء المشروع للإنتاج

```bash
npm run build
```

```bash
npm start
```

---

# هيكلة المشروع

```bash
src/
│
├── app/
│   ├── dashboard/
│   ├── skills/
│   ├── opportunities/
│   ├── courses/
│   ├── settings/
│   ├── ai-assistant/
│   └── api/
│
├── components/
│   ├── dashboard/
│   └── ui/
│
├── lib/
│   ├── ai/
│   └── supabase/
│
└── styles/
```

---

# قواعد البيانات المستخدمة

يستخدم المشروع Supabase ويتضمن:

- Authentication
- PostgreSQL Database
- File Storage
- Row Level Security

الجداول الأساسية:

```bash
user_profiles

course_completions

opportunity_applications

ai_interactions

ai_user_memory
```

---

# شرح الصفحات

## Dashboard
تعرض تحليل الطالب وجاهزيته المهنية وخريطة المهارات والتوصيات.

## Skills
تحليل المهارات الحالية واقتراح دورات مناسبة.

## Opportunities
عرض فرص وتجارب عملية مناسبة للطالب.

## Courses
عرض الدورات المقترحة وربطها بالشهادات.

## AI Assistant
مساعد ذكي يقدم استشارات مهنية للطالب.

## Settings
إدارة بيانات الطالب وتحديث الملف المهني.

---

# أوامر مهمة

تشغيل المشروع:

```bash
npm run dev
```

بناء المشروع:

```bash
npm run build
```

فحص الأخطاء:

```bash
npm run lint
```

---

# رفع المشروع إلى GitHub

تهيئة Git:

```bash
git init
```

ربط المستودع:

```bash
git remote add origin https://github.com/USERNAME/REPOSITORY.git
```

رفع الملفات:

```bash
git add .
```

```bash
git commit -m "Initial Commit"
```

```bash
git push -u origin main
```

---

# نشر المشروع على Vercel

تثبيت Vercel:

```bash
npm install -g vercel
```

تسجيل الدخول:

```bash
vercel login
```

نشر المشروع:

```bash
vercel
```

---

# ملاحظات مهمة

- لا ترفع ملف .env.local إلى GitHub
- تأكد من إضافة مفاتيح البيئة داخل Vercel
- المشروع يعتمد على OpenAI API في التحليل والتوصيات
- تأكد من تفعيل Storage داخل Supabase
- المشروع مبني بالكامل باستخدام App Router

---

# منصة مرن

خطواتك اليوم، مستقبلك غدًا.