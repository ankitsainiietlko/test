import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, User, CheckCircle, QrCode, Package, Truck, Store, Leaf } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export default function Traceability() {
  const [batchCode, setBatchCode] = useState('');
  const [traceData, setTraceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useLanguage();

  const sampleCodes = ['MKH240301', 'MNG240301', 'TRM240301'];

  const handleSearch = async () => {
    if (!batchCode) return;
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('traceability')
        .select('*, products(name)')
        .eq('batch_code', batchCode.toUpperCase())
        .single();
      if (error || !data) {
        setError(language === 'hi' ? 'बैच कोड नहीं मिला। कृपया सही कोड दर्ज करें।' : 'Batch code not found. Please enter a valid code.');
        setTraceData(null);
      } else {
        setTraceData(data);
      }
    } catch (err) {
      setError(language === 'hi' ? 'खोज में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error searching. Please try again.');
      setTraceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return language === 'hi' ? 'लागू नहीं' : 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <QrCode className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            {language === 'hi' ? 'प्रोडक्ट ट्रेसिबिलिटी' : 'Product Traceability'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'hi' 
              ? 'अपने प्रोडक्ट का बैच कोड दर्ज करें और खेत से आपके दरवाजे तक की यात्रा को ट्रैक करें'
              : 'Enter your product batch code to trace its journey from farm to your doorstep'}
          </p>
        </div>

        {/* Sample Codes */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{language === 'hi' ? 'नमूना कोड:' : 'Try sample codes:'}</span>
          {sampleCodes.map((code) => (
            <button
              key={code}
              onClick={() => setBatchCode(code)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs hover:bg-green-100 dark:hover:bg-green-900"
            >
              {code}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder={language === 'hi' ? 'बैच कोड दर्ज करें (जैसे MKH240301)' : 'Enter batch code (e.g., MKH240301)'}
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !batchCode}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? (language === 'hi' ? 'खोज रहे हैं...' : 'Searching...') : (language === 'hi' ? 'खोजें' : 'Trace')}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Manual Entry Guide */}
        {!traceData && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="font-bold mb-4 dark:text-white">{language === 'hi' ? 'QR कोड कैसे स्कैन करें:' : 'How to scan QR Code:'}</h3>
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>{language === 'hi' ? 'अपने फोन का कैमरा खोलें' : 'Open your phone camera'}</li>
              <li>{language === 'hi' ? 'प्रोडक्ट पैकेज पर QR कोड स्कैन करें' : 'Scan the QR code on the product package'}</li>
              <li>{language === 'hi' ? 'वेबसाइट पर उत्तर दें' : 'Landing page will show product journey'}</li>
            </ol>
          </div>
        )}

        {/* Results */}
        {traceData && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-in">
            {/* Header with QR */}
            <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
              <div>
                <span className="text-green-600 font-medium">Batch: {traceData.batch_code}</span>
                <h2 className="text-2xl font-bold mt-2 dark:text-white">
                  {traceData.products?.name || 'Product'}
                </h2>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCodeSVG value={traceData.qr_code || traceData.batch_code} size={80} />
                <p className="text-xs text-center mt-1 text-gray-500">{traceData.qr_code}</p>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="mb-8">
              <h3 className="font-bold mb-4 dark:text-white">{language === 'hi' ? 'उत्पाद यात्रा' : 'Product Journey'}</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block" />
                
                <div className="space-y-6">
                  {/* Farm */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white z-10">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold dark:text-white">{language === 'hi' ? 'ख��त' : 'Farm'}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{traceData.farm_name}</p>
                        </div>
                        <span className="text-sm text-green-600">{formatDate(traceData.harvest_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white z-10">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold dark:text-white">{language === 'hi' ? 'प्रसंस्करण' : 'Processing'}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'hi' ? 'गुणवत्ता जांच और पैकेजिंग' : 'Quality check & packaging'}</p>
                        </div>
                        <span className="text-sm text-green-600">{formatDate(traceData.processing_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dispatch */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white z-10">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold dark:text-white">{language === 'hi' ? 'डिस्पैच' : 'Dispatch'}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'hi' ? 'डिलीवरी के लिए भेजा गया' : 'Shipped for delivery'}</p>
                        </div>
                        <span className="text-sm text-green-600">{formatDate(traceData.packaging_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white z-10">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold dark:text-white">{language === 'hi' ? 'स्वागत' : 'Ready for you'}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'hi' ? 'आपके दरवाजे तक' : 'At your doorstep'}</p>
                        </div>
                        <span className="text-sm text-gray-500">{language === 'hi' ? 'तैयार' : 'Ready'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Info */}
            <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="dark:text-white">
                {language === 'hi' ? 'सर्वोत्तम उपयोग: ' : 'Best before: '} 
                {formatDate(traceData.expiry_date)}
              </span>
            </div>
          </div>
        )}

        {/* How it Works */}
        <div className="mt-12 text-center">
          <h3 className="font-bold mb-4 dark:text-white">{language === 'hi' ? 'यह कैसे काम करता है' : 'How it Works'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
              <QrCode className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm dark:text-gray-300">{language === 'hi' ? 'QR कोड खोजें' : 'Find QR Code'}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
              <Search className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm dark:text-gray-300">{language === 'hi' ? 'कोड दर्ज करें' : 'Enter Code'}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm dark:text-gray-300">{language === 'hi' ? 'जड़ें ट्रैक करें' : 'Track Origin'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}