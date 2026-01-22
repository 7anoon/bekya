# رفع التطبيق - خطوات سريعة ⚡

## الطريقة الأسهل: Netlify (موصى بها)

### 1️⃣ ارفعي الكود على GitHub

افتحي Terminal هنا واكتبي:

```bash
git init
git add .
git commit -m "Initial commit"
```

بعدين روحي على [GitHub](https://github.com/new) وأنشئي repository جديد واسميه `bekya`

بعدين ارجعي للـ Terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/bekya.git
git branch -M main
git push -u origin main
```

غيري `YOUR_USERNAME` باسم حسابك على GitHub

---

### 2️⃣ ارفعي على Netlify

1. روحي على [Netlify](https://app.netlify.com)
2. سجلي دخول بحساب GitHub
3. اضغطي **"Add new site"** → **"Import an existing project"**
4. اختاري **GitHub**
5. اختاري repository `bekya`
6. في الإعدادات:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. اضغطي **"Show advanced"** → **"New variable"**
8. أضيفي المتغيرات دي:
   
   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: (انسخيه من ملف `.env`)
   
   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: (انسخيه من ملف `.env`)

9. اضغطي **"Deploy site"**

✅ **خلاص!** بعد 2-3 دقائق التطبيق هيكون جاهز على رابط زي:
```
https://bekya-xyz123.netlify.app
```

---

## البديل: Vercel

نفس الخطوات بس على [Vercel](https://vercel.com):

1. سجلي دخول بحساب GitHub
2. **"Add New"** → **"Project"**
3. اختاري repository `bekya`
4. أضيفي Environment Variables
5. **"Deploy"**

---

## لو عايزة GitHub Pages (مش موصى به)

### الخطوات:

1. **ارفعي الكود على GitHub** (نفس الخطوة 1 فوق)

2. **أضيفي Secrets:**
   - روحي على repository في GitHub
   - **Settings** → **Secrets and variables** → **Actions**
   - اضغطي **"New repository secret"**
   - أضيفي:
     - Name: `VITE_SUPABASE_URL`
     - Value: (من ملف `.env`)
   - كرري للـ `VITE_SUPABASE_ANON_KEY`

3. **فعّلي GitHub Pages:**
   - **Settings** → **Pages**
   - Source: **GitHub Actions**

4. **عدلي vite.config.js:**
   ```javascript
   base: '/bekya/', // اسم الـ repository بتاعك
   ```

5. **ارفعي التعديلات:**
   ```bash
   git add .
   git commit -m "Configure for deployment"
   git push
   ```

6. **انتظري:**
   - روحي على **Actions** في GitHub
   - لما الـ workflow يخلص، التطبيق هيكون على:
   ```
   https://YOUR_USERNAME.github.io/bekya/
   ```

---

## ⚠️ مشاكل محتملة في GitHub Pages:

- الـ routing مش هيشتغل صح (404 errors)
- Environment Variables مش آمنة
- أبطأ من Netlify/Vercel

**التوصية:** استخدمي Netlify! أسهل وأسرع وأأمن 🚀

---

## محتاجة مساعدة؟

لو حصلت أي مشكلة:
1. تأكدي إن ملف `.env` موجود ومش مرفوع على GitHub
2. تأكدي إن الـ Secrets مضافة صح
3. شوفي الـ build logs في Netlify/Vercel/GitHub Actions

---

## الملفات المهمة:

✅ `.env` - **لا ترفعيه على GitHub!**
✅ `.gitignore` - بيمنع رفع `.env`
✅ `vite.config.js` - فيه إعدادات الـ build
✅ `.github/workflows/deploy.yml` - للـ GitHub Pages

---

**ملاحظة:** أنا جهزت كل الملفات، بس محتاجة تنفذي الخطوات بنفسك لأني مش أقدر أوصل لحساب GitHub بتاعك 😊
