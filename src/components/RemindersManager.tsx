import React, { useState } from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle, Plus, Trash2, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { ReminderConfig } from '../types';

interface RemindersManagerProps {
  reminders: ReminderConfig[];
  onSaveReminders: (reminders: ReminderConfig[]) => void;
  onOpenSymptomLogger: () => void;
}

export const RemindersManager: React.FC<RemindersManagerProps> = ({
  reminders,
  onSaveReminders,
  onOpenSymptomLogger,
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newCategory, setNewCategory] = useState<ReminderConfig['category']>('lifestyle');

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm === 'granted') {
          new Notification('نقاء | تم تفعيل التذكيرات بنجاح', {
            body: 'ستصلك التذكيرات اليومية في مواعيدها المحددة لدعم صحتك الإنجابية.',
            icon: '/favicon.ico'
          });
        }
      } catch (e) {
        console.error('Notification permission error', e);
      }
    }
  };

  const handleToggle = (id: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onSaveReminders(updated);
  };

  const handleTimeChange = (id: string, time: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, time } : r));
    onSaveReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    onSaveReminders(updated);
  };

  const handleSimulate = (reminder: ReminderConfig) => {
    setActiveSimulation(reminder.title);

    // If browser notifications are allowed, send a native one too
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`نقاء: ${reminder.title}`, {
        body: reminder.description,
        icon: '/favicon.ico'
      });
    }

    setTimeout(() => {
      setActiveSimulation(null);
    }, 5000);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRem: ReminderConfig = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'تذكير صحي مخصص',
      time: newTime,
      enabled: true,
      category: newCategory
    };

    onSaveReminders([...reminders, newRem]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewTime('08:00');
  };

  return (
    <div className="space-y-6">
      
      {/* Active In-App Notification Toast Simulator */}
      {activeSimulation && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs text-rose-300 font-bold block">
                محاكاة التنبيه اليومي الآن 🔔
              </span>
              <p className="text-sm font-semibold">{activeSimulation}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveSimulation(null);
              onOpenSymptomLogger();
            }}
            className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 rounded-lg whitespace-nowrap cursor-pointer"
          >
            فتح التسجيل
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-50 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-500" />
              <span>نظام التذكيرات اليومية الذكية</span>
            </h2>
            <span className="text-xs text-slate-500 block mt-0.5">
              تنبيهات مخصصة لمتابعة التبويض، قياس درجة الحرارة في الصباح، وحمض الفوليك
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تذكير جديد</span>
            </button>

            {permissionState !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>تفعيل إشعارات المتصفح</span>
              </button>
            )}
          </div>
        </div>

        {/* Permission Banner if not granted */}
        {permissionState === 'granted' ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>إشعارات المتصفح مفعلة بنجاح، وستصلك التنبيهات حتى عند تصغير النافذة.</span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>إشعارات المتصفح غير مفعلة بعد. انقري على الزر بالأعلى لتلقي التنبيهات المباشرة.</span>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="text-xs font-bold text-amber-800 underline cursor-pointer shrink-0"
            >
              تفعيل الآن
            </button>
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-3">
          {reminders.map(rem => (
            <div
              key={rem.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                rem.enabled
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={rem.enabled}
                  onChange={() => handleToggle(rem.id)}
                  className="w-5 h-5 mt-1 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {rem.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                      {rem.category === 'bbt' ? 'حرارة BBT' :
                       rem.category === 'ovulation' ? 'إباضة وخصوبة' :
                       rem.category === 'period' ? 'الحيض' :
                       rem.category === 'medication' ? 'مكملات' : 'نمط حياة'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    {rem.description}
                  </p>
                </div>
              </div>

              {/* Controls: Time & Test Action */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="time"
                    value={rem.time}
                    onChange={e => handleTimeChange(rem.id, e.target.value)}
                    className="text-xs font-mono font-bold bg-transparent text-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleSimulate(rem)}
                  title="تجربة التنبيه الآن"
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">تجربة</span>
                </button>

                {rem.id.startsWith('custom-') && (
                  <button
                    onClick={() => handleDelete(rem.id)}
                    title="حذف التذكير"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleAddReminder}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl border border-rose-100 text-right"
          >
            <h3 className="text-lg font-bold text-slate-900">
              إضافة تذكير يومي مخصص
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                عنوان التذكير
              </label>
              <input
                type="text"
                required
                placeholder="مثال: شرب كوب ماء دافئ، دواء الغدة، رياضة خفيفة..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                الوصف أو الملاحظة
              </label>
              <input
                type="text"
                placeholder="شرح مختصر للتذكير..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  وقت التنبيه
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الفئة
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="lifestyle">نمط حياة</option>
                  <option value="medication">مكملات وأدوية</option>
                  <option value="bbt">حرارة BBT</option>
                  <option value="ovulation">إباضة</option>
                  <option value="period">حيض</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer shadow-xs"
              >
                حفظ التذكير
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
