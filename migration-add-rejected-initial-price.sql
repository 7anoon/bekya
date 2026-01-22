-- إضافة عمود لتتبع رفض السعر الأولي من العميل
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rejected_initial_price BOOLEAN DEFAULT FALSE;

-- تحديث المنتجات الموجودة
COMMENT ON COLUMN products.rejected_initial_price IS 'هل رفض العميل السعر الأولي الذي اقترحه الـ AI';
