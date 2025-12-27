'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface ApiResponse {
  fullText?: string;
  pages?: {
    pageNumber: number;
    text: string;
    wordCount: number;
  }[];
  pageCount?: number;
  wordCount?: number;
  language?: string;
  // Metadata specific fields might vary, adding generic support
  [key: string]: any;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'convert' | 'metadata'>('convert');
  const [showJson, setShowJson] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // 6MB limit check
      if (selectedFile.size > 6 * 1024 * 1024) {
        setError('File size exceeds 6MB limit.');
        setFile(null);
        return;
      }

      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setResult(null);
      setShowJson(false);
    }
  };

  const loadSamplePdf = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/sample.pdf');
      if (!response.ok) throw new Error('Failed to load sample PDF');

      const blob = await response.blob();
      const sampleFile = new File([blob], 'sample.pdf', { type: 'application/pdf' });

      setFile(sampleFile);
      setError(null);
      setResult(null);
      setShowJson(false);
    } catch (err) {
      setError('Could not load sample PDF. Please upload one manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionMode: 'convert' | 'metadata') => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setMode(actionMode);
    setShowJson(false); // Reset JSON view on new action

    const formData = new FormData();
    formData.append('file', file);

    const endpoint = actionMode === 'convert' ? '/api/convert' : '/api/metadata';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${actionMode === 'convert' ? 'convert PDF' : 'fetch metadata'}`);
      }

      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = showJson || mode === 'metadata'
      ? JSON.stringify(result, null, 2)
      : result?.fullText;

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      alert(showJson || mode === 'metadata' ? 'JSON copied to clipboard!' : 'Text copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight sm:text-5xl mb-2">
            Motyl PDF Extractor
          </h1>
          <p className="text-lg text-slate-600">
            Extract text or get metadata from your PDF documents instantly.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <div className="space-y-6">

            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
                  ${file ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PDF (MAX. 6MB)</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>

              <div className="flex flex-col items-center gap-2 mt-2">
                {file ? (
                  <p className="text-sm text-blue-600 font-medium">
                    Selected: {file.name}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={loadSamplePdf}
                    className="text-sm text-slate-500 hover:text-blue-600 underline decoration-dotted underline-offset-4 transition-colors"
                  >
                    No PDF? Click here to use a sample file
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4" role="alert">
                <p className="font-bold text-red-700">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => handleAction('convert')}
                disabled={!file || isLoading}
                className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${!file || isLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {isLoading && mode === 'convert' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Convert PDF'
                )}
              </button>

              <button
                onClick={() => handleAction('metadata')}
                disabled={!file || isLoading}
                className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${!file || isLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'}`}
              >
                {isLoading && mode === 'metadata' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Get Metadata'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {result && (
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200 space-y-6 animate-fade-in-up">
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {result.wordCount !== undefined && (
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                  Word Count: <span className="font-bold">{result.wordCount}</span>
                </div>
              )}
              {result.language && (
                <div className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
                  Language: <span className="font-bold uppercase">{result.language}</span>
                </div>
              )}
              {result.pageCount !== undefined && (
                <div className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-2 rounded-full">
                  Pages: <span className="font-bold">{result.pageCount}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="result-text" className="block text-sm font-medium text-slate-700">
                  {mode === 'convert' && !showJson ? 'Extracted Text' : 'JSON Response'}
                </label>

                {mode === 'convert' && (
                  <div className="flex items-center">
                    <input
                      id="json-toggle"
                      type="checkbox"
                      checked={showJson}
                      onChange={(e) => setShowJson(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="json-toggle" className="ml-2 text-sm font-medium text-slate-600 cursor-pointer select-none">
                      Show Raw JSON
                    </label>
                  </div>
                )}
              </div>

              <textarea
                id="result-text"
                readOnly
                rows={10}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 bg-slate-50 font-mono text-slate-800"
                value={showJson || mode === 'metadata' ? JSON.stringify(result, null, 2) : result.fullText}
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-10 right-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md px-3 py-1 text-xs font-medium shadow-sm transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-slate-500 mb-4">
            Need to integrate this into your own application?
          </p>
          <a
            href="https://rapidapi.com/vishal05pandey/api/pdf-extractor-api1/playground/apiendpoint_546c0d0a-9f4b-4d04-9b01-361e0a240280"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            Get the API on RapidAPI
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm pb-8">
          <p>&copy; {new Date().getFullYear()} Motyl. Built with Next.js & RapidAPI.</p>
        </footer>

      </div>
    </main>
  );
}
