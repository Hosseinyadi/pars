-- Fix RLS policies for missing tables and function search paths

-- Add missing RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- Add missing RLS policies for pricing
CREATE POLICY "Admins can manage pricing" ON public.pricing
  FOR ALL USING (public.is_admin());

-- Add missing RLS policies for discount_codes  
CREATE POLICY "Admins can manage discount codes" ON public.discount_codes
  FOR ALL USING (public.is_admin());

-- Add missing RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- Add missing RLS policies for sms_codes
CREATE POLICY "Admins can manage SMS codes" ON public.sms_codes
  FOR ALL USING (public.is_admin());

-- Add missing RLS policies for settings
CREATE POLICY "Anyone can read settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (public.is_admin());

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create default admin user (will be triggered when user signs up with these credentials)
-- The trigger will handle profile and role creation