'use client';
import Link from 'next/link';
import Logo from '../../logo';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getMenu } from '@/lib/cryptovc';
import { Menu } from './menu';

import { Button } from '@nextui-org/react';
import { WalletClient, useChainId, useWalletClient } from 'wagmi';
import { loadSafe, useEthersAdapter, useSafeService } from '@/web3/safe';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { encodeFunctionData, toHex } from 'viem';
import { cryptoVcABI } from '@/web3/contracts';
import { CRYPTO_VC_ADDRESS } from '@/web3/const';
import { type MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';

async function proposeSafeTransaction({
  tx,
  safe,
  walletClient,
  safeService,
}: {
  tx: MetaTransactionData;
  safe: Safe;
  walletClient: WalletClient;
  safeService: SafeApiKit;
}) {
  const safeTx = await safe.createTransaction({ safeTransactionData: tx });
  const safeTxHash = await safe.getTransactionHash(safeTx);
  const { data: senderSignature } = await safe.signTransactionHash(safeTxHash);

  await safeService.proposeTransaction({
    safeTxHash,
    senderSignature,
    safeAddress: await safe.getAddress(),
    safeTransactionData: safeTx.data,
    senderAddress: walletClient.account.address,
  });
}

export default function Navbar() {
  const menu = getMenu();

  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const ethAdapter = useEthersAdapter({ chainId });
  const safeService = useSafeService({ chainId });

  const onClickPropose = async () => {
    if (!walletClient) {
      alert('Not connected');
      return;
    }

    const data = encodeFunctionData({
      abi: cryptoVcABI,
      functionName: 'requestTranche',
      args: [
        // TODO: actual project id
        '0x627c1989794a85c78742c584f8b3feb01486589b073c7321b1dc317b6caafb9f',
        // TODO: actual sum
        100n * 10n ** 18n,
        // TODO: actual text
        toHex('MVP is ready!'),
      ],
    });
    const tx: MetaTransactionData = {
      to: CRYPTO_VC_ADDRESS,
      data,
      value: '0',
      operation: OperationType.Call,
    };

    // TODO: use actual safe address
    const safe = await loadSafe({
      ethAdapter,
      safeAddress: '0x1d01d5a9bcAd80eA81494D0E7f2ea5AF593b066b',
    });

    await proposeSafeTransaction({
      tx,
      safe,
      safeService,
      walletClient,
    });
  };

  return (
    <nav className="relative flex items-center border-b border-neutral-200 dark:border-neutral-700 justify-between p-4 lg:px-6">
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <Logo />
            <div className="ml-2 flex-none text-sm font-medium md:hidden lg:block">CryptoVC</div>
          </Link>
          <Menu items={menu} />
        </div>
        <div className="md:ml-auto flex-row flex">
          <Button onPress={() => onClickPropose()}>Propose</Button>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
