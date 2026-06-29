import React, { useState } from 'react';
import { Token, HighlightColor, DocumentFont } from '../types';
import { Check, Copy, Download, FileText, Printer, FileOutput, Sparkles, Zap } from 'lucide-react';

interface DocumentPreviewProps {
  tokens: Token[];
  values: Record<string, string>;
  activeFieldKey: string | null;
  totalFieldsCount: number;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  tokens,
  values,
  activeFieldKey,
  totalFieldsCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontStyle, setFontStyle] = useState<DocumentFont>('serif');
  const [highlightColor, setHighlightColor] = useState<HighlightColor>('amber');

  const filledCount = tokens.filter(t => t.type === 'placeholder' && t.fieldKey && !t.ignored && (values[t.fieldKey] || '').trim().length > 0).length;
  const totalPlaceholders = tokens.filter(t => t.type === 'placeholder' && t.fieldKey && !t.ignored).length;

  const getResolvedText = () => {
    return tokens
      .map((tok) => {
        if (tok.type === 'text' || tok.ignored || !tok.fieldKey) {
          return tok.rawText;
        }
        const val = values[tok.fieldKey];
        if (val !== undefined && val.trim().length > 0) {
          return val;
        }
        return tok.rawText;
      })
      .join('');
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Generate clean professional HTML string for Word (.doc) export preserving all paragraph formats
  const generateDocumentHtml = () => {
    let htmlContent = '';
    for (const tok of tokens) {
      if (tok.type === 'text' || tok.ignored || !tok.fieldKey) {
        htmlContent += escapeHtml(tok.rawText);
      } else {
        const val = values[tok.fieldKey];
        if (val !== undefined && val.trim().length > 0) {
          htmlContent += `<strong style="background-color: #ffea00; color: #000000; padding: 2px 6px; font-weight: bold;">${escapeHtml(val)}</strong>`;
        } else {
          htmlContent += `<span style="color: #94a3b8; font-family: monospace;">${escapeHtml(tok.rawText)}</span>`;
        }
      }
    }

    // Split by double newlines into distinct Word paragraphs
    const paragraphs = htmlContent.split(/\r?\n\r?\n/);
    const formattedBody = paragraphs
      .map(p => `<p style="margin: 0 0 14pt 0; line-height: 1.65; text-align: left;">${p.replace(/\r?\n/g, '<br/>')}</p>`)
      .join('\n');

    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Completed Document</title>
        <style>
          body { font-family: ${fontStyle === 'serif' ? '"Times New Roman", Times, Georgia, serif' : 'Arial, Helvetica, sans-serif'}; font-size: 12pt; line-height: 1.65; color: #111827; padding: 0.8in; }
          p { margin: 0 0 14pt 0; }
        </style>
      </head>
      <body>
        <div class="document-container">
          ${formattedBody}
        </div>
      </body>
      </html>
    `;
  };

  const handleExportWord = () => {
    const html = generateDocumentHtml();
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Completed_Document_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPrintOrPdf = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const text = getResolvedText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Completed_Document_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const textToCopy = getResolvedText();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        alert('Copy failed. Please manually select and copy.');
      }
      document.body.removeChild(textArea);
    }
  };

  const getFilledHighlightClass = (isActive: boolean) => {
    if (isActive) {
      return 'ring-4 ring-indigo-600 ring-offset-2 bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md shadow-lg scale-110 z-30 inline-block transition-all animate-bounce';
    }
    switch (highlightColor) {
      case 'amber':
        return 'bg-[#FFEA00] text-black font-extrabold px-2 py-0.5 rounded-md border border-amber-400 inline-block transition-all shadow-xs';
      case 'emerald':
        return 'bg-emerald-200 text-emerald-950 font-extrabold px-2 py-0.5 rounded-md border border-emerald-400 inline-block transition-all shadow-xs';
      case 'indigo':
        return 'bg-indigo-200 text-indigo-950 font-extrabold px-2 py-0.5 rounded-md border border-indigo-400 inline-block transition-all shadow-xs';
      case 'rose':
        return 'bg-rose-200 text-rose-950 font-extrabold px-2 py-0.5 rounded-md border border-rose-400 inline-block transition-all shadow-xs';
      default:
        return 'font-extrabold text-slate-950 underline decoration-indigo-600 decoration-2 underline-offset-4';
    }
  };

  const getUnfilledHighlightClass = (isActive: boolean) => {
    if (isActive) {
      return 'ring-4 ring-indigo-600 ring-offset-2 bg-indigo-100 text-indigo-950 font-mono font-bold px-2 py-0.5 rounded-md shadow-lg scale-110 z-30 inline-block transition-all';
    }
    return 'bg-amber-100 text-amber-900 border border-amber-300 rounded-md px-2 py-0.5 text-xs font-mono font-bold inline-block mx-0.5 transition-all select-all hover:border-amber-500 shadow-2xs';
  };

  const fontClass = fontStyle === 'serif' ? 'font-serif sm:text-[16px] leading-[1.85]' : fontStyle === 'mono' ? 'font-mono text-sm leading-relaxed' : 'font-sans sm:text-[15px] leading-8';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Main Toolbar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <FileOutput className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                3. Real-Time Completed Document
              </h2>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping mr-1" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Preserves original document paragraphs & formatting</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 ml-auto">
          <button
            onClick={handleExportWord}
            title="Download formatted Microsoft Word document preserving paragraphs"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-2xs flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Word (.doc)</span>
          </button>

          <button
            onClick={handleExportPrintOrPdf}
            title="Export as PDF or print preserving layout"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF (.pdf)</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            title="Download plain text file"
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-2xs flex items-center space-x-1 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>TXT</span>
          </button>

          <button
            onClick={handleCopy}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 shadow-md ${
              copied
                ? 'bg-emerald-600 text-white scale-105 shadow-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Styling Bar */}
      <div className="px-5 py-2 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold text-[11px]">Paper Style:</span>
          <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 border border-slate-200">
            <button
              onClick={() => setFontStyle('serif')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${fontStyle === 'serif' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}`}
            >
              Contract (Serif)
            </button>
            <button
              onClick={() => setFontStyle('sans')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${fontStyle === 'sans' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}`}
            >
              Modern (Sans)
            </button>
            <button
              onClick={() => setFontStyle('mono')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${fontStyle === 'mono' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}`}
            >
              Mono
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 font-semibold text-[11px] flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
            <span>Highlight Color:</span>
          </span>
          <button
            onClick={() => setHighlightColor('amber')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${highlightColor === 'amber' ? 'bg-[#FFEA00] text-black border-amber-500 ring-2 ring-slate-900' : 'bg-[#FFEA00]/40 text-slate-700 border-amber-200 hover:bg-[#FFEA00]/80'}`}
          >
            🟡 Yellow Pen
          </button>
          <button
            onClick={() => setHighlightColor('emerald')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${highlightColor === 'emerald' ? 'bg-emerald-200 text-emerald-950 border-emerald-500 ring-2 ring-slate-900' : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'}`}
          >
            🟢 Green
          </button>
          <button
            onClick={() => setHighlightColor('indigo')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${highlightColor === 'indigo' ? 'bg-indigo-200 text-indigo-950 border-indigo-500 ring-2 ring-slate-900' : 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200'}`}
          >
            🔵 Blue
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-500 hidden md:block">
          Blanks: <span className="text-indigo-600 font-extrabold">{filledCount}</span>/{totalPlaceholders} filled
        </div>
      </div>

      {/* Realistic A4 Paper Canvas Preserving Layout */}
      <div id="print-area" className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 bg-[#F1F3F5] min-h-[450px] lg:max-h-[calc(100vh-250px)] select-text">
        <div className={`max-w-[800px] mx-auto bg-white p-8 sm:p-14 md:p-16 rounded-xl border border-slate-300 shadow-[0_12px_45px_-10px_rgba(0,0,0,0.08)] min-h-[700px] whitespace-pre-wrap ${fontClass} text-slate-900 transition-all`}>
          {tokens.length === 0 ? (
            <div className="text-center py-24 text-slate-300 font-sans text-sm select-none">
              <FileText className="w-14 h-14 mx-auto mb-3 text-slate-200" />
              <p className="font-semibold text-slate-400">Master Template is empty</p>
              <p className="text-xs text-slate-400 mt-1">Upload a document or paste template text on the left.</p>
            </div>
          ) : (
            tokens.map((tok) => {
              if (tok.type === 'text' || tok.ignored || !tok.fieldKey) {
                return <span key={tok.id}>{tok.rawText}</span>;
              }

              const currentVal = values[tok.fieldKey] || '';
              const isFilled = currentVal.trim().length > 0;
              const isActive = activeFieldKey === tok.fieldKey;

              if (isFilled) {
                return (
                  <span
                    key={tok.id}
                    className={getFilledHighlightClass(isActive)}
                    title={`Filled variable: ${tok.label}`}
                  >
                    {currentVal}
                  </span>
                );
              }

              return (
                <span
                  key={tok.id}
                  className={getUnfilledHighlightClass(isActive)}
                  title={`Unfilled variable: ${tok.label}`}
                >
                  {tok.rawText}
                </span>
              );
            })
          )}
        </div>
      </div>

      <div className="px-5 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Total Characters: <strong className="text-slate-800">{getResolvedText().length}</strong>
        </span>
        <span className="text-[11px]">
          {activeFieldKey ? (
            <span className="inline-flex items-center text-indigo-600 font-bold animate-pulse">
              <Zap className="w-3 h-3 mr-1 fill-indigo-600" />
              <span>Spotlighting "{tokens.find(t => t.fieldKey === activeFieldKey)?.label}" across document</span>
            </span>
          ) : (
            'Click any field on the left to spotlight spots'
          )}
        </span>
      </div>

    </div>
  );
};
