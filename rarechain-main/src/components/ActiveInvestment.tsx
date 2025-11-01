'use client';

import { useEffect, useState, useCallback } from 'react';
import { withdrawInvestment } from '../../utils/web3';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type Props = {
  index: number;
  amount: number;
  startTime: number;
  durationDays: number;
  roiPercent: number;
  withdrawn: boolean;
  // completed: boolean;
  onWithdraw?: () => void;
};

const planNames: Record<number, string> = {
  1: 'Master Node',
  2: 'Full Node',
  3: 'Validator Node',
  4: 'Lightning Node',
  5: 'Uncle Blocks',
};

const planFees: Record<number, number> = {
  1: 50,
  2: 40,
  3: 40,
  4: 40,
  5: 40,
};

export default function ActiveInvestment({
  index,
  amount,
  startTime,
  durationDays,
  roiPercent,
  withdrawn,
  // completed,
  onWithdraw,
}: Props) {
  const [timeLeft, setTimeLeft] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [progress, setProgress] = useState(0);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [isLoading, setIsLoading] = useState(false);

  const totalSeconds = durationDays * 86400;
  const endTime = startTime + totalSeconds;
  const roiTotal = (amount * roiPercent * durationDays) / 100;

  const planId = index + 1;
  const planName = planNames[planId] ?? 'Unknown Plan';
  const feePercent = planFees[planId] ?? 0;

  const updateInfo = useCallback(() => {
    const current = Math.floor(Date.now() / 1000);
    const elapsed = Math.max(0, current - startTime);
    const secondsLeft = Math.max(0, endTime - current);
    const progressRatio = Math.min(1, elapsed / totalSeconds);

    setProgress(progressRatio);
    setNow(current);

    if (secondsLeft === 0) {
      setTimeLeft('Completed');
    } else {
      const d = Math.floor(secondsLeft / 86400);
      const h = Math.floor((secondsLeft % 86400) / 3600);
      const m = Math.floor((secondsLeft % 3600) / 60);
      const s = secondsLeft % 60;
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }

    const roiEarned = roiTotal * progressRatio;
    const targetEarnings = amount + roiEarned;

    // Animate earnings
    setEarnings((prev) =>
      Math.abs(prev - targetEarnings) < 0.01 ? targetEarnings : prev + (targetEarnings - prev) * 0.1
    );
  }, [amount, roiTotal, startTime, endTime, totalSeconds]);

  useEffect(() => {
    updateInfo();
    const interval = setInterval(updateInfo, 1000);
    return () => clearInterval(interval);
  }, [updateInfo]);

  const handleWithdraw = async () => {
    if (withdrawn || isLoading) return;

    setIsLoading(true);
    try {
      toast.info('Processing withdrawal...');
      await withdrawInvestment(index);
      toast.success('Withdraw successful!');
      onWithdraw?.();
    } catch {
      toast.error('Withdraw failed');
    } finally {
      setIsLoading(false);
    }
  };

  const earnedROI = earnings - amount;
  const isMatured = now >= endTime;
  const feeAmount = isMatured ? 0 : (earnedROI * feePercent) / 100;
  const finalPayout = earnings - feeAmount;

  return (
    <div
      className={`bg-gray-900 p-4 rounded-xl border transition-all duration-500 mb-6 shadow-md ${
        withdrawn
          ? 'border-red-400'
          : isMatured
          ? 'border-green-600'
          : 'border-yellow-500'
      }`}
    >
      <h3 className="text-xl font-bold mb-3">
        Plan #{index + 1}: {planName}
      </h3>

      <div className="grid md:grid-cols-2 gap-6 items-center mb-4">
        <div className="w-24 h-24 mx-auto">
          <CircularProgressbar
            value={progress * 100}
            text={`${Math.floor(progress * 100)}%`}
            styles={buildStyles({
              pathColor: withdrawn
                ? '#f87171'
                : isMatured
                ? '#22c55e'
                : '#eab308',
              textColor: '#fff',
              trailColor: '#4b5563',
            })}
          />
        </div>

        <div className="space-y-1">
          <p>
            ⏳ Time Left: <span className="font-mono">{timeLeft}</span>
          </p>
          <p>
            📈 Earnings: <span className="font-mono">{earnings.toFixed(4)} BNB</span>
          </p>
          <p>
            Status:{' '}
            <span className="font-semibold">
              {withdrawn ? 'Withdrawn' : isMatured ? 'Matured' : 'Active'}
            </span>
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-300 space-y-1">
        <p>Principal: {amount.toFixed(4)} BNB</p>
        <p>ROI: {roiPercent}% daily</p>
        {!isMatured && (
          <p>
            Early Fee ({feePercent}%): -{feeAmount.toFixed(4)} BNB
          </p>
        )}
        <p className="text-white font-semibold">
          Est. Payout: {finalPayout.toFixed(4)} BNB
        </p>
      </div>

      <button
        onClick={handleWithdraw}
        disabled={withdrawn || isLoading}
        className={`mt-4 px-5 py-2 rounded text-white transition-all duration-300 flex items-center justify-center gap-2 ${
          withdrawn || isLoading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {withdrawn
          ? 'Withdrawn'
          : isMatured
          ? 'Withdraw Now'
          : 'Withdraw Early'}
      </button>
    </div>
  );
}
