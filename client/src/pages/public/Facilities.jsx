import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import SEO from '../../components/common/SEO';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { Building, BookOpen, Cpu, ShieldCheck, Dumbbell, Utensils, Wifi, Bus } from 'lucide-react';

const Facilities = () => {
  const { collegeInfo } = useCollege();

  const facilityHighlights = [
    { title: 'Central Automated Library', desc: '100,000+ volumes, 5,000+ journals, e-kiosks, and 24x7 digital reading hubs with gigabit optical fiber.', icon: BookOpen },
    { title: 'Supercomputing & AI Research Hub', desc: 'GPU clusters and virtualization testbeds for machine learning, big data simulation, and cryptographic research.', icon: Cpu },
    { title: 'Residential Hostels & Cafeterias', desc: 'Comfortable air-conditioned hostels for men and women with biometric access, hygienic dining, and infirmary.', icon: Building },
    { title: 'Olympic Sports & Fitness Complex', desc: 'Swimming pool, synthetic basketball and tennis courts, turf soccer arena, and fitness gymnasium.', icon: Dumbbell },
    { title: 'Smart Wi-Fi Campus & Eco Systems', desc: '400 Gbps network backbone, solar energy panels, rainwater harvesting, and zero-discharge waste treatment.', icon: Wifi },
    { title: 'Fleet Transport Services', desc: 'Extensive fleet of air-conditioned GPS-enabled buses connecting all metropolitan routes.', icon: Bus },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Campus Infrastructure & Facilities"
        description="Explore the laboratories, central library, computational centers, hostels, athletic complexes, and transport facilities at Apex Institute."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            World-Class Infrastructure
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Campus Infrastructure & Facilities
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            A 55-acre eco-smart campus equipped with vanguard laboratories, high-performance computing centers, and comprehensive sports amenities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Dynamic Admin Infrastructure Text */}
        {collegeInfo?.infrastructure && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-academic-navy font-heading">
              Infrastructure Overview
            </h2>
            <div className="text-slate-700 leading-relaxed text-base">
              <RichTextRenderer content={collegeInfo.infrastructure} />
            </div>
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilityHighlights.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-900 flex items-center justify-center mb-6 shadow-inner border border-primary-100">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-academic-navy font-heading mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
