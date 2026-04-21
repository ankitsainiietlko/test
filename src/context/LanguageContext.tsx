import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    products: 'Products',
    blog: 'Blog',
    bulkOrder: 'Bulk Order',
    contact: 'Contact',
    certifications: 'Certifications',
    traceability: 'Traceability',
    profile: 'Profile',
    wishlist: 'Wishlist',
    orders: 'Orders',
    search: 'Search...',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    viewAll: 'View All',
    freeDelivery: 'Free Delivery',
    securePayment: 'Secure Payment',
    certifiedOrganic: 'Certified Organic',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    description: 'Description',
    nutrition: 'Nutrition Facts',
    reviews: 'Reviews',
    howToUse: 'How to Use',
    writeReview: 'Write a Review',
    submitReview: 'Submit Review',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    myAccount: 'My Account',
    checkout: 'Checkout',
    placeOrder: 'Place Order',
    orderPlaced: 'Order Placed!',
    thankYou: 'Thank you for your order!',
    ourProducts: 'Our Products',
    popularNow: 'Popular Right Now',
    discoverProducts: 'Discover our bestsellers',
    allProducts: 'All Products',
    browseCollection: 'Browse Collection',
    shopByCategory: 'Shop by Category',
    exploreText: 'Explore organic products from Indian farms',
    whyChooseUs: 'Why Choose Us',
    directFromFarmers: 'Direct from Farmers',
    organicCertified: 'Certified Organic',
    fastDelivery: 'Fast Delivery',
    customerReviews: 'Customer Reviews',
    whatCustomersSay: 'What Our Customers Say',
    joinThousands: 'Join thousands of satisfied customers',
    getInTouch: 'Get In Touch',
    contactUs: 'Contact Us',
    questions: 'Have questions? We would love to hear from you.',
    letsTalk: "Let's Start a Conversation",
    headOffice: 'Head Office',
    phone: 'Phone',
    email: 'Email',
    workingHours: 'Working Hours',
    sendMessage: 'Send Message',
    fullName: 'Full Name',
    message: 'Message',
    thankYouMessage: 'Your message has been sent successfully.',
    sendAnother: 'Send another message',
    viewDetails: 'View Details',
    keyBenefits: 'Key Benefits',
    howToStore: 'How to Store',
    tips: 'Tips',
    perfectSnacking: 'Perfect for snacking directly from the package',
    addToChaats: 'Add to chaats and desserts for extra crunch',
    consumeWithin: 'Best consumed within 3 months of opening',
    storeInFridge: 'Can be stored in refrigerator for extended shelf life',
    storeCoolDry: 'Store in a cool, dry place away from direct sunlight',
    keepAirtight: 'Keep in an airtight container to maintain freshness',
    avoidMoisture: 'Avoid exposure to moisture',
    freshOrganic: '100% Organic & Natural',
    sourcedDirectly: 'Sourced directly from farmers',
    noAdditives: 'No preservatives or additives',
    ecoPackaging: 'Eco-friendly packaging',
  },
  hi: {
    home: 'होम',
    products: 'प्रोडक्ट्स',
    blog: 'ब्लॉग',
    bulkOrder: 'बल्क ऑर्डर',
    contact: 'संपर्क',
    certifications: 'प्रमाणपत्र',
    traceability: 'ट्रेसिबिलिटी',
    profile: 'प्रोफाइल',
    wishlist: 'विशलिस्ट',
    orders: 'ऑर्डर्स',
    search: 'खोजें...',
    addToCart: 'कार्ट में डालें',
    buyNow: 'अभी खरीदें',
    viewAll: 'सभी देखें',
    freeDelivery: 'फ्री डिलीवरी',
    securePayment: 'सुरक्षित भुगतान',
    certifiedOrganic: 'प्रमाणित जैविक',
    inStock: 'स्टॉक में',
    outOfStock: 'स्टॉक में नहीं',
    description: 'विवरण',
    nutrition: 'पोषण जानकारी',
    reviews: 'समीक्षाएं',
    howToUse: 'उपयोग कैसे करें',
    writeReview: 'समीक्षा लिखें',
    submitReview: 'समीक्षा भेजें',
    signIn: 'लॉगिन',
    signUp: 'रजिस्टर करें',
    signOut: 'लॉगआउट',
    myAccount: 'मेरा खाता',
    checkout: 'चेकआउट',
    placeOrder: 'ऑर्डर करें',
    orderPlaced: 'ऑर्डर हो गया!',
    thankYou: 'आपके ऑर्डर के लिए धन्यवाद!',
    ourProducts: 'हमारे प्रोडक्ट्स',
    popularNow: 'अभी प्रचलित',
    discoverProducts: 'हमारे बेस्टसेलर खोजें',
    allProducts: 'सभी प्रोडक्ट्स',
    browseCollection: 'संग्रह देखें',
    shopByCategory: 'श्रेणी के अनुसार खरीदें',
    exploreText: 'भारतीय खेतों से जैविक उत्पादों का अन्वेषण करें',
    whyChooseUs: 'क्यों चुनें हमें',
    directFromFarmers: 'सीधे किसानों से',
    organicCertified: 'प्रमाणित जैविक',
    fastDelivery: 'तेज़ डिलीवरी',
    customerReviews: 'ग्राहक समीक्षाएं',
    whatCustomersSay: 'हमारे ग्राहक क्या कहते हैं',
    joinThousands: 'हज़ारों संतुष्ट ग्राहकों में शामिल हों',
    getInTouch: 'संपर्क करें',
    contactUs: 'हमसे संपर्क करें',
    questions: 'प्रश्न हैं? हमें आपसे सुनना अच्छा लगेगा।',
    letsTalk: 'बातचीत शुरू करें',
    headOffice: 'मुख्य कार्यालय',
    phone: 'फ़ोन',
    email: 'ईमेल',
    workingHours: 'कार्य समय',
    sendMessage: 'संदेश भेजें',
    fullName: 'पूरा नाम',
    message: 'संदेश',
    thankYouMessage: 'आपका संदेश सफलतापूर्वक भेज दिया गया है।',
    sendAnother: 'दूसरा संदेश भेजें',
    viewDetails: 'विवरण देखें',
    keyBenefits: 'मुख्य लाभ',
    howToStore: 'कैसे स्टोर करें',
    tips: 'सुझाव',
    perfectSnacking: 'सीधे पैकेट से स्नैकिंग के लिए बढ़िया',
    addToChaats: 'चाट और मिठाई में क्रंच के लिए डालें',
    consumeWithin: 'खोलने के 3 महीने के भीतर उपभोग करें',
    storeInFridge: 'लंबी शेल्फ लाइफ के लिए फ्रिज में रखा जा सकता है',
    storeCoolDry: 'ठंडी, सूखी जगह में रखें',
    keepAirtight: 'ताज़गी बनाए रखने के लिए एयरटाइट कंटेनर में रखें',
    avoidMoisture: 'सड़ने से बचने के लिए नमी से बचें',
    freshOrganic: '100% जैविक और प्राकृतिक',
    sourcedDirectly: 'सीधे किसानों से प्राप्त',
    noAdditives: 'कोई परिरक्षक या additive नहीं',
    ecoPackaging: 'इको-फ्रेंडली पैकेजिंग',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}