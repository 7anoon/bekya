# حل المشاكل الشائعة - بيكيا

## مشكلة: "خطأ في إضافة المنتج"

### الأسباب المحتملة:

#### 1. قاعدة البيانات غير محدثة
**الأعراض:** رسالة خطأ عند الضغط على "موافق"

**الحل:**
1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. شغل الملف `migration-add-pricing-fields.sql`
4. تأكد من ظهور رسالة نجاح

#### 2. Storage Bucket غير موجود
**الأعراض:** خطأ "Bucket not found" في Console

**الحل:**
1. اذهب إلى Storage في Supabase
2. أنشئ bucket جديد اسمه `products`
3. اجعله Public
4. أضف الـ Policies من ملف `SUPABASE_SETUP.md`

#### 3. مشكلة في الصور
**الأعراض:** خطأ "فشل رفع الصورة"

**الحل:**
- تأكد من أن الصور أقل من 5MB
- تأكد من أن الصور بصيغة صحيحة (JPG, PNG)
- تأكد من اتصالك بالإنترنت

#### 4. مشكلة في الـ Authentication
**الأعراض:** خطأ "User not authenticated"

**الحل:**
- سجل خروج ثم سجل دخول مرة أخرى
- تأكد من أن الـ Session لم تنتهي
- امسح الـ Cache والـ Cookies

## كيفية التشخيص

### 1. افتح Developer Console
اضغط `F12` في المتصفح وشوف الأخطاء في Console

### 2. تحقق من الأخطاء الشائعة

**خطأ في قاعدة البيانات:**
```
Error: column "original_price" does not exist
```
**الحل:** شغل `migration-add-pricing-fields.sql`

**خطأ في Storage:**
```
Error: Bucket not found
```
**الحل:** أنشئ bucket اسمه `products`

**خطأ في الـ Policies:**
```
Error: new row violates row-level security policy
```
**الحل:** تأكد من الـ Policies في `SUPABASE_SETUP.md`

### 3. تحقق من الـ Network Tab
شوف الـ Requests الفاشلة وشوف الـ Response

## نصائح عامة

1. **دائماً شوف Console:** أي خطأ هيظهر في Console
2. **تأكد من الـ .env:** تأكد من أن الـ Keys صحيحة
3. **امسح الـ Cache:** أحياناً الـ Cache القديم يسبب مشاكل
4. **أعد تشغيل الـ Dev Server:** اضغط `Ctrl+C` وشغل `npm run dev` مرة أخرى

## إذا استمرت المشكلة

1. افتح Console (F12)
2. اعمل Screenshot للخطأ
3. شوف الـ Network Tab
4. ابحث عن الخطأ في Google
