import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  signUp: async (username, email, password, location, phone) => {
    try {
      // تحقق إن الـ username مش مستخدم
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        throw new Error('اسم المستخدم موجود بالفعل');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username,
            location,
            phone
          }
        }
      });

      if (error) throw error;

      // لو الـ trigger مشتغلش، اعمل profile يدوي
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username,
            email,
            location,
            phone,
            role: 'user'
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return data;
    } catch (err) {
      console.error('Sign up error:', err);
      throw err;
    }
  },

  signIn: async (username, password) => {
    try {
      // جرب تجيب الـ email من profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('خطأ في الاتصال بقاعدة البيانات');
      }

      if (!profile) {
        throw new Error('اسم المستخدم غير موجود');
      }

      // جرب تسجل الدخول
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid')) {
          throw new Error('كلمة المرور غير صحيحة');
        }
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },

  loadUser: async () => {
    try {
      set({ loading: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Current user:', user);
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('Profile data:', profile);
        console.log('Profile error:', error);

        if (profile) {
          set({ user, profile, loading: false });
        } else {
          console.error('No profile found for user');
          set({ user: null, profile: null, loading: false });
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ user: null, profile: null, loading: false });
    }
  }
}));
