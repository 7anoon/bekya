-- إضافة نظام التفاوض لجدول المنتجات
-- قم بتشغيل هذا في Supabase SQL Editor

-- إضافة حقل السعر المتفاوض عليه
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS negotiated_price INTEGER;

-- إضافة حقل ملاحظة التفاوض
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS negotiation_note TEXT;

-- تحديث الـ status constraint لإضافة حالات التفاوض
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_status_check;

ALTER TABLE products 
ADD CONSTRAINT products_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'negotiating', 'awaiting_seller'));

-- إضافة index للأداء
CREATE INDEX IF NOT EXISTS idx_products_status_user ON products(status, user_id);
