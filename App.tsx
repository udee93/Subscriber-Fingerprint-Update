import React, { useState } from 'react';
import { EkycStep } from './types';
import EkycWizard from './components/EkycWizard';
import { RefreshCcw, PackageCheck, XCircle, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<'EKYC' | 'SUCCESS' | 'FAILED'>('EKYC');
  const [refId, setRefId] = useState<string | null>(null);

  // --- Handlers ---
  const handleResult = (success: boolean, submissionRef?: string) => {
    if (success && submissionRef) {
      setRefId(submissionRef);
      setView('SUCCESS');
    } else {
      setView('FAILED');
    }
  };

  const resetApp = () => {
    setRefId(null);
    setView('EKYC');
  };

  // --- Render Helpers ---
  const renderSuccess = () => (
    <div className="max-w-md mx-auto mt-12 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <PackageCheck className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Order Received!</h2>
      <p className="text-gray-500 mb-8 leading-relaxed">
        The customer's EKYC validation is complete and the mobile line activation request has been queued.
      </p>
      
      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-10">
        <p className="text-xs text-blue-600 uppercase font-black tracking-widest mb-1">Order Reference</p>
        <p className="text-2xl font-mono font-bold text-gray-800">{refId}</p>
      </div>

      <button
        onClick={resetApp}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-3"
      >
        <RefreshCcw className="w-5 h-5" /> Start New Transaction
      </button>
    </div>
  );

  const renderFailed = () => (
    <div className="max-w-md mx-auto mt-12 bg-white p-10 rounded-3xl shadow-2xl border border-red-100 text-center animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <XCircle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Order Failed</h2>
      <p className="text-gray-500 mb-10 leading-relaxed">
        We encountered a system timeout during activation. The request could not be completed at this time.
      </p>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={resetApp}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center gap-3"
        >
          <RefreshCcw className="w-5 h-5" /> Try Again
        </button>
        
        <button
          onClick={resetApp}
          className="w-full py-4 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5 text-gray-400" /> Exit and Try Another Transaction
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'EKYC' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <EkycWizard onResult={handleResult} />
          </div>
        )}

        {view === 'SUCCESS' && renderSuccess()}
        {view === 'FAILED' && renderFailed()}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-400 font-medium">
                &copy; 2024 TeleConnect ePortal. All identity data is encrypted and secure.
              </p>
              <div className="flex items-center gap-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                <span>Regulatory Compliant</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Audit Log Active</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;