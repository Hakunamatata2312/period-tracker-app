import { UserCycleSettings, DailyLog, PastCycle, ReminderConfig } from '../types';
import { formatDate, addDays } from './cycleCalculator';

const SETTINGS_KEY = 'naqaa_cycle_settings_v1';
const LOGS_KEY = 'naqaa_daily_logs_v1';
const CYCLES_KEY = 'naqaa_past_cycles_v1';
const REMINDERS_KEY = 'naqaa_reminders_v1';

// Calculate realistic initial dates based on today
const today = new Date();
const todayStr = formatDate(today);
// Suppose the current cycle started 12 days ago
const defaultLastPeriod = addDays(todayStr, -12);

export const DEFAULT_SETTINGS: UserCycleSettings = {
  lastPeriodDate: defaultLastPeriod,
  periodDuration: 5,
  cycleLength: 28,
  lutealPhaseDuration: 14,
  isIrregular: false,
  goal: 'conceive',
  userName: 'صديقة نقاء'
};

export const DEFAULT_REMINDERS: ReminderConfig[] = [
  {
    id: 'bbt-morning',
    title: 'قياس حرارة الجسم الأساسية (BBT)',
    description: 'قيسي درجة حرارتك فور الاستيقاظ وقبل مغادرة السرير لرصد دقيق للتبويض.',
    time: '06:30',
    enabled: true,
    category: 'bbt'
  },
  {
    id: 'fertile-window-alert',
    title: 'تنبيه بدء نافذة الخصوبة العالية',
    description: 'أنتِ تقتربين من ذروة التبويض. هذه الأيام الـ 5 هي الوقت الأنسب للحمل.',
    time: '09:00',
    enabled: true,
    category: 'ovulation'
  },
  {
    id: 'daily-symptoms-check',
    title: 'تسجيل الأعراض اليومية والمزاج',
    description: 'دقيقة واحدة لتسجيل أعراضك تساعد الخوارزمية الطبية على تحليل صحتك.',
    time: '20:30',
    enabled: true,
    category: 'lifestyle'
  },
  {
    id: 'folic-vitamins',
    title: 'تناول حمض الفوليك والمكملات',
    description: 'تذكري أخذ مكملات ما قبل الحمل (الفوليك أسيد وفيتامين D).',
    time: '13:00',
    enabled: true,
    category: 'medication'
  },
  {
    id: 'upcoming-period',
    title: 'تذكير اقتراب موعد الحيض (قبل يومين)',
    description: 'دورتك القادمة متوقعة بعد يومين. استعدي بتهيئة مستلزماتك والراحة.',
    time: '10:00',
    enabled: true,
    category: 'period'
  }
];

export const SEED_PAST_CYCLES: PastCycle[] = [
  {
    id: 'cycle-1',
    startDate: addDays(defaultLastPeriod, -86),
    periodDuration: 5,
    cycleLength: 28
  },
  {
    id: 'cycle-2',
    startDate: addDays(defaultLastPeriod, -58),
    periodDuration: 5,
    cycleLength: 29
  },
  {
    id: 'cycle-3',
    startDate: addDays(defaultLastPeriod, -29),
    periodDuration: 5,
    cycleLength: 29
  }
];

/**
 * Generate rich, medically realistic demo logs spanning the past 3 cycles (~90 days) up to today.
 * This demonstrates realistic symptom recurrence (cramps on Days 1-2, headaches on Days 26-28,
 * ovulation pain on Day 14) across multiple consecutive months for the Heatmap.
 */
export function generateSeedDailyLogs(currentCycleStart: string): Record<string, DailyLog> {
  const logs: Record<string, DailyLog> = {};

  // Define cycle starts for the last 3 cycles and current cycle
  const cycles = [
    { startOffset: -86, length: 28 }, // Cycle -3
    { startOffset: -58, length: 29 }, // Cycle -2
    { startOffset: -29, length: 29 }, // Cycle -1
    { startOffset: 0, length: 28 }    // Current cycle (day 0 to day 12)
  ];

  cycles.forEach((c, cycleIdx) => {
    const cycleStartDate = addDays(currentCycleStart, c.startOffset);
    const maxDay = cycleIdx === 3 ? 12 : c.length - 1; // current cycle is on day 12

    for (let day = 0; day <= maxDay; day++) {
      const dStr = addDays(cycleStartDate, day);
      const cycleDay = day + 1; // 1-indexed

      let bbt = 36.35;
      let flow: DailyLog['flow'] = 'none';
      let mucus: DailyLog['cervicalMucus'] = undefined;
      const moods: string[] = [];
      const symptoms: string[] = [];
      let lh: DailyLog['lhTest'] = undefined;
      let intimacy: DailyLog['intimacy'] = undefined;

      // Period Days (Cycle days 1 to 5)
      if (cycleDay >= 1 && cycleDay <= 5) {
        if (cycleDay === 1) {
          flow = 'medium';
          symptoms.push('cramps_severe', 'backache', 'fatigue');
          moods.push('sensitive', 'tired');
          bbt = 36.28;
        } else if (cycleDay === 2) {
          flow = 'heavy';
          symptoms.push('cramps_mild', 'bloating');
          moods.push('tired', 'calm');
          bbt = 36.30;
        } else if (cycleDay === 3) {
          flow = 'medium';
          symptoms.push('bloating');
          moods.push('calm');
          bbt = 36.32;
        } else if (cycleDay === 4) {
          flow = 'light';
          moods.push('calm');
          bbt = 36.34;
        } else {
          flow = 'spotting';
          moods.push('happy');
          bbt = 36.36;
        }
      }
      // Follicular Days (Cycle days 6 to 11)
      else if (cycleDay >= 6 && cycleDay <= 11) {
        bbt = 36.30 + ((cycleDay % 3) * 0.03);
        mucus = cycleDay < 9 ? 'sticky' : 'creamy';
        moods.push('happy', 'energetic');
        if (cycleDay === 9 || cycleDay === 11) intimacy = 'unprotected';
      }
      // Ovulation Window (Cycle days 12 to 15)
      else if (cycleDay >= 12 && cycleDay <= 15) {
        if (cycleDay === 12) {
          bbt = 36.24; // pre-ovulatory dip
          mucus = 'watery';
          lh = 'high';
          moods.push('energetic');
          intimacy = 'unprotected';
        } else if (cycleDay === 13) {
          bbt = 36.22;
          mucus = 'egg_white';
          lh = 'peak';
          symptoms.push('ovulation_pain');
          moods.push('energetic', 'happy');
          intimacy = 'unprotected';
        } else if (cycleDay === 14) {
          bbt = 36.55; // sharp thermal rise
          mucus = 'egg_white';
          symptoms.push('ovulation_pain');
          moods.push('happy');
          intimacy = 'unprotected';
        } else {
          bbt = 36.68;
          mucus = 'creamy';
          moods.push('calm');
        }
      }
      // Mid & Late Luteal Phase (Cycle days 16 to 29)
      else {
        bbt = 36.72 + ((cycleDay % 4) * 0.03); // sustained high BBT
        mucus = 'creamy';

        // Recurrent PMS Symptoms in late luteal (Days 23 to 29)
        if (cycleDay >= 23 && cycleDay <= 25) {
          symptoms.push('breast_tenderness', 'bloating');
          moods.push('calm');
        } else if (cycleDay >= 26 && cycleDay <= 28) {
          symptoms.push('headache_hormonal', 'breast_tenderness', 'fatigue');
          moods.push('sensitive', 'anxious');
        } else if (cycleDay === 29) {
          symptoms.push('headache_hormonal', 'cramps_mild');
          moods.push('sensitive');
        } else {
          moods.push('calm');
        }
      }

      logs[dStr] = {
        date: dStr,
        flow,
        bbt: Math.round(bbt * 100) / 100,
        cervicalMucus: mucus,
        lhTest: lh,
        pregnancyTest: undefined,
        intimacy,
        moods,
        symptoms,
        waterGlasses: 7 + (cycleDay % 3),
        tookVitamins: true,
        notes: cycleDay === 13 ? 'مخاط عنق رحم مطاطي يشبه زلال البيض تماماً وفحص LH إيجابي مرتفع.' :
               cycleDay === 1 ? 'نزول دم الحيض مع تقلصات حوضية تم تخفيفها بكمادة دافئة.' :
               cycleDay === 27 ? 'صداع هرموني خفيف مع حساسية في الثديين قبل موعد الدورة.' : undefined
      };
    }
  });

  return logs;
}

export function loadSettings(): UserCycleSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserCycleSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function loadDailyLogs(cycleStart: string): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading daily logs', e);
  }
  const seeded = generateSeedDailyLogs(cycleStart);
  saveDailyLogs(seeded);
  return seeded;
}

export function saveDailyLogs(logs: Record<string, DailyLog>): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving daily logs', e);
  }
}

export function loadPastCycles(): PastCycle[] {
  try {
    const raw = localStorage.getItem(CYCLES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading past cycles', e);
  }
  savePastCycles(SEED_PAST_CYCLES);
  return SEED_PAST_CYCLES;
}

export function savePastCycles(cycles: PastCycle[]): void {
  try {
    localStorage.setItem(CYCLES_KEY, JSON.stringify(cycles));
  } catch (e) {
    console.error('Error saving past cycles', e);
  }
}

export function loadReminders(): ReminderConfig[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reminders', e);
  }
  saveReminders(DEFAULT_REMINDERS);
  return DEFAULT_REMINDERS;
}

export function saveReminders(reminders: ReminderConfig[]): void {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (e) {
    console.error('Error saving reminders', e);
  }
}
