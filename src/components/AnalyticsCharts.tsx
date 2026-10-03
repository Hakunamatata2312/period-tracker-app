import React, { useState } from 'react';
import { BarChart3, TrendingUp, Activity, HelpCircle, CheckCircle2, AlertCircle, Cpu, Brain } from 'lucide-react';
import { UserCycleSettings, DailyLog, PastCycle } from '../types';
import { analyzeCycles, parseDate, addDays, getDayCycleInfo, formatDate } from '../utils/cycleCalculator';
import { AVAILABLE_SYMPTOMS } from '../data/fertilityKnowledge';
import { SmartCyclePredictor } from './SmartCyclePredictor';
import { MoodAnalyticsChart } from './MoodAnalyticsChart';
import { SymptomHeatmap } from './SymptomHeatmap';

interface AnalyticsChartsProps {
  settings: UserCycleSettings;
  dailyLogs: Record<string, DailyLog>;
  pastCycles: PastCycle[];
  onOpenLogger: () => void;
  onApplyPrediction?: (newCycleLength: number, newPeriodDuration: number) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  settings,
  dailyLogs,
  pastCycles,
  onOpenLogger,
  onApplyPrediction,
}) => {
  const [activeChart, setActiveChart] = useState<'prediction' | 'mood' | 'heatmap' | 'bbt' | 'cycles' | 'symptoms'>('heatmap');
  const cycleAnalysis = analyzeCycles(pastCycles, settings);
  const todayStr = formatDate(new Date());
  const todayInfo = getDayCycleInfo(todayStr, settings);

  // Extract BBT data points sorted by date
  const sortedDates = Object.keys(dailyLogs).sort();
  const bbtPoints = sortedDates
    .map(date => ({
      date,
      bbt: dailyLogs[date]?.bbt,
      dayInfo: getDayCycleInfo(date, settings),
      log: dailyLogs[date]
    }))
    .filter(p => p.bbt !== undefined);

  // Fallback points for BBT if few logs exist
  const bbtDataToDisplay = bbtPoints.length >= 7 ? bbtPoints.slice(-28) : [];

  // Compute BBT Min/Max for chart scaling
  const minTemp = 36.0;
  const maxTemp = 37.3;
  const tempRange = maxTemp - minTemp;
  const coverline = 36.5; // Standard clinical coverline separating follicular from luteal

  // Calculate symptom counts
  const symptomCounts: Record<string, { total: number; inLuteal: number; inMenstrual: number; inFollicular: number }> = {};
  Object.values(dailyLogs).forEach(log => {
    const dayInfo = getDayCycleInfo(log.date, settings);
    log.symptoms.forEach(symId => {
      if (!symptomCounts[symId]) {
        symptomCounts[symId] = { total: 0, inLuteal: 0, inMenstrual: 0, inFollicular: 0 };
      }
      symptomCounts[symId].total += 1;
      if (dayInfo.phase === 'luteal') symptomCounts[symId].inLuteal += 1;
      else if (dayInfo.phase === 'menstrual') symptomCounts[symId].inMenstrual += 1;
      else symptomCounts[symId].inFollicular += 1;
    });
  });

  const sortedSymptoms = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 6)
    .map(([id, counts]) => {
      const meta = AVAILABLE_SYMPTOMS.find(s => s.id === id);
      return {
        id,
        nameAr: meta?.nameAr || id,
        category: meta?.categoryLabelAr || '',
        ...counts
      };
    });

  return (
    <div className="space-y-6">
      
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>متوسط طول الدورة</span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tabular-nums">
              {cycleAnalysis.averageCycleLength}
            </span>
            <span className="text-xs font-bold text-slate-500">يوماً</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            طبيعي سريرياً (21-35 يوماً)
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>مدة دم الحيض</span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tabular-nums">
              {cycleAnalysis.averagePeriodDuration}
            </span>
            <span className="text-xs font-bold text-slate-500">أيام</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            نطاق صحي متوازن
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>مؤشر انتظام الدورة</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-600 font-['Plus_Jakarta_Sans',sans-serif] tabular-nums">
              {cycleAnalysis.regularityScore}%
            </span>
            <span className="text-xs font-bold text-slate-500">انتظام</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            {cycleAnalysis.regularityStatus}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>الطور الأصفر (اللوتيني)</span>
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-purple-700 font-['Plus_Jakarta_Sans',sans-serif] tabular-nums">
              {settings.lutealPhaseDuration}
            </span>
            <span className="text-xs font-bold text-slate-500">يوماً</span>
          </div>
          <span className="text-[11px] text-purple-600 font-medium block mt-1">
            كافي لانغراس آمن للجنين (&gt;11 يوم)
          </span>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
        
        {/* Chart Selector Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-50 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              التحليلات البيومترية المتقدمة
            </h3>
            <span className="text-xs text-slate-500 block mt-0.5">
              رسوم بيانية توضح التغيرات الهرمونية ومسار التبويض بطريقة مبسطة
            </span>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar gap-1 max-w-full">
            <button
              onClick={() => setActiveChart('heatmap')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeChart === 'heatmap'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الخريطة الحرارية للأعراض 🔥
            </button>
            <button
              onClick={() => setActiveChart('prediction')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeChart === 'prediction'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              التنبؤ الخوارزمي الذكي ⚡
            </button>
            <button
              onClick={() => setActiveChart('mood')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeChart === 'mood'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              منحنى الحالة النفسية والمزاج 🧠
            </button>
            <button
              onClick={() => setActiveChart('bbt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeChart === 'bbt'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              منحنى حرارة BBT
            </button>
            <button
              onClick={() => setActiveChart('cycles')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeChart === 'cycles'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مقارنة الدورات
            </button>
            <button
              onClick={() => setActiveChart('symptoms')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeChart === 'symptoms'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تكرار الأعراض
            </button>
          </div>
        </div>

        {/* Tab Content: Symptom Heatmap */}
        {activeChart === 'heatmap' && (
          <SymptomHeatmap
            settings={settings}
            dailyLogs={dailyLogs}
            pastCycles={pastCycles}
            onOpenLogger={onOpenLogger}
          />
        )}

        {/* Tab Content: Smart Prediction */}
        {activeChart === 'prediction' && (
          <SmartCyclePredictor
            pastCycles={pastCycles}
            settings={settings}
            onApplyPrediction={onApplyPrediction || (() => {})}
          />
        )}

        {/* Tab Content: Mood & Neuro-Hormonal Curve */}
        {activeChart === 'mood' && (
          <MoodAnalyticsChart
            settings={settings}
            dailyLogs={dailyLogs}
            currentDayInCycle={todayInfo.cycleDay}
          />
        )}

        {/* 1. Basal Body Temperature Chart (BBT Curve) */}
        {activeChart === 'bbt' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-500"></span>
                  <span>الطور الجريبي (إستروجين منخفض الحرارة)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-purple-600"></span>
                  <span>الطور الأصفر (قفزة البروجستيرون)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-400 border-dashed border-b"></span>
                  <span>خط الغطاء (Coverline 36.5°C)</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400">
                مقياس الحرارة: 36.0°C إلى 37.2°C
              </span>
            </div>

            {/* BBT SVG Line Chart */}
            {bbtDataToDisplay.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[640px] h-64 relative bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="bbtGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Grid Lines */}
                    {[36.2, 36.5, 36.8, 37.1].map(temp => {
                      const yPos = 200 - ((temp - minTemp) / tempRange) * 180 - 10;
                      return (
                        <g key={temp}>
                          <line
                            x1="30"
                            y1={yPos}
                            x2="590"
                            y2={yPos}
                            stroke={temp === coverline ? '#f59e0b' : '#e2e8f0'}
                            strokeDasharray={temp === coverline ? '4,4' : '2,2'}
                            strokeWidth={temp === coverline ? 1.5 : 1}
                          />
                          <text
                            x="25"
                            y={yPos + 4}
                            textAnchor="end"
                            className="text-[9px] fill-slate-400 font-mono"
                          >
                            {temp.toFixed(1)}°
                          </text>
                        </g>
                      );
                    })}

                    {/* Temperature Line Path */}
                    {(() => {
                      const points = bbtDataToDisplay.map((p, idx) => {
                        const x = 40 + (idx / (bbtDataToDisplay.length - 1)) * 540;
                        const clampedTemp = Math.max(minTemp, Math.min(maxTemp, p.bbt || 36.4));
                        const y = 200 - ((clampedTemp - minTemp) / tempRange) * 180 - 10;
                        return { x, y, p };
                      });

                      const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
                      const areaD = `${pathD} L ${points[points.length - 1].x},190 L ${points[0].x},190 Z`;

                      return (
                        <>
                          <path d={areaD} fill="url(#bbtGradient)" />
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {points.map((pt, idx) => {
                            const isOvulationDay = pt.p.dayInfo.isOvulationDay;
                            return (
                              <g key={idx}>
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isOvulationDay ? 5 : 3.5}
                                  fill={isOvulationDay ? '#10b981' : pt.p.bbt && pt.p.bbt >= coverline ? '#9333ea' : '#f43f5e'}
                                  stroke="#ffffff"
                                  strokeWidth="1.5"
                                />
                                {isOvulationDay && (
                                  <text
                                    x={pt.x}
                                    y={pt.y - 10}
                                    textAnchor="middle"
                                    className="text-[10px] font-bold fill-emerald-600"
                                  >
                                    تبويض ⭐
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* X-axis days footer */}
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200">
                    {bbtDataToDisplay.filter((_, i) => i % 3 === 0).map(p => (
                      <span key={p.date}>
                        اليوم {p.dayInfo.cycleDay} ({p.date.slice(5)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Activity className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  سجلي قراءات الحرارة الصباحية لبدء رسم المنحنى البيومتري
                </p>
                <button
                  onClick={onOpenLogger}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl"
                >
                  تسجيل حرارة اليوم
                </button>
              </div>
            )}

            {/* BBT Clinical Interpretation */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-950 space-y-1">
                <span className="font-bold block">
                  التحليل السريري للنمط ثنائي الطور (Biphasic Pattern):
                </span>
                <p className="leading-relaxed">
                  الارتفاع المستمر لدرجة الحرارة بمقدار 0.3°C إلى 0.5°C فوق خط الغطاء (36.5°C) لأكثر من 10 أيام متتالية يؤكد حدوث إباضة نوعية وإفرازاً ممتازاً للبروجستيرون من الجسم الأصفر. في حال استمرار هذا الارتفاع لأكثر من 18 يوماً، فإن ذلك يُعتبر علامة سريرية مبكرة قوية لحدوث الحمل!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Past Cycles Comparison */}
        {activeChart === 'cycles' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {pastCycles.map((cycle, idx) => {
                const maxBar = 40;
                const widthPercent = (cycle.cycleLength / maxBar) * 100;
                const isNormal = cycle.cycleLength >= 24 && cycle.cycleLength <= 35;

                return (
                  <div key={cycle.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        الدورة {pastCycles.length - idx} (بدأت {cycle.startDate})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {cycle.cycleLength} يوماً
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isNormal ? 'طبيعي' : 'خارج المعدل'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${(cycle.periodDuration / maxBar) * 100}%` }}
                        className="h-full bg-rose-500 rounded-r-full"
                        title={`فترة الحيض: ${cycle.periodDuration} أيام`}
                      />
                      <div
                        style={{ width: `${((cycle.cycleLength - cycle.periodDuration) / maxBar) * 100}%` }}
                        className="h-full bg-indigo-500 rounded-l-full"
                        title={`بقية أيام الدورة: ${cycle.cycleLength - cycle.periodDuration} يوماً`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="font-bold block mb-1 text-slate-900">
                تقييم انتظام الدورات السابقة:
              </span>
              <p className="leading-relaxed">
                {cycleAnalysis.clinicalAdvice}
              </p>
            </div>
          </div>
        )}

        {/* 3. Symptom Frequency Breakdown */}
        {activeChart === 'symptoms' && (
          <div className="space-y-4">
            {sortedSymptoms.length > 0 ? (
              <div className="space-y-3">
                {sortedSymptoms.map(sym => {
                  const maxCount = Math.max(...sortedSymptoms.map(s => s.total));
                  const widthPercent = (sym.total / maxCount) * 100;

                  return (
                    <div key={sym.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{sym.nameAr}</span>
                          <span className="text-[10px] text-slate-500">· {sym.category}</span>
                        </div>
                        <span className="font-bold text-rose-600 font-mono">
                          {sym.total} مرات تكرار
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(sym.inMenstrual / sym.total) * widthPercent}%` }}
                          className="h-full bg-rose-500"
                          title="أثناء الحيض"
                        />
                        <div
                          style={{ width: `${(sym.inFollicular / sym.total) * widthPercent}%` }}
                          className="h-full bg-pink-400"
                          title="الطور الجريبي والتبويض"
                        />
                        <div
                          style={{ width: `${(sym.inLuteal / sym.total) * widthPercent}%` }}
                          className="h-full bg-purple-500"
                          title="الطور الأصفر (ما قبل الحيض)"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>أيام الحيض: {sym.inMenstrual}</span>
                        <span>أيام التبويض: {sym.inFollicular}</span>
                        <span>ما قبل الحيض (PMS): {sym.inLuteal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">
                  لم يتم تسجيل أعراض كافية بعد. تتبعي أعراضك يومياً لتكوين خريطة التكرار الهرموني.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
