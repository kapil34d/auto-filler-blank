import React from 'react';
import { ParserSettings } from '../types';
import { X, Settings as SettingsIcon, ShieldCheck, CheckSquare, Square } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ParserSettings;
  onUpdateSettings: (newSettings: ParserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof ParserSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const options: { key: keyof ParserSettings; label: string; example: string; desc: string }[] = [
    { key: 'detectSquare', label: 'Square Brackets', example: '[Client Name]', desc: 'Standard variable placeholders' },
    { key: 'detectRound', label: 'Round Brackets', example: '(Effective Date)', desc: 'Parenthetical date or title blanks' },
    { key: 'detectAngle', label: 'Angle Brackets', example: '<Company Address>', desc: 'HTML-style placeholder tags' },
    { key: 'detectCurly', label: 'Curly Brackets', example: '{Project Topic}', desc: 'Template engine style braces' },
    { key: 'detectUnderscores', label: 'Underscore Lines', example: '_______', desc: 'Drawn lines (3+ underscores)' },
    { key: 'detectDots', label: 'Dotted Lines', example: '.........', desc: 'Drawn dots (3+ periods)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Placeholder Detection Settings</h3>
              <p className="text-xs text-slate-500">Customize which formats Auto Filler Blanks detects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Formats
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {options.map((opt) => {
                const active = settings[opt.key];
                return (
                  <button
                    key={opt.key}
                    onClick={() => toggle(opt.key)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                      active
                        ? 'bg-indigo-50/60 border-indigo-200 text-slate-800 shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200/80 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 text-indigo-600">
                      {active ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                          {opt.label}
                        </span>
                      </div>
                      <code className={`text-[11px] font-mono font-semibold px-1 py-0.5 rounded mt-1 inline-block ${active ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-400'}`}>
                        {opt.example}
                      </code>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Filter option */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => toggle('roundBracketSmartFilter')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                settings.roundBracketSmartFilter
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-3 text-left">
                <ShieldCheck className={`w-5 h-5 ${settings.roundBracketSmartFilter ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Smart Round Bracket Filtering</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ignores numbered lists <code className="bg-white/80 px-1 py-0.5 rounded">(1)</code>, plural suffixes <code className="bg-white/80 px-1 py-0.5 rounded">(s)</code>, and citations.
                  </div>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.roundBracketSmartFilter ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.roundBracketSmartFilter ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
