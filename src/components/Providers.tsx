'use client';

import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../../lib/wagmi/config';
import { bsc } from 'wagmi/chains';
// import { bsc , bscTestnet} from 'wagmi/chains';

import React from 'react';

const queryClient = new QueryClient();

export default function PrivyProviderB({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        clientId={process.env.PRIVY_APP_SECRET || ''}
        config={{
          loginMethods: ['wallet'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo:
              'https://jade-imperial-hawk-534.mypinata.cloud/ipfs/bafkreibqukksuhirpe7u7gygdiejqcc74w74m5dlxv2kmpx5jf7ai52sfi',
          },
          defaultChain: bsc,
          supportedChains: [bsc],
          // supportedChains: [bsc, bscTestnet],

        }}
      >
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}
