import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,   // السماح بالتحديث ولكن بشكل منضبط
      persistSession: true,     // حفظ الجلسة في المتصفح لمنع تسجيل الخروج المفاجئ
      detectSessionInUrl: true, // التعرف على الجلسة القادمة من روابط التأكيد الإلكتروني
      flowType: 'pkce'          // استخدام تدفق PKCE الأكثر أماناً واستقراراً مع المتصفحات الحديثة
    }
  }
);