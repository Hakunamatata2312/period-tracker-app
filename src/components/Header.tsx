import React from 'react';
import { Sparkles, Calendar, BarChart3, BookOpen, Bell, Heart, FileText, Settings, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSymptomLogger: () => void;
  onOpenDoctorReport: () => void;
  onOpenSettings: () => void;
  onOpenAiChat: () => void;
  unreadRemindersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSymptomLogger,
  onOpenDoctorReport,
  onOpenSettings,
  onOpenAiChat,
}) => {
  const navItems = [
    { id: 'cycle', label: 'التقويم والدورة', icon: Calendar },
    { id: 'analytics', label: 'التحليلات الشهرية', icon: BarChart3 },
    { id: 'fertility', label: 'الخصوبة والحمل', icon: Heart },
    { id: 'medical', label: 'المكتبة الطبية الموثقة', icon: BookOpen },
    { id: 'reminders', label: 'التذكيرات اليومية', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Wordmark Brand Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-rose-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-['Cairo']">
                نقاء
              </span>
              <span className="text-xs text-rose-500 font-semibold block -mt-1 tracking-wider">
                الدليل والتحليل السريري
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-rose-600 bg-rose-50 font-semibold'
                      : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAiChat}
              title="مستشارة نقاء الطبية الذكية"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 cursor-pointer whitespace-nowrap"
            >
              <Bot className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>مستشارة AI</span>
            </button>

            <button
              onClick={onOpenDoctorReport}
              title="تقرير الاستشارة الطبية"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>تقرير الطبيب</span>
            </button>

            <button
              onClick={onOpenSymptomLogger}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg transition-all shadow-xs shadow-rose-300 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>تسجيل أعراض اليوم</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="إعدادات الدورة"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-between border-t border-rose-50 py-2 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? 'text-rose-600 font-bold bg-rose-50/70' : 'text-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
