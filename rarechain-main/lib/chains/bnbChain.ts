
import { defineChain } from 'viem'

export const bnbChain = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  network: 'binance-smart-chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed.binance.org'],
      webSocket: ['wss://bsc-ws-node.nariox.org:443'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
    },
  },
});
