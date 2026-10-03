import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Sparkles,
  Award,
  Microscope
} from 'lucide-react';
import { MedicalArticle, ClinicalStudy } from '../types';
import { MEDICAL_ARTICLES, MEDICAL_CATEGORIES } from '../data/medicalDatabase';
import { RECENT_CLINICAL_STUDIES } from '../data/clinicalStudies';

export const MedicalLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'studies'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<MedicalArticle | null>(null);
  const [activeStudy, setActiveStudy] = useState<ClinicalStudy | null>(null);

  // Filter articles
  const filteredArticles = MEDICAL_ARTICLES.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.author.name.toLowerCase().includes(q) ||
      art.keyPoints.some(kp => kp.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Filter clinical studies
  const filteredStudies = RECENT_CLINICAL_STUDIES.filter(study => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      study.title.toLowerCase().includes(q) ||
      study.journal.toLowerCase().includes(q) ||
      study.summaryAr.toLowerCase().includes(q) ||
      study.authors.toLowerCase().includes(q) ||
      study.keyFindings.some(f => f.toLowerCase().includes(q));

    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-right">
      
      {/* Header & Mission */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>قاعدة بيانات طبية موثقة ومعتمدة سريرياً</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              المكتبة الإكلينيكية لصحة المرأة والإنجاب
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
              أبحاث ودلائل إرشادية مترجمة ومحققة من استشاريي طب النساء والتوليد وجراحة الإخصاب والغدد الصماء، مبنية على توصيات الكلية الأمريكية ACOG، الكلية الملكية RCOG، ومنظمة الصحة العالمية WHO، بالإضافة إلى أحدث الدراسات والتجارب السريرية المحكمة (2024 - 2026).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-rose-50 p-2.5 rounded-2xl border border-rose-200">
              <Microscope className="w-4 h-4 text-rose-600" />
              <span className="font-bold">{RECENT_CLINICAL_STUDIES.length} دراسات وتجارب حديثة (2024-2026)</span>
            </div>
          </div>
        </div>

        {/* View Toggle Bar */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl gap-1 w-fit">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المقالات الطبية والمراجع ({MEDICAL_ARTICLES.length})
          </button>
          <button
            onClick={() => setActiveTab('studies')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'studies'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الأبحاث والدراسات السريرية الحديثة 2024 - 2026 ({RECENT_CLINICAL_STUDIES.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={
              activeTab === 'articles'
                ? 'ابحثي عن موضوع طبي (مثل: تكيس المبايض، فحص LH، دم الانغراس، حرارة BBT، بطانة الرحم)...'
                : 'ابحثي في الدراسات السريرية (مثل: CoQ10، جودة البويضات، الميو إينوزيتول، خوارزمية التبويض، الميكروبيوم)...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pr-11 pl-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
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

        {/* Category Filter Pills (when articles tab is active) */}
        {activeTab === 'articles' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {MEDICAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail View Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto space-y-6 my-auto text-right">
            
            {/* Modal Top Nav */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={() => setActiveArticle(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                <span>العودة للمكتبة الطبية</span>
              </button>

              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                {activeArticle.categoryLabelAr}
              </span>
            </div>

            {/* Title & Author Info */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {activeArticle.title}
              </h2>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                    <UserCheck className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{activeArticle.author.name}</span>
                    <span className="text-slate-500 text-[11px] block">{activeArticle.author.specialty} · {activeArticle.author.hospital}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono self-end sm:self-center">
                  مراجعة سريرية: {activeArticle.reviewer}
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <span className="font-bold text-rose-800 block mb-1">الخلاصة السريرية للمقال:</span>
              <p>{activeArticle.summary}</p>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>النقاط الجوهرية (Clinical Highlights)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeArticle.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Sections */}
            <div className="space-y-6 pt-2">
              {activeArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 border-b border-rose-100 pb-1.5">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                  {sec.bulletPoints && (
                    <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                      {sec.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 pr-2">
                          <span className="text-rose-500 font-bold">▫</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Guidelines & Sources */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 block">المصادر والأدلة الإرشادية المعتمدة:</span>
              <div className="space-y-1">
                {activeArticle.clinicalGuidelines.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{g}</span>
                  </div>
                ))}
                {activeArticle.sources.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-500 font-mono">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                إغلاق المقال
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Study Detail Modal */}
      {activeStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto space-y-6 my-auto text-right">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={() => setActiveStudy(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                <span>العودة لقائمة الدراسات</span>
              </button>

              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {activeStudy.journal} ({activeStudy.year})
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-600 block">{activeStudy.categoryLabelAr}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {activeStudy.title}
              </h2>
              <div className="text-xs text-slate-500 font-mono">
                الباحثون: {activeStudy.authors}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                DOI / الاقتباس: {activeStudy.doiOrCitation}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">تصميم الدراسة:</span>
                <span className="font-bold text-slate-800">{activeStudy.studyDesign}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">حجم العينة:</span>
                <span className="font-bold text-slate-800">{activeStudy.sampleSize}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">قوة الدليل:</span>
                <span className="font-bold text-emerald-700">{activeStudy.evidenceGrade}</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
              <span className="font-bold text-rose-800 block">الملخص السريري التنفيذي:</span>
              <p>{activeStudy.summaryAr}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>أبرز النتائج والمؤشرات السريرية المستنتجة</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeStudy.keyFindings.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                التطبيق والتوصية العملية للمستخدمة:
              </span>
              <p className="leading-relaxed">{activeStudy.clinicalTakeaway}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveStudy(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                إغلاق الدراسة
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 1: Articles Grid */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-3xl p-6 border border-rose-100 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-right"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-600">
                    {article.categoryLabelAr}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {article.readTimeMinutes} د قراءة
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 block">{article.author.name}</span>
                  <span className="text-[10px] text-slate-400 block">{article.author.specialty}</span>
                </div>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  <span>قراءة المقال كاملاً</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Recent Clinical Studies (2024 - 2026) */}
      {activeTab === 'studies' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3 text-xs text-indigo-950">
            <Microscope className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <span className="font-bold text-indigo-900">سجل التجارب السريرية والأبحاث المحكمة (2024 - 2026):</span>
              <p className="text-[11px] text-indigo-800/90 mt-0.5">
                دراسات حديثة منشورة في أبرز المجلات الطبية العالمية (The Lancet, Nature Medicine, Human Reproduction, Fertility and Sterility) خاضعة لمراجعة الأقران وتوثق أحدث البروتوكولات.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudies.map(study => (
              <div
                key={study.id}
                className="bg-white rounded-3xl p-6 border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-right"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {study.journal} ({study.year})
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {study.evidenceGrade.split(':')[0]}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {study.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {study.summaryAr}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-700 space-y-1">
                    <div>
                      <span className="text-slate-400">تصميم البحث: </span>
                      <span className="font-semibold text-slate-800">{study.studyDesign}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">العينة السريرية: </span>
                      <span className="font-semibold text-slate-800">{study.sampleSize}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {study.authors.split(',')[0]} et al.
                  </span>

                  <button
                    onClick={() => setActiveStudy(study)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>استعراض نتائج الدراسة</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'articles' && filteredArticles.length === 0) ||
        (activeTab === 'studies' && filteredStudies.length === 0)) && (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 space-y-2">
          <BookOpen className="w-10 h-10 text-rose-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">لم يتم العثور على نتائج مطابقة</h4>
          <p className="text-xs text-slate-500">جربي البحث بكلمات أخرى أو اختر فئة مختلفة من الأعلى.</p>
        </div>
      )}

    </div>
  );
};
