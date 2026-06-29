import React, { useState } from 'react';
import { Header } from './components/Header';
import { TemplateInput } from './components/TemplateInput';
import { DynamicForm } from './components/DynamicForm';
import { DocumentPreview } from './components/DocumentPreview';
import { SettingsModal } from './components/SettingsModal';
import { useAutoFiller } from './hooks/useAutoFiller';
import { FileText, Layers, Columns, LayoutGrid } from 'lucide-react';

export const App: React.FC = () => {
  const {
    templateText,
    uploadedFilename,
    activeSampleId,
    values,
    ignoredKeys,
    settings,
    isExtracting,
    extractionError,
    activeFieldKey,
    setActiveFieldKey,
    tokens,
    formFields,
    setSettings,
    handleFileUpload,
    handleLoadSimulatedFile,
    handleTemplateChange,
    handleSelectSample,
    handleResetSample,
    handleClearAll,
    handleChangeValue,
    handleIgnoreField,
    handleRestoreField,
    handleClearValues,
  } = useAutoFiller();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [leftTab, setLeftTab] = useState<'template' | 'form'>('form');
  const [desktopLayout, setDesktopLayout] = useState<'3col' | '2col'>('3col');

  const filledCount = formFields.filter((f) => (values[f.fieldKey] || '').trim().length > 0).length;

  const onSelectSampleWithTabSwitch = (sample: any) => {
    handleSelectSample(sample);
    setLeftTab('form');
  };

  const onFileUploadWithTabSwitch = async (file: File) => {
    await handleFileUpload(file);
    setLeftTab('form');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans antialiased text-slate-800">
      
      {/* Sleek Minimalist Navbar */}
      <Header
        onSelectSample={onSelectSampleWithTabSwitch}
        onClearAll={handleClearAll}
        onResetSample={handleResetSample}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeSampleId={activeSampleId}
      />

      {/* Workspace Layout Controls */}
      <div className="bg-white/90 border-b border-slate-200/80 px-6 py-2 hidden lg:block backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2.5">
            <span className="font-semibold text-slate-700">Workflow Layout:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200/80">
              <button
                onClick={() => setDesktopLayout('3col')}
                className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center space-x-1.5 ${
                  desktopLayout === '3col' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>3 Columns (Pro Studio)</span>
              </button>
              <button
                onClick={() => setDesktopLayout('2col')}
                className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center space-x-1.5 ${
                  desktopLayout === '2col' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>2 Columns (Tabbed Editor)</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="font-medium text-slate-600">Reactive OCR engine active</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Mobile / Small Tablet Tabs */}
        <div className="lg:hidden flex items-center space-x-2 mb-5 bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setLeftTab('template')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              leftTab === 'template'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Template Upload</span>
          </button>
          <button
            onClick={() => setLeftTab('form')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              leftTab === 'form'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Fill Blanks ({filledCount}/{formFields.length})</span>
          </button>
        </div>

        {/* 3-Column Pro Studio Layout (lg screens and up) */}
        {desktopLayout === '3col' ? (
          <div className="hidden lg:grid grid-cols-12 gap-6 h-[calc(100vh-165px)]">
            {/* Col 1-3: Upload & Editor */}
            <div className="col-span-3 h-full">
              <TemplateInput
                value={templateText}
                onChange={handleTemplateChange}
                onFileUpload={onFileUploadWithTabSwitch}
                onLoadSimulatedFile={handleLoadSimulatedFile}
                isExtracting={isExtracting}
                extractionError={extractionError}
                uploadedFilename={uploadedFilename}
                detectedCount={formFields.length}
              />
            </div>
            {/* Col 4-7: Dynamic Form */}
            <div className="col-span-4 h-full">
              <DynamicForm
                fields={formFields}
                values={values}
                onChangeValue={handleChangeValue}
                onIgnoreField={handleIgnoreField}
                onRestoreField={handleRestoreField}
                ignoredKeys={ignoredKeys}
                onClearValues={handleClearValues}
                activeFieldKey={activeFieldKey}
                setActiveFieldKey={setActiveFieldKey}
              />
            </div>
            {/* Col 8-12 (5 cols wide!): Completed Document */}
            <div className="col-span-5 h-full">
              <DocumentPreview
                tokens={tokens}
                values={values}
                activeFieldKey={activeFieldKey}
                totalFieldsCount={formFields.length}
              />
            </div>
          </div>
        ) : null}

        {/* 2-Column Layout (when 2col selected or on tablets/mobile) */}
        <div className={`${desktopLayout === '3col' ? 'lg:hidden' : ''} grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]`}>
          
          <div className="md:col-span-6 flex flex-col h-full">
            <div className="hidden md:flex lg:flex xl:flex items-center space-x-2 mb-4 bg-slate-200/60 p-1 rounded-xl">
              <button
                onClick={() => setLeftTab('template')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  leftTab === 'template'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Template Upload</span>
              </button>
              <button
                onClick={() => setLeftTab('form')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  leftTab === 'form'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Fill Blanks ({filledCount}/{formFields.length})</span>
              </button>
            </div>

            <div className="flex-1 min-h-[420px] md:h-[calc(100vh-220px)]">
              {leftTab === 'template' ? (
                <TemplateInput
                  value={templateText}
                  onChange={handleTemplateChange}
                  onFileUpload={onFileUploadWithTabSwitch}
                  onLoadSimulatedFile={handleLoadSimulatedFile}
                  isExtracting={isExtracting}
                  extractionError={extractionError}
                  uploadedFilename={uploadedFilename}
                  detectedCount={formFields.length}
                />
              ) : (
                <DynamicForm
                  fields={formFields}
                  values={values}
                  onChangeValue={handleChangeValue}
                  onIgnoreField={handleIgnoreField}
                  onRestoreField={handleRestoreField}
                  ignoredKeys={ignoredKeys}
                  onClearValues={handleClearValues}
                  activeFieldKey={activeFieldKey}
                  setActiveFieldKey={setActiveFieldKey}
                />
              )}
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col h-full md:sticky md:top-20">
            <div className="flex-1 min-h-[420px] md:h-[calc(100vh-220px)]">
              <DocumentPreview
                tokens={tokens}
                values={values}
                activeFieldKey={activeFieldKey}
                totalFieldsCount={formFields.length}
              />
            </div>
          </div>

        </div>

      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

    </div>
  );
};

export default App;
