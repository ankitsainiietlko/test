import { Leaf, ShieldCheck, Users, Truck, HeartHandshake, Sprout, Award, Recycle } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All products are certified organic, grown without harmful pesticides or chemical fertilizers. Pure nature, nothing else.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    description: "Rigorous quality checks at every stage. From farm to your doorstep, we ensure only the best reaches you.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Users,
    title: "Farmer First",
    description: "Direct partnerships with 500+ farmers ensuring fair prices, sustainable livelihoods, and community growth.",
    color: "from-amber-500 to-amber-600"
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    description: "Fast, reliable delivery across all states. Temperature-controlled packaging maintains freshness.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: HeartHandshake,
    title: "24/7 Support",
    description: "Dedicated customer care team ready to assist you anytime. Your satisfaction is our priority.",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: Sprout,
    title: "Sustainable Farming",
    description: "Eco-friendly agricultural practices that protect our planet for future generations.",
    color: "from-teal-500 to-teal-600"
  },
];

const certifications = [
  { name: 'FSSAI', desc: 'Food Safety' },
  { name: 'India Organic', desc: 'NPOP Certified' },
  { name: 'USDA Organic', desc: 'US Standard' },
  { name: 'ISO 22000', desc: 'Food Safety' },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4" />
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-700 via-green-600 to-amber-600 bg-clip-text text-transparent">
              The Givashu Difference
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
            We are committed to bringing you the finest organic products while supporting 
            Indian farmers and protecting our environment
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-100 dark:to-gray-700/30 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Certifications Banner */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-amber-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Certified For Quality
              </h3>
              <p className="text-green-100">
                Our products meet the highest international standards
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 border border-white/30">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm">{cert.name}</p>
                  <p className="text-green-200 text-xs">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sustainability Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">Zero</p>
              <p className="text-gray-600 dark:text-gray-400">Plastic Packaging</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">10K+</p>
              <p className="text-gray-600 dark:text-gray-400">Trees Planted</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">500+</p>
              <p className="text-gray-600 dark:text-gray-400">Farmer Families</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
