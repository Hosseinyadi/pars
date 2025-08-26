import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, X, Star } from 'lucide-react';

interface AdForm {
  title: string;
  description: string;
  price: string;
  adType: 'rent' | 'sale';
  categoryId: string;
  provinceId: string;
  cityId: string;
  brand: string;
  model: string;
  year: string;
  hours: string;
  condition: string;
  contactName: string;
  contactPhone: string;
  isFeatured: boolean;
}

const PostAd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userAdsCount, setUserAdsCount] = useState(0);
  const [pricing, setPricing] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  
  const [form, setForm] = useState<AdForm>({
    title: '',
    description: '',
    price: '',
    adType: 'rent',
    categoryId: '',
    provinceId: '',
    cityId: '',
    brand: '',
    model: '',
    year: '',
    hours: '',
    condition: '',
    contactName: '',
    contactPhone: '',
    isFeatured: false
  });

  useEffect(() => {
    checkAuth();
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (form.provinceId) {
      fetchCities(form.provinceId);
    }
  }, [form.provinceId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    setUser(session.user);
    
    // Get user profile for contact info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profile) {
      setForm(prev => ({
        ...prev,
        contactName: `${profile.first_name} ${profile.last_name}`,
        contactPhone: profile.phone || ''
      }));
    }

    // Count user's ads
    const { count } = await supabase
      .from('ads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);
    
    setUserAdsCount(count || 0);
  };

  const fetchInitialData = async () => {
    const [categoriesRes, provincesRes, pricingRes] = await Promise.all([
      supabase.from('categories').select('*').eq('is_active', true).order('name'),
      supabase.from('provinces').select('*').eq('is_active', true).order('name'),
      supabase.from('pricing').select('*').eq('is_active', true).order('price')
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (provincesRes.data) setProvinces(provincesRes.data);
    if (pricingRes.data) setPricing(pricingRes.data);
  };

  const fetchCities = async (provinceId: string) => {
    const { data } = await supabase
      .from('cities')
      .select('*')
      .eq('province_id', provinceId)
      .eq('is_active', true)
      .order('name');
    
    if (data) setCities(data);
  };

  const handleInputChange = (field: keyof AdForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    const selectedPricing = pricing.find(p => 
      p.ad_type === form.adType && p.is_featured === form.isFeatured
    );
    
    // First ad is free
    if (userAdsCount === 0 && !form.isFeatured) {
      return 0;
    }
    
    return selectedPricing?.price || 0;
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.categoryId || !form.provinceId || !form.cityId) {
      toast.error('لطفا تمام فیلدهای ضروری را پر کنید');
      return;
    }

    if (!user) {
      toast.error('لطفا ابتدا وارد شوید');
      return;
    }

    setLoading(true);
    try {
      const adPrice = calculatePrice();
      
      // If price > 0, handle payment (for now, just show message)
      if (adPrice > 0) {
        toast.info(`هزینه آگهی: ${adPrice.toLocaleString('fa-IR')} تومان - پرداخت در حال توسعه است`);
      }

      // Create ad
      const { data: ad, error } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          price: form.price ? parseInt(form.price) : null,
          ad_type: form.adType,
          category_id: form.categoryId,
          province_id: form.provinceId,
          city_id: form.cityId,
          brand: form.brand,
          model: form.model,
          year: form.year ? parseInt(form.year) : null,
          hours: form.hours ? parseInt(form.hours) : null,
          condition: form.condition,
          contact_name: form.contactName,
          contact_phone: form.contactPhone,
          is_featured: form.isFeatured,
          is_active: true,
          is_approved: userAdsCount === 0 // Auto-approve first ad
        })
        .select()
        .single();

      if (error) {
        toast.error('خطا در ثبت آگهی: ' + error.message);
        return;
      }

      // Create payment record if needed
      if (adPrice > 0) {
        await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            ad_id: ad.id,
            amount: adPrice,
            status: 'pending'
          });
      }

      toast.success('آگهی با موفقیت ثبت شد');
      navigate('/');
    } catch (err: any) {
      toast.error('خطا در ثبت آگهی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">ثبت آگهی جدید</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              بازگشت به خانه
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ثبت آگهی
                {userAdsCount === 0 && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    آگهی اول رایگان!
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                اطلاعات ماشین آلات خود را با دقت وارد کنید
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Ad Type */}
              <div className="space-y-3">
                <Label>نوع آگهی</Label>
                <RadioGroup 
                  value={form.adType} 
                  onValueChange={(value: 'rent' | 'sale') => handleInputChange('adType', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent">اجاره</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="sale" id="sale" />
                    <Label htmlFor="sale">فروش</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">عنوان آگهی *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="مثال: بیل مکانیکی کوماتسو PC200"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>دسته بندی *</Label>
                <Select value={form.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>استان *</Label>
                  <Select value={form.provinceId} onValueChange={(value) => handleInputChange('provinceId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب استان" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>شهر *</Label>
                  <Select value={form.cityId} onValueChange={(value) => handleInputChange('cityId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Machine Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">برند</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="کوماتسو، کاترپیلار، ولوو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">مدل</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="PC200، D6T، L90H"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">سال ساخت</Label>
                  <Input
                    id="year"
                    type="number"
                    value={form.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="1400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">ساعت کار</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={form.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                    placeholder="2500"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label>وضعیت</Label>
                <Select value={form.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نو">نو</SelectItem>
                    <SelectItem value="عالی">عالی</SelectItem>
                    <SelectItem value="خوب">خوب</SelectItem>
                    <SelectItem value="قابل قبول">قابل قبول</SelectItem>
                    <SelectItem value="نیاز به تعمیر">نیاز به تعمیر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">قیمت {form.adType === 'rent' ? '(روزانه - تومان)' : '(تومان)'}</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="مثال: 2500000"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">توضیحات *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="توضیحات کامل در مورد ماشین آلات..."
                  rows={4}
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">نام تماس</Label>
                  <Input
                    id="contactName"
                    value={form.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">شماره تماس</Label>
                  <Input
                    id="contactPhone"
                    value={form.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="09123456789"
                  />
                </div>
              </div>

              {/* Featured Option */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="featured"
                  checked={form.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked as boolean)}
                />
                <div>
                  <Label htmlFor="featured" className="flex items-center gap-1 cursor-pointer">
                    <Star className="h-4 w-4 text-yellow-500" />
                    آگهی ویژه
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    نمایش در بالای لیست و بیشتر دیده شدن
                  </p>
                </div>
              </div>

              {/* Pricing Info */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>هزینه آگهی:</span>
                      <span className="font-medium">
                        {calculatePrice() === 0 ? 'رایگان' : `${calculatePrice().toLocaleString('fa-IR')} تومان`}
                      </span>
                    </div>
                    {userAdsCount === 0 && (
                      <p className="text-green-600 text-xs mt-1">
                        اولین آگهی شما رایگان است!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {calculatePrice() === 0 ? 'ثبت آگهی رایگان' : `پرداخت و ثبت آگهی`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostAd;