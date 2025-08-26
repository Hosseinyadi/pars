import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { ProductItem } from '@/data/products';

/**
 * SellerDashboard provides an interface for verified sellers to manage
 * their profile information and the products/services they offer. This
 * implementation stores data in local state; in a real application
 * you should fetch and persist these records to Supabase.
 */
const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Seller profile information. Extend as needed to include
  // additional fields such as social links, avatar etc.
  const [profile, setProfile] = useState({
    bio: '',
    email: '',
    phone: '',
    socials: '',
  });

  // List of products belonging to this seller
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      // TODO: fetch profile from Supabase when available
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    // In a real implementation this would update the profiles table
    // via Supabase. For now we'll just display a notification.
    alert('پروفایل شما ذخیره شد');
  };

  const handleAddProduct = () => {
    if (!newProduct) return;
    const id = Date.now().toString();
    const productToAdd: ProductItem = {
      ...newProduct,
      id,
      seller: {
        id: user?.id || 'self',
        name: user?.email || 'فروشنده',
      },
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    setProducts(prev => [...prev, productToAdd]);
    setShowNewForm(false);
    setNewProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return <div className="p-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">پنل فروشنده</h1>
          <Button variant="outline" onClick={() => navigate('/')}>بازگشت</Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Dashboard Summary */}
        <section>
          <h2 className="text-xl font-bold mb-4">خلاصه فعالیت</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">تعداد محصولات</p>
                    <p className="text-2xl font-bold text-primary">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">در انتظار تأیید</p>
                    <p className="text-2xl font-bold text-secondary">{products.filter(p => p.category === 'در انتظار').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">بازدید امروز</p>
                    <p className="text-2xl font-bold text-success">{(products.length * 23) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Profile Editing */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">پروفایل من</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">بیوگرافی</label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="درباره خودتان بنویسید"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ایمیل</label>
                  <Input
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="ایمیل"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">شماره تلفن</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    placeholder="0912xxxxxxx"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">لینک شبکه‌های اجتماعی</label>
                  <Input
                    value={profile.socials}
                    onChange={(e) => handleProfileChange('socials', e.target.value)}
                    placeholder="مثال: instagram.com/yourname"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>ذخیره پروفایل</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Product Management */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">مدیریت محصولات / قطعات</h2>
            <Button onClick={() => {
              setShowNewForm(!showNewForm);
              if (!showNewForm) {
                setNewProduct({
                  id: '',
                  name: '',
                  category: '',
                  description: '',
                  price: 0,
                  specs: '',
                  seller: { id: '', name: '' },
                  images: [],
                  createdAt: '',
                });
              }
            }}>
              {showNewForm ? 'بستن فرم' : 'افزودن محصول جدید'}
            </Button>
          </div>
          {showNewForm && newProduct && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">نام محصول</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="نام"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">دسته‌بندی</label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="قطعات بیل مکانیکی">قطعات بیل مکانیکی</SelectItem>
                        <SelectItem value="قطعات لودر">قطعات لودر</SelectItem>
                        <SelectItem value="خدمات تعمیرات">خدمات تعمیرات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">قیمت (تومان)</label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">مشخصات فنی</label>
                    <Textarea
                      value={newProduct.specs}
                      onChange={(e) => setNewProduct({ ...newProduct, specs: e.target.value })}
                      placeholder="مشخصات فنی و ویژگی‌ها"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">توضیحات</label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="توضیحات کامل محصول"
                  />
                </div>
                {/* Image upload could be implemented here */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewForm(false)}>انصراف</Button>
                  <Button onClick={handleAddProduct}>ثبت محصول</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              {products.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">هیچ محصولی ثبت نشده است</div>
              ) : (
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-right p-4">نام</th>
                      <th className="text-right p-4">دسته‌بندی</th>
                      <th className="text-right p-4">قیمت</th>
                      <th className="text-right p-4">تاریخ</th>
                      <th className="text-right p-4">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.price.toLocaleString('fa-IR')}</td>
                        <td className="p-4">{item.createdAt}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(item.id)}>
                            حذف
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;