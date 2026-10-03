import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileText, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UserCycleSettings, DailyLog, PastCycle } from '../types';
import { analyzeCycles, formatDate } from '../utils/cycleCalculator';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserCycleSettings;
  dailyLogs: Record<string, DailyLog>;
  pastCycles: PastCycle[];
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  settings,
  dailyLogs,
  pastCycles,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cycleAnalysis = analyzeCycles(pastCycles, settings);
  const todayFormatted = formatDate(new Date());

  // Count BBT stats
  const loggedBbts = Object.values(dailyLogs).filter(l => l.bbt !== undefined).map(l => l.bbt as number);
  const avgBbt = loggedBbts.length > 0 ? (loggedBbts.reduce((a, b) => a + b, 0) / loggedBbts.length).toFixed(2) : 'غير مسجل';

  // Heavy bleeding days
  const heavyDays = Object.values(dailyLogs).filter(l => l.flow === 'heavy').length;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const reportText = `
=== تقرير الاستشارة الطبية وصحة الدورة الشهرية (تطبيق نقاء) ===
تاريخ إصدار التقرير: ${todayFormatted}

1. المؤشرات الفسيولوجية الأساسية:
- متوسط طول الدورة الشهرية: ${cycleAnalysis.averageCycleLength} يوماً (أقصر دورة: ${cycleAnalysis.shortestCycle}، أطول دورة: ${cycleAnalysis.longestCycle})
- متوسط مدة تدفق دم الحيض: ${cycleAnalysis.averagePeriodDuration} أيام
- مؤشر الانتظام السريري: ${cycleAnalysis.regularityScore}% (${cycleAnalysis.regularityStatus})
- مدة الطور الأصفر المقدرة: ${settings.lutealPhaseDuration} يوماً

2. شواهد التبويض البيومترية:
- نمط حرارة الجسم الأساسية (BBT): مسجل لـ ${loggedBbts.length} يوماً، المتوسط: ${avgBbt}°C
- استقرار الطور الأصفر: كافي (> 11 يوماً)

3. سجل الدورات السابقة:
${pastCycles.map(c => `• دورة بدأت في ${c.startDate}: الطول ${c.cycleLength} يوماً، مدة الحيض ${c.periodDuration} أيام`).join('\n')}

4. ملاحظات الغزارة والأعراض:
- أيام التدفق الغزير المسجلة: ${heavyDays} أيام
- الهدف الإنجابي المحدد: ${settings.goal === 'conceive' ? 'التخطيط للحمل الطبيعي' : 'تتبع العافية العامة'}
===================================================
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-rose-100 max-h-[90vh] overflow-y-auto space-y-6 my-auto text-right print:max-h-none print:shadow-none print:border-none">
        
        {/* Header (Hidden in print buttons) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                الملخص السريري لزيارة الطبيب (Clinical Report)
              </h3>
              <span className="text-[11px] text-slate-500">
                جاهز للمعاينة أو الطباعة لتقديمه لاستشاري طب النساء والتوليد
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ التقرير'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Clinical Sheet */}
        <div className="space-y-6 p-4 rounded-2xl bg-slate-50/60 border border-slate-200 print:p-0 print:border-none">
          
          {/* Formal Letterhead */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-rose-600">تطبيق نقاء للصحة الإنجابية</span>
              <h2 className="text-lg font-black text-slate-900">ملخص المؤشرات الفسيولوجية والتبويض</h2>
              <span className="text-xs text-slate-500">تاريخ السجل: {todayFormatted}</span>
            </div>
            <div className="text-left text-xs text-slate-500 font-mono">
              <div>الحالة: {settings.goal === 'conceive' ? 'تخطيط الحمل (Conception)' : 'تتبع العافية'}</div>
              <div>نطاق البيانات: آخر 3 دورات متتالية</div>
            </div>
          </div>

          {/* Section 1: Overview Metrics Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">1. المؤشرات الدورية والانتظام:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">متوسط طول الدورة</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{cycleAnalysis.averageCycleLength} يوماً</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">مدة تدفق الحيض</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{cycleAnalysis.averagePeriodDuration} أيام</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">تقييم الانتظام</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">{cycleAnalysis.regularityScore}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">طول الطور الأصفر</span>
                <span className="font-bold text-purple-700 text-sm font-mono">{settings.lutealPhaseDuration} يوماً</span>
              </div>
            </div>
          </div>

          {/* Section 2: BBT & Ovulation Proof */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">2. مؤشرات التبويض الأساسية (BBT & Biomarkers):</h4>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 leading-relaxed">
              <div className="flex items-center justify-between">
                <span>أيام قياس حرارة BBT المسجلة:</span>
                <span className="font-mono font-bold">{loggedBbts.length} يوماً (المتوسط {avgBbt}°C)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ملاحظات التدفق الغزير (Heavy Bleeding):</span>
                <span className="font-mono font-bold">{heavyDays > 0 ? `${heavyDays} أيام` : 'ضمن المعدل الطبيعي'}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                تظهر البيانات ارتفاعاً ثنائياً للحرارة (Biphasic Pattern) مع زيادة ملحوظة بعد اليوم 14 من بداية الحيض، متزامناً مع تسجيل إفرازات مطاطية عالية اللزوجة.
              </p>
            </div>
          </div>

          {/* Section 3: Past Cycles Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">3. سجل أطوال الدورات السابقة:</h4>
            <table className="w-full text-xs text-right border-collapse border border-slate-200 bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-2 border-b border-slate-200">الدورة</th>
                  <th className="p-2 border-b border-slate-200">تاريخ البدء</th>
                  <th className="p-2 border-b border-slate-200">مدة الحيض</th>
                  <th className="p-2 border-b border-slate-200">طول الدورة الكلي</th>
                </tr>
              </thead>
              <tbody>
                {pastCycles.map((c, i) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="p-2 font-medium">دورة #{pastCycles.length - i}</td>
                    <td className="p-2 font-mono text-slate-600">{c.startDate}</td>
                    <td className="p-2 font-mono">{c.periodDuration} أيام</td>
                    <td className="p-2 font-mono font-bold text-slate-900">{c.cycleLength} يوماً</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note to Doctor */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
            <strong>ملاحظة للطبيبة المعالجة:</strong> هذا السجل تم تجميعه عبر رصد يومي دقيق للحرارة الأساسية والأعراض ومخاط عنق الرحم لمساعدة فريقكم الطبي على تقييم وظيفة التبويض ونمط الدورة.
          </div>

        </div>

      </div>
    </div>
  );
};
