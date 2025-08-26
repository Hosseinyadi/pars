import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'خانه', href: '/', active: true },
    { name: 'اجاره', href: '/rent' },
    { name: 'فروش', href: '/sale' },
    { name: 'قطعات و خدمات', href: '/shop' },
    { name: 'تماس', href: '/contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Minimal Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center ml-3">
              <span className="text-white font-bold text-sm">پ</span>
            </div>
            <h1 className="text-lg font-bold gradient-text">پارس اکسکاواتور</h1>
          </div>

          {/* Clean Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Simple Actions */}
          <div className="hidden md:flex items-center space-x-3 space-x-reverse">
            <a href="/auth">
              <Button variant="ghost" size="sm" className="text-sm">
                ورود/ثبت‌نام
              </Button>
            </a>
            <a href="/post-ad">
              <Button size="sm" className="text-sm">
                ثبت آگهی
              </Button>
            </a>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`p-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted ${
                    item.active ? 'text-primary bg-muted' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2 mt-2 border-t space-y-2">
                <a href="/auth">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    ورود/ثبت‌نام
                  </Button>
                </a>
                <a href="/post-ad">
                  <Button size="sm" className="w-full text-sm">
                    ثبت آگهی
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;