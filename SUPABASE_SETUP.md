# إعداد Supabase لتطبيق بيكيا

## الخطوات المطلوبة

### 1. إنشاء قاعدة البيانات

افتح **SQL Editor** في Supabase وقم بتشغيل الملف `supabase-schema.sql` كاملاً.

### 2. تحديث قاعدة البيانات الموجودة (إذا كانت موجودة بالفعل)

إذا كانت قاعدة البيانات موجودة بالفعل، قم بتشغيل `migration-add-pricing-fields.sql` لإضافة الحقول الجديدة.

### 3. إنشاء Storage Bucket

1. اذهب إلى **Storage** في Supabase
2. اضغط على **New bucket**
3. اسم الـ bucket: `products`
4. اجعله **Public** (عام)
5. احفظ

### 4. إعداد Storage Policies

قم بتشغيل هذا الكود في SQL Editor:

```sql
-- السماح لأي شخص بمشاهدة الصور
CREATE POLICY "Anyone can view product images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'products');

-- السماح للمستخدمين المسجلين برفع الصور
CREATE POLICY "Authenticated users can upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- السماح للمستخدمين بحذف صورهم الخاصة
CREATE POLICY "Users can delete own images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. إنشاء حساب Admin

قم بتشغيل هذا الكود بعد تسجيل أول مستخدم:

```sql
-- استبدل 'your-user-id' بـ ID المستخدم من جدول auth.users
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id';
```

### 6. التحقق من الإعداد

تأكد من:
- ✅ جدول `profiles` موجود
- ✅ جدول `products` موجود مع الحقول الجديدة (`original_price`, `discount_percentage`)
- ✅ جدول `notifications` موجود
- ✅ Storage bucket `products` موجود وعام
- ✅ جميع الـ Policies مفعلة

## الأخطاء الشائعة

### خطأ: "relation 'products' does not exist"
**الحل:** قم بتشغيل `supabase-schema.sql` في SQL Editor

### خطأ: "column 'original_price' does not exist"
**الحل:** قم بتشغيل `migration-add-pricing-fields.sql` في SQL Editor

### خطأ: "Bucket not found"
**الحل:** أنشئ bucket اسمه `products` في Storage

### خطأ: "new row violates row-level security policy"
**الحل:** تأكد من أن جميع الـ Policies مفعلة في SQL Editor

## ملاحظات

- تأكد من أن ملف `.env` يحتوي على:
  ```
  VITE_SUPABASE_URL=your-project-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

- لا تشارك الـ `service_role_key` أبداً في الكود!
