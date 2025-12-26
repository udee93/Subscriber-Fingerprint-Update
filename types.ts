export interface SmartCardData {
  fullName: string;
  cprNumber: string;
  dateOfBirth: string;
  expiryDate: string;
  gender: string;
  nationality: string;
  photoUrl: string;
}

// Fix: Define Transaction interface to resolve import errors in mockService.ts and TransactionList.tsx
export interface Transaction {
  id: string;
  cprNumber: string;
  customerName: string;
  serviceType: string;
  status: string;
  date: string;
  amount: string;
}

export interface OrderData {
  msisdn: string;
  cardData: SmartCardData;
}

export enum EkycStep {
  READ_CARD = 'READ_CARD',
  VERIFY_BIOMETRIC = 'VERIFY_BIOMETRIC',
  ORDER_DETAILS = 'ORDER_DETAILS',
  SUCCESS = 'SUCCESS'
}