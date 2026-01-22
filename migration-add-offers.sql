-- إنشاء جدول العروض
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  discount_percentage INTEGER,
  target_location TEXT, -- null = كل المناطق
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- سياسات الأمان للعروض
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- الجميع يقدر يشوف العروض النشطة
CREATE POLICY "Anyone can view active offers" 
  ON offers FOR SELECT 
  USING (is_active = true);

-- الأدمن فقط يقدر يضيف عروض
CREATE POLICY "Admins can insert offers" 
  ON offers FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- الأدمن فقط يقدر يعدل العروض
CREATE POLICY "Admins can update offers" 
  ON offers FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- الأدمن فقط يقدر يحذف العروض
CREATE POLICY "Admins can delete offers" 
  ON offers FOR DELETE 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- إنشاء index للأداء
CREATE INDEX idx_offers_active ON offers(is_active);
CREATE INDEX idx_offers_location ON offers(target_location);
CREATE INDEX idx_offers_dates ON offers(start_date, end_date);

-- تفعيل Realtime على جدول العروض
ALTER PUBLICATION supabase_realtime ADD TABLE offers;
