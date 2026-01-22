-- إضافة حقول التسعير الجديدة لجدول المنتجات
-- قم بتشغيل هذا في Supabase SQL Editor إذا كانت قاعدة البيانات موجودة بالفعل

-- إضافة حقل السعر الأصلي
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price INTEGER;

-- إضافة حقل نسبة التخفيض
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER;

-- تحديث البيانات الموجودة (اختياري)
-- يمكنك حذف هذا القسم إذا لم تكن هناك بيانات موجودة
UPDATE products 
SET original_price = suggested_price * 2,
    discount_percentage = 50
WHERE original_price IS NULL AND suggested_price IS NOT NULL;
