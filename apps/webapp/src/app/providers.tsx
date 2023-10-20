'use client';
import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { frameWallet, safeWallet } from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli } from 'viem/chains';
import { publicProvider } from 'wagmi/providers/public';
import { gs } from '@/lib';
import { NextUIProvider } from '@nextui-org/react';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : [])],
  [publicProvider()],
);

const projectId = '349bd428e75cb1edf6e0a7f01c55dcae';

const { wallets } = getDefaultWallets({
  appName: 'CryptoVC',
  projectId,
  chains,
});

const appInfo = {
  appName: 'CryptoVC',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [safeWallet({ chains }), frameWallet({ projectId, chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
(async () => {
  await gs.prepare();
})();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo}>
        <NextUIProvider>{children}</NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
