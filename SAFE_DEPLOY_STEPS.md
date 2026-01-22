# خطوات الرفع الآمنة ✅

## ⚠️ تحذير أمني مهم:
**لا تشاركي معلومات حسابك مع أي حد أبداً!**

---

## الطريقة الصحيحة والآمنة:

### الخطوة 1: افتحي Terminal هنا

اضغطي كليك يمين في مجلد المشروع → **Open in Terminal** أو **Git Bash Here**

### الخطوة 2: نفذي الأوامر دي:

```bash
# تهيئة Git
git init

# إضافة الملفات
git add .

# عمل Commit
git commit -m "Initial commit"
```

### الخطوة 3: أنشئي Repository على GitHub

1. روحي على [GitHub](https://github.com/new)
2. سجلي دخول بحسابك
3. اسم الـ Repository: `bekya`
4. اجعليه **Public**
5. **لا تضيفي** README أو .gitignore
6. اضغطي **Create repository**

### الخطوة 4: اربطي المشروع بالـ Repository

GitHub هيديكي أوامر، نفذيها في Terminal:

```bash
git remote add origin https://github.com/7anoon987/bekya.git
git branch -M main
git push -u origin main
```

**ملاحظة:** GitHub هيطلب منك تسجيل دخول - استخدمي **Personal Access Token** مش الـ password!

### الخطوة 5: أنشئي Personal Access Token

1. روحي على [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. اضغطي **Generate new token (classic)**
3. اختاري:
   - ✅ repo (كل الصلاحيات)
   - ✅ workflow
4. اضغطي **Generate token**
5. **انسخي الـ Token** (هيظهر مرة واحدة بس!)

### الخطوة 6: استخدمي الـ Token

لما Git يطلب password، استخدمي الـ **Token** مش الـ password!

---

## بعد ما الكود يترفع:

### للرفع على Netlify (الأسهل):

1. روحي على [Netlify](https://app.netlify.com)
2. سجلي دخول بحساب GitHub
3. **Add new site** → **Import an existing project**
4. اختاري repository `bekya`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. أضيفي Environment Variables من ملف `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. اضغطي **Deploy**

✅ خلاص! التطبيق هيكون جاهز في دقائق!

---

## ⚠️ نصائح أمنية مهمة:

1. ❌ **لا تشاركي** password حسابك مع أي حد
2. ✅ استخدمي **Personal Access Token** للـ Git
3. ✅ فعّلي **Two-Factor Authentication** على GitHub
4. ✅ تأكدي إن ملف `.env` **مش مرفوع** على GitHub
5. ✅ غيري password حسابك دلوقتي للأمان!

---

## محتاجة مساعدة؟

لو حصلت أي مشكلة في أي خطوة، قوليلي وأنا هساعدك! 😊
