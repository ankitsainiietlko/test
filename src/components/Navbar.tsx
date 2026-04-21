import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Phone, Search, Heart, Sun, Moon, Leaf, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Traceability', href: '/traceability' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Bulk Order', href: '/bulk-order' },
];

interface NavbarProps {
  onCartClick: () => void;
  onSearchClick: () => void;
}

export default function Navbar({ onCartClick, onSearchClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-amber-600 text-white text-xs py-2.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              <Phone className="w-3 h-3" />
              +91 99997 69192
            </span>
            <span className="hidden sm:inline text-green-100">
              Free shipping on orders above ₹999
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-amber-900 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
              New User Offer
            </span>
            <span className="text-amber-100 font-medium">Use code: FRESH10</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || location.pathname !== '/' 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:shadow-green-600/50 transition-all duration-300 group-hover:scale-105">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-amber-900">100%</span>
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                  Givashu
                </h1>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest -mt-0.5">Agrotech</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 px-2 py-2 rounded-full">
              {navLinks.map((link) => {
                const linkKey = link.name.toLowerCase().replace(' ', '');
                const label = link.href === '/' ? t('home') : 
                           link.href === '/products' ? t('products') :
                           link.href === '/certifications' ? t('certifications') :
                           link.href === '/traceability' ? t('traceability') :
                           link.href === '/blogs' ? t('blog') :
                           link.href === '/bulk-order' ? t('bulkOrder') : link.name;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      location.pathname === link.href
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-green-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={onSearchClick} 
                className="p-3 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 rounded-full transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                onClick={toggleTheme} 
                className="p-3 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 rounded-full transition-all duration-300"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 rounded-full transition-all duration-300"
                title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
              
              <button 
                onClick={() => user ? navigate('/wishlist') : setAuthOpen(true)} 
                className="hidden sm:flex p-3 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-500 rounded-full transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => user ? navigate('/profile') : setAuthOpen(true)} 
                className="hidden sm:flex p-3 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 rounded-full transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onCartClick} 
                className="relative p-3 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 rounded-full transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
              
              <button
                className="md:hidden p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-xl">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const label = link.href === '/' ? t('home') : 
                           link.href === '/products' ? t('products') :
                           link.href === '/certifications' ? t('certifications') :
                           link.href === '/traceability' ? t('traceability') :
                           link.href === '/blogs' ? t('blog') :
                           link.href === '/bulk-order' ? t('bulkOrder') : link.name;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`block w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.href
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              <div className="border-t dark:border-gray-800 my-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    user ? navigate('/profile') : setAuthOpen(true);
                  }}
                  className="block w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/wishlist');
                  }}
                  className="block w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
