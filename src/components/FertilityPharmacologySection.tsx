import React, { useState } from 'react';
import { Pill, Search, ShieldAlert, CheckCircle2, AlertTriangle, Stethoscope, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { FERTILITY_MEDICATIONS, OHSS_PREVENTION_GUIDE } from '../data/fertilityPharmacology';
import { FertilityMedication } from '../types';

export const FertilityPharmacologySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedMed, setExpandedMed] = useState<string | null>('letrozole-femara');
  const [showOhssGuide, setShowOhssGuide] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'جميع الأدوية والمحفزات' },
    { id: 'oral_inducer', label: 'المحفزات الفموية (أقراص)' },
    { id: 'injectable_gonadotropin', label: 'الحقن الهرمونية (FSH/hMG)' },
    { id: 'trigger_shot', label: 'الإبرة التفجيرية (Trigger)' },
    { id: 'luteal_support', label: 'مثبتات بطانة الرحم' },
    { id: 'insulin_sensitizer', label: 'علاج التكيس (ميتفورمين)' },
    { id: 'adjuvant_supplement', label: 'المكملات الداعمة للبويضة' }
  ];

  const filteredMeds = FERTILITY_MEDICATIONS.filter(med => {
    const matchesCat = selectedCategory === 'all' || med.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      med.genericName.toLowerCase().includes(q) ||
      med.brandNames.some(b => b.toLowerCase().includes(q)) ||
      med.mechanismOfActionAr.toLowerCase().includes(q) ||
      med.categoryLabelAr.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedMed(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      
      {/* Hero & Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-2">
              <Pill className="w-3.5 h-3.5 text-purple-600" />
              <span>المرجع السريري الموسع للأدوية ومحفزات الإخصاب</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              الدليل الدوائي الشامل لعلاجات الخصوبة وتنشيط المبايض
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              شرح سريري مفصل لبروتوكولات الأدوية الأكثر استخداماً عالمياً (ليتروزول، كلوميد، الجونادوتروبين، الإبرة التفجيرية، والبروجستيرون)، آليات العمل، معدلات النجاح، وطرق المراقبة بالسونار لتفادي فرط التنشيط.
            </p>
          </div>

          <button
            onClick={() => setShowOhssGuide(!showOhssGuide)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{showOhssGuide ? 'إخفاء دليل فرط التنشيط OHSS' : 'دليل الوقاية من فرط التنشيط OHSS'}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحثي عن دواء أو محفز (مثل: فيرمارا، كلوميد، أوفيتريل، غونال إف، مينوبور، كرينون، إينوزيتول)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pr-11 pl-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-3.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* OHSS Prevention Guide Modal / Expandable Banner */}
      {showOhssGuide && (
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>{OHSS_PREVENTION_GUIDE.title}</span>
            </h4>
            <button
              onClick={() => setShowOhssGuide(false)}
              className="text-xs text-amber-800 hover:underline cursor-pointer"
            >
              إغلاق
            </button>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            {OHSS_PREVENTION_GUIDE.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-950 block">عوامل الخطر:</span>
              <ul className="space-y-1 text-slate-600">
                {OHSS_PREVENTION_GUIDE.riskFactors.map((rf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2">
              <span className="font-bold text-emerald-950 block">استراتيجيات الوقاية الطبية:</span>
              <ul className="space-y-1 text-slate-600">
                {OHSS_PREVENTION_GUIDE.preventionProtocols.map((pp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>{pp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2">
              <span className="font-bold text-red-950 block">علامات الخطر التي تستلزم مراجعة الطوارئ:</span>
              <ul className="space-y-1 text-slate-600">
                {OHSS_PREVENTION_GUIDE.warningSymptoms.map((ws, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-500">⚠</span>
                    <span>{ws}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Medications Accordion List */}
      <div className="space-y-4">
        {filteredMeds.map(med => {
          const isExpanded = expandedMed === med.id;
          return (
            <div
              key={med.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white border-purple-200 shadow-sm ring-1 ring-purple-100'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Collapsed Header */}
              <button
                onClick={() => toggleExpand(med.id)}
                className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-slate-900">
                      {med.genericName}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                      {med.categoryLabelAr}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      med.ohssRiskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      med.ohssRiskLevel === 'moderate' ? 'bg-amber-100 text-amber-800' :
                      med.ohssRiskLevel === 'low' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      خطر فرط التنشيط: {med.ohssRiskLevel === 'high' ? 'مرتفع (يتطلب متابعة)' : med.ohssRiskLevel === 'moderate' ? 'متوسط' : med.ohssRiskLevel === 'low' ? 'منخفض جداً' : 'معدوم'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <span>الأسماء التجارية الشائعة:</span>
                    {med.brandNames.map((bn, bIdx) => (
                      <span key={bIdx} className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {bn}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2 text-slate-400 hover:text-slate-700 rounded-full shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Detailed Clinical Breakdown */}
              {isExpanded && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-4 text-xs sm:text-sm">
                  
                  {/* Mechanism & Protocol Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1.5">
                      <span className="font-bold text-purple-950 block text-xs">
                        آلية العمل البيولوجية (Mechanism of Action):
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {med.mechanismOfActionAr}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-1.5">
                      <span className="font-bold text-indigo-950 block text-xs">
                        البروتوكول السريري والتوقيت (Standard Protocol):
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {med.standardProtocolAr}
                      </p>
                    </div>
                  </div>

                  {/* Success Rates & Ultrasound Monitoring */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1.5">
                      <span className="font-bold text-emerald-950 block text-xs">
                        معدلات النجاح السريرية ونسب الحمل:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {med.successRatesAr}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-900 block text-xs">
                        متطلبات المتابعة الطبية والسونار المهبلي:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {med.monitoringRequirementsAr}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations & Side Effects */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block text-xs">
                        توصيات الأطباء الاستشاريين للمريضة:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 pr-2">
                        {med.clinicalRecommendationsAr.map((rec, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-2 space-y-1">
                      <span className="font-bold text-slate-700 block text-xs">
                        الآثار الجانبية والمحاذير السريرية:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 pr-2">
                        {med.sideEffectsAndRisksAr.map((se, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="text-amber-500">•</span>
                            <span>{se}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
