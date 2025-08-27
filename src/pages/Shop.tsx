import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { sampleProducts } from '@/data/products';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

/**
 * Shop page displays all parts and services available for purchase.
 * Visitors can search by keyword and filter by category. Each
 * product links to a dedicated details page (to be implemented).
 */
const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(new Set(sampleProducts.map(p => p.category)));

  const filteredProducts = sampleProducts.filter(p => {
    const matchesSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="bg-gradient-surface py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                فروش قطعات و خدمات
              </h1>
              <p className="text-muted-foreground text-lg">
                {filteredProducts.length} محصول/خدمت موجود
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-warm p-6 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="جستجو در محصولات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه دسته‌ها" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">همه دسته‌ها</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-4">محصولی یافت نشد</h2>
                <p className="text-muted-foreground mb-6">
                  متأسفانه هیچ محصولی مطابق با فیلترهای انتخابی شما یافت نشد
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }} className="btn-outline-warm">
                  حذف فیلترها
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(item => (
                  <Link key={item.id} to={`/product/${item.id}`} className="no-underline">
                    <Card className="card-warm group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden rounded-t-xl">
                          {item.images[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              loading="lazy"
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="font-bold">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              {item.price.toLocaleString('fa-IR')}
                            </span>
                            <span className="text-muted-foreground text-sm mr-2">تومان</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.seller.name}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;