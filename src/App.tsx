import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { handleGoogleRedirect } from './lib/googleAuth';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import WhyChooseUs from './components/WhyChooseUs';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import NewsletterPopup from './components/NewsletterPopup';
import WhatsAppChat from './components/WhatsAppChat';
import RecentlyViewed from './components/RecentlyViewed';
import CartDrawer from './components/CartDrawer';
import SearchBar from './components/SearchBar';

// Pages
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import BulkOrder from './pages/BulkOrder';
import Profile from './pages/Profile';
import Certifications from './pages/Certifications';
import Traceability from './pages/Traceability';
import Wishlist from './pages/Wishlist';
import AllProducts from './pages/AllProducts';

// Theme wrapper - placeholder for future use
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyChooseUs />
      <Products />
      <Testimonials />
      <RecentlyViewed />
      <Contact />
    </>
  );
}

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    handleGoogleRedirect();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar onCartClick={() => setCartOpen(true)} onSearchClick={() => setSearchOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NewsletterPopup />
      <WhatsAppChat />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/bulk-order" element={<BulkOrder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/traceability" element={<Traceability />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      
      {location.pathname === '/' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <ThemeWrapper>
            <AuthProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </AuthProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
