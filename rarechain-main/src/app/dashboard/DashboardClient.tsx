'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { investInPlan, getUserInvestments, withdrawInvestment } from '../../../utils/web3';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActiveInvestment from '@/components/ActiveInvestment';
import DashboardSummary from '@/components/DashboardSummary';
import { motion } from 'framer-motion';
import { useChainId, useSwitchChain } from 'wagmi';

interface UserInvestment {
  index: number;
  planId: number;
  amount: number;
  startTime: number;
  withdrawn: boolean;
  completed: boolean;
}

interface RawInvestment {
  planId: string;
  amount: string;
  startTime: string;
  withdrawn: boolean;
  completed: boolean;
}

interface Plan {
  name: string;
  days: number;
  roi: number;
  min: number;
  max: number;
  fee: number;
}

interface DashboardClientProps {
  picture?: string;
}

const plansMap: Record<number, Plan> = {
  1: { name: 'Master Node', days: 240, roi: 0.8, min: 100000, max: 180000, fee: 50 },
  2: { name: 'Full Node', days: 240, roi: 0.5, min: 50000, max: 99000, fee: 40 },
  3: { name: 'Validator Node', days: 365, roi: 0.4, min: 10000, max: 49999, fee: 40 },
  4: { name: 'Lightning Node', days: 365, roi: 0.3, min: 100, max: 9999, fee: 40 },
  5: { name: 'Uncle Blocks', days: 120, roi: 1, min: 200000, max: Infinity, fee: 40 },
};

export default function DashboardClient({ picture }: DashboardClientProps) {
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<number>(1);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [avatarSrc, setAvatarSrc] = useState(picture || '/icons/avatar.jpg');
  const [bnbPrice, setBnbPrice] = useState<number | null>(null);

  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const allowedChains = [56, 97]; // BNB Mainnet and Testnet

  const fetchInvestments = useCallback(async () => {
    if (!user?.wallet?.address) return;
    try {
      const inv: RawInvestment[] = await getUserInvestments(user.wallet.address);
      const mapped = inv.map((i: RawInvestment, idx: number): UserInvestment => ({
        index: idx,
        planId: Number(i.planId),
        amount: Number(i.amount) / 1e18,
        startTime: Number(i.startTime),
        withdrawn: i.withdrawn,
        completed: i.completed,
      }));
      setInvestments(mapped);
    } catch {
      toast.error('Failed to load investments');
    }
  }, [user]);

  const fetchBnbPrice = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
      const data = await res.json();
      setBnbPrice(data.binancecoin.usd);
    } catch {
      toast.error('Failed to fetch BNB price');
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    } else if (authenticated) {
      fetchInvestments();
    }
  }, [ready, authenticated, fetchInvestments, router]);

  useEffect(() => {
    fetchBnbPrice();
  }, []);

  const summary = investments.reduce(
    (acc, inv) => {
      const plan = plansMap[inv.planId];
      const roiTotal = inv.amount * (plan.roi / 100) * plan.days;
      acc.totalInvested += inv.amount;
      acc.totalROI += roiTotal;
      acc.totalWithdrawn += inv.withdrawn ? inv.amount + roiTotal : 0;
      return acc;
    },
    { totalInvested: 0, totalROI: 0, totalWithdrawn: 0 }
  );

  const handleInvest = async () => {
    const amountBNB = parseFloat(amount);
    if (!amount || isNaN(amountBNB) || amountBNB <= 0) {
      toast.warning('Enter a valid BNB amount');
      return;
    }

    const plan = plansMap[selectedPlan];
    if (!bnbPrice) {
      toast.error('BNB price not available. Please try again.');
      return;
    }

    const minBNB = plan.min / bnbPrice;
    const maxBNB = plan.max === Infinity ? Infinity : plan.max / bnbPrice;

    if (amountBNB < minBNB || (maxBNB !== Infinity && amountBNB > maxBNB)) {
      toast.warning(
        `Invalid amount for ${plan.name}. Enter between ${minBNB.toFixed(3)} - ${
          maxBNB === Infinity ? '∞' : maxBNB.toFixed(3)
        } BNB`
      );
      return;
    }

    const confirm = window.confirm(`Are you sure you want to activate with ${amountBNB} BNB in the ${plan.name} plan?`);
    if (!confirm) return;

    try {
      toast.info(`💰 Processing activation for ${plan.name}...`);
      await investInPlan(selectedPlan, amount);
      toast.success(`🎉 Successfully activated  ${plan.name} with ${amountBNB} BNB`);
      setAmount('');
      fetchInvestments();
    } catch {
      toast.error('Node Activation failed');
    }
  };

  const handleWithdraw = async (index: number) => {
    try {
      toast.info('Processing withdrawal...');
      await withdrawInvestment(index);
      toast.success('Withdrawal successful!');
      fetchInvestments();
    } catch {
      toast.error('Withdrawal failed');
    }
  };

  const shortenAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (ready && authenticated && !allowedChains.includes(chainId)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div className="p-6 bg-red-900 text-white rounded-lg max-w-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">Unsupported Network</h1>
          <p className="mb-4">
            Please switch your wallet to <strong>BNB Smart Chain</strong> (Mainnet).
          </p>
          <button
            onClick={() => switchChain({ chainId: 56 })}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Switch to BNB Mainnet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={4000} />

      {ready && authenticated && user && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={avatarSrc}
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full object-cover"
              onError={() => setAvatarSrc('/icons/avatar.jpg')}
            />
            <div>
              <p className="text-sm text-gray-300">Wallet Address:</p>
              <p className="font-semibold">{shortenAddress(user.wallet?.address)}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-green-600 text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      )}

      <DashboardSummary
        totalInvested={summary.totalInvested}
        totalROI={summary.totalROI}
        totalWithdrawn={summary.totalWithdrawn}
      />

      <h1 className="text-2xl font-bold mb-4 text-center">Select a Node Plan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {Object.entries(plansMap).map(([id, plan], idx) => {
          const isSelected = selectedPlan === Number(id);
          return (
            <motion.div
              key={id}
              onClick={() => setSelectedPlan(Number(id))}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-500 ${
                isSelected ? 'border-green-400 bg-green-800/10 shadow-md' : 'border-gray-700 hover:bg-gray-800/40'
              }`}
            >
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <p>📅 Duration: {plan.days} days</p>
              <p>📈 ROI: {plan.roi}% daily</p>
              <p>🔽 Min: ${plan.min.toLocaleString()} USD</p>
              <p>🔼 Max: {plan.max === Infinity ? '∞ USD' : `$${plan.max.toLocaleString()} USD`}</p>
              <p>💸 Early fee: {plan.fee}%</p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in BNB"
          className="p-2 rounded text-black w-full sm:w-64 bg-green-600"
        />
        <motion.button
          onClick={handleInvest}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition"
        >
          Acquire Node
        </motion.button>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Activation</h2>
      {investments.length === 0 ? (
        <p className="text-gray-400">No activations.</p>
      ) : (
        investments.map((inv: UserInvestment, i: number) => {
          const plan = plansMap[inv.planId];
          return (
            <ActiveInvestment
              key={inv.index}
              {...inv}
              durationDays={plan.days}
              roiPercent={plan.roi}
              onWithdraw={() => handleWithdraw(inv.index)}
            />
          );
        })
      )}

      <h2 className="text-xl font-bold mb-4 mt-10">Activation History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-800 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Amount (BNB)</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Rewards Date</th>
            </tr>
          </thead>
          <tbody className="text-white">
             {investments.map((inv: UserInvestment, i: number) => {

              const plan = plansMap[inv.planId];
              const status = inv.withdrawn ? 'Withdrawn' : inv.completed ? 'Matured' : 'Active';
              const maturityDate = new Date((inv.startTime + plan.days * 86400) * 1000).toLocaleDateString();
              const startDate = new Date(inv.startTime * 1000).toLocaleDateString();

              return (
                <tr
                  key={inv.index}
                  className="border-b border-gray-700 transition-all duration-300 hover:bg-gray-800/40 hover:scale-[1.005]"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{plan.name}</td>
                  <td className="px-4 py-3">{inv.amount.toFixed(4)}</td>
                  <td className="px-4 py-3">{startDate}</td>
                  <td className="px-4 py-3">{status}</td>
                  <td className="px-4 py-3">{status !== 'Active' ? maturityDate : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
