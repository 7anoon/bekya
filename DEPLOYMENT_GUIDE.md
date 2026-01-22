# دليل رفع التطبيق على GitHub Pages

## الخطوات:

### 1. إنشاء Repository على GitHub

1. اذهبي لـ [GitHub](https://github.com)
2. اضغطي على "New Repository"
3. اختاري اسم للـ repository (مثلاً: `bekya`)
4. اجعليه Public
5. اضغطي "Create Repository"

### 2. رفع الكود على GitHub

افتحي Terminal في مجلد المشروع ونفذي:

```bash
# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit"

# ربط الـ repository
git remote add origin https://github.com/username/bekya.git

# رفع الكود
git push -u origin main
```

**ملاحظة:** غيري `username` و `bekya` باسم حسابك واسم الـ repository

### 3. إضافة Secrets في GitHub

1. اذهبي لـ repository على GitHub
2. Settings → Secrets and variables → Actions
3. اضغطي "New repository secret"
4. أضيفي:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** رابط Supabase بتاعك
5. كرري الخطوة لـ:
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** مفتاح Supabase

### 4. تفعيل GitHub Pages

1. اذهبي لـ Settings → Pages
2. في "Source" اختاري: **GitHub Actions**
3. احفظي

### 5. تعديل vite.config.js

في ملف `vite.config.js`، غيري السطر:

```javascript
base: '/bekya/', // غيري "bekya" لاسم الـ repository بتاعك
```

### 6. Push التعديلات

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push
```

### 7. انتظري الـ Deployment

1. اذهبي لـ Actions في GitHub
2. هتلاقي workflow شغال
3. لما يخلص، التطبيق هيكون متاح على:
   ```
   https://username.github.io/bekya/
   ```

---

## ⚠️ ملاحظات مهمة:

### GitHub Pages له قيود:
- ❌ مش بيدعم Server-Side Rendering
- ❌ مش بيدعم Environment Variables بشكل آمن
- ❌ الـ routing ممكن يعمل مشاكل

### البدائل الأفضل:

#### 1. Netlify (موصى به ⭐)
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# رفع التطبيق
netlify deploy --prod
```

**المميزات:**
- ✅ Environment Variables آمنة
- ✅ Automatic HTTPS
- ✅ Continuous Deployment
- ✅ Redirects & Rewrites
- ✅ مجاني 100%

#### 2. Vercel (موصى به ⭐)
```bash
# تثبيت Vercel CLI
npm install -g vercel

# رفع التطبيق
vercel --prod
```

**المميزات:**
- ✅ تكامل مثالي مع React
- ✅ Environment Variables
- ✅ Edge Functions
- ✅ مجاني 100%

---

## إعداد Netlify (الطريقة الأسهل)

### من الموقع:

1. اذهبي لـ [Netlify](https://netlify.com)
2. سجلي دخول بحساب GitHub
3. اضغطي "Add new site" → "Import an existing project"
4. اختاري الـ repository
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. أضيفي Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. اضغطي "Deploy"

✅ خلاص! التطبيق هيكون متاح على رابط مثل:
```
https://bekya.netlify.app
```

---

## إعداد Vercel

### من الموقع:

1. اذهبي لـ [Vercel](https://vercel.com)
2. سجلي دخول بحساب GitHub
3. اضغطي "Add New" → "Project"
4. اختاري الـ repository
5. Framework Preset: **Vite**
6. أضيفي Environment Variables
7. اضغطي "Deploy"

✅ التطبيق هيكون متاح على:
```
https://bekya.vercel.app
```

---

## الخلاصة

| المنصة | السهولة | الأمان | المميزات | التوصية |
|--------|---------|--------|-----------|----------|
| **Netlify** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ الأفضل |
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ ممتاز |
| **GitHub Pages** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⚠️ مش موصى به |

**التوصية:** استخدمي Netlify أو Vercel بدلاً من GitHub Pages!
