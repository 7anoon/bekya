-- إنشاء جدول الملفات الشخصية
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول المنتجات
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL,
  condition TEXT NOT NULL,
  original_price INTEGER,
  suggested_price INTEGER,
  final_price INTEGER,
  negotiated_price INTEGER,
  discount_percentage INTEGER,
  can_recycle BOOLEAN DEFAULT false,
  recycle_idea TEXT,
  choice_type TEXT CHECK (choice_type IN ('sell', 'recycle')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'negotiating', 'awaiting_seller')),
  rejection_reason TEXT,
  negotiation_note TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الإشعارات
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  product_id UUID REFERENCES products(id),
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- سياسات الأمان للـ profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "profiles_insert_policy" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "profiles_update_policy" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- سياسات الأمان للـ products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved products" 
  ON products FOR SELECT 
  USING (status = 'approved' OR user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert own products" 
  ON products FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" 
  ON products FOR UPDATE 
  USING (auth.uid() = user_id OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- سياسات الأمان للـ notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON notifications FOR INSERT 
  WITH CHECK (true);

-- سياسات الأمان للـ storage
CREATE POLICY "Anyone can view product images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- إنشاء indexes للأداء
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_location ON products(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_username ON profiles(username);
