import React from 'react';
import { Transaction } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onProceed: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  selectedIds, 
  onToggleSelect,
  onProceed
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500">No transactions found matching your criteria.</p>
      </div>
    );
  }

  const allSelected = transactions.length > 0 && selectedIds.length === transactions.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Search Results ({transactions.length})</h2>
        <span className="text-sm text-gray-500">Select transactions to proceed</span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  Select
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPR / ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((trx) => {
                const isSelected = selectedIds.includes(trx.id);
                return (
                  <tr 
                    key={trx.id} 
                    onClick={() => onToggleSelect(trx.id)}
                    className={`cursor-pointer transition-colors hover:bg-blue-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trx.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trx.cprNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trx.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {trx.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {trx.amount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end items-center shadow-lg md:relative md:bg-transparent md:border-0 md:shadow-none md:p-0">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm text-gray-600 hidden md:block">
              {selectedIds.length} selected
            </span>
            <button
              onClick={onProceed}
              disabled={selectedIds.length === 0}
              className={`w-full md:w-auto px-6 py-3 rounded-md font-medium text-white transition-all
                ${selectedIds.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
            >
              Proceed to EKYC ({selectedIds.length})
            </button>
         </div>
      </div>
    </div>
  );
};

export default TransactionList;
