import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Phone, Lock, User, MapPin } from 'lucide-react';

interface AuthState {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  province: string;
  verificationCode: string;
  step: 'auth' | 'verify';
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [state, setState] = useState<AuthState>({
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    verificationCode: '',
    step: 'auth'
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const redirect = location.state?.from?.pathname || '/';
        navigate(redirect);
      }
    };
    
    checkSession();
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (state.province) {
      fetchCities(state.province);
    }
  }, [state.province]);

  const fetchProvinces = async () => {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (!error && data) {
      setProvinces(data);
    }
  };

  const fetchCities = async (provinceName: string) => {
    const { data, error } = await supabase
      .from('cities')
      .select('*, provinces!inner(*)')
      .eq('provinces.name', provinceName)
      .eq('is_active', true)
      .order('name');
    
    if (!error && data) {
      setCities(data);
    }
  };

  const handleInputChange = (field: keyof AuthState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!state.phone || !state.password) {
      toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }

    setLoading(true);
    try {
      // Convert phone to email format for Supabase auth
      const email = `${state.phone}@machinery.app`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: state.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('شماره موبایل یا رمز عبور اشتباه است');
        } else {
          toast.error('خطا در ورود: ' + error.message);
        }
        return;
      }

      if (data.user) {
        toast.success('با موفقیت وارد شدید');
        const redirect = location.state?.from?.pathname || '/';
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!state.phone || !state.password || !state.firstName || !state.lastName) {
      toast.error('لطفا تمام فیلدهای ضروری را پر کنید');
      return;
    }

    if (state.password.length < 6) {
      toast.error('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    setLoading(true);
    try {
      // Convert phone to email format for Supabase auth
      const email = `${state.phone}@machinery.app`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: state.password,
        options: {
          data: {
            phone: state.phone,
            first_name: state.firstName,
            last_name: state.lastName,
            city: state.city,
            province: state.province
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('این شماره موبایل قبلا ثبت شده است');
        } else {
          toast.error('خطا در ثبت نام: ' + error.message);
        }
        return;
      }

      if (data.user) {
        toast.success('ثبت نام با موفقیت انجام شد');
        setActiveTab('login');
        setState(prev => ({ ...prev, password: '' }));
      }
    } catch (err: any) {
      toast.error('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!state.phone) {
      toast.error('لطفا شماره موبایل خود را وارد کنید');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would send SMS
      // For now, we'll just show a message
      toast.info('کد بازیابی به شماره شما ارسال شد (این قابلیت در حال توسعه است)');
      setState(prev => ({ ...prev, step: 'verify' }));
    } catch (err: any) {
      toast.error('خطا در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/50 to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">بازار ماشین آلات</CardTitle>
          <CardDescription>
            {state.step === 'auth' ? 'ورود یا ثبت نام' : 'تایید شماره موبایل'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.step === 'auth' ? (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">ورود</TabsTrigger>
                <TabsTrigger value="signup">ثبت نام</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="login-phone">شماره موبایل</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="09123456789"
                      value={state.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pr-10 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">رمز عبور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      value={state.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                <Button onClick={handleLogin} disabled={loading} className="w-full">
                  {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  ورود
                </Button>

                <Button variant="ghost" onClick={handleForgotPassword} className="w-full text-sm">
                  فراموشی رمز عبور
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">نام</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        value={state.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pr-10"
                        placeholder="نام"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input
                      id="lastName"
                      value={state.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="نام خانوادگی"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">شماره موبایل</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="09123456789"
                      value={state.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pr-10 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">استان</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select
                        id="province"
                        value={state.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        className="w-full pr-10 pl-3 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">انتخاب استان</option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">شهر</Label>
                    <select
                      id="city"
                      value={state.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={!state.province}
                    >
                      <option value="">انتخاب شهر</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">رمز عبور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={state.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pr-10"
                      placeholder="حداقل 6 کاراکتر"
                    />
                  </div>
                </div>

                <Button onClick={handleSignup} disabled={loading} className="w-full">
                  {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  ثبت نام
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">کد تایید</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="کد 6 رقمی را وارد کنید"
                  value={state.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button disabled={loading || state.verificationCode.length !== 6} className="w-full">
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                تایید
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setState(prev => ({ ...prev, step: 'auth' }))}
                className="w-full"
              >
                بازگشت
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;