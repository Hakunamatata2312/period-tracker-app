import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BarChart3,
  Heart,
  BookOpen,
  Bell,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  ChevronLeft,
  Flame,
  Info
} from 'lucide-react';
import { UserCycleSettings, DailyLog, PastCycle, ReminderConfig } from './types';
import {
  loadSettings,
  saveSettings,
  loadDailyLogs,
  saveDailyLogs,
  loadPastCycles,
  savePastCycles,
  loadReminders,
  saveReminders,
  DEFAULT_SETTINGS,
  DEFAULT_REMINDERS,
  SEED_PAST_CYCLES,
  generateSeedDailyLogs
} from './utils/storage';
import { formatDate, getDayCycleInfo } from './utils/cycleCalculator';

// Components
import { Header } from './components/Header';
import { CycleWheel } from './components/CycleWheel';
import { CycleCalendar } from './components/CycleCalendar';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { FertilityGuide } from './components/FertilityGuide';
import { MedicalLibrary } from './components/MedicalLibrary';
import { RemindersManager } from './components/RemindersManager';
import { SymptomLoggerModal } from './components/SymptomLoggerModal';
import { DoctorReportModal } from './components/DoctorReportModal';
import { SettingsModal } from './components/SettingsModal';
import { AiChatAssistant } from './components/AiChatAssistant';
import { Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('cycle');
  const [settings, setSettings] = useState<UserCycleSettings>(() => loadSettings());
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() =>
    loadDailyLogs(settings.lastPeriodDate)
  );
  const [pastCycles, setPastCycles] = useState<PastCycle[]>(() => loadPastCycles());
  const [reminders, setReminders] = useState<ReminderConfig[]>(() => loadReminders());

  const todayStr = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Modals state
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [loggerTargetDate, setLoggerTargetDate] = useState<string>(todayStr);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  // Persist settings changes
  const handleSaveSettings = (newSettings: UserCycleSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Persist daily logs changes
  const handleSaveDailyLog = (log: DailyLog) => {
    const updated = {
      ...dailyLogs,
      [log.date]: log
    };
    setDailyLogs(updated);
    saveDailyLogs(updated);
  };

  // Persist reminders changes
  const handleSaveReminders = (newReminders: ReminderConfig[]) => {
    setReminders(newReminders);
    saveReminders(newReminders);
  };

  // Reset demo data
  const handleResetDemoData = () => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);

    const freshLogs = generateSeedDailyLogs(DEFAULT_SETTINGS.lastPeriodDate);
    saveDailyLogs(freshLogs);
    setDailyLogs(freshLogs);

    savePastCycles(SEED_PAST_CYCLES);
    setPastCycles(SEED_PAST_CYCLES);

    saveReminders(DEFAULT_REMINDERS);
    setReminders(DEFAULT_REMINDERS);
  };

  // Open logger for specific date
  const handleOpenLoggerForDate = (date: string) => {
    setLoggerTargetDate(date);
    setIsLoggerOpen(true);
  };

  // Handle applying smart prediction result to settings
  const handleApplyPrediction = (newCycleLength: number, newPeriodDuration: number) => {
    const updated: UserCycleSettings = {
      ...settings,
      cycleLength: newCycleLength,
      periodDuration: newPeriodDuration
    };
    handleSaveSettings(updated);
  };

  const todayInfo = getDayCycleInfo(todayStr, settings);
  const todayLog = dailyLogs[todayStr];

  return (
    <div className="min-h-screen bg-rose-50/20 text-slate-800 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSymptomLogger={() => handleOpenLoggerForDate(todayStr)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* TAB 1: Cycle & Calendar Overview */}
        {activeTab === 'cycle' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Cycle Wheel Hero */}
            <CycleWheel
              dayInfo={todayInfo}
              settings={settings}
              todayLog={todayLog}
              onOpenSymptomLogger={() => handleOpenLoggerForDate(todayStr)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onGoToFertility={() => setActiveTab('fertility')}
            />

            {/* Interactive Month Calendar */}
            <CycleCalendar
              settings={settings}
              dailyLogs={dailyLogs}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenLogModal={handleOpenLoggerForDate}
            />

            {/* Quick Scientific Education Callout */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    هل تبحثين عن تعزيز فرص الإنجاب لهذا الشهر؟
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    اطلعي على جدول نوافذ الخصوبة وحاسبة موعد الولادة المتوقع وبروتوكول الـ 90 يوماً الذهبية.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('fertility')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                <span>دليل الخصوبة والإنجاب</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Biometric Analytics & Charts */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in duration-200">
            <AnalyticsCharts
              settings={settings}
              dailyLogs={dailyLogs}
              pastCycles={pastCycles}
              onOpenLogger={() => handleOpenLoggerForDate(todayStr)}
              onApplyPrediction={handleApplyPrediction}
            />
          </div>
        )}

        {/* TAB 3: Fertility & Conception Guide */}
        {activeTab === 'fertility' && (
          <div className="animate-in fade-in duration-200">
            <FertilityGuide
              settings={settings}
              onOpenSymptomLogger={() => handleOpenLoggerForDate(todayStr)}
            />
          </div>
        )}

        {/* TAB 4: Verified Medical Library */}
        {activeTab === 'medical' && (
          <div className="animate-in fade-in duration-200">
            <MedicalLibrary />
          </div>
        )}

        {/* TAB 5: Daily Reminders */}
        {activeTab === 'reminders' && (
          <div className="animate-in fade-in duration-200">
            <RemindersManager
              reminders={reminders}
              onSaveReminders={handleSaveReminders}
              onOpenSymptomLogger={() => handleOpenLoggerForDate(todayStr)}
            />
          </div>
        )}

      </main>

      {/* Clinical Disclaimer & Footer */}
      <footer className="border-t border-rose-100 bg-white/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3 text-xs text-rose-950">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>تنويه طبي سريري وإخلاء مسؤولية:</strong> تطبيق «نقاء» صُمم كأداة إرشادية وتحليلية مساعدة لتتبع المؤشرات الحيوية للدورة الشهرية والخصوبة استناداً لأحدث المراجع العلمية (ACOG, WHO, RCOG). المعلومات والتحليلات الواردة لا تشكل تشخيصاً طبياً مستقلاً ولا تغني بأي حال عن الفحص السريري المباشر واستشارة الطبيب المختص عند الشكوى من آلام حادة أو نزيف غير معتاد.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-2">
            <span>© 2026 تطبيق نقاء للصحة الإنجابية والخصوبة السريرية. جميع الحقوق محفوظة.</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDoctorReportOpen(true)}
                className="hover:text-rose-600 cursor-pointer"
              >
                تقرير الطبيب
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-rose-600 cursor-pointer"
              >
                إعدادات الدورة
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className="hover:text-rose-600 cursor-pointer"
              >
                المكتبة الطبية
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SymptomLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        date={loggerTargetDate}
        initialLog={dailyLogs[loggerTargetDate]}
        onSave={handleSaveDailyLog}
      />

      <DoctorReportModal
        isOpen={isDoctorReportOpen}
        onClose={() => setIsDoctorReportOpen(false)}
        settings={settings}
        dailyLogs={dailyLogs}
        pastCycles={pastCycles}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onResetDemoData={handleResetDemoData}
      />

      {/* Floating AI Chat Assistant Trigger Button */}
      <button
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white animate-pulse" />
        </div>
        <span className="text-xs sm:text-sm font-bold">اسألي مستشارة نقاء AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>

      {/* AI Chat Assistant Modal */}
      <AiChatAssistant
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        settings={settings}
        currentCycleDay={todayInfo.cycleDay}
        currentPhaseName={todayInfo.phaseNameAr}
      />

    </div>
  );
}
