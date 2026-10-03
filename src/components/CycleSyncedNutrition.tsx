import React, { useState } from 'react';
import { Apple, Sparkles, Heart, Flame, ShieldAlert, CheckCircle2, ChevronRight, ChevronLeft, Coffee, Sun, Sunset, Moon, Utensils, Sprout } from 'lucide-react';
import { CyclePhase } from '../types';
import { CYCLE_SYNCED_NUTRITION, PhaseNutritionPlan } from '../data/cycleNutritionData';

interface CycleSyncedNutritionProps {
  currentPhase: CyclePhase;
  currentDayInCycle: number;
}

export const CycleSyncedNutrition: React.FC<CycleSyncedNutritionProps> = ({
  currentPhase,
  currentDayInCycle,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(currentPhase || 'follicular');

  const phaseData: PhaseNutritionPlan = CYCLE_SYNCED_NUTRITION[selectedPhase];
  const isCurrentPhase = selectedPhase === currentPhase;

  const phaseButtons: { id: CyclePhase; label: string; icon: string; range: string }[] = [
    { id: 'menstrual', label: 'طور الحيض والتعويض', icon: '🍲', range: 'الأيام 1-5' },
    { id: 'follicular', label: 'الطور الجريبي وبناء البويضة', icon: '🥑', range: 'الأيام 6-12' },
    { id: 'ovulation', label: 'طور التبويض والخصوبة القصوى', icon: '🌱', range: 'الأيام 13-16' },
    { id: 'luteal', label: 'الطور الأصفر والانغراس', icon: '🍠', range: 'الأيام 17-28' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Apple className="w-4 h-4 text-emerald-600" />
              <span>نظام التغذية المتزامنة مع الهرمونات (Cycle-Synced Fertility Diet)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              دليل التغذية الذكية للخصوبة المتناغمة مع دورتكِ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              كل طور هرموني يمتلك احتياجات غذائية وأيضية مختلفة جذرياً؛ مواءمة طعامكِ مع أطوار دورتكِ يحسن جودة البويضات، يدعم سمك بطانة الرحم، ويخفف أعراض ما قبل الحيض (PMS) بصورة ملحوظة.
            </p>
          </div>

          {/* Current Phase Live Badge */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-950 shrink-0">
            <span className="text-[10px] text-rose-600 font-bold block mb-0.5">مرحلتكِ اليوم:</span>
            <span className="font-bold flex items-center gap-1">
              <span>{CYCLE_SYNCED_NUTRITION[currentPhase]?.phaseNameAr.split('(')[0]}</span>
              <span className="font-mono text-rose-700">(اليوم {currentDayInCycle}) 📍</span>
            </span>
          </div>
        </div>

        {/* Phase Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
          {phaseButtons.map(btn => {
            const isSelected = selectedPhase === btn.id;
            const isUsersCurrent = currentPhase === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedPhase(btn.id)}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{btn.icon}</span>
                  {isUsersCurrent && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-800'
                    }`}>
                      أنتِ هنا 📍
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold block leading-tight">{btn.label}</span>
                <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                  {btn.range}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
        
        {/* Phase Goal Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border border-rose-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 px-2.5 py-0.5 rounded-full bg-white border border-rose-200">
              {phaseData.cycleDaysRangeAr}
            </span>
            {isCurrentPhase && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ خطتكِ الغذائية الموصى بها لهذا اليوم
              </span>
            )}
          </div>
          <h4 className="text-lg font-bold text-slate-900">
            {phaseData.phaseNameAr}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>الحالة الهرمونية:</strong> {phaseData.hormoneSummaryAr}
          </p>
          <div className="p-3 rounded-xl bg-white/80 border border-rose-100 text-xs text-rose-950 font-medium">
            <strong>الهدف البيولوجي والغذائي الأساسي:</strong> {phaseData.biologicalGoalAr}
          </div>
        </div>

        {/* 3 Superfoods Spotlight */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>الأطعمة الخارقة (Superfoods) الواجب التركيز عليها في هذا الطور:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {phaseData.superfoodsToFocusOn.map((sf, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{sf.icon}</span>
                  <span className="text-xs font-bold text-slate-900">{sf.nameAr}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sf.benefitAr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Nutrients Matrix */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            العناصر والمغذيات الدقيقة الأساسية لهذا الطور:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {phaseData.primaryNutrients.map((nut, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1 text-xs">
                <span className="font-bold text-purple-900 block">{nut.nameAr}</span>
                <p className="text-slate-600 leading-relaxed">{nut.whyNeededAr}</p>
                <span className="text-[11px] text-purple-700 font-semibold block pt-1">
                  المصادر: {nut.foodSourcesAr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Meal Plan Schedule */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-indigo-600" />
            <span>نموذج خطة الوجبات اليومية المقترحة لهذا الطور:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Breakfast */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
                <div className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>الإفطار</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{phaseData.dailyMealPlan.breakfast.caloriesApprox}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {phaseData.dailyMealPlan.breakfast.title}
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {phaseData.dailyMealPlan.breakfast.desc}
              </p>
            </div>

            {/* Lunch */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-rose-700 font-bold">
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>الغداء</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{phaseData.dailyMealPlan.lunch.caloriesApprox}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {phaseData.dailyMealPlan.lunch.title}
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {phaseData.dailyMealPlan.lunch.desc}
              </p>
            </div>

            {/* Dinner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-indigo-700 font-bold">
                <div className="flex items-center gap-1">
                  <Sunset className="w-3.5 h-3.5" />
                  <span>العشاء</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{phaseData.dailyMealPlan.dinner.caloriesApprox}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {phaseData.dailyMealPlan.dinner.title}
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {phaseData.dailyMealPlan.dinner.desc}
              </p>
            </div>

            {/* Snack & Herbal Tea */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                <div className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>سناك ومشروب هرموني</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{phaseData.dailyMealPlan.snack.caloriesApprox}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {phaseData.dailyMealPlan.snack.title}
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {phaseData.dailyMealPlan.snack.desc}
              </p>
              <div className="border-t border-emerald-200 pt-1 text-[10px] text-emerald-900 font-medium">
                🍵 {phaseData.dailyMealPlan.herbalInfusion.title} ({phaseData.dailyMealPlan.herbalInfusion.timing})
              </div>
            </div>

          </div>
        </div>

        {/* Seed Cycling Protocol Section */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-amber-700" />
              <span>بروتوكول تدوير البذور الهرموني (Seed Cycling Protocol):</span>
            </h4>
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
              {phaseData.seedCycling.seeds}
            </span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            {phaseData.seedCycling.mechanismAr}
          </p>
          <div className="text-xs font-semibold text-amber-950 bg-white/80 p-2.5 rounded-xl border border-amber-200">
            الجرعة اليومية المقترحة: {phaseData.seedCycling.dailyDoseAr}
          </div>
        </div>

        {/* Foods to Limit & Clinical Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 text-xs">
            <span className="font-bold text-rose-950 block">أطعمة ومشروبات يُفضل تقليلها في هذا الطور:</span>
            <ul className="space-y-1.5 text-slate-600">
              {phaseData.foodsToLimit.map((f, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <div>
                    <strong className="text-slate-800">{f.nameAr}:</strong> <span>{f.reasonAr}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">نصائح وإرشادات طبية خاصة بالطور:</span>
            <ul className="space-y-1.5 text-slate-600">
              {phaseData.clinicalTipsAr.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
