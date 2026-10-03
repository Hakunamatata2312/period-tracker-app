import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Heart, Droplets, Star, Plus } from 'lucide-react';
import { UserCycleSettings, DailyLog } from '../types';
import { formatDate, parseDate, getDayCycleInfo, addDays } from '../utils/cycleCalculator';

interface CycleCalendarProps {
  settings: UserCycleSettings;
  dailyLogs: Record<string, DailyLog>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenLogModal: (date: string) => void;
}

export const CycleCalendar: React.FC<CycleCalendarProps> = ({
  settings,
  dailyLogs,
  selectedDate,
  onSelectDate,
  onOpenLogModal,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const todayStr = formatDate(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(todayStr);
  };

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Arabic Month Name
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthTitle = `${monthNamesAr[month]} ${year}`;

  // First day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday
  // In Arabic/Middle East calendar, week usually starts Saturday (6) or Sunday (0)
  // Let's start week on Saturday: Saturday (0), Sunday (1), ... Friday (6)
  const adjustedFirstDay = (firstDayOfMonth + 1) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day names header (Saturday to Friday)
  const weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  // Build grid cells
  const calendarCells = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push(dStr);
  }

  const selectedDayInfo = getDayCycleInfo(selectedDate, settings);
  const selectedLog = dailyLogs[selectedDate];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {monthTitle}
          </h3>
          <span className="text-xs text-slate-500 block mt-0.5">
            توقعات دوراتك، أيام التبويض، ونوافذ الخصوبة العالية
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          >
            اليوم
          </button>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={handlePrevMonth}
              title="الشهر السابق"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              title="الشهر القادم"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>فترة الحيض المتوقعة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
          <span>نافذة الخصوبة (فرصة حمل عالية)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>يوم الإباضة المقدر (الذروة)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-400"></span>
          <span>الطور الأصفر (اللوتيني)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>أعراض مسجلة</span>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-slate-500 pb-1">
        {weekDays.map((d, idx) => (
          <div key={idx} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarCells.map((dateStr, idx) => {
          if (!dateStr) {
            return (
              <div
                key={`empty-${idx}`}
                className="h-16 sm:h-20 rounded-xl bg-slate-50/40 border border-transparent"
              />
            );
          }

          const dayInfo = getDayCycleInfo(dateStr, settings);
          const log = dailyLogs[dateStr];
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const dayNumber = parseDate(dateStr).getDate();

          let bgBadge = 'hover:bg-slate-50 border-slate-100 text-slate-700';

          if (dayInfo.isPeriod) {
            bgBadge = 'bg-rose-50/90 border-rose-200 text-rose-900 font-semibold';
          } else if (dayInfo.isOvulationDay) {
            bgBadge = 'bg-emerald-50/90 border-emerald-300 text-emerald-900 font-bold';
          } else if (dayInfo.isFertileWindow) {
            bgBadge = 'bg-indigo-50/80 border-indigo-200 text-indigo-900 font-semibold';
          }

          if (isSelected) {
            bgBadge += ' ring-2 ring-rose-500 ring-offset-2';
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`h-16 sm:h-20 rounded-xl p-1.5 sm:p-2 border flex flex-col justify-between transition-all cursor-pointer text-right relative overflow-hidden ${bgBadge}`}
            >
              {/* Day header: Number and Today tag */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs sm:text-sm font-semibold tabular-nums ${isToday ? 'bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold' : ''}`}>
                  {dayNumber}
                </span>

                {dayInfo.isOvulationDay && (
                  <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                )}
                {dayInfo.isPeriod && !dayInfo.isOvulationDay && (
                  <Droplets className="w-3 h-3 text-rose-500 fill-rose-400" />
                )}
                {dayInfo.isFertileWindow && !dayInfo.isOvulationDay && !dayInfo.isPeriod && (
                  <Heart className="w-3 h-3 text-indigo-500 fill-indigo-400" />
                )}
              </div>

              {/* Biomarkers / logged badges indicators */}
              <div className="flex items-center gap-1 justify-end flex-wrap mt-auto">
                {log?.bbt && (
                  <span className="text-[10px] font-mono text-slate-600 bg-white/80 px-1 rounded">
                    {log.bbt.toFixed(1)}°
                  </span>
                )}
                {log?.intimacy && log.intimacy !== 'none' && (
                  <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                )}
                {log?.symptoms && log.symptoms.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspector Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              تفاصيل تاريخ {selectedDate}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-rose-200 text-rose-700 font-semibold">
              اليوم {selectedDayInfo.cycleDay} من الدورة
            </span>
            <span className="text-xs text-slate-500">
              · {selectedDayInfo.phaseNameAr}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {selectedDayInfo.chanceLabelAr} · {selectedDayInfo.phaseDescriptionAr}
          </p>

          {selectedLog && (
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-700 flex-wrap">
              {selectedLog.bbt && <span>حرارة: {selectedLog.bbt}°C</span>}
              {selectedLog.flow && selectedLog.flow !== 'none' && <span>تدفق: {selectedLog.flow}</span>}
              {selectedLog.cervicalMucus && <span>إفرازات: {selectedLog.cervicalMucus}</span>}
              {selectedLog.symptoms.length > 0 && <span>أعراض: {selectedLog.symptoms.length} مسجلة</span>}
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenLogModal(selectedDate)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{selectedLog ? 'تعديل سجل هذا اليوم' : 'تسجيل أعراض هذا اليوم'}</span>
        </button>
      </div>

    </div>
  );
};
