import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker&inline';
// @ts-ignore
import { WorkerMessageHandler } from 'pdfjs-dist/build/pdf.worker.mjs';

// Double-barrel execution architecture for PDF parsing
(globalThis as any).pdfjsWorker = { WorkerMessageHandler };

if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();
  } catch (e) {
    console.warn('Inline worker restricted by sandbox, falling back to main thread OCR');
  }
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'data:application/javascript;base64,';

export interface ExtractionResult {
  text: string;
  filename: string;
}

export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  const filename = file.name;
  const extension = filename.split('.').pop()?.toLowerCase();

  try {
    if (extension === 'txt' || extension === 'md' || extension === 'csv') {
      const text = await readTextFile(file);
      return { text, filename };
    }

    if (extension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return { text: result.value.trim(), filename };
    }

    if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        isEvalSupported: false,
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        let pageText = '';
        let lastY: number | null = null;

        for (const item of content.items as any[]) {
          if (!('str' in item) || !item.str) continue;
          const currentY = item.transform ? Math.round(item.transform[5]) : null;

          if (lastY !== null && currentY !== null) {
            const yDiff = lastY - currentY;
            if (yDiff > 12) {
              // Paragraph or section break (significant vertical drop)
              pageText += '\n\n';
            } else if (yDiff > 3 || item.hasEOL) {
              // Normal line break
              pageText += '\n';
            } else if (!pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              pageText += ' ';
            }
          } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }

          pageText += item.str;
          if (currentY !== null) lastY = currentY;
        }

        fullText += pageText.trim() + (i < pdf.numPages ? '\n\n' : '');
      }
      return { text: fullText.trim(), filename };
    }

    throw new Error(`Unsupported file type: .${extension}. Please upload .txt, .docx, or .pdf files.`);
  } catch (error: any) {
    console.error('File extraction error:', error);
    throw new Error(error.message || 'Failed to parse document content.');
  }
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}
