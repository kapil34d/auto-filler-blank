import React, { useState } from 'react';
import { Sparkles, RefreshCw, Trash2, Settings, ChevronDown, FileText, Briefcase, Send, Receipt, ShieldAlert } from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/sampleTemplates';
import { TemplateSample } from '../types';

interface HeaderProps {
  onSelectSample: (sample: TemplateSample) => void;
  onClearAll: () => void;
  onResetSample: () => void;
  onOpenSettings: () => void;
  activeSampleId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  onClearAll,
  onResetSample,
  onOpenSettings,
  activeSampleId
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-indigo-600" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-slate-700" />;
      case 'Send': return <Send className="w-4 h-4 text-emerald-600" />;
      case 'Receipt': return <Receipt className="w-4 h-4 text-amber-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <header className="bg-white/90 border-b border-slate-200/80 sticky top-0 z-30 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Auto Filler Blanks
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Pro Engine
            </span>
          </div>
        </div>

        {/* Right: Controls & Samples */}
        <div className="flex items-center space-x-2">
          
          {/* Templates Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Templates</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Sample Documents
                </div>
                {SAMPLE_TEMPLATES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectSample(sample);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${
                      activeSampleId === sample.id ? 'bg-indigo-50/60' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      {getIcon(sample.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {sample.title}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {sample.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={onResetSample}
            title="Reload active sample template"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Parser Settings & Format Filters"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Clear button */}
          <button
            onClick={onClearAll}
            title="Clear template and inputs"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

        </div>

      </div>
    </header>
  );
};
