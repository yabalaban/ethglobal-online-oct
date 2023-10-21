import { globalStateAtom } from '@/lib';
import { Company } from '@/lib/types';
import { CRYPTO_VC_ADDRESS } from '@/web3/const';
import { cryptoVcABI } from '@/web3/contracts';
import { loadSafe, proposeSafeTransaction, useEthersAdapter, useSafeService } from '@/web3/safe';
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { encodeFunctionData, parseEther, toHex } from 'viem';
import { useChainId, useWalletClient } from 'wagmi';

function PromiseClaim({ amount }: { amount: number }) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-medium">Ongoing round: {amount} DAI</h1>
      </div>
    </>
  );
}

function PromiseDescription({ text }: { text: string }) {
  return (
    <>
      <div>
        <div className="mb-6 dark:text-white/[80%]">
          <p className="text-sm break-words">{text}</p>
        </div>
      </div>
    </>
  );
}

function ClaimAction({ company }: { company: Company }) {
  function handleClaimClick() {
    console.log('claim', company);
  }

  return (
    <div className="flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleClaimClick}
      >
        Claim
      </button>
    </div>
  );
}

function MakePromiseAction({ loading }: { loading: boolean }) {
  return (
    <div className="flex row lg:flex-row lg:gap-1">
      {!loading ? (
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Propose Goal
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
          Proposal goes brrr
        </button>
      )}
    </div>
  );
}

<button
  type="button"
  className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
>
  Make Promise
</button>;
function OngoingRound({ context }: { context: { company: Company } }) {
  const amount = 12;
  const text = 'export function UmaPromise({ context }: { context: { company: Company } }) {';
  return (
    <>
      <div className="flex flex-col lg:flex-col">
        <PromiseClaim amount={amount} />
        <PromiseDescription text={text} />
        <ClaimAction company={context.company} />
      </div>
    </>
  );
}

function NewRoundInput({ onChange }: { onChange: any }) {
  return (
    <>
      <div className="flex flex-col lg:flex-col lg:gap-2 pb-2">
        <input
          type="text"
          id="text"
          className="description bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
          placeholder={'Here goes the ambitious goal'}
          onChange={onChange}
        />
        <div className="flex flex-row lg:flex-row lg:gap-2">
          <div className="w-full">
            <input
              type="number"
              id="amount"
              className="description bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
              onChange={onChange}
              placeholder="Amount: 10"
            />
          </div>
          <div className="grow self-center text-sm">DAI</div>
        </div>
      </div>
    </>
  );
}

function CreateNewRound({ context }: { context: { company: Company } }) {
  const [formData, setFormData] = useState({
    text: "What's the current goal?",
    amount: '10',
  });
  const [loading, setLoading] = useState(false);

  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const ethAdapter = useEthersAdapter({ chainId });
  const safeService = useSafeService({ chainId });

  const onChange = (e: any) => {
    const fieldName = e.target.id;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = async (e: any) => {
    if (!walletClient) {
      return;
    }
    const safeAddress = context.company.status.safe;
    if (!safeAddress) {
      return;
    }

    e.preventDefault();
    setLoading(true);

    const data = encodeFunctionData({
      abi: cryptoVcABI,
      functionName: 'requestTranche',
      args: [context.company.projectId, parseEther(formData.amount), toHex(formData.text)],
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

      window
        .open('https://app.safe.global/transactions/queue?safe=gor:' + safeAddress, '_blank')
        ?.focus();
    } catch (e: any) {
      console.log(e);
      alert(e.reason ?? e.message);
    }

    console.log(formData);
    setLoading(false);
  };

  //   const { writeAsync: createProject } = useCryptoVcCreateProject({
  //     address: CRYPTO_VC_ADDRESS,
  //     gas: 3000000n,
  //     value: parseEther('0.001'),
  //   });

  return (
    <>
      <div className="flex flex-col lg:flex-col">
        <form onSubmit={onSubmit}>
          <NewRoundInput onChange={onChange} />
          <MakePromiseAction loading={loading} />
        </form>
      </div>
    </>
  );
}

export function UmaPromise({ context }: { context: { company: Company } }) {
  const promise = context.company.status.promise;
  const hasPromise = promise !== null;
  return (
    <>
      <div className="grid justify-items-start w-full py-2">
        {hasPromise ? <OngoingRound context={context} /> : <CreateNewRound context={context} />}
      </div>
    </>
  );
}

// function PromiseActions({ company }: { company: Company }) {
//   const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false);

//   const chainId = useChainId();
//   const { data: walletClient } = useWalletClient();

//   const ethAdapter = useEthersAdapter({ chainId });
//   const safeService = useSafeService({ chainId });

//   const onAssert = async (assertion: string, amount: string) => {
//     if (!walletClient) {
//       alert('Connect wallet first');
//       return;
//     }

//     const data = encodeFunctionData({
//       abi: cryptoVcABI,
//       functionName: 'requestTranche',
//       args: [company.projectId, parseEther(amount), toHex(assertion)],
//     });
//     const tx: MetaTransactionData = {
//       to: CRYPTO_VC_ADDRESS,
//       data,
//       value: '0',
//       operation: OperationType.Call,
//     };

//     try {
//       const safe = await loadSafe({
//         ethAdapter,
//         safeAddress: company.status.safe,
//       });

//       await proposeSafeTransaction({
//         tx,
//         safe,
//         safeService,
//         walletClient,
//       });
//       setIsPromiseModalOpen(false);
//     } catch (e: any) {
//       console.log(e);
//       alert(e.reason ?? e.message);
//     }
//   };

//   function handleClaimClick() {
//     console.log('claim', company);
//   }
//   function handleSendPushClick() {
//     console.log('send push', company);
//   }

//   return (
//     <div className="flex row lg:flex-row lg:gap-1">
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={() => setIsPromiseModalOpen(true)}
//       >
//         Make Promise
//       </button>
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={handleClaimClick}
//       >
//         Claim
//       </button>
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={handleSendPushClick}
//       >
//         Send Push
//       </button>
//       {isPromiseModalOpen && (
//         <PromiseModal onCancel={() => setIsPromiseModalOpen(false)} onAssert={onAssert} />
//       )}
//     </div>
//   );
// }
