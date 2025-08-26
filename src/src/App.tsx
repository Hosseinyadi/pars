import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import RentAds from "./pages/RentAds";
import SaleAds from "./pages/SaleAds";
import Admin from "./pages/Admin";
import PostAd from "./pages/PostAd";
import Auth from "./pages/Auth";
import SellerDashboard from "./pages/SellerDashboard";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/rent" element={<RentAds />} />
          <Route path="/sale" element={<SaleAds />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/post-ad" element={<PostAd />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/parts-services" element={<Search />} />
          <Route path="/blog" element={<Search />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
