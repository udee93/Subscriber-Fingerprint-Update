import React, { useState } from 'react';
import { SmartCardData, EkycStep } from '../types';
import { simulateSmartCardRead, simulateFingerprintScan } from '../services/mockService';
import { CreditCard, Fingerprint, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface EkycWizardProps {
  onComplete: (data: SmartCardData) => void;
  onCancel: () => void;
}

const EkycWizard: React.FC<EkycWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<EkycStep>(EkycStep.IDLE);
  const [cardData, setCardData] = useState<SmartCardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReadCard = async () => {
    setStep(EkycStep.READING_CARD);
    setError(null);
    try {
      const data = await simulateSmartCardRead();
      setCardData(data);
      setStep(EkycStep.CARD_READ_SUCCESS);
    } catch (e) {
      setError("Failed to read Smart Card. Please ensure card is inserted correctly.");
      setStep(EkycStep.IDLE);
    }
  };

  const handleScanFingerprint = async () => {
    if (!cardData) return;
    setStep(EkycStep.SCANNING_FINGERPRINT);
    setError(null);
    try {
      await simulateFingerprintScan();
      setStep(EkycStep.FINGERPRINT_VERIFIED);
      
      // Auto complete after short delay to show success state
      setTimeout(() => {
        onComplete(cardData);
      }, 1500);
      
    } catch (e) {
      setError("Fingerprint verification failed. Please try again.");
      setStep(EkycStep.CARD_READ_SUCCESS);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
          
          {/* Step 1 Node */}
          <div className={`flex flex-col items-center bg-white px-2 ${step !== EkycStep.IDLE ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
              ${cardData ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-current'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold mt-2">Smart Card</span>
          </div>

          {/* Step 2 Node */}
          <div className={`flex flex-col items-center bg-white px-2 
            ${step === EkycStep.FINGERPRINT_VERIFIED ? 'text-green-600' : 
              (cardData ? 'text-blue-600' : 'text-gray-400')}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
              ${step === EkycStep.FINGERPRINT_VERIFIED ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-current'}`}>
              <Fingerprint className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold mt-2">Biometric</span>
          </div>

           {/* Step 3 Node */}
           <div className={`flex flex-col items-center bg-white px-2 text-gray-400`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-300 bg-white`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold mt-2">Submit</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Step 1: Smart Card */}
        {(!cardData || step === EkycStep.READING_CARD) && (
          <div className="p-8 text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Insert Bahraini Smart Card</h3>
            <p className="text-gray-500">Please insert the customer's Smart Card into the reader to fetch details.</p>
            
            <div className="py-8 flex justify-center">
               <div className={`relative w-48 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-inner flex items-center justify-center
                  ${step === EkycStep.READING_CARD ? 'animate-pulse' : ''}`}>
                 <div className="w-12 h-10 bg-yellow-400 rounded opacity-80 ml-4 mb-4 self-end"></div>
                 <div className="absolute top-4 left-4 text-white/50 text-xs">Bahrain ID</div>
               </div>
            </div>

            {error && (
               <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-center justify-center gap-2">
                 <AlertCircle className="w-4 h-4" />
                 {error}
               </div>
            )}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={onCancel}
                className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleReadCard}
                disabled={step === EkycStep.READING_CARD}
                className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {step === EkycStep.READING_CARD ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Reading Chip...
                  </>
                ) : (
                  <>Read Smart Card</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Display Data & Fingerprint */}
        {cardData && step !== EkycStep.READING_CARD && (
          <div className="flex flex-col md:flex-row">
             {/* Left: Card Data Review */}
             <div className="md:w-1/2 p-6 md:border-r border-gray-100 bg-gray-50">
                <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">Card Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={cardData.photoUrl} alt="ID" className="w-20 h-20 rounded-md object-cover bg-gray-200 border border-gray-300" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-bold text-gray-900">{cardData.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">CPR Number</p>
                      <p className="font-mono font-medium">{cardData.cprNumber}</p>
                    </div>
                     <div>
                      <p className="text-xs text-gray-500 uppercase">Nationality</p>
                      <p className="font-medium">{cardData.nationality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Date of Birth</p>
                      <p className="font-medium">{cardData.dateOfBirth}</p>
                    </div>
                     <div>
                      <p className="text-xs text-gray-500 uppercase">Expiry Date</p>
                      <p className="font-medium text-green-700">{cardData.expiryDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button onClick={() => { setCardData(null); setStep(EkycStep.IDLE); }} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                    <RefreshCw className="w-3 h-3" /> Re-scan Card
                  </button>
                </div>
             </div>

             {/* Right: Fingerprint Action */}
             <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
                
                {step === EkycStep.CARD_READ_SUCCESS && (
                  <>
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                      <Fingerprint className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Verify Fingerprint</h3>
                    <p className="text-gray-500 mb-8 text-sm">Ask the customer to place their finger on the scanner to verify identity against the Smart Card.</p>
                    
                     {error && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center justify-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}

                    <button 
                      onClick={handleScanFingerprint}
                      className="w-full max-w-xs px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                    >
                      Scan Fingerprint
                    </button>
                  </>
                )}

                {step === EkycStep.SCANNING_FINGERPRINT && (
                   <div className="flex flex-col items-center">
                     <div className="relative w-24 h-24 mb-6">
                       <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                       <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                       <Fingerprint className="absolute inset-0 m-auto text-blue-500 w-10 h-10 animate-pulse" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Scanning...</h3>
                     <p className="text-sm text-gray-500">Please keep finger placed firmly.</p>
                   </div>
                )}

                {step === EkycStep.FINGERPRINT_VERIFIED && (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Identity Verified</h3>
                    <p className="text-sm text-gray-500">Biometric data matches Smart Card.</p>
                    <div className="mt-8 flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Submitting request...</span>
                    </div>
                  </div>
                )}

             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EkycWizard;
