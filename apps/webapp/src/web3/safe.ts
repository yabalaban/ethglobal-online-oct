import SafeApiKit from '@safe-global/api-kit';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useEthersSigner } from './ethersViem';
import { Address } from 'viem';
import { WalletClient } from 'wagmi';
import { type MetaTransactionData } from '@safe-global/safe-core-sdk-types';

const TX_SERVICE_URLS: Record<number, string> = {
  1: 'https://safe-transaction-mainnet.safe.global',
  5: 'https://safe-transaction-goerli.safe.global',
  10: 'https://safe-transaction-optimism.safe.global',
  100: 'https://safe-transaction-gnosis-chain.safe.global',
};

export const useEthersAdapter = ({ chainId }: { chainId: number }) => {
  const signer = useEthersSigner({ chainId });

  return useMemo(
    () => (signer ? new EthersAdapter({ ethers, signerOrProvider: signer }) : undefined) as any,
    [signer],
  );
};

export const useSafeService = ({ chainId }: { chainId: number }) => {
  const ethAdapter = useEthersAdapter({ chainId });

  return useMemo(
    () =>
      ethAdapter
        ? new SafeApiKit({ txServiceUrl: TX_SERVICE_URLS[chainId], ethAdapter })
        : (undefined as any),
    [chainId, ethAdapter],
  );
};

export async function loadSafe({
  safeAddress,
  ethAdapter,
}: {
  safeAddress: Address;
  ethAdapter: EthersAdapter;
}): Promise<Safe> {
  return Safe.create({ ethAdapter, safeAddress });
}

export async function proposeSafeTransaction({
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
