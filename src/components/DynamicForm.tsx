import React, { useState } from 'react';
import { FormField } from '../types';
import { CheckCircle2, Circle, EyeOff, Eye, Search, RotateCcw, Sparkles, SlidersHorizontal, Zap } from 'lucide-react';

interface DynamicFormProps {
  fields: FormField[];
  values: Record<string, string>;
  onChangeValue: (fieldKey: string, value: string) => void;
  onIgnoreField: (fieldKey: string) => void;
  onRestoreField: (fieldKey: string) => void;
  ignoredKeys: Set<string>;
  onClearValues: () => void;
  activeFieldKey: string | null;
  setActiveFieldKey: (key: string | null) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  values,
  onChangeValue,
  onIgnoreField,
  onRestoreField,
  ignoredKeys,
  onClearValues,
  activeFieldKey,
  setActiveFieldKey,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showIgnoredDrawer, setShowIgnoredDrawer] = useState(false);

  const filledCount = fields.filter((f) => (values[f.fieldKey] || '').trim().length > 0).length;
  const totalCount = fields.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((filledCount / totalCount) * 100);

  const filteredFields = fields.filter((f) =>
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.contextSnippet && f.contextSnippet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const ignoredList = Array.from(ignoredKeys);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col h-full overflow-hidden select-none">
      
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Detected Placeholders
          </h2>
          {totalCount > 0 && (
            <span className="text-xs font-semibold text-slate-400">
              {filledCount}/{totalCount}
            </span>
          )}
        </div>

        {totalCount > 0 && (
          <button
            onClick={onClearValues}
            title="Reset typed input values"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full bg-slate-100 h-1 overflow-hidden">
          <div
            className="bg-slate-900 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Filter bar */}
      {totalCount > 4 && (
        <div className="p-3 border-b border-slate-100 bg-slate-50/20">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search placeholders..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 text-slate-800 transition-all"
            />
          </div>
        </div>
      )}

      {/* Form Fields List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px] lg:max-h-[calc(100vh-280px)]">
        {totalCount === 0 ? (
          <div className="text-center py-14 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">No blanks found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Upload a document or paste text containing brackets like <code className="text-slate-700 font-semibold bg-slate-100 px-1 py-0.5 rounded">[Name]</code> or lines <code className="text-slate-700 font-semibold bg-slate-100 px-1 py-0.5 rounded">______</code>.
            </p>
          </div>
        ) : filteredFields.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 font-medium">
            No variables match "{searchQuery}".
          </div>
        ) : (
          filteredFields.map((field) => {
            const currentVal = values[field.fieldKey] || '';
            const isFilled = currentVal.trim().length > 0;
            const isActive = activeFieldKey === field.fieldKey;

            return (
              <div
                key={field.fieldKey}
                onMouseEnter={() => setActiveFieldKey(field.fieldKey)}
                className={`p-3.5 rounded-xl border transition-all duration-150 ${
                  isActive
                    ? 'border-indigo-600 ring-2 ring-indigo-600/15 bg-indigo-50/20 shadow-xs'
                    : isFilled
                    ? 'bg-slate-50/40 border-slate-200/90'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2 min-w-0">
                    {isFilled ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <label
                      htmlFor={field.fieldKey}
                      className="text-xs font-bold text-slate-800 truncate select-none cursor-pointer"
                    >
                      {field.label}
                    </label>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {field.occurrencesCount > 1 && (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100" title="Updates all spots simultaneously">
                        <Zap className="w-2.5 h-2.5 fill-indigo-600" />
                        <span>{field.occurrencesCount}x</span>
                      </span>
                    )}

                    <button
                      onClick={() => onIgnoreField(field.fieldKey)}
                      title="Dismiss false positive (render as static text)"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {field.contextSnippet && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-1 mb-2 pl-5.5 select-text">
                    "{field.contextSnippet}"
                  </p>
                )}

                <div className="pl-5.5">
                  <input
                    id={field.fieldKey}
                    type="text"
                    value={currentVal}
                    onFocus={() => setActiveFieldKey(field.fieldKey)}
                    onChange={(e) => onChangeValue(field.fieldKey, e.target.value)}
                    placeholder={`Type value for ${field.label}...`}
                    className={`w-full px-3 py-2 text-xs font-medium rounded-lg border transition-all select-text ${
                      isFilled
                        ? 'bg-white border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 text-slate-900 font-semibold'
                        : 'bg-slate-50/60 border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ignored Drawer */}
      {ignoredList.length > 0 && (
        <div className="border-t border-slate-200/80 bg-slate-50/60 text-xs">
          <button
            onClick={() => setShowIgnoredDrawer(!showIgnoredDrawer)}
            className="w-full px-5 py-2.5 flex items-center justify-between text-slate-600 hover:bg-slate-100/80 font-medium transition-colors"
          >
            <div className="flex items-center space-x-2">
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold">Ignored Variables ({ignoredList.length})</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold hover:text-slate-900 underline underline-offset-2">
              {showIgnoredDrawer ? 'Hide' : 'Manage'}
            </span>
          </button>

          {showIgnoredDrawer && (
            <div className="px-5 py-3 space-y-2 border-t border-slate-200/60 max-h-36 overflow-y-auto bg-white">
              <p className="text-[11px] text-slate-400 mb-1">
                Dismissed items currently treated as static text. Click to restore:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ignoredList.map((key) => {
                  const display = key.startsWith('named_') ? key.replace('named_', '') : key;
                  return (
                    <div key={key} className="inline-flex items-center space-x-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 text-[11px]">
                      <span className="font-semibold">{display}</span>
                      <button
                        onClick={() => onRestoreField(key)}
                        title="Restore variable"
                        className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
