import React, { useState } from 'react';
import { Cpu, Sparkles, CheckCircle2, TrendingUp, Calendar, Heart, Shield, ArrowRight, Check } from 'lucide-react';
import { PastCycle, UserCycleSettings } from '../types';
import { calculateSmart3CyclePrediction } from '../utils/cycleCalculator';

interface SmartCyclePredictorProps {
  pastCycles: PastCycle[];
  settings: UserCycleSettings;
  onApplyPrediction: (newCycleLength: number, newPeriodDuration: number) => void;
}

export const SmartCyclePredictor: React.FC<SmartCyclePredictorProps> = ({
  pastCycles,
  settings,
  onApplyPrediction,
}) => {
  const [applied, setApplied] = useState(false);

  const prediction = calculateSmart3CyclePrediction(
    pastCycles,
    settings.lastPeriodDate,
    settings.lutealPhaseDuration || 14
  );

  const handleApply = () => {
    onApplyPrediction(
      Math.round(prediction.predictedCycleLength),
      Math.round(prediction.predictedPeriodDuration)
    );
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  const deltaFromSettings = Math.round((prediction.predictedCycleLength - settings.cycleLength) * 10) / 10;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-50 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>خوارزمية الانحدار الموزون (3-Cycle Weighted Moving Average)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            محرك التنبؤ الذكي للدورة والتبويض القادمين
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            بدلاً من الاعتماد على المتوسط النظري الثابت (28 يوماً)، تحلل الخوارزمية سجل دوراتكِ الثلاث الأخيرة بأوزان ترجيحية تصاعدية (50% لأحدث دورة، 30% للسابقة، و 20% للقديمة) مع حساب الانحراف المعياري وهامش الخطأ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">درجة الدقة الإحصائية:</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
            {prediction.confidenceScore}% دقة
          </span>
        </div>
      </div>

      {/* Main Results Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Next Period Date */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold">
            <span>تاريخ بدء الحيض القادم المتوقع</span>
            <Calendar className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            {prediction.predictedNextPeriodDate}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>طول الدورة المتوقع: <strong className="text-slate-800 font-mono">{prediction.predictedCycleLength} يوماً</strong></span>
            <span className="font-mono text-rose-600">هامش: ±{prediction.marginOfErrorDays} يوم</span>
          </div>
        </div>

        {/* Card 2: Predicted Ovulation Day */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>يوم التبويض الذروة المتوقع</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            {prediction.predictedOvulationDate}
          </div>
          <div className="text-[11px] text-emerald-700 pt-1 font-medium">
            أعلى فرصة بيولوجية لتخصيب البويضة (Day of Peak Ovulation)
          </div>
        </div>

        {/* Card 3: Fertile Window */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-800 font-semibold">
            <span>نافذة الخصوبة العالية القادمة</span>
            <Heart className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {prediction.predictedFertileStart.slice(5)} إلى {prediction.predictedFertileEnd.slice(5)}
          </div>
          <div className="text-[11px] text-indigo-700 pt-1 font-medium">
            فترة الـ 6 أيام الذهبية لحضور الحيوانات المنوية
          </div>
        </div>

      </div>

      {/* Algorithmic Weighting Mathematical Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span>المعادلة الإحصائية والأوزان المطبقة على سجلاتك:</span>
          <span className="font-mono text-[11px] text-slate-500">
            الانحراف المعياري (σ): {prediction.standardDeviation} يوماً
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>الدورة الأحدث (C₁)</span>
              <span className="font-bold text-rose-600">وزن 50%</span>
            </div>
            <span className="text-base font-bold text-slate-900 font-mono">
              {prediction.recentCycleLengths[0]} يوماً
            </span>
            <span className="text-[10px] text-slate-400 block">التأثير الأكبر على الهرمونات الحالية</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>الدورة السابقة (C₂)</span>
              <span className="font-bold text-indigo-600">وزن 30%</span>
            </div>
            <span className="text-base font-bold text-slate-900 font-mono">
              {prediction.recentCycleLengths[1]} يوماً
            </span>
            <span className="text-[10px] text-slate-400 block">تأكيد الاتجاه الفسيولوجي</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>الدورة الأقدم (C₃)</span>
              <span className="font-bold text-slate-600">وزن 20%</span>
            </div>
            <span className="text-base font-bold text-slate-900 font-mono">
              {prediction.recentCycleLengths[2]} يوماً
            </span>
            <span className="text-[10px] text-slate-400 block">خط الأساس للمقارنة التاريخية</span>
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed pt-1">
          <strong>الاستنتاج السريري:</strong> {prediction.clinicalInterpretation}
        </div>
      </div>

      {/* Action to Apply Prediction to App Settings */}
      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              مقارنة مع الإعدادات الحالية لتطبيقك:
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-rose-200 font-mono font-bold text-slate-800">
              الحالي: {settings.cycleLength} يوم
            </span>
            {deltaFromSettings !== 0 && (
              <span className="text-xs text-rose-600 font-semibold font-mono">
                {deltaFromSettings > 0 ? `+${deltaFromSettings}` : deltaFromSettings} يوم
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600">
            تطبيق هذه النتيجة يحدّث تلقائياً تقويم الدورة وحلقة اليوم ومواعيد التبويض المقدرة في كافة أرجاء التطبيق.
          </p>
        </div>

        <button
          onClick={handleApply}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          {applied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>تم تطبيق التنبؤ الذكي بنجاح!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span>تطبيق التنبؤ الذكي على حسابات التطبيق</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
