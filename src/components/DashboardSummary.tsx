import React from 'react';

type Props = {
  totalInvested: number;
  totalROI: number;
  totalWithdrawn: number;
};

export default function DashboardSummary({ totalInvested, totalROI, totalWithdrawn }: Props) {
  return (
    <div className="bg-gray-800 border border-green-700 rounded-lg p-4 text-white mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-sm text-gray-400">Total Activated</p>
        <p className="text-lg font-bold">{totalInvested.toFixed(4)} BNB</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Total Returns</p>
        <p className="text-lg font-bold">{totalROI.toFixed(4)} BNB</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Total Rewards</p>
        <p className="text-lg font-bold">{totalWithdrawn.toFixed(4)} BNB</p>
      </div>
    </div>
  );
}
