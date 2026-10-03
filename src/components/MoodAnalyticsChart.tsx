import React, { useState } from 'react';
import { Smile, Sparkles, Heart, Brain, Sun, Moon, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { UserCycleSettings, DailyLog } from '../types';
import { getDayCycleInfo, parseDate } from '../utils/cycleCalculator';
import { AVAILABLE_MOODS } from '../data/fertilityKnowledge';

interface MoodAnalyticsChartProps {
  settings: UserCycleSettings;
  dailyLogs: Record<string, DailyLog>;
  currentDayInCycle: number;
}

export const MoodAnalyticsChart: React.FC<MoodAnalyticsChartProps> = ({
  settings,
  dailyLogs,
  currentDayInCycle,
}) => {
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState<string>('all');

  const cycleLen = settings.cycleLength || 28;
  const ovulationDay = Math.max(1, cycleLen - (settings.lutealPhaseDuration || 14));

  // Compute daily mood scores from logs
  // Happy/Energetic = +2, Calm = +1, Sensitive/Low focus = -0.5, Anxious/Irritable/Sad = -1.5
  const moodScoreMap: Record<string, number> = {
    happy: 2,
    energetic: 2,
    calm: 1,
    sensitive: -0.5,
    low_focus: -0.5,
    anxious: -1.5,
    irritable: -1.5,
    sad: -2
  };

  // Build 28-day points for the baseline neuro-hormonal mood curve
  // Theoretical curve:
  // Days 1-5: starts at -0.5, climbs to 0.5
  // Days 6-13: climbs from 0.5 to peak +2.0 at ovulation
  // Days 14-16: high at +1.8
  // Days 17-21: steady at +0.8 (calm progesterone)
  // Days 22-28: drops to -1.2 (PMS window dip) then recovers at menstruation start
  const theoreticalCurve = Array.from({ length: cycleLen }, (_, idx) => {
    const day = idx + 1;
    let score = 0;

    if (day <= settings.periodDuration) {
      score = -0.8 + (day / settings.periodDuration) * 1.0;
    } else if (day <= ovulationDay) {
      const progress = (day - settings.periodDuration) / (ovulationDay - settings.periodDuration);
      score = 0.2 + progress * 1.8; // peaks at 2.0
    } else if (day <= ovulationDay + 2) {
      score = 1.8;
    } else if (day <= cycleLen - 6) {
      score = 0.8;
    } else {
      const pmsProgress = (day - (cycleLen - 6)) / 6;
      score = 0.6 - pmsProgress * 1.8; // dips down to -1.2
    }

    return { day, score };
  });

  // Calculate user-logged mood points
  const userMoodPoints: { dayInCycle: number; score: number; primaryMood: string; date: string }[] = [];
  const moodTallies: Record<string, number> = {};

  Object.values(dailyLogs).forEach(log => {
    const dayInfo = getDayCycleInfo(log.date, settings);
    if (log.moods && log.moods.length > 0) {
      let sum = 0;
      log.moods.forEach(m => {
        sum += (moodScoreMap[m] || 0);
        moodTallies[m] = (moodTallies[m] || 0) + 1;
      });
      const avg = sum / log.moods.length;
      userMoodPoints.push({
        dayInCycle: dayInfo.cycleDay,
        score: avg,
        primaryMood: log.moods[0],
        date: log.date
      });
    }
  });

  // Sorted moods by count
  const sortedMoods = Object.entries(moodTallies)
    .sort(([, a], [, b]) => b - a)
    .map(([id, count]) => {
      const meta = AVAILABLE_MOODS.find(m => m.id === id);
      return { id, count, label: meta?.labelAr || id, emoji: meta?.emoji || '🌸' };
    });

  // SVG Chart bounds
  const chartW = 700;
  const chartH = 220;
  const paddingX = 40;
  const paddingY = 20;

  // Convert score (-2.5 to +2.5) to Y (bottom to top)
  const scoreToY = (score: number) => {
    const normalized = (score - (-2.5)) / 5.0; // 0 to 1
    return (chartH - paddingY) - normalized * (chartH - 2 * paddingY);
  };

  const dayToX = (day: number) => {
    return paddingX + ((day - 1) / (cycleLen - 1)) * (chartW - 2 * paddingX);
  };

  // Build theoretical path
  const theoreticalPath = theoreticalCurve.reduce((acc, pt, i) => {
    const x = dayToX(pt.day);
    const y = scoreToY(pt.score);
    return `${acc} ${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }, '');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-50 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5 text-pink-600" />
            <span>منحنى التقلبات النفسية والهرمونية (Psychological Cycle Profile)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            الحالة النفسية والمزاجية عبر أطوار الدورة الشهرية
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            رسم بياني سريري يوضح كيف تؤثر تقلبات الإستروجين والبروجستيرون على كيمياء الدماغ (السيروتونين والدوبامين و GABA)، مع مطابقة مشاعركِ اليومية المسجلة.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded"></span>
            <span className="text-slate-600">المسار الهرموني المتوقع</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white"></span>
            <span className="text-slate-600">تسجيلاتكِ الفعلية</span>
          </div>
        </div>
      </div>

      {/* SVG Mood Chart */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[650px] h-72 relative bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
            
            {/* Phase Background Shading */}
            {/* Menstrual Phase */}
            <rect
              x={dayToX(1)}
              y={paddingY}
              width={dayToX(settings.periodDuration) - dayToX(1)}
              height={chartH - 2 * paddingY}
              fill="rgba(244, 63, 94, 0.08)"
            />
            {/* Ovulation Peak */}
            <rect
              x={dayToX(ovulationDay - 1)}
              y={paddingY}
              width={dayToX(ovulationDay + 1) - dayToX(ovulationDay - 1)}
              height={chartH - 2 * paddingY}
              fill="rgba(16, 185, 129, 0.12)"
            />
            {/* PMS / Late Luteal Window */}
            <rect
              x={dayToX(cycleLen - 6)}
              y={paddingY}
              width={dayToX(cycleLen) - dayToX(cycleLen - 6)}
              height={chartH - 2 * paddingY}
              fill="rgba(147, 51, 234, 0.08)"
            />

            {/* Zero Neutral Line */}
            <line
              x1={paddingX}
              y1={scoreToY(0)}
              x2={chartW - paddingX}
              y2={scoreToY(0)}
              stroke="#cbd5e1"
              strokeDasharray="3,3"
              strokeWidth="1"
            />
            <text x={paddingX - 8} y={scoreToY(0) + 3} textAnchor="end" className="text-[10px] fill-slate-400">
              توازن
            </text>

            <text x={paddingX - 8} y={scoreToY(1.8) + 3} textAnchor="end" className="text-[10px] fill-emerald-600 font-semibold">
              إيجابية ✨
            </text>

            <text x={paddingX - 8} y={scoreToY(-1.6) + 3} textAnchor="end" className="text-[10px] fill-rose-600 font-semibold">
              حساسية 💧
            </text>

            {/* Theoretical Baseline Curve */}
            <path
              d={theoreticalPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4,2"
              className="opacity-70"
            />

            {/* User Logged Daily Mood Points */}
            {userMoodPoints.map((pt, idx) => {
              const x = dayToX(Math.min(cycleLen, pt.dayInCycle));
              const y = scoreToY(pt.score);
              const meta = AVAILABLE_MOODS.find(m => m.id === pt.primaryMood);

              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={5}
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-[11px]"
                  >
                    {meta?.emoji || '🌸'}
                  </text>
                </g>
              );
            })}

            {/* Current Day Pointer Line */}
            {currentDayInCycle <= cycleLen && (
              <g>
                <line
                  x1={dayToX(currentDayInCycle)}
                  y1={paddingY}
                  x2={dayToX(currentDayInCycle)}
                  y2={chartH - paddingY}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <circle
                  cx={dayToX(currentDayInCycle)}
                  cy={scoreToY(theoreticalCurve[currentDayInCycle - 1]?.score || 0)}
                  r={6}
                  fill="#0f172a"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={dayToX(currentDayInCycle)}
                  y={paddingY - 5}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-900"
                >
                  اليوم {currentDayInCycle}📍
                </text>
              </g>
            )}

          </svg>

          {/* Phase labels beneath chart */}
          <div className="grid grid-cols-4 text-center text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200">
            <span className="text-rose-600">الحيض (استعادة التوازن)</span>
            <span className="text-pink-600">الطور الجريبي (تصاعد الطاقة)</span>
            <span className="text-emerald-700">التبويض (قمة الحيوية والجاذبية)</span>
            <span className="text-purple-700">الطور اللوتيني (الهدوء ثم PMS)</span>
          </div>
        </div>
      </div>

      {/* Mood Distribution Stats and Phase Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Logged Emotions Distribution */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>توزيع المشاعر المسجلة في مفكرتك:</span>
            <span className="font-mono text-slate-500 text-[11px]">{userMoodPoints.length} أيام مسجلة</span>
          </h4>

          {sortedMoods.length > 0 ? (
            <div className="space-y-2">
              {sortedMoods.map(item => {
                const percent = Math.round((item.count / userMoodPoints.length) * 100);
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{item.count} مرات ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-rose-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              سجلي حالتك المزاجية يومياً في زر «تسجيل أعراض اليوم» لتكوين إحصائية المشاعر الدقيقة وتتبع نمطك الشخصي.
            </p>
          )}
        </div>

        {/* Right: Phase-Specific Emotional Clinical Guidance */}
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold">
              الإرشاد النفسي والعصبي لمرحلتكِ الحالية (اليوم {currentDayInCycle}):
            </h4>
          </div>

          <div className="text-xs text-indigo-950 space-y-2 leading-relaxed">
            {currentDayInCycle <= settings.periodDuration ? (
              <>
                <p>
                  <strong>طور الحيض:</strong> مستويات الإستروجين والبروجستيرون في أدنى مستوياتها. يستريح عقلك تدريجياً من توتر الأسبوع الماضي. امنحي جسدك وقتاً للنوم الكافي والتغذية الدافئة وتجنبي الضغوط الاجتماعية الإضافية.
                </p>
                <span className="text-[11px] text-indigo-700 block">نصيحة: شاي البابونج والمغنيسيوم والمشي الخفيف.</span>
              </>
            ) : currentDayInCycle <= ovulationDay ? (
              <>
                <p>
                  <strong>الطور الجريبي والتبويض:</strong> تصاعد الإستروجين يعزز نشاط النواقل العصبية (السيروتونين والدوبامين)، مما يمنحك صفاءً ذهنياً ممتازاً، ثقة عالية، وسهولة في التواصل وحل المسائل الصعبة.
                </p>
                <span className="text-[11px] text-emerald-700 block">نصيحة: الوقت الذهبي للمشاريع الجديدة والرياضات الحيوية.</span>
              </>
            ) : (
              <>
                <p>
                  <strong>الطور الأصفر (ما قبل الحيض):</strong> هبوط الإستروجين قد يقلل مستوى السيروتونين مؤقتاً، مما يفسر نوبات الحساسية العاطفية أو سرعة الانفعال. اعلمي أن هذه كيمياء بيولوجية مؤقتة وليست حقيقة مشاعرك الدائمة.
                </p>
                <span className="text-[11px] text-purple-700 block">نصيحة: تجنبي الكافيين الزائد، واستهلكي الكربوهيدرات المعقدة والمغنيسيوم غلايسينات لدعم النوم وتهدئة الأعصاب.</span>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
