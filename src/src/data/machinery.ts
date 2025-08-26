// Mock data for machinery listings
export interface MachineryItem {
  id: string;
  title: string;
  description: string;
  price: string;
  type: 'rent' | 'sale';
  category: string;
  location: {
    province: string;
    city: string;
  };
  image: string;
  featured: boolean;
  specs: {
    brand: string;
    model: string;
    year: number;
    hours?: number;
    condition: string;
  };
  contact: {
    name: string;
    phone: string;
  };
  createdAt: string;
}

export const featuredMachinery: MachineryItem[] = [
  {
    id: '1',
    title: 'بیل مکانیکی کوماتسو PC200',
    description: 'بیل مکانیکی کوماتسو مدل PC200 در شرایط عالی، مناسب برای پروژه‌های سنگین',
    price: '۲،۵۰۰،۰۰۰',
    type: 'rent',
    category: 'بیل مکانیکی',
    location: {
      province: 'تهران',
      city: 'تهران'
    },
    image: '/src/assets/excavator-featured.jpg',
    featured: true,
    specs: {
      brand: 'کوماتسو',
      model: 'PC200',
      year: 2020,
      hours: 2500,
      condition: 'عالی'
    },
    contact: {
      name: 'احمد محمدی',
      phone: '۰۹۱۲۳۴۵۶۷۸۹'
    },
    createdAt: '۱۴۰۳/۰۵/۱۵'
  },
  {
    id: '2',
    title: 'بولدوزر کاترپیلار D6T',
    description: 'بولدوزر کاترپیلار مدل D6T قدرتمند و کارآمد برای عملیات خاکریزی',
    price: '۴،۸۰۰،۰۰۰،۰۰۰',
    type: 'sale',
    category: 'بولدوزر',
    location: {
      province: 'اصفهان',
      city: 'اصفهان'
    },
    image: '/src/assets/bulldozer-featured.jpg',
    featured: true,
    specs: {
      brand: 'کاترپیلار',
      model: 'D6T',
      year: 2019,
      hours: 3200,
      condition: 'خوب'
    },
    contact: {
      name: 'رضا احمدی',
      phone: '۰۹۱۱۲۳۴۵۶۷۸'
    },
    createdAt: '۱۴۰۳/۰۵/۱۲'
  },
  {
    id: '3',
    title: 'لودر چرخی ولوو L90H',
    description: 'لودر چرخی ولوو مدل L90H با قابلیت‌های بالا برای حمل و نقل مواد',
    price: '۱،۸۰۰،۰۰۰',
    type: 'rent',
    category: 'لودر',
    location: {
      province: 'فارس',
      city: 'شیراز'
    },
    image: '/src/assets/loader-featured.jpg',
    featured: true,
    specs: {
      brand: 'ولوو',
      model: 'L90H',
      year: 2021,
      hours: 1800,
      condition: 'عالی'
    },
    contact: {
      name: 'علی کریمی',
      phone: '۰۹۱۷۳۴۵۶۷۸۹'
    },
    createdAt: '۱۴۰۳/۰۵/۱۰'
  }
];

export const categories = [
  'همه دسته‌ها',
  'بیل مکانیکی',
  'بولدوزر',
  'لودر',
  'کمپرسی',
  'رولر',
  'کرین',
  'دامپ تراک',
  'میکسر',
  'پمپ بتن'
];

export const provinces = [
  'همه استان‌ها',
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'آذربایجان شرقی',
  'خوزستان',
  'مازندران',
  'گیلان',
  'کرمان',
  'سیستان و بلوچستان'
];

export const cities = {
  'تهران': ['همه شهرها', 'تهران', 'کرج', 'اسلامشهر', 'ورامین'],
  'اصفهان': ['همه شهرها', 'اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر'],
  'فارس': ['همه شهرها', 'شیراز', 'مرودشت', 'کازرون', 'فسا'],
  'خراسان رضوی': ['همه شهرها', 'مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه']
};