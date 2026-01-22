-- إضافة عمود الوزن لجدول المنتجات
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2);

-- إضافة تعليق على العمود
COMMENT ON COLUMN products.weight IS 'وزن المنتج بالكيلوجرام';
