import React, { useState } from 'react';
import { SearchType, Transaction, SmartCardData } from './types';
import { searchTransactions, submitEkycRequest } from './services/mockService';
import Header from './components/Header';
import TransactionList from './components/TransactionList';
import EkycWizard from './components/EkycWizard';
import { Search, Loader2, CheckCircle2, ArrowLeft, RefreshCcw, Info } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<'SEARCH' | 'EKYC' | 'SUCCESS'>('SEARCH');
  
  // Search State
  const [searchType, setSearchType] = useState<SearchType>(SearchType.TRANSACTION_ID);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Transaction[] | null>(null);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Submission State
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // --- Handlers ---

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults(null);
    setSelectedIds([]);

    try {
      const results = await searchTransactions(searchQuery.trim(), searchType);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      // In a real app, handle error UI here
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const startEkyc = () => {
    setView('EKYC');
  };

  const handleEkycComplete = async (cardData: SmartCardData) => {
    // Submit final request
    try {
      const refId = await submitEkycRequest(selectedIds, cardData);
      setSubmissionId(refId);
      setView('SUCCESS');
    } catch (error) {
      alert("Submission failed");
    }
  };

  const resetApp = () => {
    setView('SEARCH');
    setSearchQuery('');
    setSearchResults(null);
    setSelectedIds([]);
    setSubmissionId(null);
  };

  // --- Render Helpers ---

  const renderSearchSection = () => {
    const demoData = searchType === SearchType.TRANSACTION_ID 
      ? ['TRX-987261', 'TRX-112233', 'TRX-554433']
      : ['890112345', '950554321', '780998877'];

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Look up Transaction</h1>
          
          {/* Search Type Toggles */}
          <div className="flex space-x-6 mb-6 border-b border-gray-100 pb-2">
            <button
              type="button"
              onClick={() => { setSearchType(SearchType.TRANSACTION_ID); setSearchResults(null); setSelectedIds([]); setSearchQuery(''); }}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                searchType === SearchType.TRANSACTION_ID ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              By Transaction ID
              {searchType === SearchType.TRANSACTION_ID && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setSearchType(SearchType.CPR_NUMBER); setSearchResults(null); setSelectedIds([]); setSearchQuery(''); }}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                searchType === SearchType.CPR_NUMBER ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              By CPR Number
              {searchType === SearchType.CPR_NUMBER && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === SearchType.TRANSACTION_ID ? "Enter Transaction Ref (e.g. TRX-123)" : "Enter Bahraini CPR ID"}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery || isSearching}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:bg-blue-400 transition-all flex items-center justify-center min-w-[120px]"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </form>

          {/* Demo Data Helper */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-3">
              <Info className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Demo Data (Click to fill)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {demoData.map((data) => (
                <button
                  key={data}
                  type="button"
                  onClick={() => setSearchQuery(data)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {data}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results Area */}
        {searchResults && (
          <TransactionList 
            transactions={searchResults} 
            selectedIds={selectedIds}
            onToggleSelect={toggleSelection}
            onProceed={startEkyc}
          />
        )}
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center animate-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Validation Successful</h2>
      <p className="text-gray-500 mb-6">
        The EKYC process has been completed successfully for the selected transactions.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
        <p className="text-xs text-gray-500 uppercase font-semibold">Request Reference</p>
        <p className="text-lg font-mono font-bold text-gray-800">{submissionId}</p>
      </div>

      <button
        onClick={resetApp}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCcw className="w-4 h-4" /> Process Next Customer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'SEARCH' && renderSearchSection()}
        
        {view === 'EKYC' && (
          <div className="animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setView('SEARCH')}
              className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
            </button>
            <EkycWizard 
              onCancel={() => setView('SEARCH')}
              onComplete={handleEkycComplete}
            />
          </div>
        )}

        {view === 'SUCCESS' && renderSuccess()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
           <p className="text-center text-xs text-gray-400">
             &copy; 2024 Telecom Provider. All rights reserved. System Version 2.1.0
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;