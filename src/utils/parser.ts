import { Token, FormField, ParserSettings, PlaceholderFormat } from '../types';

export const DEFAULT_SETTINGS: ParserSettings = {
  detectSquare: true,
  detectRound: true,
  detectAngle: true,
  detectCurly: true,
  detectUnderscores: true,
  detectDots: true,
  roundBracketSmartFilter: true,
};

const COMMON_HTML_TAGS = new Set([
  'br', 'p', '/p', 'div', '/div', 'span', '/span', 'a', '/a', 'b', '/b',
  'i', '/i', 'strong', '/strong', 'em', '/em', 'ul', '/ul', 'ol', '/ol',
  'li', '/li', 'h1', '/h1', 'h2', '/h2', 'h3', '/h3', 'h4', '/h4',
  'table', '/table', 'tr', '/tr', 'td', '/td', 'th', '/th', 'hr'
]);

function isLikelyRoundBracketPlaceholder(inner: string, smartFilter: boolean): boolean {
  if (!smartFilter) return true;
  const clean = inner.trim();
  if (!clean) return false;

  // Ignore purely numbers like (1), (2024)
  if (/^\d+$/.test(clean)) return false;

  // Ignore single letters or common plural/verb suffixes like (s), (es), (ed)
  if (/^[a-z]{1,2}$/.test(clean)) return false;

  // Ignore common Latin/editorial abbreviations
  if (/^(e\.g\.|i\.e\.|etc\.|sic|ref|c|tm|r|v|vs)$/i.test(clean)) return false;

  // Ignore legal terminology citations or quoted definitions like (the "Agreement")
  if (clean.includes('"') || clean.includes("'") || /^the\s+/i.test(clean) || /^hereinafter/i.test(clean)) {
    return false;
  }

  return true;
}

export function parseTemplate(
  text: string,
  settings: ParserSettings = DEFAULT_SETTINGS,
  ignoredFieldKeys: Set<string> = new Set()
): { tokens: Token[]; formFields: FormField[] } {
  if (!text) {
    return { tokens: [], formFields: [] };
  }

  // Construct dynamic regex based on settings
  const patterns: string[] = [];
  if (settings.detectSquare) patterns.push('\\[[^\\[\\]\\r\\n]+?\\]');
  if (settings.detectRound) patterns.push('\\([^()\\r\\n]+?\\)');
  if (settings.detectAngle) patterns.push('<[^<>\\r\\n]+?>');
  if (settings.detectCurly) patterns.push('\\{[^{}\\r\\n]+?\\}');
  if (settings.detectUnderscores) patterns.push('_{3,}');
  if (settings.detectDots) patterns.push('\\.{3,}');

  if (patterns.length === 0) {
    return {
      tokens: [{ id: 'tok_0', type: 'text', rawText: text }],
      formFields: [],
    };
  }

  const combinedRegex = new RegExp(`(${patterns.join('|')})`, 'g');
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIdCounter = 0;
  let lineBlankCounter = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const rawText = match[0];

    // Push preceding static text
    if (matchIndex > lastIndex) {
      tokens.push({
        id: `tok_${tokenIdCounter++}`,
        type: 'text',
        rawText: text.slice(lastIndex, matchIndex),
      });
    }
    lastIndex = matchIndex + rawText.length;

    // Determine format and inner content
    let format: PlaceholderFormat = 'square';
    let isLine = false;
    let innerContent = '';

    if (rawText.startsWith('[') && rawText.endsWith(']')) {
      format = 'square';
      innerContent = rawText.slice(1, -1).trim();
    } else if (rawText.startsWith('(') && rawText.endsWith(')')) {
      format = 'round';
      innerContent = rawText.slice(1, -1).trim();
      if (!isLikelyRoundBracketPlaceholder(innerContent, settings.roundBracketSmartFilter)) {
        // Treat as normal text
        tokens.push({
          id: `tok_${tokenIdCounter++}`,
          type: 'text',
          rawText,
        });
        continue;
      }
    } else if (rawText.startsWith('<') && rawText.endsWith('>')) {
      format = 'angle';
      innerContent = rawText.slice(1, -1).trim();
      // Ignore standard HTML tags
      if (COMMON_HTML_TAGS.has(innerContent.toLowerCase())) {
        tokens.push({
          id: `tok_${tokenIdCounter++}`,
          type: 'text',
          rawText,
        });
        continue;
      }
    } else if (rawText.startsWith('{') && rawText.endsWith('}')) {
      format = 'curly';
      innerContent = rawText.slice(1, -1).trim();
    } else if (rawText.startsWith('_')) {
      format = 'underscore';
      isLine = true;
    } else if (rawText.startsWith('.')) {
      format = 'dot';
      isLine = true;
    }

    if (!innerContent && !isLine) {
      // Empty brackets [] or {}
      isLine = true;
    }

    let label = '';
    let fieldKey = '';

    if (isLine) {
      lineBlankCounter++;
      label = `Blank ${lineBlankCounter}`;
      fieldKey = `line_blank_${lineBlankCounter}`;
    } else {
      label = innerContent;
      // Deduplication key normalized
      fieldKey = `named_${innerContent.toLowerCase().replace(/\s+/g, ' ').trim()}`;
    }

    const isIgnored = ignoredFieldKeys.has(fieldKey);

    tokens.push({
      id: `tok_${tokenIdCounter++}`,
      type: 'placeholder',
      rawText,
      label,
      fieldKey,
      format,
      ignored: isIgnored,
    });
  }

  // Push remaining static text
  if (lastIndex < text.length) {
    tokens.push({
      id: `tok_${tokenIdCounter++}`,
      type: 'text',
      rawText: text.slice(lastIndex),
    });
  }

  // Build FormFields list
  const fieldMap = new Map<string, FormField>();

  tokens.forEach((tok, index) => {
    if (tok.type === 'placeholder' && tok.fieldKey && !tok.ignored) {
      const key = tok.fieldKey;
      if (!fieldMap.has(key)) {
        // Find brief context snippet around this token
        const prevText = index > 0 ? tokens[index - 1].rawText : '';
        const nextText = index < tokens.length - 1 ? tokens[index + 1].rawText : '';
        const cleanPrev = prevText.replace(/\r?\n/g, ' ').slice(-25).trimStart();
        const cleanNext = nextText.replace(/\r?\n/g, ' ').slice(0, 25).trimEnd();
        const snippet = `${cleanPrev} [${tok.label}] ${cleanNext}`.trim();

        fieldMap.set(key, {
          fieldKey: key,
          label: tok.label || 'Blank',
          format: tok.format || 'square',
          occurrencesCount: 1,
          tokenIds: [tok.id],
          contextSnippet: snippet !== `[${tok.label}]` ? snippet : undefined,
        });
      } else {
        const existing = fieldMap.get(key)!;
        existing.occurrencesCount++;
        existing.tokenIds.push(tok.id);
      }
    }
  });

  return {
    tokens,
    formFields: Array.from(fieldMap.values()),
  };
}
