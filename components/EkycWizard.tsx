import React, { useState } from 'react';
import { SmartCardData, EkycStep } from '../types';
import { simulateSmartCardRead, simulateFingerprintScan, submitEkycRequest } from '../services/mockService';
import { CreditCard, Fingerprint, Loader2, CheckCircle, AlertCircle, Smartphone, Send } from 'lucide-react';

interface EkycWizardProps {
  onComplete: (refId: string) => void;
}

const EkycWizard: React.FC<EkycWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<EkycStep>(EkycStep.READ_CARD);
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState<SmartCardData | null>(null);
  const [msisdn, setMsisdn] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleReadCard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateSmartCardRead();
      setCardData(data);
      setStep(EkycStep.VERIFY_BIOMETRIC);
    } catch (e) {
      setError("Failed to read Smart Card. Please ensure card is inserted correctly.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanFingerprint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await simulateFingerprintScan();
      setStep(EkycStep.ORDER_DETAILS);
    } catch (e) {
      setError("Fingerprint verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msisdn || !cardData) return;
    
    setIsLoading(true);
    try {
      const refId = await submitEkycRequest([], cardData);
      onComplete(refId);
    } catch (e) {
      setError("Order submission failed. Please check connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative px-8">
          <div className="absolute left-10 right-10 top-5 h-0.5 bg-gray-200 -z-10"></div>
          
          <div className={`flex flex-col items-center z-10 ${step === EkycStep.READ_CARD ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300
              ${step !== EkycStep.READ_CARD ? 'bg-green-600 border-green-600 text-white' : 'border-blue-600 text-blue-600 shadow-lg'}`}>
              {step !== EkycStep.READ_CARD ? <CheckCircle className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            </div>
            <span className="text-xs font-bold mt-2">ID Card</span>
          </div>

          <div className={`flex flex-col items-center z-10 
            ${step === EkycStep.VERIFY_BIOMETRIC ? 'text-blue-600' : 
              (step === EkycStep.ORDER_DETAILS ? 'text-green-600' : 'text-gray-400')}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300
              ${step === EkycStep.ORDER_DETAILS ? 'bg-green-600 border-green-600 text-white' : 
                (step === EkycStep.VERIFY_BIOMETRIC ? 'border-blue-600 text-blue-600 shadow-lg' : 'border-gray-300')}`}>
              {step === EkycStep.ORDER_DETAILS ? <CheckCircle className="w-5 h-5" /> : <Fingerprint className="w-5 h-5" />}
            </div>
            <span className="text-xs font-bold mt-2">Biometric</span>
          </div>

          <div className={`flex flex-col items-center z-10 ${step === EkycStep.ORDER_DETAILS ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300
              ${step === EkycStep.ORDER_DETAILS ? 'border-blue-600 text-blue-600 shadow-lg' : 'border-gray-300'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold mt-2">Complete</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Step 1: READ CARD */}
        {step === EkycStep.READ_CARD && (
          <div className="p-10 text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">New Order EKYC</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Please insert the customer's Smart Card into the reader to begin verification.</p>
            
            <div className="py-10 flex justify-center">
               <div className={`relative w-56 h-36 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl shadow-2xl flex items-center justify-center
                  ${isLoading ? 'animate-pulse' : ''}`}>
                 <div className="absolute top-4 left-4 w-10 h-10 border border-white/20 rounded-lg"></div>
                 <div className="w-14 h-10 bg-yellow-400 rounded opacity-90 ml-6 mb-6 self-end shadow-sm"></div>
                 <div className="absolute top-4 right-4 text-white/40 text-[10px] font-mono">CHIP ID 0x82A</div>
                 <div className="absolute bottom-4 left-4 text-white/50 text-xs font-semibold">BAHRAIN ID CARD</div>
               </div>
            </div>

            {error && (
               <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 text-sm">
                 <AlertCircle className="w-5 h-5" />
                 {error}
               </div>
            )}

            <button 
              onClick={handleReadCard}
              disabled={isLoading}
              className="w-full max-w-xs px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-3 disabled:bg-blue-400"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Fetching Card Data...</>
              ) : (
                <><CreditCard className="w-5 h-5" /> Read Smart Card</>
              )}
            </button>
          </div>
        )}

        {/* Step 2: VERIFY BIOMETRIC */}
        {step === EkycStep.VERIFY_BIOMETRIC && cardData && (
          <div className="p-10 text-center space-y-6">
            <div className="flex flex-col items-center mb-4">
              <img src={cardData.photoUrl} alt="Customer" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg -mt-20 mb-4 bg-gray-100" />
              <h3 className="text-xl font-bold text-gray-900">{cardData.fullName}</h3>
              <p className="text-sm text-gray-500">CPR: {cardData.cprNumber}</p>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6">
              <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm
                 ${isLoading ? 'animate-bounce' : ''}`}>
                <Fingerprint className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-800">Biometric Verification</h4>
              <p className="text-sm text-gray-500 mt-2">Place any registered finger on the scanner</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-4">
               <button 
                onClick={() => setStep(EkycStep.READ_CARD)}
                className="flex-1 px-6 py-4 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
              >
                Re-read Card
              </button>
              <button 
                onClick={handleScanFingerprint}
                disabled={isLoading}
                className="flex-[2] px-6 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Scan Biometrics'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: ORDER DETAILS */}
        {step === EkycStep.ORDER_DETAILS && cardData && (
          <form onSubmit={handleFinalSubmit} className="p-8 space-y-8">
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Complete Activation</h3>
                <p className="text-sm text-gray-500">Enter customer's service number to activate</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Identity Verified
              </div>
            </div>

            {/* Validated Customer Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 gap-y-6">
                
                {/* Name Row */}
                <div className="flex flex-col border-b border-gray-50 pb-4">
                  <span className="text-[13px] font-medium text-slate-400 uppercase tracking-tight">Full Name</span>
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">{cardData.fullName}</span>
                </div>

                {/* Nationality and Gender Row */}
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-400 uppercase tracking-tight">NATIONALITY</span>
                    <span className="text-lg font-bold text-slate-800">{cardData.nationality}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-400 uppercase tracking-tight">GENDER</span>
                    <span className="text-lg font-bold text-slate-800">{cardData.gender}</span>
                  </div>
                </div>

                {/* CPR and Expiry Row */}
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-400 uppercase tracking-tight">CPR NUMBER</span>
                    <span className="text-lg font-bold text-slate-800 tracking-wider font-mono">{cardData.cprNumber}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-400 uppercase tracking-tight">EXPIRY</span>
                    <span className="text-lg font-bold text-emerald-600">{cardData.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Service MSISDN (Mobile Number)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 3xxxxxxx"
                    value={msisdn}
                    onChange={(e) => setMsisdn(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="block w-full pl-11 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400 text-xl font-mono tracking-[0.2em] bg-gray-50/50"
                  />
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Entry required to proceed</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4">
               <button 
                type="button"
                onClick={() => setStep(EkycStep.VERIFY_BIOMETRIC)}
                className="px-6 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={isLoading || !msisdn}
                className="flex-grow px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing Order...</>
                ) : (
                  <><Send className="w-5 h-5" /> Activate Service</>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default EkycWizard;