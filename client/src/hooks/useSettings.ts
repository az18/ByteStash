import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => 
    (localStorage.getItem('viewMode') as 'grid' | 'list') || 'grid'
  );
  const [compactView, setCompactView] = useState(() => localStorage.getItem('compactView') === 'true');
  const [showCodePreview, setShowCodePreview] = useState(() => localStorage.getItem('showCodePreview') !== 'false');
  const [previewLines, setPreviewLines] = useState(() => parseInt(localStorage.getItem('previewLines') || '4', 10));
  const [includeCodeInSearch, setIncludeCodeInSearch] = useState(() => localStorage.getItem('includeCodeInSearch') === 'true');
  const [showCategories, setShowCategories] = useState(() => localStorage.getItem('showCategories') !== 'false');
  const [expandCategories, setExpandCategories] = useState(() => localStorage.getItem('expandCategories') === 'true');
  const [showLineNumbers, setShowLineNumbers] = useState(() => localStorage.getItem('showLineNumbers') === 'true')

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('compactView', compactView.toString());
  }, [compactView]);

  useEffect(() => {
    localStorage.setItem('showCodePreview', showCodePreview.toString());
  }, [showCodePreview]);

  useEffect(() => {
    localStorage.setItem('previewLines', previewLines.toString());
  }, [previewLines]);

  useEffect(() => {
    localStorage.setItem('includeCodeInSearch', includeCodeInSearch.toString());
  }, [includeCodeInSearch]);

  useEffect(() => {
    localStorage.setItem('showCategories', showCategories.toString());
  }, [showCategories]);

  useEffect(() => {
    localStorage.setItem('expandCategories', expandCategories.toString());
  }, [expandCategories]);

  useEffect(() => {
    localStorage.setItem('showLineNumbers', showLineNumbers.toString());
  }, [showLineNumbers]);

  const updateSettings = (newSettings: {
    compactView: boolean;
    showCodePreview: boolean;
    previewLines: number;
    includeCodeInSearch: boolean;
    showCategories: boolean;
    expandCategories: boolean;
    showLineNumbers: boolean;
  }) => {
    setCompactView(newSettings.compactView);
    setShowCodePreview(newSettings.showCodePreview);
    setPreviewLines(newSettings.previewLines);
    setIncludeCodeInSearch(newSettings.includeCodeInSearch);
    setShowCategories(newSettings.showCategories);
    setExpandCategories(newSettings.expandCategories);
    setShowLineNumbers(newSettings.showLineNumbers);
  };

  return {
    viewMode,
    setViewMode,
    compactView,
    showCodePreview,
    previewLines,
    includeCodeInSearch,
    showCategories,
    expandCategories,
    updateSettings,
    showLineNumbers
  };
};