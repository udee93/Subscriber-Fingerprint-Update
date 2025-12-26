import { SmartCardData, Transaction } from '../types';

// Mock Database
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-987261',
    cprNumber: '930658450',
    customerName: 'UDIT PANT',
    serviceType: 'New Postpaid Line',
    status: 'PENDING',
    date: '2023-10-25',
    amount: '15.000 BHD'
  }
];

export const searchTransactions = async (query: string, type: 'TRANSACTION_ID' | 'CPR_NUMBER'): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  if (!query) return [];
  if (type === 'TRANSACTION_ID') {
    return MOCK_TRANSACTIONS.filter(t => t.id.toLowerCase() === query.toLowerCase());
  } else {
    return MOCK_TRANSACTIONS.filter(t => t.cprNumber.includes(query));
  }
};

export const simulateSmartCardRead = async (): Promise<SmartCardData> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    fullName: 'UDIT PANT',
    cprNumber: '930658450',
    dateOfBirth: '1993-06-05',
    expiryDate: '18/10/2027',
    gender: 'M',
    nationality: '423',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop'
  };
};

export const simulateFingerprintScan = async (shouldFail = false): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  if (shouldFail) throw new Error("Fingerprint mismatch");
  return true;
};

export const submitEkycRequest = async (transactionIds: string[], smartCardData: SmartCardData, shouldFail = false): Promise<string> => {
  // Wait for 10 seconds as requested
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  if (shouldFail) {
    // Simulate a failure by throwing an error
    throw new Error("SYSTEM_TIMEOUT_OR_VALIDATION_FAILURE");
  }

  // Return a mock reference ID for success
  return 'ACT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};