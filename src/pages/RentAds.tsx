import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { featuredMachinery, categories, provinces } from "@/data/machinery";
import { useState } from "react";
import excavatorImage from "@/assets/excavator-featured.jpg";
import bulldozerImage from "@/assets/bulldozer-featured.jpg";
import loaderImage from "@/assets/loader-featured.jpg";

/**
 * RentAds page displays only rental machinery listings. It reuses the
 * search and filter UI from the generic Search page but fixes the
 * advertisement type to "rent" so that sale ads do not appear. Users
 * can still search by keyword, category and province.
 */
const RentAds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Map of image paths to imported modules for displaying sample images
  const imageMap = {
    '/src/assets/excavator-featured.jpg': excavatorImage,
    '/src/assets/bulldozer-featured.jpg': bulldozerImage,
    '/src/assets/loader-featured.jpg': loaderImage,
  } as Record<string, string>;

  // Filter machinery to include only rental ads and apply search filters
  const filteredMachinery = featuredMachinery.filter(item => {
    if (item.type !== 'rent') return false;
    const matchesSearch = !searchQuery || item.title.includes(searchQuery);
    const matchesCategory = !selectedCategory || selectedCategory === 'همه دسته‌ها' || item.category === selectedCategory;
    const matchesProvince = !selectedProvince || selectedProvince === 'همه استان‌ها' || item.location.province === selectedProvince;
    return matchesSearch && matchesCategory && matchesProvince;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Search Header */}
        <section className="bg-gradient-surface py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                آگهی‌های اجاره
              </h1>
              <p className="text-muted-foreground text-lg">
                {filteredMachinery.length} آگهی اجاره موجود است
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-warm p-6 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="جستجو در آگهی‌های اجاره..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-outline-warm"
                >
                  <SlidersHorizontal className="w-4 h-4 ml-2" />
                  فیلترها
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">دسته‌بندی</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="search-select">
                        <SelectValue placeholder="همه دسته‌ها" />
                      </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">استان</label>
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger className="search-select">
                        <SelectValue placeholder="همه استان‌ها" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredMachinery.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-4">آگهی یافت نشد</h2>
                <p className="text-muted-foreground mb-6">
                  متأسفانه هیچ آگهی اجاره مطابق با فیلترهای انتخابی شما یافت نشد
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedProvince('');
                  }}
                  className="btn-outline-warm"
                >
                  حذف فیلترها
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachinery.map((item) => (
                  <Card key={item.id} className="card-warm group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={imageMap[item.image as keyof typeof imageMap]}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="default" className="font-bold">
                            اجاره
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 ml-2" />
                          <span>
                            {item.location.city}، {item.location.province}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {item.price}
                          </span>
                          <span className="text-muted-foreground text-sm mr-2">
                            تومان/روز
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

export default RentAds;