import React from 'react';
import { Sparkles, Calendar, Heart, ShieldAlert, CheckCircle2, Flame, Droplets, Star } from 'lucide-react';
import { DayCycleInfo, UserCycleSettings, DailyLog } from '../types';

interface CycleWheelProps {
  dayInfo: DayCycleInfo;
  settings: UserCycleSettings;
  todayLog?: DailyLog;
  onOpenSymptomLogger: () => void;
  onOpenSettings: () => void;
  onGoToFertility: () => void;
}

export const CycleWheel: React.FC<CycleWheelProps> = ({
  dayInfo,
  settings,
  todayLog,
  onOpenSymptomLogger,
  onOpenSettings,
  onGoToFertility,
}) => {
  const cycleLength = settings.cycleLength || 28;
  const periodDuration = settings.periodDuration || 5;
  const lutealDuration = settings.lutealPhaseDuration || 14;
  const ovulationDay = Math.max(1, cycleLength - lutealDuration);
  const fertileStart = Math.max(1, ovulationDay - 5);
  const currentDay = Math.min(dayInfo.cycleDay, cycleLength);

  // SVG parameters
  const size = 320;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const currentProgress = (currentDay / cycleLength) * circumference;

  // Dynamic Theme Colors based on Phase and Day characteristics
  let theme = {
    gradientId: 'menstrualGrad',
    fromColor: '#e11d48',
    viaColor: '#f43f5e',
    toColor: '#be123c',
    glowColor: 'rgba(225, 29, 72, 0.25)',
    heartFill: 'rgba(244, 63, 94, 0.08)',
    heartStroke: '#e11d48',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-200',
    titleColor: 'text-rose-600',
    ambientBg: 'from-rose-100/50 via-pink-50/20 to-transparent',
    icon: Droplets,
    pulseClass: 'animate-pulse'
  };

  if (dayInfo.isOvulationDay) {
    theme = {
      gradientId: 'ovulationGrad',
      fromColor: '#10b981',
      viaColor: '#14b8a6',
      toColor: '#f59e0b',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      heartFill: 'rgba(16, 185, 129, 0.12)',
      heartStroke: '#10b981',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-200',
      titleColor: 'text-emerald-700',
      ambientBg: 'from-emerald-100/40 via-teal-50/30 to-amber-50/20',
      icon: Star,
      pulseClass: 'animate-bounce'
    };
  } else if (dayInfo.isFertileWindow) {
    theme = {
      gradientId: 'fertileGrad',
      fromColor: '#6366f1',
      viaColor: '#8b5cf6',
      toColor: '#a855f7',
      glowColor: 'rgba(99, 102, 241, 0.3)',
      heartFill: 'rgba(99, 102, 241, 0.1)',
      heartStroke: '#6366f1',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      titleColor: 'text-indigo-600',
      ambientBg: 'from-indigo-100/40 via-purple-50/30 to-transparent',
      icon: Sparkles,
      pulseClass: 'animate-pulse'
    };
  } else if (dayInfo.phase === 'luteal') {
    theme = {
      gradientId: 'lutealGrad',
      fromColor: '#8b5cf6',
      viaColor: '#7c3aed',
      toColor: '#4f46e5',
      glowColor: 'rgba(139, 92, 246, 0.25)',
      heartFill: 'rgba(139, 92, 246, 0.08)',
      heartStroke: '#8b5cf6',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
      titleColor: 'text-purple-700',
      ambientBg: 'from-purple-100/40 via-indigo-50/20 to-transparent',
      icon: Heart,
      pulseClass: ''
    };
  } else if (dayInfo.phase === 'follicular') {
    theme = {
      gradientId: 'follicularGrad',
      fromColor: '#ec4899',
      viaColor: '#f43f5e',
      toColor: '#fb7185',
      glowColor: 'rgba(236, 72, 153, 0.22)',
      heartFill: 'rgba(236, 72, 153, 0.08)',
      heartStroke: '#ec4899',
      badgeBg: 'bg-pink-100 text-pink-900 border-pink-200',
      titleColor: 'text-pink-600',
      ambientBg: 'from-pink-100/40 via-rose-50/30 to-transparent',
      icon: Sparkles,
      pulseClass: ''
    };
  }

  const PhaseIcon = theme.icon;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
      {/* Background soft ambient glowing blur */}
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl ${theme.ambientBg} rounded-full blur-3xl pointer-events-none transition-colors duration-1000`}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left/Center: Anatomical Heart-Uterus & Cycle Ring Showcase */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          
          <div className="relative" style={{ width: size, height: size }}>
            
            {/* SVG Canvas for Track & Anatomical Heart-Uterus Silhouette */}
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${size} ${size}`}
            >
              <defs>
                {/* Dynamic Linear Gradient for Progress Ring */}
                <linearGradient id={theme.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.fromColor} />
                  <stop offset="50%" stopColor={theme.viaColor} />
                  <stop offset="100%" stopColor={theme.toColor} />
                </linearGradient>

                {/* Soft glow filter */}
                <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor={theme.glowColor} />
                </filter>
              </defs>

              {/* Background Cycle Circle Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="text-slate-100 stroke-current"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Fertile window indicator arc */}
              {(() => {
                const startRatio = (fertileStart - 1) / cycleLength;
                const windowLengthRatio = 6 / cycleLength;
                const arcDash = windowLengthRatio * circumference;
                const arcOffset = -startRatio * circumference;
                return (
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(99, 102, 241, 0.28)"
                    strokeWidth={strokeWidth + 2}
                    strokeDasharray={`${arcDash} ${circumference}`}
                    strokeDashoffset={arcOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                );
              })()}

              {/* Period indicator arc */}
              {(() => {
                const arcDash = (periodDuration / cycleLength) * circumference;
                return (
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(244, 63, 94, 0.28)"
                    strokeWidth={strokeWidth + 2}
                    strokeDasharray={`${arcDash} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    fill="transparent"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                );
              })()}

              {/* Active Current Day Progress Ring with smooth settle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={`url(#${theme.gradientId})`}
                strokeWidth={strokeWidth}
                strokeDasharray={`${currentProgress} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-all duration-1000 ease-out"
              />

              {/* ========================================================= */}
              {/* BESPOKE HEART-UTERUS ANATOMICAL SCULPTURAL SILHOUETTE */}
              {/* Merges the loving heart contour with uterine fundus & fallopian horns */}
              {/* ========================================================= */}
              <g filter="url(#heartGlow)" className="transition-all duration-700">
                {/* Heart-Uterus Main Chamber Body */}
                <path
                  d="M 160 255
                     C 130 225, 95 190, 80 150
                     C 65 110, 80 75, 115 75
                     C 135 75, 150 90, 160 105
                     C 170 90, 185 75, 205 75
                     C 240 75, 255 110, 240 150
                     C 225 190, 190 225, 160 255 Z"
                  fill={theme.heartFill}
                  stroke={theme.heartStroke}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="transition-colors duration-700"
                />

                {/* Stylized Fallopian Tube Branches (قناتا فالوب الممتدتان كأجنحة رقيقة) */}
                <path
                  d="M 115 75 C 90 70, 68 80, 58 98"
                  fill="none"
                  stroke={theme.heartStroke}
                  strokeWidth="2"
                  strokeDasharray="2,2"
                  strokeLinecap="round"
                />
                <path
                  d="M 205 75 C 230 70, 252 80, 262 98"
                  fill="none"
                  stroke={theme.heartStroke}
                  strokeWidth="2"
                  strokeDasharray="2,2"
                  strokeLinecap="round"
                />

                {/* Delicate Glowing Ovary Orbs (المبيضان الحاضنان للبويضات) */}
                <circle
                  cx="54"
                  cy="104"
                  r="6.5"
                  fill={theme.heartStroke}
                  fillOpacity="0.8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className={dayInfo.isOvulationDay ? 'animate-ping' : ''}
                />
                <circle
                  cx="266"
                  cy="104"
                  r="6.5"
                  fill={theme.heartStroke}
                  fillOpacity="0.8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className={dayInfo.isOvulationDay ? 'animate-ping' : ''}
                />

                {/* Cervical Os (عنق الرحم السفلي) */}
                <path
                  d="M 152 265 C 156 270, 164 270, 168 265"
                  fill="none"
                  stroke={theme.heartStroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

            </svg>

            {/* Inner Content Positioned Within the Heart-Uterus Chamber */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">
              
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 tracking-wider">
                <PhaseIcon className={`w-3.5 h-3.5 ${theme.titleColor}`} />
                <span>اليوم من دورتكِ</span>
              </div>

              {/* Day Number */}
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] tabular-nums">
                  {dayInfo.cycleDay}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  / {cycleLength}
                </span>
              </div>

              {/* Phase Badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs max-w-[190px] truncate ${theme.badgeBg}`}>
                {dayInfo.phaseNameAr}
              </span>

              {/* Countdown or Due status */}
              <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                {dayInfo.daysUntilNextPeriod > 0
                  ? `باقي ${dayInfo.daysUntilNextPeriod} يوماً على الحيض`
                  : dayInfo.daysUntilNextPeriod === 0
                  ? 'موعد الحيض المتوقع اليوم'
                  : `تأخرت الدورة بـ ${Math.abs(dayInfo.daysUntilNextPeriod)} أيام`}
              </p>
            </div>
          </div>

          {/* Quick status dots legend beneath heart-uterus */}
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-4 flex-wrap justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>الحيض (1-{periodDuration})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>الخصوبة ({fertileStart}-{ovulationDay})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>يوم {ovulationDay} (التبويض ⭐)</span>
            </div>
          </div>
        </div>

        {/* Right Details: Clinical Phase Summary & Biomarkers Card */}
        <div className="flex-1 w-full space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">فرصة الحمل اليوم:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${theme.badgeBg}`}>
                  {dayInfo.chanceLabelAr}
                </span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
              >
                تعديل طول الدورة
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {dayInfo.phaseNameAr}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {dayInfo.phaseDescriptionAr}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-1.5 text-xs text-rose-700 font-medium mb-1">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>يوم التبويض المقدر</span>
              </div>
              <p className="text-base font-bold text-slate-900">
                اليوم {ovulationDay} من الدورة
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {dayInfo.cycleDay <= ovulationDay
                  ? `متبقي ${ovulationDay - dayInfo.cycleDay} أيام`
                  : 'تم التبويض لهذه الدورة'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium mb-1">
                <Heart className="w-4 h-4 text-indigo-500" />
                <span>نافذة الخصوبة</span>
              </div>
              <p className="text-base font-bold text-slate-900">
                الأيام {fertileStart} إلى {ovulationDay}
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {dayInfo.isFertileWindow ? 'أنتِ داخل النافذة الآن' : 'خارج فترة الخصوبة'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium mb-1">
                <Droplets className="w-4 h-4 text-purple-500" />
                <span>حرارة BBT اليوم</span>
              </div>
              <p className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {todayLog?.bbt ? `${todayLog.bbt.toFixed(2)} °C` : 'لم تُسجل بعد'}
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {todayLog?.cervicalMucus ? `مخاط: ${todayLog.cervicalMucus}` : 'سجلي المؤشرات الصباحية'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenSymptomLogger}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>تسجيل قياسات وأعراض اليوم</span>
            </button>

            <button
              onClick={onGoToFertility}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>إرشادات زيادة فرص الحمل</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
