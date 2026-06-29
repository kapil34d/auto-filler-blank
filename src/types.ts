export type PlaceholderFormat = 'square' | 'round' | 'angle' | 'curly' | 'underscore' | 'dot';
export type HighlightColor = 'emerald' | 'amber' | 'indigo' | 'rose' | 'none';
export type DocumentFont = 'sans' | 'serif' | 'mono';

export interface Token {
  id: string;
  type: 'text' | 'placeholder';
  rawText: string;
  label?: string;
  fieldKey?: string;
  format?: PlaceholderFormat;
  ignored?: boolean;
}

export interface FormField {
  fieldKey: string;
  label: string;
  format: PlaceholderFormat;
  occurrencesCount: number;
  tokenIds: string[];
  contextSnippet?: string;
}

export interface TemplateSample {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  content: string;
}

export interface ParserSettings {
  detectSquare: boolean;
  detectRound: boolean;
  detectAngle: boolean;
  detectCurly: boolean;
  detectUnderscores: boolean;
  detectDots: boolean;
  roundBracketSmartFilter: boolean;
}
