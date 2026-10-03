import React, { useState, useEffect } from 'react';
import { X, Check, Droplets, Thermometer, Heart, Sparkles, Smile, Shield, FileText, Pill } from 'lucide-react';
import { DailyLog, FlowIntensity, CervicalMucusType, LHTestResult, PregnancyTestResult } from '../types';
import { AVAILABLE_SYMPTOMS, AVAILABLE_MOODS, CERVICAL_MUCUS_GUIDE } from '../data/fertilityKnowledge';

interface SymptomLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  initialLog?: DailyLog;
  onSave: (log: DailyLog) => void;
}

export const SymptomLoggerModal: React.FC<SymptomLoggerModalProps> = ({
  isOpen,
  onClose,
  date,
  initialLog,
  onSave,
}) => {
  const [flow, setFlow] = useState<FlowIntensity>('none');
  const [bbt, setBbt] = useState<number | undefined>(undefined);
  const [bbtString, setBbtString] = useState<string>('');
  const [cervicalMucus, setCervicalMucus] = useState<CervicalMucusType | undefined>(undefined);
  const [lhTest, setLhTest] = useState<LHTestResult>('none');
  const [pregnancyTest, setPregnancyTest] = useState<PregnancyTestResult>('none');
  const [intimacy, setIntimacy] = useState<'none' | 'protected' | 'unprotected'>('none');
  const [moods, setMoods] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [waterGlasses, setWaterGlasses] = useState<number>(6);
  const [tookVitamins, setTookVitamins] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [symptomCategory, setSymptomCategory] = useState<string>('all');

  useEffect(() => {
    if (initialLog) {
      setFlow(initialLog.flow || 'none');
      setBbt(initialLog.bbt);
      setBbtString(initialLog.bbt ? initialLog.bbt.toString() : '');
      setCervicalMucus(initialLog.cervicalMucus);
      setLhTest(initialLog.lhTest || 'none');
      setPregnancyTest(initialLog.pregnancyTest || 'none');
      setIntimacy(initialLog.intimacy || 'none');
      setMoods(initialLog.moods || []);
      setSymptoms(initialLog.symptoms || []);
      setWaterGlasses(initialLog.waterGlasses || 6);
      setTookVitamins(initialLog.tookVitamins ?? true);
      setNotes(initialLog.notes || '');
    } else {
      setFlow('none');
      setBbt(undefined);
      setBbtString('');
      setCervicalMucus(undefined);
      setLhTest('none');
      setPregnancyTest('none');
      setIntimacy('none');
      setMoods([]);
      setSymptoms([]);
      setWaterGlasses(6);
      setTookVitamins(true);
      setNotes('');
    }
  }, [initialLog, date, isOpen]);

  if (!isOpen) return null;

  const handleBbtChange = (valStr: string) => {
    setBbtString(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed >= 35 && parsed <= 40) {
      setBbt(Math.round(parsed * 100) / 100);
    } else if (valStr === '') {
      setBbt(undefined);
    }
  };

  const handleAdjustBbt = (delta: number) => {
    const current = bbt || 36.40;
    const nextVal = Math.round((current + delta) * 100) / 100;
    if (nextVal >= 35.5 && nextVal <= 38.5) {
      setBbt(nextVal);
      setBbtString(nextVal.toFixed(2));
    }
  };

  const toggleMood = (id: string) => {
    setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleSymptom = (id: string) => {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const log: DailyLog = {
      date,
      flow,
      bbt,
      cervicalMucus,
      lhTest,
      pregnancyTest,
      intimacy,
      moods,
      symptoms,
      waterGlasses,
      tookVitamins,
      notes: notes.trim() || undefined
    };
    onSave(log);
    onClose();
  };

  const filteredSymptoms = symptomCategory === 'all'
    ? AVAILABLE_SYMPTOMS
    : AVAILABLE_SYMPTOMS.filter(s => s.category === symptomCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-rose-100 max-h-[90vh] overflow-y-auto space-y-6 my-auto text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              تسجيل المؤشرات الصحية ليوم {date}
            </h3>
            <span className="text-xs text-slate-500 block mt-0.5">
              بياناتك تحفظ محلياً على جهازك بسرية تامة دون أي مشاركة
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Menstrual Flow */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Droplets className="w-4 h-4 text-rose-500" />
            <span>تدفق دم الحيض</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[
              { id: 'none', label: 'بدون' },
              { id: 'spotting', label: 'تبقيع خفيف' },
              { id: 'light', label: 'خفيف' },
              { id: 'medium', label: 'متوسط' },
              { id: 'heavy', label: 'غزير' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFlow(item.id as FlowIntensity)}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  flow === item.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Basal Body Temperature (BBT) */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span>درجة حرارة الجسم الأساسية (BBT)</span>
            </label>
            <span className="text-[11px] text-amber-700 font-medium">
              تُقاس فور الاستيقاظ وقبل النهوض
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleAdjustBbt(-0.05)}
              className="w-10 h-10 rounded-xl bg-white border border-amber-200 text-amber-800 font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer text-base"
            >
              -
            </button>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                placeholder="36.45"
                value={bbtString}
                onChange={e => handleBbtChange(e.target.value)}
                className="w-32 py-2 px-3 text-center text-xl font-bold bg-white border border-amber-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-['Plus_Jakarta_Sans',sans-serif]"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-medium">
                °C
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleAdjustBbt(0.05)}
              className="w-10 h-10 rounded-xl bg-white border border-amber-200 text-amber-800 font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer text-base"
            >
              +
            </button>
            {bbt && (
              <button
                type="button"
                onClick={() => {
                  setBbt(undefined);
                  setBbtString('');
                }}
                className="text-xs text-slate-400 hover:text-red-500 mr-2"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* 3. Cervical Mucus */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>مخاط وإفرازات عنق الرحم</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              أدق مؤشر حيوي منزلي للتبويض
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CERVICAL_MUCUS_GUIDE.map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => setCervicalMucus(item.type as CervicalMucusType)}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  cervicalMucus === item.type
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/40 text-indigo-950'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{item.titleAr}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.fertilityBadge === 'peak' ? 'bg-emerald-100 text-emerald-800' :
                    item.fertilityBadge === 'high' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {item.fertilityScoreAr}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {item.descriptionAr}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Ovulation LH & Pregnancy Tests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              فحص التبويض المنزلي (LH Test)
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'none', label: 'لم أقم به' },
                { id: 'negative', label: 'سلبي' },
                { id: 'high', label: 'مرتفع' },
                { id: 'peak', label: 'ذروة 🌟' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLhTest(item.id as LHTestResult)}
                  className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                    lhTest === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              فحص الحمل المنزلي (hCG)
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'none', label: 'لم أقم به' },
                { id: 'negative', label: 'سلبي' },
                { id: 'faint_positive', label: 'إيجابي خافت' },
                { id: 'positive', label: 'إيجابي مؤكد' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPregnancyTest(item.id as PregnancyTestResult)}
                  className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                    pregnancyTest === item.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Intimacy */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>العلاقة الحميمية</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'none', label: 'لا يوجد لقاء' },
              { id: 'unprotected', label: 'لقاء بغرض الحمل (بدون عازل)' },
              { id: 'protected', label: 'مع وقاية' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIntimacy(item.id as any)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  intimacy === item.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Moods */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Smile className="w-4 h-4 text-amber-500" />
            <span>الحالة المزاجية</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_MOODS.map(m => {
              const active = moods.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMood(m.id)}
                  className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    active
                      ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.labelAr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Physical Symptoms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>الأعراض الجسدية</span>
            </label>
            <div className="flex items-center gap-1 text-[11px]">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'pelvic', label: 'الحوض' },
                { id: 'body', label: 'العضلات' },
                { id: 'digestive', label: 'الهضم' },
                { id: 'skin_head', label: 'الرأس' },
                { id: 'sleep_energy', label: 'الطاقة' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSymptomCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    symptomCategory === cat.id
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredSymptoms.map(sym => {
              const active = symptoms.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    active
                      ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-400 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs block">{sym.nameAr}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{sym.descriptionAr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Lifestyle: Vitamins & Water */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-rose-50/40 border border-rose-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">حمض الفوليك والمكملات</span>
                <span className="text-[10px] text-slate-500">تم تناول جرعة اليوم</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tookVitamins}
              onChange={e => setTookVitamins(e.target.checked)}
              className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">أكواب الماء</span>
                <span className="text-[10px] text-slate-500">الترطيب مهم لمرونة المخاط</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWaterGlasses(Math.max(1, waterGlasses - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-900 w-6 text-center tabular-nums">
                {waterGlasses}
              </span>
              <button
                type="button"
                onClick={() => setWaterGlasses(Math.min(14, waterGlasses + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 9. Notes */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>ملاحظات خاصة</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="أي تفاصيل أخرى ترغبين بتدوينها (تغير مواعيد النوم، ضغوطات، سفر، أدوية)..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white resize-none"
          />
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>حفظ السجل الصحي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
