-- إضافة policy للسماح للمستخدمين بتحديث إشعاراتهم الخاصة
CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
