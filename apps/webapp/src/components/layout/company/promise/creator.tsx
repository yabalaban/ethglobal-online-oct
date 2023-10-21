import { getCurrentGoal } from '@/lib';
import { ActionsContext } from '../actions/types';
import { useEthersSigner } from '@/web3/ethersViem';
import { useState } from 'react';
import { broadcastMessage } from '@/lib/xmtp';
import { loadSafe, proposeSafeTransaction, useEthersAdapter, useSafeService } from '@/web3/safe';
import Link from 'next/link';
import { encodeFunctionData, parseEther, toHex } from 'viem';
import { cryptoVcABI } from '@/web3/contracts';
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import { CRYPTO_VC_ADDRESS } from '@/web3/const';
import { useChainId, useWalletClient } from 'wagmi';
import { sendPush } from '@/lib/push';

function ClaimGoal() {
  return (
    <>
      <div className="text-sm dark:text-white/[80%]">
        There is no goal set yet, nudge the creator by sending the message below!
      </div>
    </>
  );
}

function CreateGoal({ loading }: { loading: boolean }) {
  return (
    <div className="pt-2">
      {!loading ? (
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Publish
        </button>
      ) : (
        <button
          disabled
          type="submit"
          className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 mr-2 text-white animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Publishing..
        </button>
      )}
    </div>
  );
}

function CreateGoalForm({ context }: { context: ActionsContext }) {
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: 'Hi there!',
  });

  const ethAdapter = useEthersAdapter({ chainId });
  const safeService = useSafeService({ chainId });
  const { data: walletClient } = useWalletClient();
  const safeAddress = context.company.status.safe;
  const safeLink = 'https://app.safe.global/transactions/queue?safe=gor:' + safeAddress!;

  const onChange = (e: any) => {
    const fieldName = e.target.id;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!signer || !walletClient) {
      alert('connect wallet first');
      return;
    }
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    const data = encodeFunctionData({
      abi: cryptoVcABI,
      functionName: 'requestTranche',
      args: [context.company.projectId, parseEther('10'), toHex(form.get('message') as string)],
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
        safeAddress: safeAddress,
      });

      await proposeSafeTransaction({
        tx,
        safe,
        safeService,
        walletClient,
      });

      window.open(safeLink, '_blank')?.focus();
      const msg =
        'New goal was published for ' +
        context.company.details!.name +
        '. Check details in safe: ' +
        safeAddress;
      const recepients = context.company.status.investments.map((inv) => inv.investor.address);
      await sendPush(walletClient as any, context.company.details?.name ?? 'New goal!', msg);
      await broadcastMessage(signer, msg, recepients);
      console.log('broadcasting', msg, recepients);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col lg:flex-col lg:gap-1 w-full">
        <textarea
          id="message"
          rows={4}
          className="description bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
          placeholder={'Time to set an ambitious goal and share it with your bakers!'}
          onChange={onChange}
        />
        <div className="flex flex-row lg:flex-row lg:gap-4">
          <div className="w-full h-full self-center ">
            <input
              type="number"
              id="amount"
              className="self-center description bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
              placeholder={'Claim Amount'}
              onChange={onChange}
            />
          </div>
          <div className="hover:underline self-center text-sm text-neutral-400 ">
            <Link href={safeLink} className="" target="_blank">
              Safe
            </Link>
          </div>
          <div>
            <CreateGoal loading={loading} />
          </div>
        </div>
      </div>
    </form>
  );
}

export function CreatorGoalView({ context }: { context: ActionsContext }) {
  const current = getCurrentGoal(context.company);

  if (!current) {
    return <CreateGoalForm context={context} />;
  } else {
    return <ClaimGoal />;
  }
}
