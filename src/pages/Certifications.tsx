import { useEffect, useState } from 'react';
import { Award, Shield, Globe, Leaf, Check, TreePine, Droplets, Recycle, Truck, LeafyGreen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

interface Certification {
  id: number;
  name: string;
  image_url: string;
  description: string;
  valid_until: string;
}

interface SustainabilityMetric {
  label: string;
  value: string;
  icon: string;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase.from('certifications').select('*');
      if (error) throw error;
      setCertifications(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const getIcon = (name: string) => {
    if (name.includes('FSSAI')) return Shield;
    if (name.includes('Organic')) return Leaf;
    if (name.includes('ISO')) return Award;
    return Globe;
  };

  const sustainabilityMetrics: SustainabilityMetric[] = language === 'hi' 
    ? [
        { label: 'पेड़ लगाए गए', value: '50,000+', icon: 'tree' },
        { label: 'जल बचत', value: '2.5 करोड़ लीटर', icon: 'droplet' },
        { label: 'कार्बन कमी', value: '1,200 टन/वर्ष', icon: 'leaf' },
        { label: 'जैविक खेत', value: '10,000 एकड़', icon: 'farm' },
      ]
    : [
        { label: 'Trees Planted', value: '50,000+', icon: 'tree' },
        { label: 'Water Saved', value: '2.5 Crore Liters', icon: 'droplet' },
        { label: 'Carbon Reduced', value: '1,200 Tons/Year', icon: 'leaf' },
        { label: 'Organic Farms', value: '10,000 Acres', icon: 'farm' },
      ];

  const getMetricIcon = (icon: string) => {
    switch(icon) {
      case 'tree': return TreePine;
      case 'droplet': return Droplets;
      case 'leaf': return LeafyGreen;
      default: return Leaf;
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-green-600 font-medium">Our Commitment</span>
          <h1 className="text-4xl font-bold mt-2 mb-4 dark:text-white">
            {language === 'hi' ? 'प्रमाणपत्र और गुणवत्ता' : 'Certifications & Quality'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'हम गुणवत्ता और सुरक्षा के उच्चतम मानक बनाए रखते हैं। हमारे प्रमाणपत्र आपको सर्वोत्तम जैविक उत्पाद देने की हमारी प्रतिबद्धता को दर्शाते हैं।'
              : 'We maintain the highest standards of quality and safety. Our certifications reflect our commitment to providing you with the best organic products.'}
          </p>
        </div>

        {/* Sustainability Tracker */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">
            {language === 'hi' ? 'सस्टेनैबिलिटी ट्रैकर' : 'Sustainability Tracker'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sustainabilityMetrics.map((metric, index) => {
              const Icon = getMetricIcon(metric.icon);
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <Icon className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{metric.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sustainability Goals */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 mb-16 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Recycle className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-xl font-bold">{language === 'hi' ? 'शून्य प्लास्टिक' : 'Zero Plastic'}</h3>
              <p className="opacity-90">{language === 'hi' ? '2025 तक सभी पैकेजिंग' : 'All packaging by 2025'}</p>
            </div>
            <div className="text-center">
              <TreePine className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-xl font-bold">{language === 'hi' ? 'कार्बन नकारात्मक' : 'Carbon Negative'}</h3>
              <p className="opacity-90">{language === 'hi' ? '2026 तक शुद्ध शून्य' : 'Net zero by 2026'}</p>
            </div>
            <div className="text-center">
              <Truck className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-xl font-bold">{language === 'hi' ? 'इलेक्ट्रिक डिलीवरी' : 'Electric Delivery'}</h3>
              <p className="opacity-90">{language === 'hi' ? '2025 तक 50% वाहन' : '50% fleet by 2025'}</p>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">
          {language === 'hi' ? 'प्रमाणपत्र' : 'Certifications'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {certifications.map((cert) => {
            const Icon = getIcon(cert.name);
            return (
              <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{cert.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{cert.description}</p>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {language === 'hi' ? 'वैध तक: ' : 'Valid until '} 
                    {new Date(cert.valid_until).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Process */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">
            {language === 'hi' ? 'हमारी गुणवत्ता प्रक्���िया' : 'Our Quality Process'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 'Sourcing', descEn: 'Direct from certified organic farms', descHi: 'प्रमाणित जैविक खेतों से सीधे' },
              { step: 'Testing', descEn: 'Rigorous lab testing for purity', descHi: 'शुद्धता के लिए कठोर प्रयोगशाला परीक्षण' },
              { step: 'Processing', descEn: 'Hygienic processing facilities', descHi: 'स्वच्छ प्रसंस्करण सुविधाएं' },
              { step: 'Packaging', descEn: 'Eco-friendly sealed packaging', descHi: 'इको-फ्रेंडली सील पैकेजिंग' },
            ].map((item, i) => (
              <div key={item.step} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {i + 1}
                  </div>
                  {i < 3 && (
                    <div className="absolute top-1/2 left-full w-full h-0.5 bg-green-200 hidden md:block" style={{ transform: 'translateY(-50%)', width: '100%', zIndex: -1 }} />
                  )}
                </div>
                <h3 className="font-bold mb-2 dark:text-white">{item.step}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}