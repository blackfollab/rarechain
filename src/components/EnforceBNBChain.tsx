'use client';

import { useEffect } from 'react';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { switchChain } from 'wagmi/actions';
import { wagmiConfig } from '../../lib/wagmi/config';
import type { StreamProvider } from '@metamask/providers';

export function EnforceBNBChain() {
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) return;

    const enforceBNBChain = async () => {
      if (chainId === 56) return;

      alert('Only BNB Chain is supported. Attempting to switch...');

      try {
        await switchChain(wagmiConfig, { chainId: 56 });
      } catch (switchError: unknown) {
        console.error('Error switching chain:', switchError);

        const ethereum = window.ethereum as StreamProvider | undefined;

        if (ethereum?.request) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'BNB Smart Chain',
                  nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                  },
                  rpcUrls: ['https://bsc-dataseed.binance.org'],
                  blockExplorerUrls: ['https://bscscan.com'],
                },
              ],
            });

            await switchChain(wagmiConfig, { chainId: 56 });
          } catch (addChainError: unknown) {
            console.error('Error adding BNB chain:', addChainError);
            alert('BNB Chain not added or switch rejected. Disconnecting...');
            disconnect();
          }
        } else {
          alert('No Ethereum wallet found. Disconnecting...');
          disconnect();
        }
      }
    };

    enforceBNBChain();
  }, [chainId, isConnected, disconnect]);

  return null;
}