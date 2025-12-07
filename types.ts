export enum SearchType {
  TRANSACTION_ID = 'TRANSACTION_ID',
  CPR_NUMBER = 'CPR_NUMBER'
}

export interface Transaction {
  id: string;
  cprNumber: string;
  customerName: string;
  serviceType: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  amount: string;
}

export interface SmartCardData {
  fullName: string;
  cprNumber: string;
  dateOfBirth: string;
  expiryDate: string;
  gender: string;
  nationality: string;
  photoUrl: string;
}

export enum EkycStep {
  IDLE = 'IDLE',
  READING_CARD = 'READING_CARD',
  CARD_READ_SUCCESS = 'CARD_READ_SUCCESS',
  SCANNING_FINGERPRINT = 'SCANNING_FINGERPRINT',
  FINGERPRINT_VERIFIED = 'FINGERPRINT_VERIFIED',
  SUBMITTING = 'SUBMITTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
