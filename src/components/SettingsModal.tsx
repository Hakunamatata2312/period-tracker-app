import React, { useState } from 'react';
import { X, Check, Settings, RotateCcw, Heart, Shield } from 'lucide-react';
import { UserCycleSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserCycleSettings;
  onSave: (settings: UserCycleSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onResetDemoData,
}) => {
  const [lastPeriodDate, setLastPeriodDate] = useState(settings.lastPeriodDate);
  const [cycleLength, setCycleLength] = useState(settings.cycleLength || 28);
  const [periodDuration, setPeriodDuration] = useState(settings.periodDuration || 5);
  const [lutealPhaseDuration, setLutealPhaseDuration] = useState(settings.lutealPhaseDuration || 14);
  const [goal, setGoal] = useState<UserCycleSettings['goal']>(settings.goal || 'conceive');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      lastPeriodDate,
      cycleLength: Math.max(20, Math.min(45, Number(cycleLength))),
      periodDuration: Math.max(2, Math.min(10, Number(periodDuration))),
      lutealPhaseDuration: Math.max(10, Math.min(18, Number(lutealPhaseDuration))),
      goal
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-rose-100 text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                إعدادات الدورة والخصوبة
              </h3>
              <span className="text-[11px] text-slate-500">
                خصصي الخوارزمية لتناسب جسدكِ بدقة
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Last period start date */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              تاريخ أول يوم لآخر دورة شهرية:
            </label>
            <input
              type="date"
              required
              value={lastPeriodDate}
              onChange={e => setLastPeriodDate(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-['Plus_Jakarta_Sans',sans-serif]"
            />
          </div>

          {/* Cycle Length & Period Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                متوسط طول الدورة
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="45"
                  required
                  value={cycleLength}
                  onChange={e => setCycleLength(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
                <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-400">يوماً</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">المعدل الطبيعي 24-35</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                مدة نزول الدم
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="10"
                  required
                  value={periodDuration}
                  onChange={e => setPeriodDuration(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
                <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-400">أيام</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">المعدل الطبيعي 3-7</span>
            </div>
          </div>

          {/* Luteal Phase Duration */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              طول الطور الأصفر (بين الإباضة والحيض)
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="18"
                required
                value={lutealPhaseDuration}
                onChange={e => setLutealPhaseDuration(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-400">يوماً</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">الافتراضي السريري هو 14 يوماً</span>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              هدفكِ الصحي الحالي:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'conceive', label: 'التخطيط للحمل', icon: Heart },
                { id: 'track', label: 'تتبع العافية', icon: Settings },
                { id: 'avoid', label: 'تنظيم طبيعي', icon: Shield }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = goal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1 text-rose-500" />
                    <span className="text-[11px] block">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('هل ترغبين بإعادة تحميل السجلات والبيانات التوضيحية الغنية؟')) {
                  onResetDemoData();
                  onClose();
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط البيانات التجريبية</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
