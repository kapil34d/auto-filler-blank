import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, AlertCircle, Loader2, X, PlusCircle, CheckCircle2, FileUp, Sparkles } from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/sampleTemplates';

interface TemplateInputProps {
  value: string;
  onChange: (val: string) => void;
  onFileUpload: (file: File) => Promise<void>;
  onLoadSimulatedFile: (filename: string, content: string) => void;
  isExtracting: boolean;
  extractionError: string | null;
  uploadedFilename?: string;
  detectedCount: number;
}

export const TemplateInput: React.FC<TemplateInputProps> = ({
  value,
  onChange,
  onFileUpload,
  onLoadSimulatedFile,
  isExtracting,
  extractionError,
  uploadedFilename,
  detectedCount,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await onFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await onFileUpload(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + (value.endsWith('\n') || value === '' ? '' : '\n') + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextVal = value.substring(0, start) + snippet + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 10);
  };

  const simulateDemoPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLoadSimulatedFile('Enterprise_Master_Agreement_v3.pdf', SAMPLE_TEMPLATES[1].content);
  };

  const simulateDemoDocx = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLoadSimulatedFile('Freelance_Statement_of_Work.docx', SAMPLE_TEMPLATES[3].content);
  };

  const chips = [
    { label: '[Name]', hint: 'Square' },
    { label: '(Date)', hint: 'Round' },
    { label: '<Company>', hint: 'Angle' },
    { label: '{Topic}', hint: 'Curly' },
    { label: '______', hint: 'Underscore' },
    { label: '.........', hint: 'Dots' },
  ];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col h-full overflow-hidden shadow-xl relative ${
        isDragging
          ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-indigo-50/20'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Full card drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-600/10 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-indigo-600 rounded-2xl p-6 pointer-events-none animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3 animate-bounce">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-base font-bold text-indigo-950">Drop document to extract text</p>
          <p className="text-xs text-indigo-600 font-medium mt-1">Extracts OCR & variables from Word .docx, .pdf, and .txt</p>
        </div>
      )}

      {/* Card Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <FileUp className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            1. Master Template Input
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
            {detectedCount} {detectedCount === 1 ? 'blank' : 'blanks'}
          </span>
        </div>
      </div>

      {/* Prominent Drag-and-Drop Zone Banner */}
      <div className="p-4 border-b border-slate-100/80 bg-slate-50/40">
        <div
          onClick={() => !isExtracting && fileInputRef.current?.click()}
          className={`group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-5 text-center relative overflow-hidden ${
            isExtracting
              ? 'border-indigo-300 bg-indigo-50/40 cursor-wait'
              : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 bg-white shadow-2xs'
          }`}
        >
          {isExtracting ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <div className="text-xs font-bold text-indigo-950">Extracting document text...</div>
              <div className="text-[11px] text-indigo-600">Parsing PDF / DOCX binary streams synchronously</div>
            </div>
          ) : uploadedFilename ? (
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center space-x-3 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">{uploadedFilename}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">✓ Successfully extracted text & detected blanks</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear template"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drag & drop your template file here, or <span className="text-indigo-600 font-extrabold underline underline-offset-2">browse files</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports <strong className="text-slate-600">.docx</strong> (Word), <strong className="text-slate-600">.pdf</strong>, and <strong className="text-slate-600">.txt</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instant 1-Click Simulation Buttons (Bypasses sandboxed iframe file picker blocks) */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Quick Test OCR:</span>
          <button
            onClick={simulateDemoPdf}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title="Simulate dropping a real PDF document"
          >
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>⚡ Demo .PDF</span>
          </button>
          <button
            onClick={simulateDemoDocx}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title="Simulate dropping a Word document"
          >
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>⚡ Demo .DOCX</span>
          </button>
        </div>

        {extractionError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-900 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Upload Error:</span> {extractionError}
              <p className="text-[10px] text-rose-700 mt-1 font-normal">
                (Tip: If your browser iframe blocks local filesystem uploads, click "⚡ Demo .PDF" above to test the app instantly!)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fallback Textarea Editor */}
      <div className="flex-1 flex flex-col min-h-[200px] relative bg-white">
        <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex justify-between select-none">
          <span>Manual Text Editor / Fallback</span>
          <span>{value.length} chars</span>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Extracted document text will appear here...&#10;&#10;Or type / paste your master template manually."
          className="w-full flex-1 p-4 text-sm font-mono leading-relaxed text-slate-800 bg-transparent placeholder:text-slate-300 focus:outline-hidden resize-none min-h-[180px] sm:min-h-[240px] border-none"
          spellCheck="true"
        />
      </div>

      {/* Footer Variable Quick Helpers */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center gap-1.5 select-none">
        <span className="inline-flex items-center space-x-1 mr-1 text-[11px] font-semibold text-slate-400">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Insert blank:</span>
        </span>
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => insertSnippet(chip.label)}
            className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 font-mono text-[11px] font-medium text-slate-700 transition-colors shadow-2xs active:scale-95"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
