-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  city TEXT,
  province TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create provinces table
CREATE TABLE public.provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cities table
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  province_id UUID REFERENCES public.provinces(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT,
  ad_type TEXT NOT NULL CHECK (ad_type IN ('rent', 'sale')),
  category_id UUID REFERENCES public.categories(id),
  province_id UUID REFERENCES public.provinces(id),
  city_id UUID REFERENCES public.cities(id),
  brand TEXT,
  model TEXT,
  year INTEGER,
  hours INTEGER,
  condition TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  images TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create pricing table
CREATE TABLE public.pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ad_type TEXT NOT NULL CHECK (ad_type IN ('rent', 'sale')),
  price BIGINT NOT NULL,
  duration_days INTEGER NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create discount codes table
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  discount_amount BIGINT,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  discount_code_id UUID REFERENCES public.discount_codes(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create SMS codes table for verification
CREATE TABLE public.sms_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('verification', 'password_reset')),
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for ads
CREATE POLICY "Anyone can view approved ads" ON public.ads
  FOR SELECT USING (is_approved = TRUE AND is_active = TRUE);

CREATE POLICY "Users can view their own ads" ON public.ads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create ads" ON public.ads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ads" ON public.ads
  FOR UPDATE USING (user_id = auth.uid());

-- Create admin function to check roles
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid AND role IN ('admin', 'moderator')
  );
$$;

-- Admin policies for all tables
CREATE POLICY "Admins can do everything on profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can do everything on ads" ON public.ads
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can do everything on categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Public read policies for reference tables
CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can read provinces" ON public.provinces
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can read cities" ON public.cities
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can read pricing" ON public.pricing
  FOR SELECT USING (is_active = TRUE);

-- Insert initial data
INSERT INTO public.categories (name, name_en) VALUES 
('بیل مکانیکی', 'excavator'),
('بولدوزر', 'bulldozer'), 
('لودر', 'loader'),
('کمپرسی', 'compressor'),
('رولر', 'roller'),
('کرین', 'crane'),
('دامپ تراک', 'dump_truck'),
('میکسر', 'mixer'),
('پمپ بتن', 'concrete_pump');

INSERT INTO public.provinces (name, name_en) VALUES
('تهران', 'tehran'),
('اصفهان', 'isfahan'),
('فارس', 'fars'),
('خراسان رضوی', 'khorasan_razavi'),
('آذربایجان شرقی', 'east_azerbaijan'),
('خوزستان', 'khuzestan'),
('مازندران', 'mazandaran'),
('گیلان', 'gilan'),
('کرمان', 'kerman'),
('سیستان و بلوچستان', 'sistan_baluchestan');

INSERT INTO public.cities (name, province_id) VALUES
('تهران', (SELECT id FROM public.provinces WHERE name = 'تهران')),
('کرج', (SELECT id FROM public.provinces WHERE name = 'تهران')),
('اصفهان', (SELECT id FROM public.provinces WHERE name = 'اصفهان')),
('شیراز', (SELECT id FROM public.provinces WHERE name = 'فارس')),
('مشهد', (SELECT id FROM public.provinces WHERE name = 'خراسان رضوی'));

INSERT INTO public.pricing (name, ad_type, price, duration_days, is_featured) VALUES
('اگهی معمولی اجاره', 'rent', 0, 30, FALSE),
('اگهی ویژه اجاره', 'rent', 50000, 30, TRUE),
('اگهی معمولی فروش', 'sale', 0, 45, FALSE),
('اگهی ویژه فروش', 'sale', 100000, 45, TRUE);

INSERT INTO public.settings (key, value) VALUES
('site_name', '"بازار ماشین آلات"'),
('site_description', '"بزرگترین مرجع خرید و اجاره ماشین آلات سنگین"'),
('contact_phone', '"09123456789"'),
('contact_email', '"info@machinery-market.com"'),
('free_ads_limit', '1'),
('sms_api_key', '""'),
('payment_gateway', '"zarinpal"');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, phone, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;