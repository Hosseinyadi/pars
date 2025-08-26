import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  Crown, 
  BarChart3, 
  Database,
  UserCog,
  LogOut,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Package,
  MapPin,
  History,
  Shield,
  UserMinus,
  Archive
} from "lucide-react";
import { featuredMachinery, categories, provinces } from "@/data/machinery";
import { sampleProducts } from "@/data/products";
import type { MachineryItem } from "@/data/machinery";
import type { ProductItem } from "@/data/products";

// Define a simple message interface for the messaging system
interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: Date;
}

interface User {
  username: string;
  password: string;
  role: string;
  permissions: string[];
  /**
   * When true this user is blocked and cannot log in. Admins can
   * toggle this state. Blocked users appear in the "مسدود شده" list.
   */
  blocked: boolean;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', showPassword: false });
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock users with different permissions. In addition to
  // username, password, role and permissions we include a
  // `blocked` flag to allow administrators to restrict access.
  const users: User[] = [
    { username: 'admin', password: 'admin123', role: 'admin', permissions: ['all'], blocked: false },
    {
      username: 'yadegari',
      password: 'Asus',
      role: 'manager',
      permissions: [
        'ads',
        'users',
        'reports',
        'products',
        'categories',
        'messages',
        'vip',
        'backup',
        'admins',
        'roles',
        'audit',
        'comments',
        'trash',
        'blocked'
      ],
      blocked: false
    },
    { username: 'moderator', password: 'mod123', role: 'moderator', permissions: ['ads'], blocked: false }
  ];

  const handleLogin = () => {
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginForm({ username: '', password: '', showPassword: false });
    } else {
      alert('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const hasPermission = (permission: string) => {
    return currentUser?.permissions.includes('all') || currentUser?.permissions.includes(permission);
  };

  /**
   * ------------------------------
   * Realistic state management for the admin panel
   *
   * The original admin panel used static arrays and placeholder
   * content for users, ads, categories, messages and other
   * resources. To make the panel actually functional we
   * introduce local state for these entities. In a real
   * application this data would be persisted to a database,
   * however for the purposes of this exercise we store it in
   * memory so that administrators can create, edit and delete
   * entries during their session.
   */

  // Maintain a list of all ads. Initially seeded from the
  // mock data defined in data/machinery.ts. Administrators can
  // add, edit, delete and toggle the featured status of ads.
  const [ads, setAds] = useState<MachineryItem[]>([...featuredMachinery]);

  // Keep track of our custom categories. We slice off the first
  // entry ("همه دسته‌ها") because that is used purely for
  // filtering in the UI and not as an actual category. Admins
  // can add new categories or remove existing ones.
  const [categoryList, setCategoryList] = useState<string[]>(categories.slice(1));

  // Use local state for our users instead of a constant so that
  // admins can update roles or delete users. We clone the
  // initial list so that mutations do not affect the original
  // `users` constant.
  const [userList, setUserList] = useState<User[]>([...users]);

  // Simple messaging state. Each message consists of an ID,
  // sender (username), content and timestamp. Messages are
  // appended to this array when sent via the messaging tab.
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');

  // State for adding a new category from the categories tab.
  const [newCategoryName, setNewCategoryName] = useState('');

  // Admin product list state. Initially seeded from mock products.
  const [productList, setProductList] = useState<ProductItem[]>([...sampleProducts]);

  /**
   * Deleted items are stored in separate arrays (trash) instead of being
   * removed permanently. Administrators can restore or permanently delete
   * them from the Recycle Bin tab. This implements a soft delete pattern.
   */
  const [deletedAds, setDeletedAds] = useState<MachineryItem[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<ProductItem[]>([]);

  /**
   * Simple comment moderation state. Each comment belongs to a product and
   * includes a rating, content and status. Pending comments can be
   * approved or rejected in the Comments tab. This example uses a few
   * hard‑coded comments; in a real implementation these would be
   * fetched from the database.
   */
  const [comments, setComments] = useState<{ id: string; productId: string; user: string; rating: number; content: string; status: 'pending' | 'approved' | 'rejected'; createdAt: Date }[]>([
    { id: 'c1', productId: sampleProducts[0]?.id || '1', user: 'کاربر۱', rating: 5, content: 'خیلی راضی بودم از کیفیت', status: 'pending', createdAt: new Date() },
    { id: 'c2', productId: sampleProducts[1]?.id || '2', user: 'کاربر۲', rating: 3, content: 'معمولی بود', status: 'approved', createdAt: new Date() }
  ]);

  // Role creation form state: administrators can create new roles with
  // selectable permissions. See Roles tab for UI.
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  // Search and sort state for ads. The search query filters ads by title,
  // description or location. The sort key determines the order of ads
  // displayed (date or price).
  const [adsSearchQuery, setAdsSearchQuery] = useState('');
  const [adsSortBy, setAdsSortBy] = useState<'date' | 'price-asc' | 'price-desc'>('date');

  // Selected ad IDs for bulk actions (e.g. mass deletion or VIP toggle).
  const [selectedAdIds, setSelectedAdIds] = useState<Set<string>>(new Set());

  /**
   * Maintain a list of defined roles and their associated permissions. This
   * allows administrators to create custom roles beyond the built‑in ones
   * (admin, manager, moderator, user). Each role has a name and a list
   * of permissions that can be assigned to users. Use the roles state
   * when creating new roles or editing existing ones.
   */
  const [roles, setRoles] = useState<{ name: string; permissions: string[] }[]>([
    { name: 'admin', permissions: ['all'] },
    {
      name: 'manager',
      permissions: [
        'ads',
        'users',
        'reports',
        'products',
        'categories',
        'messages',
        'vip',
        'backup',
        'admins',
        'roles',
        'audit',
        'comments',
        'trash',
        'blocked'
      ]
    },
    { name: 'moderator', permissions: ['ads'] },
    { name: 'user', permissions: [] },
  ]);

  /**
   * The audit log stores records of sensitive actions performed in the admin
   * panel. Each entry includes an ID, timestamp, user who performed the
   * action and a description. The log is displayed in the Audit Log tab.
   */
  const [auditLog, setAuditLog] = useState<{ id: string; timestamp: Date; user: string; action: string }[]>([]);

  /**
   * Helpers for the audit log. Call this function whenever a sensitive
   * action occurs (delete, update, role change, message etc.). It appends
   * a new entry to the log with a timestamp and current user.
   */
  const addAuditEntry = (action: string) => {
    const userName = currentUser?.username || 'سیستم';
    const entry = { id: Date.now().toString(), timestamp: new Date(), user: userName, action };
    setAuditLog(prev => [...prev, entry]);
  };

  // Note: the search, sorting and selectedAdIds state are defined above
  // alongside other admin states.

  const handleDeleteProductAdmin = (id: string) => {
    const product = productList.find(p => p.id === id);
    setProductList(prev => prev.filter(p => p.id !== id));
    if (product) {
      setDeletedProducts(prev => [...prev, product]);
      addAuditEntry(`حذف محصول "${product.name}"`);
    }
  };

  // Manage the visibility of the new ad form. When true a form
  // appears at the top of the ads tab allowing entry of basic
  // ad information. Once submitted it will be added to the ads
  // state array.
  const [showNewAdForm, setShowNewAdForm] = useState(false);

  // Hold the values for a new ad while it's being created. We
  // initialise sensible defaults here. The ID is generated
  // dynamically when the form is submitted.
  const [newAd, setNewAd] = useState<MachineryItem>({
    id: '',
    title: '',
    description: '',
    price: '',
    type: 'rent',
    category: '',
    location: { province: '', city: '' },
    image: '',
    featured: false,
    specs: {
      brand: '',
      model: '',
      year: 0,
      hours: 0,
      condition: ''
    },
    contact: { name: '', phone: '' },
    createdAt: ''
  });

  /**
   * Helpers for ads management
   */
  const handleAddAd = () => {
    if (!newAd.title || !newAd.category || !newAd.price) return;
    const id = Date.now().toString();
    const createdAt = new Date().toLocaleDateString('fa-IR');
    const adToAdd = { ...newAd, id, createdAt };
    setAds(prev => [...prev, adToAdd]);
    addAuditEntry(`افزودن آگهی جدید با عنوان "${newAd.title}"`);
    // reset form
    setNewAd({
      id: '',
      title: '',
      description: '',
      price: '',
      type: 'rent',
      category: '',
      location: { province: '', city: '' },
      image: '',
      featured: false,
      specs: {
        brand: '',
        model: '',
        year: 0,
        hours: 0,
        condition: ''
      },
      contact: { name: '', phone: '' },
      createdAt: ''
    });
    setShowNewAdForm(false);
  };

  const handleDeleteAd = (id: string) => {
    const ad = ads.find(item => item.id === id);
    // soft delete: move to deletedAds instead of permanent removal
    setAds(prev => prev.filter(item => item.id !== id));
    if (ad) {
      setDeletedAds(prev => [...prev, { ...ad }]);
      addAuditEntry(`حذف آگهی "${ad.title}" (انتقال به سطل بازیابی)`);
    }
  };

  const toggleFeatured = (id: string) => {
    setAds(prev => prev.map(item => item.id === id ? { ...item, featured: !item.featured } : item));
    const ad = ads.find(item => item.id === id);
    if (ad) addAuditEntry(`تغییر وضعیت ویژه برای آگهی "${ad.title}"`);
  };

  /**
   * Helpers for category management
   */
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    setCategoryList(prev => [...prev, trimmed]);
    setNewCategoryName('');
    addAuditEntry(`افزودن دسته جدید "${trimmed}"`);
  };

  const handleDeleteCategory = (name: string) => {
    setCategoryList(prev => prev.filter(cat => cat !== name));
    addAuditEntry(`حذف دسته "${name}"`);
  };

  /**
   * Helpers for user management
   */
  const handleRoleChange = (username: string, newRole: string) => {
    setUserList(prev => prev.map(u => {
      if (u.username === username) {
        // Find permissions for the selected role. If not found default to empty.
        const roleDef = roles.find(r => r.name === newRole);
        const perms = roleDef ? roleDef.permissions : [];
        return { ...u, role: newRole, permissions: perms };
      }
      return u;
    }));
    addAuditEntry(`تغییر نقش کاربر ${username} به ${newRole}`);
  };

  const handleDeleteUser = (username: string) => {
    setUserList(prev => prev.filter(u => u.username !== username));
    addAuditEntry(`حذف کاربر ${username}`);
  };

  const handleAddUser = () => {
    // simple prompt-based user creation
    const username = prompt('نام کاربری جدید را وارد کنید');
    if (!username) return;
    const password = prompt('رمز عبور را وارد کنید') || '';
    const role = prompt('نقش کاربر را وارد کنید (admin/manager/moderator/user)', 'user') || 'user';
    // assign default permissions based on role
    let permissions: string[] = [];
    // Look up permissions from the defined roles state. If none found fall back to empty.
    const roleDef = roles.find(r => r.name === role);
    permissions = roleDef ? roleDef.permissions : [];
    setUserList(prev => [...prev, { username, password, role, permissions, blocked: false }]);
    addAuditEntry(`افزودن کاربر جدید با نام کاربری ${username}`);
  };

  /**
   * Helpers for messaging
   */
  const handleSendMessage = () => {
    const trimmed = newMessageContent.trim();
    if (!trimmed || !currentUser) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: currentUser.username,
      content: trimmed,
      createdAt: new Date()
    };
    setMessagesList(prev => [...prev, newMsg]);
    setNewMessageContent('');
  };

  /**
   * Backup helper: creates a JSON blob of the current state
   * and triggers a download. This simulates exporting the
   * database as a backup file.
   */
  const handleDownloadBackup = () => {
    const data = {
      ads,
      categories: categoryList,
      users: userList,
      messages: messagesList
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">پ</span>
            </div>
            <CardTitle className="text-2xl gradient-text">پنل مدیریت</CardTitle>
            <p className="text-muted-foreground">وارد حساب کاربری خود شوید</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام کاربری</label>
              <Input
                type="text"
                placeholder="نام کاربری خود را وارد کنید"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رمز عبور</label>
              <div className="relative">
                <Input
                  type={loginForm.showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setLoginForm({...loginForm, showPassword: !loginForm.showPassword})}
                >
                  {loginForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full">
              ورود به پنل
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              برای دسترسی به پنل مدیریت باید حساب کاربری معتبر داشته باشید
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">پ</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">پنل مدیریت</h1>
              <p className="text-xs text-muted-foreground">پارس اکسکاواتور</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Badge variant="secondary">{currentUser?.role}</Badge>
            <span className="text-sm">سلام، {currentUser?.username}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-border min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>داشبورد</span>
            </button>

            {hasPermission('ads') && (
              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                  activeTab === 'ads' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>مدیریت آگهی‌ها</span>
              </button>
            )}

            {hasPermission('users') && (
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                  activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>مدیریت کاربران</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                activeTab === 'categories' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span>دسته‌بندی‌ها</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                activeTab === 'messages' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>پیام‌رسانی</span>
            </button>

            {hasPermission('all') && (
              <>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                    activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>تنظیمات سایت</span>
                </button>

                {/* Products management navigation */}
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                    activeTab === 'products' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>مدیریت محصولات</span>
                </button>

                <button
                  onClick={() => setActiveTab('vip')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                    activeTab === 'vip' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Crown className="w-5 h-5" />
                  <span>مدیریت VIP</span>
                </button>
              </>
            )}

            {hasPermission('reports') && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                  activeTab === 'reports' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>گزارشات پیشرفته</span>
              </button>
            )}

            {hasPermission('all') && (
              <>
                <button
                  onClick={() => setActiveTab('backup')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                    activeTab === 'backup' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  <span>پشتیبان‌گیری</span>
                </button>

                <button
                  onClick={() => setActiveTab('admins')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                    activeTab === 'admins' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <UserCog className="w-5 h-5" />
                  <span>مدیریت ادمین‌ها</span>
                </button>
                {/* Roles management */}
                {hasPermission('roles') && (
                  <button
                    onClick={() => setActiveTab('roles')}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                      activeTab === 'roles' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>مدیریت نقش‌ها</span>
                  </button>
                )}
                {/* Audit log */}
                {hasPermission('audit') && (
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                      activeTab === 'audit' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <History className="w-5 h-5" />
                    <span>گزارش وقایع</span>
                  </button>
                )}
                {/* Comments moderation */}
                {hasPermission('comments') && (
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                      activeTab === 'comments' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Edit className="w-5 h-5" />
                    <span>نظرات کاربران</span>
                  </button>
                )}
                {/* Blocked users */}
                {hasPermission('blocked') && (
                  <button
                    onClick={() => setActiveTab('blocked')}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                      activeTab === 'blocked' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <UserMinus className="w-5 h-5" />
                    <span>کاربران مسدود</span>
                  </button>
                )}
                {/* Trash / recycle bin */}
                {hasPermission('trash') && (
                  <button
                    onClick={() => setActiveTab('trash')}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${
                      activeTab === 'trash' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Archive className="w-5 h-5" />
                    <span>سطل بازیابی</span>
                  </button>
                )}
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">داشبورد</h2>
                <p className="text-muted-foreground">خلاصه‌ای از وضعیت سایت</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">کل آگهی‌ها</p>
                        <p className="text-2xl font-bold text-primary">{featuredMachinery.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">کاربران فعال</p>
                        <p className="text-2xl font-bold text-secondary">۱۲۴</p>
                      </div>
                      <Users className="w-8 h-8 text-secondary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">بازدید امروز</p>
                        <p className="text-2xl font-bold text-success">۱،۲۳۴</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-success/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">درآمد ماه</p>
                        <p className="text-2xl font-bold text-primary">۱۲،۵۰۰،۰۰۰</p>
                      </div>
                      <Package className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>فعالیت‌های اخیر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p className="flex-1">آگهی جدید "بیل مکانیکی کوماتسو" ثبت شد</p>
                      <span className="text-xs text-muted-foreground">۲ ساعت پیش</span>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <p className="flex-1">کاربر جدید "احمد محمدی" ثبت نام کرد</p>
                      <span className="text-xs text-muted-foreground">۴ ساعت پیش</span>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <p className="flex-1">آگهی "لودر چرخی ولوو" تأیید شد</p>
                      <span className="text-xs text-muted-foreground">۶ ساعت پیش</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ads Management */}
          {activeTab === 'ads' && hasPermission('ads') && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">مدیریت آگهی‌ها</h2>
                  <p className="text-muted-foreground">مدیریت تمامی آگهی‌های سایت</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <Input
                    value={adsSearchQuery}
                    onChange={(e) => setAdsSearchQuery(e.target.value)}
                    placeholder="جستجو در عنوان، قیمت یا استان..."
                    className="md:w-48"
                  />
                  <Select
                    value={adsSortBy}
                    onValueChange={(value) => setAdsSortBy(value as 'date' | 'price-asc' | 'price-desc')}
                  >
                    <SelectTrigger className="md:w-40">
                      <SelectValue placeholder="مرتب‌سازی" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">تاریخ</SelectItem>
                      <SelectItem value="price-asc">قیمت صعودی</SelectItem>
                      <SelectItem value="price-desc">قیمت نزولی</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowNewAdForm(!showNewAdForm)}>
                    <Plus className="w-4 h-4 ml-2" />
                    {showNewAdForm ? 'بستن فرم' : 'افزودن آگهی جدید'}
                  </Button>
                </div>
              </div>

              {/* New ad form */}
              {showNewAdForm && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-lg">ثبت آگهی جدید</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">عنوان آگهی *</label>
                        <Input
                          value={newAd.title}
                          onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                          placeholder="عنوان"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">قیمت *</label>
                        <Input
                          value={newAd.price}
                          onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
                          placeholder="قیمت به تومان"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">نوع *</label>
                        <Select
                          value={newAd.type}
                          onValueChange={(value) => setNewAd({ ...newAd, type: value as 'rent' | 'sale' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="نوع آگهی" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rent">اجاره</SelectItem>
                            <SelectItem value="sale">فروش</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">دسته بندی *</label>
                        <Select
                          value={newAd.category}
                          onValueChange={(value) => setNewAd({ ...newAd, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب دسته" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryList.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">استان</label>
                        <Select
                          value={newAd.location.province}
                          onValueChange={(value) => setNewAd({ ...newAd, location: { ...newAd.location, province: value }, })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب استان" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.slice(1).map((prov) => (
                              <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">شهر</label>
                        <Input
                          value={newAd.location.city}
                          onChange={(e) => setNewAd({ ...newAd, location: { ...newAd.location, city: e.target.value } })}
                          placeholder="نام شهر"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewAdForm(false)}>
                        انصراف
                      </Button>
                      <Button onClick={handleAddAd}>
                        ثبت آگهی
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bulk actions for selected ads */}
              {selectedAdIds.size > 0 && (
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => {
                    // perform bulk delete
                    Array.from(selectedAdIds).forEach(id => handleDeleteAd(id));
                    setSelectedAdIds(new Set());
                  }}>
                    حذف دسته‌جمعی
                  </Button>
                  <Button onClick={() => {
                    // toggle VIP for selected items
                    Array.from(selectedAdIds).forEach(id => toggleFeatured(id));
                    setSelectedAdIds(new Set());
                  }}>
                    تغییر وضعیت VIP دسته‌جمعی
                  </Button>
                </div>
              )}

              {/* Rent Ads Table */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">آگهی‌های اجاره</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="p-4"></th>
                            <th className="text-right p-4">عنوان</th>
                            <th className="text-right p-4">قیمت</th>
                            <th className="text-right p-4">موقعیت</th>
                            <th className="text-right p-4">ویژه؟</th>
                            <th className="text-right p-4">عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* compute filtered and sorted ads for rent */}
                          {ads
                            .filter((ad) => ad.type === 'rent')
                            .filter((ad) => {
                              const query = adsSearchQuery.toLowerCase().trim();
                              if (!query) return true;
                              const combined = `${ad.title ?? ''} ${ad.description ?? ''} ${ad.location?.province ?? ''} ${ad.price ?? ''}`.toLowerCase();
                              return combined.includes(query);
                            })
                            .sort((a, b) => {
                              if (adsSortBy === 'price-asc') {
                                const pa = parseInt(a.price.toString().replace(/\D/g, '')) || 0;
                                const pb = parseInt(b.price.toString().replace(/\D/g, '')) || 0;
                                return pa - pb;
                              }
                              if (adsSortBy === 'price-desc') {
                                const pa = parseInt(a.price.toString().replace(/\D/g, '')) || 0;
                                const pb = parseInt(b.price.toString().replace(/\D/g, '')) || 0;
                                return pb - pa;
                              }
                              // default: sort by createdAt (most recent first)
                              const da = new Date(a.createdAt || '').getTime() || 0;
                              const db = new Date(b.createdAt || '').getTime() || 0;
                              return db - da;
                            })
                            .map((item) => (
                              <tr key={item.id} className="border-b hover:bg-muted/50">
                                <td className="p-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedAdIds.has(item.id)}
                                    onChange={(e) => {
                                      const newSet = new Set(selectedAdIds);
                                      if (e.target.checked) {
                                        newSet.add(item.id);
                                      } else {
                                        newSet.delete(item.id);
                                      }
                                      setSelectedAdIds(newSet);
                                    }}
                                  />
                                </td>
                                <td className="p-4 font-medium">{item.title}</td>
                                <td className="p-4">{item.price} تومان</td>
                                <td className="p-4">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 ml-1" />
                                    {item.location.province || '-'}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant={item.featured ? 'default' : 'secondary'} onClick={() => toggleFeatured(item.id)} className="cursor-pointer">
                                    {item.featured ? 'ویژه' : 'معمولی'}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    {/* Edit operation could be implemented here */}
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAd(item.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sale Ads Table */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">آگهی‌های فروش</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="p-4"></th>
                            <th className="text-right p-4">عنوان</th>
                            <th className="text-right p-4">قیمت</th>
                            <th className="text-right p-4">موقعیت</th>
                            <th className="text-right p-4">ویژه؟</th>
                            <th className="text-right p-4">عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ads
                            .filter((ad) => ad.type === 'sale')
                            .filter((ad) => {
                              const query = adsSearchQuery.toLowerCase().trim();
                              if (!query) return true;
                              const combined = `${ad.title ?? ''} ${ad.description ?? ''} ${ad.location?.province ?? ''} ${ad.price ?? ''}`.toLowerCase();
                              return combined.includes(query);
                            })
                            .sort((a, b) => {
                              if (adsSortBy === 'price-asc') {
                                const pa = parseInt(a.price.toString().replace(/\D/g, '')) || 0;
                                const pb = parseInt(b.price.toString().replace(/\D/g, '')) || 0;
                                return pa - pb;
                              }
                              if (adsSortBy === 'price-desc') {
                                const pa = parseInt(a.price.toString().replace(/\D/g, '')) || 0;
                                const pb = parseInt(b.price.toString().replace(/\D/g, '')) || 0;
                                return pb - pa;
                              }
                              const da = new Date(a.createdAt || '').getTime() || 0;
                              const db = new Date(b.createdAt || '').getTime() || 0;
                              return db - da;
                            })
                            .map((item) => (
                              <tr key={item.id} className="border-b hover:bg-muted/50">
                                <td className="p-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedAdIds.has(item.id)}
                                    onChange={(e) => {
                                      const newSet = new Set(selectedAdIds);
                                      if (e.target.checked) {
                                        newSet.add(item.id);
                                      } else {
                                        newSet.delete(item.id);
                                      }
                                      setSelectedAdIds(newSet);
                                    }}
                                  />
                                </td>
                                <td className="p-4 font-medium">{item.title}</td>
                                <td className="p-4">{item.price} تومان</td>
                                <td className="p-4">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 ml-1" />
                                    {item.location.province || '-'}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant={item.featured ? 'default' : 'secondary'} onClick={() => toggleFeatured(item.id)} className="cursor-pointer">
                                    {item.featured ? 'ویژه' : 'معمولی'}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAd(item.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Categories Management */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
                  <p className="text-muted-foreground">مدیریت دسته‌بندی‌های ماشین‌آلات</p>
                </div>
                {/* Add new category input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="نام دسته جدید"
                    className="w-40"
                  />
                  <Button onClick={handleAddCategory}>
                    <Plus className="w-4 h-4 ml-2" />
                    افزودن
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryList.map((category) => (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{category}</h3>
                          <p className="text-sm text-muted-foreground">
                            {ads.filter((a) => a.category === category).length} آگهی
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {/* Category deletion */}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && hasPermission('all') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">تنظیمات سایت</h2>
                <p className="text-muted-foreground">تنظیمات عمومی و پیکربندی سایت</p>
              </div>

              <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="general">عمومی</TabsTrigger>
                  <TabsTrigger value="seo">سئو</TabsTrigger>
                  <TabsTrigger value="advanced">پیشرفته</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>اطلاعات عمومی سایت</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">عنوان سایت</label>
                          <Input defaultValue="پارس اکسکاواتور" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ایمیل تماس</label>
                          <Input defaultValue="info@parsexcavator.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">شماره تماس</label>
                          <Input defaultValue="۰۲۱-۸۸۷۷۶۶۵۵" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">آدرس</label>
                          <Input defaultValue="تهران، میدان انقلاب" />
                        </div>
                      </div>
                      <Button>ذخیره تغییرات</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>تنظیمات سئو</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">کلمات کلیدی</label>
                        <Input defaultValue="اجاره ماشین آلات، فروش ماشین آلات، بیل مکانیکی" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Google Analytics ID</label>
                        <Input placeholder="GA-XXXXXXXXX-X" />
                      </div>
                      <Button>ذخیره تغییرات</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>تنظیمات پیشرفته</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">حداکثر تصاویر هر آگهی</label>
                        <Input type="number" defaultValue="5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">مدت نمایش آگهی (روز)</label>
                        <Input type="number" defaultValue="30" />
                      </div>
                      <Button>ذخیره تغییرات</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Other tabs with placeholder content */}
          {activeTab === 'users' && hasPermission('users') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">مدیریت کاربران</h2>
                <Button onClick={handleAddUser}>
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن کاربر
                </Button>
              </div>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">نام کاربری</th>
                        <th className="text-right p-4">نقش</th>
                        <th className="text-right p-4">مجوزها</th>
                        <th className="text-right p-4">وضعیت</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((u) => (
                        <tr key={u.username} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{u.username}</td>
                          <td className="p-4">
                            <Select
                              value={u.role}
                              onValueChange={(value) => handleRoleChange(u.username, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="نقش" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">ادمین</SelectItem>
                                <SelectItem value="manager">مدیر</SelectItem>
                                <SelectItem value="moderator">ناظر</SelectItem>
                                <SelectItem value="user">کاربر</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            {u.permissions.length > 0 ? u.permissions.join(', ') : '-'}
                          </td>
                          <td className="p-4 text-sm">
                            {u.blocked ? 'مسدود' : 'فعال'}
                          </td>
                          <td className="p-4 flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.username)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setUserList(prev => prev.map(user => user.username === u.username ? { ...user, blocked: !user.blocked } : user));
                                addAuditEntry(`${u.blocked ? 'رفع انسداد' : 'انسداد'} کاربر ${u.username}`);
                              }}
                            >
                              {u.blocked ? 'رفع انسداد' : 'مسدود'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">سیستم پیام‌رسانی</h2>
              <Card className="max-h-[60vh] overflow-y-auto">
                <CardContent className="p-4 space-y-4">
                  {messagesList.length === 0 ? (
                    <p className="text-muted-foreground text-center">هنوز پیامی ارسال نشده است</p>
                  ) : (
                    messagesList.slice().reverse().map((msg) => (
                      <div key={msg.id} className="border p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">{msg.createdAt.toLocaleString('fa-IR')}</span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))
                  )}
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <div className="flex flex-col w-full space-y-2">
                    <Textarea
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSendMessage}>ارسال پیام</Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === 'vip' && hasPermission('all') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">مدیریت VIP</h2>
              {ads.filter((a) => a.featured).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">هیچ آگهی ویژه‌ای وجود ندارد</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-right p-4">عنوان</th>
                            <th className="text-right p-4">نوع</th>
                            <th className="text-right p-4">قیمت</th>
                            <th className="text-right p-4">موقعیت</th>
                            <th className="text-right p-4">عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ads.filter((a) => a.featured).map((item) => (
                            <tr key={item.id} className="border-b hover:bg-muted/50">
                              <td className="p-4 font-medium">{item.title}</td>
                              <td className="p-4">{item.type === 'rent' ? 'اجاره' : 'فروش'}</td>
                              <td className="p-4">{item.price} تومان</td>
                              <td className="p-4">
                                {item.location.province || '-'}
                              </td>
                              <td className="p-4">
                                <Button variant="ghost" size="sm" onClick={() => toggleFeatured(item.id)}>
                                  حذف از VIP
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'reports' && hasPermission('reports') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">گزارشات</h2>
              <p className="text-muted-foreground">آمار کلی وبسایت را مشاهده کنید</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">تعداد کل آگهی‌ها</p>
                        <p className="text-2xl font-bold text-primary">{ads.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">آگهی‌های اجاره</p>
                        <p className="text-2xl font-bold text-secondary">{ads.filter(a => a.type === 'rent').length}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-secondary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">آگهی‌های فروش</p>
                        <p className="text-2xl font-bold text-success">{ads.filter(a => a.type === 'sale').length}</p>
                      </div>
                      <Package className="w-8 h-8 text-success/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">آگهی‌های ویژه</p>
                        <p className="text-2xl font-bold text-primary">{ads.filter(a => a.featured).length}</p>
                      </div>
                      <Crown className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">تعداد کاربران</p>
                        <p className="text-2xl font-bold text-secondary">{userList.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-secondary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">تعداد دسته‌ها</p>
                        <p className="text-2xl font-bold text-success">{categoryList.length}</p>
                      </div>
                      <FolderOpen className="w-8 h-8 text-success/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'backup' && hasPermission('all') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">پشتیبان‌گیری</h2>
              <p className="text-muted-foreground">می‌توانید از اطلاعات فعلی یک فایل پشتیبان تهیه کنید</p>
              <Card>
                <CardContent className="p-8 flex flex-col items-center gap-4">
                  <Database className="w-16 h-16 text-muted-foreground" />
                  <Button onClick={handleDownloadBackup}>دانلود فایل پشتیبان</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'products' && hasPermission('all') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">مدیریت محصولات / قطعات</h2>
              <p className="text-muted-foreground">محصولات افزوده شده توسط فروشندگان</p>
              {productList.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    محصولی ثبت نشده است
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-right p-4">نام</th>
                          <th className="text-right p-4">دسته‌بندی</th>
                          <th className="text-right p-4">قیمت</th>
                          <th className="text-right p-4">فروشنده</th>
                          <th className="text-right p-4">تاریخ</th>
                          <th className="text-right p-4">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{product.name}</td>
                            <td className="p-4">{product.category}</td>
                            <td className="p-4">{product.price.toLocaleString('fa-IR')} تومان</td>
                            <td className="p-4">{product.seller.name}</td>
                            <td className="p-4">{product.createdAt}</td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteProductAdmin(product.id)}>
                                حذف
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'admins' && hasPermission('all') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">مدیریت ادمین‌ها</h2>
              <p className="text-muted-foreground">کاربران دارای نقش ادمین در سیستم</p>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">نام کاربری</th>
                        <th className="text-right p-4">نقش</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.filter((u) => u.role === 'admin').map((admin) => (
                        <tr key={admin.username} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{admin.username}</td>
                          <td className="p-4">ادمین</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              <div className="flex items-center gap-4">
                <Select onValueChange={(value) => handleRoleChange(value, 'admin')}>
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="افزودن کاربر به ادمین" />
                  </SelectTrigger>
                  <SelectContent>
                    {userList.filter((u) => u.role !== 'admin').map((user) => (
                      <SelectItem key={user.username} value={user.username}>{user.username}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">یک کاربر انتخاب و به ادمین ارتقا دهید</span>
              </div>
            </div>
          )}

          {/* Roles Management */}
          {activeTab === 'roles' && hasPermission('roles') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">مدیریت نقش‌ها</h2>
              <p className="text-muted-foreground">تعریف و ویرایش نقش‌های سفارشی</p>
              {/* New role creation form */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg">ایجاد نقش جدید</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">نام نقش</label>
                      <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="مثلاً supervisor" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">مجوزها</label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                        {[
                          'ads','users','reports','products','categories','messages','vip','backup','admins','roles','audit','comments','trash','blocked','settings'
                        ].map((perm) => (
                          <label key={perm} className="flex items-center space-x-2 space-x-reverse text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={newRolePermissions.includes(perm)}
                              onChange={(e) => {
                                const updated = new Set(newRolePermissions);
                                if (e.target.checked) {
                                  updated.add(perm);
                                } else {
                                  updated.delete(perm);
                                }
                                setNewRolePermissions(Array.from(updated));
                              }}
                            />
                            <span>{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      disabled={!newRoleName.trim() || newRolePermissions.length === 0}
                      onClick={() => {
                        if (!newRoleName.trim()) return;
                        // Prevent duplicate role names
                        if (roles.some(r => r.name === newRoleName.trim())) {
                          alert('نام نقش تکراری است');
                          return;
                        }
                        setRoles(prev => [...prev, { name: newRoleName.trim(), permissions: newRolePermissions }]);
                        addAuditEntry(`ایجاد نقش جدید "${newRoleName.trim()}"`);
                        setNewRoleName('');
                        setNewRolePermissions([]);
                      }}
                    >
                      ایجاد نقش
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Existing roles list */}
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">نام نقش</th>
                        <th className="text-right p-4">مجوزها</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role.name} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{role.name}</td>
                          <td className="p-4 text-sm">
                            {role.permissions.length > 0 ? role.permissions.join(', ') : '-'}
                          </td>
                          <td className="p-4">
                            {/* Delete role except built-in admin/manager/moderator/user */}
                            {['admin','manager','moderator','user'].includes(role.name) ? (
                              <span className="text-muted-foreground text-xs">سیستمی</span>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setRoles(prev => prev.filter(r => r.name !== role.name));
                                  addAuditEntry(`حذف نقش "${role.name}"`);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Audit Log */}
          {activeTab === 'audit' && hasPermission('audit') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">گزارش وقایع</h2>
              <p className="text-muted-foreground">ردیابی تمام عملیات حساس انجام‌شده در سیستم</p>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">زمان</th>
                        <th className="text-right p-4">کاربر</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.length === 0 ? (
                        <tr>
                          <td className="p-4 text-center text-muted-foreground" colSpan={3}>هنوز رویدادی ثبت نشده است</td>
                        </tr>
                      ) : (
                        auditLog
                          .slice()
                          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                          .map((entry) => (
                            <tr key={entry.id} className="border-b hover:bg-muted/50">
                              <td className="p-4 text-sm">
                                {entry.timestamp.toLocaleString('fa-IR')}
                              </td>
                              <td className="p-4 text-sm">{entry.user}</td>
                              <td className="p-4 text-sm">{entry.action}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Comments moderation */}
          {activeTab === 'comments' && hasPermission('comments') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">نظرات کاربران</h2>
              <p className="text-muted-foreground">مدیریت و تأیید یا رد نظرات ثبت‌شده</p>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">کاربر</th>
                        <th className="text-right p-4">محصول</th>
                        <th className="text-right p-4">امتیاز</th>
                        <th className="text-right p-4">متن</th>
                        <th className="text-right p-4">وضعیت</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">نظری ثبت نشده است</td>
                        </tr>
                      ) : (
                        comments.map((c) => {
                          const productName = productList.find(p => p.id === c.productId)?.name || 'نامشخص';
                          return (
                            <tr key={c.id} className="border-b hover:bg-muted/50">
                              <td className="p-4 text-sm">{c.user}</td>
                              <td className="p-4 text-sm">{productName}</td>
                              <td className="p-4 text-sm">{c.rating}</td>
                              <td className="p-4 text-sm">{c.content}</td>
                              <td className="p-4 text-sm">
                                {c.status === 'approved' ? 'تأیید شده' : c.status === 'rejected' ? 'رد شده' : 'در انتظار'}
                              </td>
                              <td className="p-4 flex gap-2">
                                {c.status !== 'approved' && (
                                  <Button variant="default" size="sm" onClick={() => {
                                    setComments(prev => prev.map(cm => cm.id === c.id ? { ...cm, status: 'approved' } : cm));
                                    addAuditEntry(`تأیید نظر از کاربر ${c.user}`);
                                  }}>
                                    تأیید
                                  </Button>
                                )}
                                {c.status !== 'rejected' && (
                                  <Button variant="destructive" size="sm" onClick={() => {
                                    setComments(prev => prev.map(cm => cm.id === c.id ? { ...cm, status: 'rejected' } : cm));
                                    addAuditEntry(`رد نظر از کاربر ${c.user}`);
                                  }}>
                                    رد
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setComments(prev => prev.filter(cm => cm.id !== c.id));
                                  addAuditEntry(`حذف نظر از کاربر ${c.user}`);
                                }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Blocked Users */}
          {activeTab === 'blocked' && hasPermission('blocked') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">کاربران مسدود</h2>
              <p className="text-muted-foreground">لیست کاربران مسدود شده و امکان رفع انسداد</p>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">نام کاربری</th>
                        <th className="text-right p-4">نقش</th>
                        <th className="text-right p-4">وضعیت</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.filter(u => u.blocked).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">کاربر مسدودی وجود ندارد</td>
                        </tr>
                      ) : (
                        userList.filter(u => u.blocked).map(u => (
                          <tr key={u.username} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{u.username}</td>
                            <td className="p-4">{u.role}</td>
                            <td className="p-4">مسدود</td>
                            <td className="p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUserList(prev => prev.map(user => user.username === u.username ? { ...user, blocked: false } : user));
                                  addAuditEntry(`رفع انسداد کاربر ${u.username}`);
                                }}
                              >
                                رفع انسداد
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trash / Recycle Bin */}
          {activeTab === 'trash' && hasPermission('trash') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">سطل بازیابی</h2>
              <p className="text-muted-foreground">آیتم‌های حذف شده را بازیابی یا حذف دائمی کنید</p>
              {/* Deleted Ads */}
              <h3 className="font-semibold text-lg">آگهی‌ها</h3>
              <Card className="mb-6">
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">عنوان</th>
                        <th className="text-right p-4">نوع</th>
                        <th className="text-right p-4">قیمت</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedAds.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">هیچ آگهی‌ای در سطل نیست</td>
                        </tr>
                      ) : (
                        deletedAds.map(item => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{item.title}</td>
                            <td className="p-4">{item.type === 'rent' ? 'اجاره' : 'فروش'}</td>
                            <td className="p-4">{item.price}</td>
                            <td className="p-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // restore ad
                                  setDeletedAds(prev => prev.filter(a => a.id !== item.id));
                                  setAds(prev => [...prev, item]);
                                  addAuditEntry(`بازیابی آگهی "${item.title}"`);
                                }}
                              >
                                بازیابی
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setDeletedAds(prev => prev.filter(a => a.id !== item.id));
                                  addAuditEntry(`حذف دائمی آگهی "${item.title}"`);
                                }}
                              >
                                حذف دائمی
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              {/* Deleted Products */}
              <h3 className="font-semibold text-lg">محصولات</h3>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-right p-4">نام</th>
                        <th className="text-right p-4">دسته‌بندی</th>
                        <th className="text-right p-4">قیمت</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">هیچ محصولی در سطل نیست</td>
                        </tr>
                      ) : (
                        deletedProducts.map(item => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4">{item.category}</td>
                            <td className="p-4">{item.price.toLocaleString('fa-IR')}</td>
                            <td className="p-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDeletedProducts(prev => prev.filter(p => p.id !== item.id));
                                  setProductList(prev => [...prev, item]);
                                  addAuditEntry(`بازیابی محصول "${item.name}"`);
                                }}
                              >
                                بازیابی
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setDeletedProducts(prev => prev.filter(p => p.id !== item.id));
                                  addAuditEntry(`حذف دائمی محصول "${item.name}"`);
                                }}
                              >
                                حذف دائمی
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
