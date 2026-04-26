-- إنشاء جدول الملفات الشخصية (Profiles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  student_code INTEGER UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT UNIQUE,
  parent_phone TEXT,
  governorate TEXT,
  city TEXT,
  email TEXT UNIQUE,
  grade INTEGER,
  track TEXT,
  birth_date DATE,
  gender TEXT,
  photo_url TEXT,
  wallet_balance INTEGER DEFAULT 0,
  role TEXT DEFAULT 'student',
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء جدول الباقات (Packages)
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  grade_id INTEGER,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  price INTEGER DEFAULT 0,
  old_price INTEGER,
  image_url TEXT,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء جدول الأسابيع (Weeks)
CREATE TABLE weeks (
  id SERIAL PRIMARY KEY,
  package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء جدول الدروس (Lessons)
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- video_exp, video_hw, pdf, exam_mcq
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء جدول الاشتراكات (Subscriptions)
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  payment_method TEXT
);

-- إنشاء جدول المعاملات (Transactions)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  amount INTEGER,
  type TEXT, -- deposit, purchase
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء جدول الأكواد (Codes)
CREATE TABLE codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  package_id INTEGER REFERENCES packages(id),
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- تفعيل Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدمين برؤية ملفاتهم فقط
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

-- السماح للآدمن برؤية كل شيء
CREATE POLICY "Admins can view all profiles" ON profiles 
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
