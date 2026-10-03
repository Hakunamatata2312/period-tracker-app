import React, { useState, useMemo } from 'react';
import {
  Flame,
  Calendar,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { DailyLog, UserCycleSettings, PastCycle } from '../types';
import { addDays, formatDate, getDayCycleInfo, parseDate } from '../utils/cycleCalculator';
import { AVAILABLE_SYMPTOMS } from '../data/fertilityKnowledge';

interface SymptomHeatmapProps {
  settings: UserCycleSettings;
  dailyLogs: Record<string, DailyLog>;
  pastCycles: PastCycle[];
  onOpenLogger?: () => void;
}

interface SymptomOptionItem {
  id: string;
  nameAr: string;
  icon: string;
  category: string;
  clinicalNote: string;
}

const TRACKED_SYMPTOMS: SymptomOptionItem[] = [
  {
    id: 'all',
    nameAr: 'جميع الأعراض مجتمعة',
    icon: '📊',
    category: 'شامل',
    clinicalNote: 'نظرة شمولية لتوزيع كامل الأعراض الجسدية والنفسية عبر أطوار الدورة المتعاقبة.'
  },
  {
    id: 'cramps',
    nameAr: 'تقلصات ومغص حوضي',
    icon: '⚡',
    category: 'حوضي',
    clinicalNote: 'ترتبط عادة بذروة إفراز البروستاغلاندينات (PGF2a) في بطانة الرحم خلال أول 48 ساعة من نزول الدم.'
  },
  {
    id: 'headache_hormonal',
    nameAr: 'صداع نصفي وهرموني',
    icon: '🤕',
    category: 'رأس وجهاز عصبي',
    clinicalNote: 'صداع انخفاض الإستروجين (Catamenial Migraine) يظهر نمطياً قبل الحيض بيومين (اليوم 26-28) نتيجة الهبوط الهرموني السريع.'
  },
  {
    id: 'bloating',
    nameAr: 'انتفاخ وغازات البطن',
    icon: '🎈',
    category: 'هضمي',
    clinicalNote: 'يسببه تأثير البروجستيرون في إبطاء حركة الأمعاء خلال الطور الأصفر المتقدم، واحتباس السوائل الأسموزي.'
  },
  {
    id: 'ovulation_pain',
    nameAr: 'ألم ونغزات التبويض (Mittelschmerz)',
    icon: '🌸',
    category: 'مبيضي',
    clinicalNote: 'يحدث في منتصف الدورة (اليوم 13-15) نتيجة تمدد محفظة المبيض أو انسكاب سائل الجريب المجهري المحفز لغشاء البريتون.'
  },
  {
    id: 'breast_tenderness',
    nameAr: 'ألم وحساسية الثدي',
    icon: '👙',
    category: 'ثدي',
    clinicalNote: 'استجابة فسيولوجية لارتفاع هرموني الإستروجين والبروجستيرون معاً في الطور الأصفر، مما يوسع القنوات الحليبية.'
  },
  {
    id: 'fatigue',
    nameAr: 'إرهاق وخمول بدني',
    icon: '😴',
    category: 'طاقة',
    clinicalNote: 'يرتبط بنقص الحديد وفقدان الدم أثناء الحيض، أو الأثر المهدئ للبروجستيرون على مستقبلات GABA الدماغية.'
  },
  {
    id: 'backache',
    nameAr: 'آلام أسفل الظهر',
    icon: '🩹',
    category: 'عضلي',
    clinicalNote: 'ألم انعكاسي عصبي ناتج عن تقلصات أربطة الرحم العجزية (Uterosacral Ligaments) خلال الطمث.'
  }
];

export const SymptomHeatmap: React.FC<SymptomHeatmapProps> = ({
  settings,
  dailyLogs,
  pastCycles,
  onOpenLogger
}) => {
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>('cramps');
  const [viewMode, setViewMode] = useState<'cycle_days' | 'calendar_months'>('cycle_days');
  const [activeCell, setActiveCell] = useState<{
    date: string;
    cycleName: string;
    cycleDay: number;
    intensity: number;
    phaseName: string;
    log?: DailyLog;
  } | null>(null);

  // Build the list of cycles to analyze: Current Cycle + Past 3 Cycles
  const cyclesToDisplay = useMemo(() => {
    const list: {
      id: string;
      labelAr: string;
      startDate: string;
      length: number;
      isCurrent: boolean;
    }[] = [];

    // Current Cycle
    list.push({
      id: 'current',
      labelAr: 'الدورة الحالية (الشهر الحالي)',
      startDate: settings.lastPeriodDate,
      length: settings.cycleLength,
      isCurrent: true
    });

    // Past cycles (sorted most recent first)
    const sortedPast = [...pastCycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
    sortedPast.slice(0, 3).forEach((pc, idx) => {
      const names = ['الدورة السابقة (الشهر الماضي)', 'قبل شهرين', 'قبل 3 أشهر'];
      list.push({
        id: pc.id,
        labelAr: names[idx] || `دورة ${pc.startDate}`,
        startDate: pc.startDate,
        length: pc.cycleLength,
        isCurrent: false
      });
    });

    return list;
  }, [settings, pastCycles]);

  // Check if a specific symptom matched
  const symptomMatches = (log: DailyLog | undefined, symptomKey: string): number => {
    if (!log) return 0;
    if (symptomKey === 'all') {
      return log.symptoms.length;
    }
    if (symptomKey === 'cramps') {
      if (log.symptoms.includes('cramps_severe')) return 3;
      if (log.symptoms.includes('cramps_mild')) return 2;
      return 0;
    }
    return log.symptoms.includes(symptomKey) ? 2 : 0;
  };

  // Compute Heatmap Matrix for Cycle Days (1 to 32)
  const maxCycleDays = 32;
  const cycleDaysArray = Array.from({ length: maxCycleDays }, (_, i) => i + 1);

  // Statistics calculation for the selected symptom
  const symptomStats = useMemo(() => {
    let totalOccurrences = 0;
    const cycleDayFrequency: Record<number, number> = {};
    const phaseFrequency: Record<string, number> = {
      menstrual: 0,
      follicular: 0,
      ovulation: 0,
      luteal: 0
    };
    let cyclesWithSymptomCount = 0;

    cyclesToDisplay.forEach(c => {
      let foundInThisCycle = false;
      for (let day = 1; day <= c.length; day++) {
        const dStr = addDays(c.startDate, day - 1);
        const log = dailyLogs[dStr];
        const intensity = symptomMatches(log, selectedSymptomId);
        if (intensity > 0) {
          totalOccurrences += 1;
          foundInThisCycle = true;
          cycleDayFrequency[day] = (cycleDayFrequency[day] || 0) + 1;
          const info = getDayCycleInfo(dStr, settings);
          phaseFrequency[info.phase] = (phaseFrequency[info.phase] || 0) + 1;
        }
      }
      if (foundInThisCycle) cyclesWithSymptomCount += 1;
    });

    // Find peak day
    let peakDay = 1;
    let maxDayCount = 0;
    Object.entries(cycleDayFrequency).forEach(([d, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = Number(d);
      }
    });

    // Find peak phase
    let peakPhase = 'menstrual';
    let maxPhaseCount = 0;
    Object.entries(phaseFrequency).forEach(([p, count]) => {
      if (count > maxPhaseCount) {
        maxPhaseCount = count;
        peakPhase = p;
      }
    });

    const recurrenceRate = cyclesToDisplay.length > 0
      ? Math.round((cyclesWithSymptomCount / cyclesToDisplay.length) * 100)
      : 0;

    const phaseLabels: Record<string, string> = {
      menstrual: 'طور الحيض (الأيام الأولى)',
      follicular: 'الطور الجريبي',
      ovulation: 'فترة التبويض',
      luteal: 'الطور الأصفر (ما قبل الحيض PMS)'
    };

    return {
      totalOccurrences,
      peakDay,
      maxDayCount,
      peakPhase: phaseLabels[peakPhase] || peakPhase,
      recurrenceRate,
      cyclesEvaluated: cyclesToDisplay.length
    };
  }, [cyclesToDisplay, dailyLogs, selectedSymptomId, settings]);

  const activeSymptomMeta = TRACKED_SYMPTOMS.find(s => s.id === selectedSymptomId) || TRACKED_SYMPTOMS[0];

  // Helper for heatmap cell color
  const getCellColor = (intensity: number, isToday: boolean, isPastDay: boolean) => {
    if (!isPastDay) return 'bg-slate-50 border-slate-100 text-slate-300';
    if (intensity === 0) return 'bg-slate-100/60 hover:bg-slate-200/60 border-slate-200/50 text-slate-400';
    if (intensity === 1) return 'bg-rose-100 hover:bg-rose-200 border-rose-200 text-rose-700 font-semibold';
    if (intensity === 2) return 'bg-rose-300 hover:bg-rose-400 border-rose-300 text-rose-900 font-bold';
    return 'bg-rose-600 hover:bg-rose-700 border-rose-600 text-white font-extrabold shadow-xs ring-1 ring-rose-400';
  };

  const todayStr = formatDate(new Date());

  return (
    <div className="space-y-6 text-right">
      
      {/* Header & Description */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-white/20 backdrop-blur-xs rounded-xl text-white">
                <Flame className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold">الخريطة الحرارية لتكرار الأعراض (Symptom Heatmap)</h3>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              تحليل بصري دقيق يوضح تكرار ظهور أعراض معينة (كالتقلصات الحوضية، الصداع الهرموني، أو الانتفاخ) خلال أيام محددة من الشهر عبر الدورات السابقة لاكتشاف الأنماط الهرمونية المسببة لها.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('cycle_days')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === 'cycle_days'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              أيام الدورة الهرمونية (1-32)
            </button>
            <button
              onClick={() => setViewMode('calendar_months')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === 'calendar_months'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              أيام الشهر التقويمية (1-31)
            </button>
          </div>
        </div>
      </div>

      {/* Symptom Filter Chips */}
      <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-rose-500" />
            <span>حددي العَرَض المراد تحليله على الخريطة الحرارية:</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {TRACKED_SYMPTOMS.length} مؤشرات بيومترية
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRACKED_SYMPTOMS.map(s => {
            const isSelected = selectedSymptomId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSymptomId(s.id);
                  setActiveCell(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs scale-102 ring-2 ring-rose-300'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-600'
                }`}
              >
                <span className="text-sm">{s.icon}</span>
                <span>{s.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* Clinical Note for Selected Symptom */}
        <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100/80 flex items-start gap-2.5 text-xs text-rose-950">
          <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-rose-800">التفسير الفسيولوجي لـ {activeSymptomMeta.nameAr}:</span>
            <p className="text-[11px] text-rose-900/90 leading-relaxed">
              {activeSymptomMeta.clinicalNote}
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Recognition Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>معدل التكرار الشهري</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              {symptomStats.recurrenceRate}%
            </span>
          </div>
          <span className="text-[11px] text-rose-600 font-medium block mt-1">
            ظهر في {symptomStats.recurrenceRate}% من الدورات السابقة
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>يوم الذروة الأكثر تكراراً</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-600 font-['Plus_Jakarta_Sans',sans-serif]">
              اليوم {symptomStats.peakDay}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            تكرر {symptomStats.maxDayCount} مرات في نفس هذا اليوم
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>المرحلة الهرمونية المرتبطة</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-sm font-extrabold text-purple-700 mt-2 truncate">
            {symptomStats.peakPhase}
          </div>
          <span className="text-[11px] text-purple-600 font-medium block mt-1">
            تأثير مباشر للتقلب الهرموني
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>إجمالي مرات التسجيل</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-600 font-['Plus_Jakarta_Sans',sans-serif]">
              {symptomStats.totalOccurrences}
            </span>
            <span className="text-xs font-bold text-slate-500">مرات</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            عبر آخر {symptomStats.cyclesEvaluated} دورات مسجلة
          </span>
        </div>
      </div>

      {/* Main Heatmap Visualization Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-xs space-y-6">
        
        {/* Heatmap Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-rose-50 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">مقياس الكثافة والتكرار:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-200" title="لم يُسجل عرض" />
              <span className="text-[11px] text-slate-500">طبيعي (0)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-rose-200" title="عرض خفيف" />
              <span className="text-[11px] text-slate-500">خفيف</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-300 border border-rose-300" title="عرض متوسط" />
              <span className="text-[11px] text-slate-500">متوسط</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-600 border border-rose-600" title="ذروة الألم والتكرار" />
              <span className="text-[11px] text-slate-700 font-bold">ذروة الألم / شديد</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            انقري على أي خلية لعرض التفاصيل السريرية الكاملة لليوم
          </div>
        </div>

        {/* View Mode 1: Cycle Days Matrix (1 to 32) */}
        {viewMode === 'cycle_days' && (
          <div className="space-y-4">
            
            {/* Phase Header Indicators */}
            <div className="overflow-x-auto no-scrollbar pb-1">
              <div className="min-w-[760px] flex items-center pr-32 text-[10px] font-bold">
                <div className="w-[15.6%] bg-rose-100 text-rose-800 p-1.5 rounded-r-lg text-center border-r-2 border-rose-500">
                  طور الحيض (أيام 1 - 5)
                </div>
                <div className="w-[21.8%] bg-pink-50 text-pink-700 p-1.5 text-center border-r-2 border-pink-400">
                  الطور الجريبي (أيام 6 - 12)
                </div>
                <div className="w-[12.5%] bg-purple-100 text-purple-800 p-1.5 text-center border-r-2 border-purple-500">
                  التبويض (13 - 16)
                </div>
                <div className="w-[50.1%] bg-amber-50 text-amber-800 p-1.5 rounded-l-lg text-center border-r-2 border-amber-400">
                  الطور الأصفر / ما قبل الطمث PMS (أيام 17 - 32)
                </div>
              </div>

              {/* Day numbers ruler */}
              <div className="min-w-[760px] flex items-center pr-32 pt-2 text-[10px] text-slate-400 font-mono">
                {cycleDaysArray.map(d => (
                  <div key={d} className="flex-1 text-center font-semibold">
                    {d}
                  </div>
                ))}
              </div>

              {/* Heatmap Rows for each Cycle */}
              <div className="min-w-[760px] space-y-2 mt-2">
                {cyclesToDisplay.map((cycle) => {
                  return (
                    <div key={cycle.id} className="flex items-center gap-2">
                      {/* Cycle Label */}
                      <div className="w-30 shrink-0 text-left pl-2">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {cycle.labelAr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          بدأت {cycle.startDate}
                        </span>
                      </div>

                      {/* Day Cells (1 to 32) */}
                      <div className="flex-1 flex items-center gap-1">
                        {cycleDaysArray.map(dayNum => {
                          const dateForDay = addDays(cycle.startDate, dayNum - 1);
                          const log = dailyLogs[dateForDay];
                          const intensity = symptomMatches(log, selectedSymptomId);
                          const isToday = dateForDay === todayStr;
                          const isPastOrToday = dateForDay <= todayStr;
                          const isSelectedCell = activeCell?.date === dateForDay;

                          return (
                            <button
                              key={dayNum}
                              onClick={() => {
                                const info = getDayCycleInfo(dateForDay, settings);
                                setActiveCell({
                                  date: dateForDay,
                                  cycleName: cycle.labelAr,
                                  cycleDay: dayNum,
                                  intensity,
                                  phaseName: info.phaseNameAr,
                                  log
                                });
                              }}
                              title={`اليوم ${dayNum} من ${cycle.labelAr} (${dateForDay})`}
                              className={`flex-1 h-8 rounded-md transition-all cursor-pointer text-[10px] flex items-center justify-center border relative ${getCellColor(
                                intensity,
                                isToday,
                                isPastOrToday
                              )} ${
                                isSelectedCell ? 'ring-2 ring-indigo-500 scale-110 z-10' : ''
                              } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                            >
                              {intensity > 0 ? (
                                intensity >= 3 ? '!' : intensity === 2 ? '•' : ''
                              ) : null}
                              {isToday && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* View Mode 2: Calendar Month Grid (1 to 31) */}
        {viewMode === 'calendar_months' && (
          <div className="space-y-4">
            <div className="overflow-x-auto no-scrollbar pb-1">
              {/* Day numbers 1 to 31 */}
              <div className="min-w-[760px] flex items-center pr-32 pb-2 text-[10px] text-slate-400 font-mono font-semibold">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <div key={d} className="flex-1 text-center">
                    {d}
                  </div>
                ))}
              </div>

              {/* Rows for the last 3-4 calendar months */}
              <div className="min-w-[760px] space-y-2">
                {[0, 1, 2, 3].map(monthsAgo => {
                  const targetDate = new Date();
                  targetDate.setMonth(targetDate.getMonth() - monthsAgo);
                  const year = targetDate.getFullYear();
                  const month = targetDate.getMonth() + 1;
                  const monthName = targetDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
                  const daysInMonth = new Date(year, month, 0).getDate();

                  return (
                    <div key={monthsAgo} className="flex items-center gap-2">
                      <div className="w-30 shrink-0 text-left pl-2">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {monthName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {daysInMonth} يوماً
                        </span>
                      </div>

                      <div className="flex-1 flex items-center gap-1">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => {
                          if (dayNum > daysInMonth) {
                            return (
                              <div
                                key={dayNum}
                                className="flex-1 h-8 bg-slate-50/30 rounded-md border border-slate-100"
                              />
                            );
                          }

                          const dStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                          const log = dailyLogs[dStr];
                          const intensity = symptomMatches(log, selectedSymptomId);
                          const isToday = dStr === todayStr;
                          const isPastOrToday = dStr <= todayStr;
                          const isSelectedCell = activeCell?.date === dStr;
                          const info = getDayCycleInfo(dStr, settings);

                          return (
                            <button
                              key={dayNum}
                              onClick={() => {
                                setActiveCell({
                                  date: dStr,
                                  cycleName: monthName,
                                  cycleDay: info.cycleDay,
                                  intensity,
                                  phaseName: info.phaseNameAr,
                                  log
                                });
                              }}
                              className={`flex-1 h-8 rounded-md transition-all cursor-pointer text-[10px] flex items-center justify-center border relative ${getCellColor(
                                intensity,
                                isToday,
                                isPastOrToday
                              )} ${
                                isSelectedCell ? 'ring-2 ring-indigo-500 scale-110 z-10' : ''
                              } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                            >
                              {intensity > 0 ? (intensity >= 3 ? '!' : '•') : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selected Cell Inspection Details Card */}
        {activeCell ? (
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-bold">
                  اليوم {activeCell.cycleDay} من الدورة
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {activeCell.date} ({activeCell.cycleName})
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    المرحلة: {activeCell.phaseName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs rounded-full font-bold ${
                  activeCell.intensity > 0
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {activeCell.intensity > 0
                    ? `سُجل عَرَض: ${activeSymptomMeta.nameAr}`
                    : 'لا توجد أعراض مسجلة لهذا العَرَض'}
                </span>
                <button
                  onClick={() => setActiveCell(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Daily Log Snapshot */}
            {activeCell.log ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">كافة الأعراض المسجلة:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeCell.log.symptoms.length > 0 ? (
                      activeCell.log.symptoms.map(sId => {
                        const m = AVAILABLE_SYMPTOMS.find(s => s.id === sId);
                        return (
                          <span key={sId} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-medium">
                            {m?.nameAr || sId}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-slate-400">لا أعراض</span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">الحالة الفيزيولوجية:</span>
                  <div className="mt-1 space-y-0.5 text-slate-700 font-medium">
                    <div>الحرارة BBT: {activeCell.log.bbt ? `${activeCell.log.bbt}°C` : 'غير مسجلة'}</div>
                    <div>غزارة الحيض: {activeCell.log.flow !== 'none' ? activeCell.log.flow : 'لا يوجد دم'}</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">ملاحظات مسجلة:</span>
                  <p className="mt-1 text-slate-600 italic">
                    {activeCell.log.notes || 'لا توجد ملاحظات مدونة لهذا اليوم.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-1">
                لم يتم تسجيل إدخال في سجل هذا اليوم. يمكنكِ إضافة الأعراض بالضغط على زر التدوين اليومي.
              </div>
            )}
          </div>
        ) : null}

        {/* Clinical Recommendations based on Heatmap Patterns */}
        <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-rose-600" />
            <h4 className="text-sm font-bold text-rose-950">
              التوصية السريرية للتعامل مع نمط {activeSymptomMeta.nameAr} المتكرر:
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-rose-100 space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                العلاج الاستباقي بالمكملات
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {selectedSymptomId === 'cramps' || selectedSymptomId === 'headache_hormonal'
                  ? 'جلايسينات المغنيسيوم (300-400 مجم) وفيتامين B6 يثبطان إنتاج البروستاغلاندينات المسببة للتشنج وتوسع الأوعية المخية.'
                  : 'مضادات الأكسدة (CoQ10 وأوميغا-3) لتقليل الالتهاب الخلوي في النصف الثاني من الدورة.'}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-100 space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                التغذية الموجهة
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                تقليل الصوديوم والسكريات المكررة قبل أسبوع من موعد الذروة الموضح بالخريطة، مع شرب مغلي الزنجبيل والبابونج لتهدئة عضلات الرحم الملساء.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-100 space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                استشارة الطبيبة
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                إذا كان الألم في يوم الذروة يعيق ممارسة نشاطكِ اليومي أو لا يستجيب للمسكنات، قد يشير ذلك لبطانة رحم مهاجرة أو ألياف رحمية تستوجب فحص السونار.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
