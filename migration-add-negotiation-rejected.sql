-- إضافة عمود لتتبع رفض البائع للسعر المقترح
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seller_rejected_negotiation BOOLEAN DEFAULT false;

-- إضافة تعليق على العمود
COMMENT ON COLUMN products.seller_rejected_negotiation IS 'هل رفض البائع عرض التفاوض من الأدمن';
