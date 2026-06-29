import { useState, useMemo, useCallback, useEffect } from 'react';
import { parseTemplate, DEFAULT_SETTINGS } from '../utils/parser';
import { extractTextFromFile } from '../utils/fileExtractor';
import { SAMPLE_TEMPLATES } from '../data/sampleTemplates';
import { TemplateSample, ParserSettings } from '../types';

export function useAutoFiller() {
  const [templateText, setTemplateText] = useState<string>(() => {
    const saved = localStorage.getItem('afb_template');
    return saved !== null ? saved : SAMPLE_TEMPLATES[0].content;
  });

  const [activeSampleId, setActiveSampleId] = useState<string | undefined>(() => {
    return localStorage.getItem('afb_sample_id') || SAMPLE_TEMPLATES[0].id;
  });

  const [uploadedFilename, setUploadedFilename] = useState<string | undefined>(() => {
    return localStorage.getItem('afb_filename') || undefined;
  });

  const [values, setValues] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('afb_values');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [ignoredKeys, setIgnoredKeys] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('afb_ignored');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [settings, setSettings] = useState<ParserSettings>(() => {
    try {
      const saved = localStorage.getItem('afb_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('afb_template', templateText); }, [templateText]);
  useEffect(() => {
    if (uploadedFilename) localStorage.setItem('afb_filename', uploadedFilename);
    else localStorage.removeItem('afb_filename');
  }, [uploadedFilename]);
  useEffect(() => { localStorage.setItem('afb_values', JSON.stringify(values)); }, [values]);
  useEffect(() => { localStorage.setItem('afb_ignored', JSON.stringify(Array.from(ignoredKeys))); }, [ignoredKeys]);
  useEffect(() => { localStorage.setItem('afb_settings', JSON.stringify(settings)); }, [settings]);

  const { tokens, formFields } = useMemo(() => {
    return parseTemplate(templateText, settings, ignoredKeys);
  }, [templateText, settings, ignoredKeys]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsExtracting(true);
    setExtractionError(null);
    try {
      const result = await extractTextFromFile(file);
      setTemplateText(result.text);
      setUploadedFilename(result.filename);
      setActiveSampleId(undefined);
      setValues({});
      setIgnoredKeys(new Set());
    } catch (err: any) {
      setExtractionError(err.message || 'Failed to extract text from document.');
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleLoadSimulatedFile = useCallback((filename: string, content: string) => {
    setTemplateText(content);
    setUploadedFilename(filename);
    setActiveSampleId(undefined);
    setValues({});
    setIgnoredKeys(new Set());
    setExtractionError(null);
  }, []);

  const handleTemplateChange = useCallback((newText: string) => {
    setTemplateText(newText);
    setExtractionError(null);
    if (uploadedFilename && newText === '') setUploadedFilename(undefined);
  }, [uploadedFilename]);

  const handleSelectSample = useCallback((sample: TemplateSample) => {
    setTemplateText(sample.content);
    setActiveSampleId(sample.id);
    setUploadedFilename(undefined);
    setValues({});
    setIgnoredKeys(new Set());
    setExtractionError(null);
  }, []);

  const handleResetSample = useCallback(() => {
    const sample = SAMPLE_TEMPLATES.find((s) => s.id === activeSampleId) || SAMPLE_TEMPLATES[0];
    setTemplateText(sample.content);
    setValues({});
    setIgnoredKeys(new Set());
    setExtractionError(null);
  }, [activeSampleId]);

  const handleClearAll = useCallback(() => {
    setTemplateText('');
    setValues({});
    setIgnoredKeys(new Set());
    setActiveSampleId(undefined);
    setUploadedFilename(undefined);
    setExtractionError(null);
  }, []);

  const handleChangeValue = useCallback((key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleIgnoreField = useCallback((key: string) => {
    setIgnoredKeys((prev) => new Set(prev).add(key));
  }, []);

  const handleRestoreField = useCallback((key: string) => {
    setIgnoredKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  return {
    templateText, uploadedFilename, activeSampleId, values, ignoredKeys, settings,
    isExtracting, extractionError, activeFieldKey, setActiveFieldKey,
    tokens, formFields, setSettings,
    handleFileUpload, handleLoadSimulatedFile, handleTemplateChange, handleSelectSample, handleResetSample, handleClearAll,
    handleChangeValue, handleIgnoreField, handleRestoreField, handleClearValues: () => setValues({}),
  };
}
