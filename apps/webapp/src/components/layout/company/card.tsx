'use client';

import { ipfsStorage } from '@/lib/storage';
import { Company, Person } from '@/lib/types';
import { CRYPTO_VC_ADDRESS } from '@/web3/const';
import { useCryptoVcCreateProject, useCryptoVcFundProject } from '@/web3/contracts';
import clsx from 'clsx';
import React, { useState } from 'react';
import { getAddress, parseEther } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';
import { useChainId, useWalletClient } from 'wagmi';
import { loadSafe, proposeSafeTransaction, useEthersAdapter, useSafeService } from '@/web3/safe';
import { encodeFunctionData, toHex } from 'viem';
import { cryptoVcABI } from '@/web3/contracts';
import { type MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import InvestModal from '@/components/modals/invest';
import PromiseModal from '@/components/modals/promise';

// Company detailsss

function Name({ name }: { name: string }) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-medium">{name}</h1>
      </div>
    </>
  );
}

function Description({ description }: { description: string }) {
  return (
    <>
      <div>
        <div className="mb-6 dark:text-white/[80%]">
          <p className="text-sm break-words">{description}</p>
        </div>
      </div>
    </>
  );
}

function Info({ info }: { info: { name: string; description: string } }) {
  return (
    <>
      <Name name={info.name} />
      <Description description={info.description} />
    </>
  );
}

// Progress

export function ProgressLabel({
  progress,
  compact,
}: {
  progress: { actual: number; goal: string; currency: string };
  compact: boolean;
}) {
  return (
    <div className={clsx('flex flex-row lg:gap-1 items-baseline', { 'pb-4': !compact })}>
      <div>
        <p className={clsx('font-medium', { 'text-4xl': !compact, 'text-sm': compact })}>
          {progress.actual} {progress.currency}
        </p>
      </div>
      <div>
        <p
          className={clsx('font-light dark:text-white/[80%]', {
            'text-xl': !compact,
            'text-sm': compact,
          })}
        >
          raised of {progress.goal} {progress.currency}
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ ratio }: { ratio: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
      <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: ratio + '%' }}></div>
    </div>
  );
}

function ProgressInfo({ progress }: { progress: { investors: Person[] } }) {
  return (
    <>
      <div className="grid justify-items-start w-full pt-2">
        {progress.investors.length > 0 ? (
          <div>
            <div className="font-light text-sm">
              Funded by {progress.investors.length} investors:
            </div>
            <div>
              <ul className="list-disc">
                {progress.investors.map((investor, i) => (
                  <li className="font-light text-xs dark:text-white/[80%]" key={i}>
                    {investor.address}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>Become the first investor! 🚀🚀🚀</div>
        )}
      </div>
    </>
  );
}

function Promise({ context }: { context: { progress: { investors: Person[] } } }) {
  console.log(context);
  return (
    <>
      <div className="grid justify-items-start w-full pt-2">
        <div>Become the first investor! 🚀🚀🚀</div>
      </div>
    </>
  );
}

function Progress({
  context,
}: {
  context: {
    creator: boolean;
    progress: { actual: number; goal: string; currency: string; investors: Person[] };
  };
}) {
  const progress = context.progress;
  const ratio = Math.trunc((progress.actual / Number(progress.goal)) * 100);
  return (
    <div className="py-4">
      <ProgressLabel progress={progress} compact={false} />
      <ProgressBar ratio={ratio} />
      {!context.creator ? <ProgressInfo progress={progress} /> : null}
    </div>
  );
}

// Actions

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
      await publicClient.waitForTransactionReceipt(tx);
      setIsInvestModalOpen(false);
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
      to: getAddress(CRYPTO_VC_ADDRESS),
      data,
      value: '0',
      operation: OperationType.Call,
    };

    try {
      const safe = await loadSafe({
        ethAdapter,
        safeAddress: getAddress(company.status.safe),
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
      {company.status?.safe !== '0x0' && (
        <button
          type="button"
          className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={() => setIsPromiseModalOpen(true)}
        >
          Request a tranche
        </button>
      )}
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

function Actions({
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

// Utils

function Section({ component }: { component: any }) {
  return (
    <>
      <div className={clsx('border-b dark:border-neutral-700 w-full')}>{component}</div>
    </>
  );
}

export function Card({ company }: { company: Company }) {
  const { address } = useAccount();
  const creator = company.creator.address === address?.toLowerCase();
  const investor =
    company.status.investments.find((inv) => inv.investor.address === address?.toLowerCase()) !=
    null;

  const info = {
    name: company.details?.name ?? '<name>',
    description: company.details?.description ?? '<details>',
  };
  const progress = {
    goal: company.status.goal,
    actual: company.status.investments.reduce((acc, inv) => acc + inv.amount, 0),
    currency: 'DAI',
    investors: company.status.investments.map((inv) => inv.investor),
  };
  const context = {
    investor: investor,
    creator: creator,
    company: company,
    progress: progress,
  };

  return (
    <>
      <div className="bg-white dark:border-neutral-900 shadow-xl dark:bg-neutral-800 rounded-lg border border-neutral-200 h-full w-full pb-4">
        <div className="flex flex-col lg:flex-col items-center justify-center px-8 py-4">
          <Section component={<Info info={info} />} />
          <Section component={<Progress context={context} />} />
          {creator ? <Section component={<Promise context={context} />} /> : null}
          <Actions context={context} />
        </div>
      </div>
    </>
  );
}

function Input({
  prefill,
  formData,
  onChange,
}: {
  prefill: { name: string; description: string };
  formData: any;
  onChange: any;
}) {
  return (
    <>
      <div className="w-full p-4">
        <div className="py-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="name bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
            placeholder={prefill.name}
            onChange={onChange}
          />
        </div>
        <div className="py-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="description bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
            defaultValue={formData.description}
            onChange={onChange}
          />
        </div>
        <div className="py-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Goal
          </label>
          <div className="flex justify-self-center align-center flex-row lg:flex-row lg:gap-2">
            <div className="w-20">
              <input
                type="number"
                id="goal"
                className="goal bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
                onChange={onChange}
                placeholder={formData.goal}
              />
            </div>
            <div className="grow self-center text-xl">DAI</div>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateAction({ loading }: { loading: boolean }) {
  return (
    <div className="w-full p-4">
      {!loading ? (
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Create
        </button>
      ) : (
        <button
          disabled
          type="submit"
          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
          Creating...
        </button>
      )}
    </div>
  );
}

export function NewCard({
  prefill,
}: {
  prefill: { image: string; name: string; description: string };
}) {
  const [formData, setFormData] = useState({
    name: prefill.name,
    description: prefill.description,
    goal: '1000',
  });
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();
  const [globalState] = useAtom(globalStateAtom);

  const onChange = (e: any) => {
    const fieldName = e.target.id;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const { writeAsync: createProject } = useCryptoVcCreateProject({
    address: CRYPTO_VC_ADDRESS,
    gas: 3000000n,
    value: parseEther('0.001'),
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    const details = {
      name: data.get('name') as string,
      description: data.get('description') as string,
      image: prefill.image,
      goal: data.get('goal') as string,
    };
    const cid = await ipfsStorage.store(details);
    try {
      const tx = await createProject({
        args: [cid, BigInt(parseEther(formData.goal))],
      });
      await publicClient.waitForTransactionReceipt(tx);
      const company = await globalState.fetchNewCompany(cid, details);
      window.location.replace(`/company/${company.projectId}`);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white dark:border-neutral-900 shadow-xl dark:bg-neutral-800 rounded-lg border border-neutral-200 h-full w-full pb-4">
        <div className="flex flex-col lg:flex-col items-center justify-center px-8 py-4">
          <form className="w-full" onSubmit={onSubmit}>
            <Section
              component={<Input prefill={prefill} formData={formData} onChange={onChange} />}
            />
            <CreateAction loading={loading} />
          </form>
        </div>
      </div>
    </>
  );
}
