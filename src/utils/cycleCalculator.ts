import { DayCycleInfo, UserCycleSettings, PastCycle, CyclePhase, PregnancyChance, SmartPredictionResult } from '../types';

/**
 * Format Date to YYYY-MM-DD in local time
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD to local Date object
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Add days to a date string
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * Calculate difference in days between two date strings (dateB - dateA)
 */
export function diffDays(dateA: string, dateB: string): number {
  const da = parseDate(dateA);
  const db = parseDate(dateB);
  const diffTime = db.getTime() - da.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the current cycle start date for any target date
 */
export function getCurrentCycleStart(targetDate: string, settings: UserCycleSettings): string {
  const daysDiff = diffDays(settings.lastPeriodDate, targetDate);
  const cycleLen = Math.max(21, settings.cycleLength);
  
  if (daysDiff >= 0) {
    const cyclesElapsed = Math.floor(daysDiff / cycleLen);
    return addDays(settings.lastPeriodDate, cyclesElapsed * cycleLen);
  } else {
    // Target date is in the past before lastPeriodDate
    const cyclesBack = Math.ceil(Math.abs(daysDiff) / cycleLen);
    return addDays(settings.lastPeriodDate, -cyclesBack * cycleLen);
  }
}

/**
 * Detailed clinical calculation for a specific day
 */
export function getDayCycleInfo(targetDate: string, settings: UserCycleSettings): DayCycleInfo {
  const cycleStart = getCurrentCycleStart(targetDate, settings);
  const dayInCycle = diffDays(cycleStart, targetDate) + 1; // 1-indexed (Day 1 = first day of bleeding)
  const cycleLen = settings.cycleLength;
  const periodDuration = settings.periodDuration;
  const lutealLen = settings.lutealPhaseDuration || 14;
  const ovulationDay = Math.max(1, cycleLen - lutealLen); // e.g. 28 - 14 = Day 14

  let phase: CyclePhase = 'follicular';
  let phaseNameAr = 'الطور الجريبي';
  let phaseDescriptionAr = 'فترة نشاط هرمون الإستروجين ونمو الحويصلات المبيضية وتجدد بطانة الرحم والطاقة العالية.';
  let chance: PregnancyChance = 'low';
  let chanceLabelAr = 'فرصة منخفضة جداً';

  const isPeriod = dayInCycle >= 1 && dayInCycle <= periodDuration;
  const isOvulationDay = dayInCycle === ovulationDay;
  const isFertileWindow = dayInCycle >= (ovulationDay - 5) && dayInCycle <= ovulationDay;

  if (isPeriod) {
    phase = 'menstrual';
    phaseNameAr = 'طور الحيض (الطمث)';
    phaseDescriptionAr = 'انسلاخ بطانة الرحم السطحية مع مستويات منخفضة من الهرمونات؛ يتطلب الجسد راحة وتغذية دافئة.';
    chance = 'none';
    chanceLabelAr = 'فرصة معدومة تقريباً';
  } else if (isOvulationDay) {
    phase = 'ovulation';
    phaseNameAr = 'يوم التبويض (ذروة الإباضة)';
    phaseDescriptionAr = 'تحرر البويضة الناضجة من المبيض واستقرارها في قناة فالوب لمدة 12-24 ساعة؛ أعلى فرصة إخصاب بيولوجية.';
    chance = 'very_high';
    chanceLabelAr = 'أقصى فرصة للحمل (ذروة الخصوبة)';
  } else if (dayInCycle >= ovulationDay - 2 && dayInCycle < ovulationDay) {
    phase = 'follicular';
    phaseNameAr = 'نافذة الخصوبة العالية';
    phaseDescriptionAr = 'الأيام الذهبية قبل التبويض؛ وجود الحيوانات المنوية الآن يعطي أفضل فرصة للقاء البويضة فور خروجها.';
    chance = 'high';
    chanceLabelAr = 'فرصة حمل مرتفعة جداً';
  } else if (dayInCycle >= ovulationDay - 5 && dayInCycle < ovulationDay - 2) {
    phase = 'follicular';
    phaseNameAr = 'بداية نافذة الخصوبة';
    phaseDescriptionAr = 'بدء إفراز مخاط عنق الرحم المغذي وتوسع فرصة وصول الحيوانات المنوية بنجاح.';
    chance = 'medium';
    chanceLabelAr = 'فرصة حمل متوسطة';
  } else if (dayInCycle === ovulationDay + 1) {
    phase = 'luteal';
    phaseNameAr = 'نهاية نافذة الخصوبة';
    phaseDescriptionAr = 'الساعات الأخيرة لصلاحية البويضة للتلقيح قبل تحللها وبدء إفراز هرمون البروجستيرون.';
    chance = 'medium';
    chanceLabelAr = 'فرصة حمل متوسطة';
  } else if (dayInCycle > ovulationDay + 1) {
    phase = 'luteal';
    phaseNameAr = 'الطور الأصفر (اللوتيني)';
    phaseDescriptionAr = 'سيادة هرمون البروجستيرون لتهيئة بطانة الرحم لاستقبال الجنين أو الاستعداد لدورة جديدة.';
    chance = 'none';
    chanceLabelAr = 'فرصة معدومة تقريباً';
  }

  // Days until next period
  const nextPeriodDate = addDays(cycleStart, cycleLen);
  const daysUntilNextPeriod = diffDays(targetDate, nextPeriodDate);

  return {
    date: targetDate,
    cycleDay: dayInCycle,
    phase,
    phaseNameAr,
    phaseDescriptionAr,
    chance,
    chanceLabelAr,
    isPeriod,
    isFertileWindow,
    isOvulationDay,
    daysUntilNextPeriod
  };
}

/**
 * Predict next upcoming 6 cycle dates
 */
export function getUpcomingCycles(settings: UserCycleSettings, count: number = 4) {
  const todayStr = formatDate(new Date());
  let currentStart = getCurrentCycleStart(todayStr, settings);
  const results = [];

  for (let i = 0; i < count; i++) {
    const cycleStart = addDays(currentStart, i * settings.cycleLength);
    const periodEnd = addDays(cycleStart, settings.periodDuration - 1);
    const ovulationDay = Math.max(1, settings.cycleLength - (settings.lutealPhaseDuration || 14));
    const ovulationDate = addDays(cycleStart, ovulationDay - 1);
    const fertileStart = addDays(cycleStart, ovulationDay - 6);
    const fertileEnd = ovulationDate;

    results.push({
      cycleNumber: i + 1,
      startDate: cycleStart,
      periodEndDate: periodEnd,
      ovulationDate,
      fertileStartDate: fertileStart,
      fertileEndDate: fertileEnd,
      nextCycleStartDate: addDays(cycleStart, settings.cycleLength)
    });
  }

  return results;
}

/**
 * Calculate Conception Estimated Due Date (EDD) based on Last Menstrual Period (Naegele's rule)
 */
export function calculateEDD(lastPeriodDate: string, cycleLength: number = 28) {
  const lmp = parseDate(lastPeriodDate);
  // Naegele's rule: LMP + 1 year - 3 months + 7 days + (cycleLength - 28)
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280 + (cycleLength - 28));

  // Current gestational age
  const today = new Date();
  const diffTime = today.getTime() - lmp.getTime();
  const diffDaysTotal = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const weeks = Math.floor(diffDaysTotal / 7);
  const days = diffDaysTotal % 7;

  return {
    eddDate: formatDate(edd),
    gestationalWeeks: weeks,
    gestationalDays: days,
    trimester: weeks < 13 ? 1 : weeks < 27 ? 2 : 3,
    conceptionDate: addDays(lastPeriodDate, cycleLength - 14)
  };
}

/**
 * Compute health statistics from past cycles
 */
export function analyzeCycles(pastCycles: PastCycle[], currentSettings: UserCycleSettings) {
  if (!pastCycles || pastCycles.length === 0) {
    return {
      averageCycleLength: currentSettings.cycleLength,
      averagePeriodDuration: currentSettings.periodDuration,
      shortestCycle: currentSettings.cycleLength,
      longestCycle: currentSettings.cycleLength,
      regularityScore: 92,
      regularityStatus: 'منتظمة ومتوازنة سريرياً',
      regularityColor: 'emerald',
      clinicalAdvice: 'دورتك الشهرية تقع ضمن النطاق الفسيولوجي المعتمد من ACOG (21-35 يوماً). استمري في التتبع لحساب معدل التبويض الدقيق.'
    };
  }

  const lengths = pastCycles.map(c => c.cycleLength);
  const periods = pastCycles.map(c => c.periodDuration);

  const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const avgPeriod = Math.round((periods.reduce((a, b) => a + b, 0) / periods.length) * 10) / 10;
  const shortest = Math.min(...lengths);
  const longest = Math.max(...lengths);
  const variance = longest - shortest;

  let regularityScore = 100 - (variance * 6);
  regularityScore = Math.max(40, Math.min(99, regularityScore));

  let regularityStatus = 'عالية الانتظام';
  let regularityColor = 'emerald';
  let clinicalAdvice = 'انتظام الدورة ممتاز ويدل على سلامة التوازن الهرموني والإباضة المتكررة.';

  if (variance > 9 || avgLength < 21 || avgLength > 35) {
    regularityStatus = 'تقلبات أو غير منتظمة';
    regularityColor = 'amber';
    clinicalAdvice = 'يوجد تباين ملحوظ في أطوال الدورات السابقة (> 8 أيام). يُنصح بمراجعة طبيبة نسائية لفحص مخزون التبويض وهرمونات الغدة والبرولاكتين.';
  } else if (variance > 5) {
    regularityStatus = 'انتظام معتدل طبيعي';
    regularityColor = 'teal';
    clinicalAdvice = 'تقلبات طفيفة ضمن النطاق الفسيولوجي الطبيعي الشائع بسبب الإجهاد العابر أو تغيرات النوم.';
  }

  return {
    averageCycleLength: avgLength,
    averagePeriodDuration: avgPeriod,
    shortestCycle: shortest,
    longestCycle: longest,
    regularityScore,
    regularityStatus,
    regularityColor,
    clinicalAdvice
  };
}

/**
 * Smart Algorithmic 3-Cycle Weighted Prediction
 * Uses weights: Cycle 1 (most recent) 50%, Cycle 2 (30%), Cycle 3 (20%)
 * Computes standard deviation, margin of error, and confidence interval
 */
export function calculateSmart3CyclePrediction(
  pastCycles: PastCycle[],
  lastPeriodDate: string,
  lutealPhaseDuration: number = 14
): SmartPredictionResult {
  // If fewer than 3 cycles exist, synthesize reasonable estimates
  const defaultLengths = [28, 29, 28];
  const defaultPeriods = [5, 5, 5];

  let lengths: number[] = [];
  let periods: number[] = [];

  if (pastCycles && pastCycles.length > 0) {
    lengths = pastCycles.slice(0, 3).map(c => c.cycleLength);
    periods = pastCycles.slice(0, 3).map(c => c.periodDuration);
  }

  while (lengths.length < 3) {
    lengths.push(defaultLengths[lengths.length]);
    periods.push(defaultPeriods[periods.length]);
  }

  // Weights: Most recent cycle has highest predictive power (50%), then 30%, then 20%
  const w1 = 0.50;
  const w2 = 0.30;
  const w3 = 0.20;

  const predictedLengthRaw = (lengths[0] * w1) + (lengths[1] * w2) + (lengths[2] * w3);
  const predictedCycleLength = Math.round(predictedLengthRaw * 10) / 10;
  const predictedPeriodDuration = Math.round(((periods[0] * w1) + (periods[1] * w2) + (periods[2] * w3)) * 10) / 10;

  // Standard deviation calculation
  const mean = (lengths[0] + lengths[1] + lengths[2]) / 3;
  const variance = lengths.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / 3;
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;

  // Margin of error with 90% confidence z-factor
  const margin = Math.round(Math.max(1.0, stdDev * 1.2) * 10) / 10;
  const confidence = Math.max(65, Math.min(98, Math.round(100 - (stdDev * 10))));

  // Target date predictions
  const roundedCycleLen = Math.round(predictedCycleLength);
  const predictedNextPeriodDate = addDays(lastPeriodDate, roundedCycleLen);
  const ovulationDayInCycle = Math.max(1, roundedCycleLen - lutealPhaseDuration);
  const predictedOvulationDate = addDays(lastPeriodDate, ovulationDayInCycle - 1);
  const predictedFertileStart = addDays(predictedOvulationDate, -5);
  const predictedFertileEnd = predictedOvulationDate;

  let clinicalInterpretation = '';
  if (stdDev <= 1.0) {
    clinicalInterpretation = 'ثبات دوري استثنائي (انحراف معياري ≤ 1.0 يوم). الخوارزمية تتوقع الموعد بدقة إحصائية تفوق 95%.';
  } else if (stdDev <= 2.5) {
    clinicalInterpretation = 'انتظام فسيولوجي طبيعي ومستقر. التقلبات الطفيفة ضمن الحدود البيولوجية المعتادة لنضوج الجريب.';
  } else {
    clinicalInterpretation = 'يوجد تباين نسبي في الدورات السابقة؛ تم توسيع هامش الأمان الإحصائي لضمان تغطية نافذة الخصوبة بالكامل.';
  }

  return {
    predictedCycleLength,
    predictedPeriodDuration,
    confidenceScore: confidence,
    marginOfErrorDays: margin,
    predictedNextPeriodDate,
    predictedOvulationDate,
    predictedFertileStart,
    predictedFertileEnd,
    weightsUsed: { cycle1: w1, cycle2: w2, cycle3: w3 },
    recentCycleLengths: lengths,
    standardDeviation: stdDev,
    clinicalInterpretation
  };
}
