import React, { useState } from 'react';
import { Heart, Calendar, Baby, CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp, Clock, HelpCircle, Pill, ShieldCheck, Stethoscope, Apple } from 'lucide-react';
import { UserCycleSettings } from '../types';
import { calculateEDD, getUpcomingCycles, formatDate, addDays, getDayCycleInfo } from '../utils/cycleCalculator';
import { PREGNANCY_WEEK_MILESTONES, CERVICAL_MUCUS_GUIDE, CLINICAL_FAQS } from '../data/fertilityKnowledge';
import { FertilityPharmacologySection } from './FertilityPharmacologySection';
import { CycleSyncedNutrition } from './CycleSyncedNutrition';

interface FertilityGuideProps {
  settings: UserCycleSettings;
  onOpenSymptomLogger: () => void;
}

export const FertilityGuide: React.FC<FertilityGuideProps> = ({
  settings,
  onOpenSymptomLogger,
}) => {
  const [guideTab, setGuideTab] = useState<'natural' | 'nutrition' | 'pharmacology'>('natural');
  const [calcMethod, setCalcMethod] = useState<'lmp' | 'ovulation'>('lmp');
  const [calcDate, setCalcDate] = useState<string>(settings.lastPeriodDate);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const todayStr = formatDate(new Date());
  const todayInfo = getDayCycleInfo(todayStr, settings);

  // Calculate Conception / EDD
  const eddInfo = calculateEDD(calcDate, settings.cycleLength);
  const upcomingCycles = getUpcomingCycles(settings, 3);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner: Conception & Fertility Header */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>الدليل السريري للخصوبة وتسهيل الحمل والرعاية الدوائية والغذائية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            تخطيط الإنجاب السليم والتغذية المتزامنة والأدوية
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
            كل ما يلزمك لمعرفة التوقيت البيولوجي الأنسب، خطط التغذية حسب أطوار دورتكِ، تهيئة البويضة والرحم، وموسوعة محفزات التبويض المعتمدة.
          </p>

          {/* Guide Sub-Tabs */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <button
              onClick={() => setGuideTab('natural')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                guideTab === 'natural'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              دليل التخطيط والحاسبات
            </button>
            <button
              onClick={() => setGuideTab('nutrition')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                guideTab === 'nutrition'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              التغذية المتزامنة مع دورتكِ 🥑
            </button>
            <button
              onClick={() => setGuideTab('pharmacology')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                guideTab === 'pharmacology'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              المرجع الدوائي لمحفزات الخصوبة 💊
            </button>
          </div>
        </div>

        {/* Decorative soft circles */}
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* View 1: Cycle Synced Nutrition Section */}
      {guideTab === 'nutrition' && (
        <div className="animate-in fade-in duration-300">
          <CycleSyncedNutrition
            currentPhase={todayInfo.phase}
            currentDayInCycle={todayInfo.cycleDay}
          />
        </div>
      )}

      {/* View 2: Pharmacology Section */}
      {guideTab === 'pharmacology' && (
        <div className="animate-in fade-in duration-300">
          <FertilityPharmacologySection />
        </div>
      )}

      {/* View 3: Natural Conception & Planning Guide */}
      {guideTab === 'natural' && (
        <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Interactive Clinical Due Date & Gestation Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-50 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-500" />
              <span>حاسبة موعد الولادة المتوقع وعمر الحمل (EDD)</span>
            </h3>
            <span className="text-xs text-slate-500 block mt-0.5">
              حساب طبي دقيق وفق قاعدة نايجيل السريرية المعتمدة لدى ACOG
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setCalcMethod('lmp')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                calcMethod === 'lmp'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              بأول يوم لآخر دورة
            </button>
            <button
              onClick={() => setCalcMethod('ovulation')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                calcMethod === 'ovulation'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              بيوم التبويض المقدر
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {calcMethod === 'lmp' ? 'تاريخ أول يوم في آخر حيض:' : 'تاريخ يوم الإباضة أو التلقيح:'}
              </label>
              <input
                type="date"
                value={calcDate}
                onChange={e => setCalcDate(e.target.value)}
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-['Plus_Jakarta_Sans',sans-serif]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1 text-xs text-rose-950">
              <span className="font-bold block">ملاحظة سريرية:</span>
              <p className="leading-relaxed">
                يستمر الحمل الطبيعي لمدة 40 أسبوعاً (280 يوماً) من تاريخ أول يوم لآخر دورة شهرية. 5% فقط من الأمهات يلدن في اليوم المحدد تماماً، وتعتبر الولادة طبيعية في أي وقت بين الأسبوع 37 و 42.
              </p>
            </div>
          </div>

          {/* Calculator Results Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
              <span className="text-xs font-semibold text-rose-600 block mb-1">
                تاريخ الولادة التقديري المتوقع (EDD)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                {eddInfo.eddDate}
              </div>
              <span className="text-xs text-slate-500 block mt-2">
                تاريخ الإخصاب المقدر: {eddInfo.conceptionDate}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-600 block mb-1">
                عمر الحمل الحالي (إذا كنتِ حاملاً)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                {eddInfo.gestationalWeeks} أسبوع و {eddInfo.gestationalDays} يوم
              </div>
              <span className="text-xs text-indigo-700 font-semibold block mt-2">
                الثلث {eddInfo.trimester === 1 ? 'الأول (تكوين الأعضاء)' : eddInfo.trimester === 2 ? 'الثاني (النمو السريع)' : 'الثالث (الاستعداد للولادة)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Fertile Windows Calendar Forecast */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              جدول نوافذ الخصوبة للأشهر القادمة
            </h3>
            <span className="text-xs text-slate-500">
              خططي مواعيد اللقاء مع الزوج مسبقاً بناءً على الحسابات البيولوجية
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingCycles.map((cyc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  الدورة القادمة #{cyc.cycleNumber}
                </span>
                <span className="text-[11px] text-rose-600 font-semibold">
                  بداية الحيض: {cyc.startDate}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">نافذة الخصوبة:</span>
                  <span className="font-semibold text-indigo-700">{cyc.fertileStartDate} إلى {cyc.fertileEndDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">يوم التبويض الذروة:</span>
                  <span className="font-bold text-emerald-700">{cyc.ovulationDate} ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">الدورة التي تليها:</span>
                  <span>{cyc.nextCycleStartDate}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-100 text-[11px] text-slate-600">
                التوقيت الأنسب للقاء: {addDays(cyc.ovulationDate, -2)} و {addDays(cyc.ovulationDate, -1)} و {cyc.ovulationDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The 90-Day Preconception Protocol */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-rose-500" />
            <span>بروتوكول الـ 90 يوماً الذهبية لتهيئة البويضة والرحم</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            دورة نضوج الحويصلة المبيضية تستغرق 3 أشهر؛ إليكِ التوصيات الإكلينيكية المعتمدة:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
              01
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              المكملات الأساسية للزوجة
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              حمض الفوليك (400-800 مكجم) يومياً لمنع تشوهات الجنين، فيتامين D3 لرفع كفاءة بطانة الرحم، ومساعد الإنزيم CoQ10 (Ubiquinol) لتغذية ميتوكوندريا البويضة.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              02
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              توقيت وتكرار اللقاء الزوجي
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              توصي ASRM بممارسة العلاقة الزوجية كل يوم أو يومين خلال الأيام الـ 6 السابقة للإباضة. تجنبي المزلقات المهبلية التجارية لأنها تقتل الحيوانات المنوية، واختاري المزلقات المعتمدة الآمنة للخصوبة (Fertility-friendly).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              03
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              صحة الزوج وجودة الحيوانات المنوية
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              تستغرق صناعة الحيوانات المنوية 74 يوماً. يجب على الزوج تجنب الحمامات الساخنة والساونا، الامتناع عن التدخين، وتناول الزنك ومضادات الأكسدة لتقليل تكسر الحمض النووي (DNA Fragmentation).
            </p>
          </div>
        </div>
      </div>

      {/* 4. Cervical Mucus Visual Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>دليل قراءة مخاط عنق الرحم والخصوبة (طريقة بيلينجز السريرية)</span>
          </h3>
          <span className="text-xs text-slate-500">
            أدق طريقة طبيعية ومجانية لمعرفة لحظة استعداد جسدك للإخصاب
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CERVICAL_MUCUS_GUIDE.map(item => (
            <div key={item.type} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.titleAr}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.fertilityBadge === 'peak' ? 'bg-emerald-100 text-emerald-800' :
                  item.fertilityBadge === 'high' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {item.fertilityScoreAr}
                </span>
              </div>
              <span className="text-[11px] text-rose-600 font-medium block">
                التوقيت: {item.timingAr}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.descriptionAr}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Early Pregnancy Milestones */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Baby className="w-5 h-5 text-purple-600" />
            <span>المراحل الأولى للحمل (الأسابيع 1 إلى 12)</span>
          </h3>
          <span className="text-xs text-slate-500">
            ماذا تتوقعين من انغراس البويضة حتى أول سونار وسماع نبض الجنين
          </span>
        </div>

        <div className="space-y-3">
          {PREGNANCY_WEEK_MILESTONES.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-900 px-2.5 py-0.5 rounded-full bg-purple-100">
                    {m.weekRange}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {m.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {m.clinicalDescription}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0 bg-white p-2.5 rounded-xl border border-purple-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">حجم الجنين</span>
                  <span className="font-bold text-slate-800">{m.fetalSize}</span>
                </div>
                <div className="border-r border-slate-100 pr-3">
                  <span className="text-[10px] text-slate-400 block">مستوى هرمون hCG</span>
                  <span className="font-bold text-purple-700">{m.hCGExpected}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Clinical FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-500" />
            <span>الأسئلة السريرية الأكثر شيوعاً حول الخصوبة والحمل</span>
          </h3>
          <span className="text-xs text-slate-500">
            إجابات علمية موثقة من استشاريي طب الإخصاب والنساء والتوليد
          </span>
        </div>

        <div className="space-y-2">
          {CLINICAL_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-right flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 font-bold text-sm text-slate-900 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
        </div>
      )}

    </div>
  );
};
