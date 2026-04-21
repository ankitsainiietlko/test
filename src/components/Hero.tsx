import { useEffect, useState } from 'react';
import { ArrowRight, Leaf, Award, Truck, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const heroSlides = [
  {
    titleEn: "Nature's Finest",
    titleHi: "प्रकृति की सर्वश्रेष्ठ",
    subtitleEn: "Delivered Fresh",
    subtitleHi: "ताज़ा पहुंचाया जाता है",
    descriptionEn: "Premium organic makhana, farm-fresh mangoes, and authentic Indian spices sourced directly from certified organic farms across India.",
    descriptionHi: "प्रीमियम जैविक मखाना, खेत से ताज़ा आम और प्रामाणिक भारतीय मसाले, भारत भर के प्रमाणित जैविक खेतों से सीधे प्राप्त।",
    image: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ctaEn: "Explore Collection",
    ctaHi: "संग्रह देखें",
    color: "from-green-600 to-green-700"
  },
  {
    titleEn: "Fox Nuts",
    titleHi: "फॉक नट्स",
    subtitleEn: "The Superfood",
    subtitleHi: "सुपरफूड",
    descriptionEn: "Premium roasted makhana - gluten-free, high protein, low calorie. The perfect healthy snack for fitness enthusiasts and health-conscious families.",
    descriptionHi: "प्रीमियम रोस्टेड मखाना - ग्लूटेन-फ्री, उच्च प्रोटीन, कम कैलोरी। फिटनेस प्रेमियों और स्वास्थ्य-जागरूक परिवारों के लिए एकदम सही स्वस्थ स्नैक।",
    image: "https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ctaEn: "Shop Makhana",
    ctaHi: "मखाना खरीदें",
    color: "from-amber-500 to-amber-600"
  },
  {
    titleEn: "Royal Alphonso",
    titleHi: "रॉयल अल्फोंसो",
    subtitleEn: "King of Mangoes",
    subtitleHi: "आमों का राजा",
    descriptionEn: "Handpicked Devgad Alphonso mangoes, naturally ripened to perfection. Experience the authentic taste of India's most beloved fruit.",
    descriptionHi: "हाथ से चुने गए देवगढ़ अल्फोंसो आम, प्राकृतिक रूप सेपरफेक्शन तक पकाए गए। भारत के सबसे प्रिय फल की प्रामाणिक टेस्ट का अनुभव करें।",
    image: "https://images.pexels.com/photos/39303/mango-tropical-fruit-juicy-sweet-39303.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ctaEn: "Order Now",
    ctaHi: "अभी ऑर्डर करें",
    color: "from-orange-500 to-red-500"
  },
];

const trustBadges = [
  { icon: Leaf, textEn: "100% Organic", textHi: "100% जैविक", subtextEn: "Certified Products", subtextHi: "प्रमाणित उत्पाद" },
  { icon: Award, textEn: "Premium Quality", textHi: "प्रीमियम गुणवत्ता", subtextEn: "Farm Fresh", subtextHi: "खेत से ताज़ा" },
  { icon: Truck, textEn: "Pan India", textHi: "पान इंडिया", subtextEn: "Free Shipping >₹999", subtextHi: "₹999+ पर फ्री शिपिंग" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % heroSlides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-900">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={language === 'hi' ? slide.titleHi : slide.titleEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.2),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-medium">Trusted by 50,000+ Customers</span>
            </div>

            {/* Slide Content */}
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`space-y-6 transition-all duration-700 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'
                }`}
              >
                {index === currentSlide && (
                  <>
                    <div>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gradient-to-r ${slide.color} text-white shadow-lg`}>
                        {language === 'hi' ? slide.subtitleHi : slide.subtitleEn}
                      </span>
                      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                        {language === 'hi' ? slide.titleHi : slide.titleEn}
                      </h1>
                    </div>
                    
                    <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
                      {language === 'hi' ? slide.descriptionHi : slide.descriptionEn}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <button 
                        onClick={() => navigate('/products')}
                        className={`group px-8 py-4 bg-gradient-to-r ${slide.color} text-white font-semibold rounded-2xl shadow-xl shadow-green-900/30 hover:shadow-2xl hover:shadow-green-900/50 transition-all duration-300 flex items-center gap-3 hover:-translate-y-1`}
                      >
                        {language === 'hi' ? slide.ctaHi : slide.ctaEn}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Trust Cards */}
          <div className="hidden lg:block">
            <div className="space-y-4">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <badge.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{language === 'hi' ? badge.textHi : badge.textEn}</p>
                    <p className="text-gray-400 text-sm">{language === 'hi' ? badge.subtextHi : badge.subtextEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between">
          {/* Slide Indicators */}
          <div className="flex items-center gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-10 bg-gradient-to-r from-green-400 to-green-500' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button 
              onClick={prevSlide}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Trust Badges */}
      <div className="lg:hidden absolute bottom-24 left-4 right-4">
        <div className="flex justify-center gap-3">
          {trustBadges.slice(0, 2).map((badge, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full">
              <badge.icon className="w-4 h-4 text-green-400" />
              <span className="text-white text-xs font-medium">{language === 'hi' ? badge.textHi : badge.textEn}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
