import InvestModal from '@/components/modals/invest';
import PromiseModal from '@/components/modals/promise';
import { Company } from '@/lib/types';
import { CRYPTO_VC_ADDRESS } from '@/web3/const';
import { cryptoVcABI, useCryptoVcFundProject } from '@/web3/contracts';
import { loadSafe, proposeSafeTransaction, useEthersAdapter, useSafeService } from '@/web3/safe';
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import { useState } from 'react';
import { encodeFunctionData, parseEther, toHex } from 'viem';
import { useChainId, usePublicClient, useWalletClient } from 'wagmi';

function ViewerActions({ company }: { company: Company }) {
  const { writeAsync: fundProject } = useCryptoVcFundProject({
    address: CRYPTO_VC_ADDRESS,
    gas: 3000000n,
  });
  const publicClient = usePublicClient();

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  function handleSaveClick() {
    console.log('save', company);
  }

  const onInvest = async (value: string) => {
    try {
      const tx = await fundProject({ args: [company.projectId, parseEther(value)] });
      setIsInvestModalOpen(false);
      await publicClient.waitForTransactionReceipt(tx);
      // TODO: reload something?
    } catch (e: any) {
      console.log(e);
      alert(e.reason ?? e.message);
    }
  };

  return (
    <div className="flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSaveClick}
      >
        Save
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => setIsInvestModalOpen(true)}
      >
        Invest
      </button>
      {isInvestModalOpen && (
        <InvestModal onCancel={() => setIsInvestModalOpen(false)} onInvest={onInvest} />
      )}
    </div>
  );
}

function InvestorActions({ company }: { company: Company }) {
  function handlePromiseClick() {
    console.log('promise', company);
  }
  function handleSafeClick() {
    console.log('safe', company);
  }
  function handleMessageClick() {
    console.log('message', company);
  }

  return (
    <div className="flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handlePromiseClick}
      >
        Promise
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSafeClick}
      >
        Safe
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleMessageClick}
      >
        Message
      </button>
    </div>
  );
}

function CreatorActions({ company }: { company: Company }) {
  const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false);

  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const ethAdapter = useEthersAdapter({ chainId });
  const safeService = useSafeService({ chainId });

  const onAssert = async (assertion: string, amount: string) => {
    if (!walletClient) {
      alert('Connect wallet first');
      return;
    }

    const data = encodeFunctionData({
      abi: cryptoVcABI,
      functionName: 'requestTranche',
      args: [company.projectId, parseEther(amount), toHex(assertion)],
    });
    const tx: MetaTransactionData = {
      to: CRYPTO_VC_ADDRESS,
      data,
      value: '0',
      operation: OperationType.Call,
    };

    try {
      const safe = await loadSafe({
        ethAdapter,
        safeAddress: company.status.safe,
      });

      await proposeSafeTransaction({
        tx,
        safe,
        safeService,
        walletClient,
      });
      setIsPromiseModalOpen(false);
    } catch (e: any) {
      console.log(e);
      alert(e.reason ?? e.message);
    }
  };

  function handleClaimClick() {
    console.log('claim', company);
  }
  function handleSendPushClick() {
    console.log('send push', company);
  }

  return (
    <div className="flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => setIsPromiseModalOpen(true)}
      >
        Make Promise
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleClaimClick}
      >
        Claim
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSendPushClick}
      >
        Send Push
      </button>
      {isPromiseModalOpen && (
        <PromiseModal onCancel={() => setIsPromiseModalOpen(false)} onAssert={onAssert} />
      )}
    </div>
  );
}

export function Actions({
  context,
}: {
  context: { investor: boolean; creator: boolean; company: Company };
}) {
  const justViewer = !context.investor && !context.creator;
  return (
    <>
      <div className="h-full w-full basis-full py-4 grow">
        {justViewer ? <ViewerActions company={context.company} /> : null}
        {context.investor ? <InvestorActions company={context.company} /> : null}
        {context.creator ? <CreatorActions company={context.company} /> : null}
      </div>
    </>
  );
}
