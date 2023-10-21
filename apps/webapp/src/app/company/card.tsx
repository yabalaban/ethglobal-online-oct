'use client';

import { ipfsStorage } from '@/lib/storage';
import { Company } from '@/lib/types';
import { CRYPTO_VC_ADDRESS } from '@/web3/const';
import { useCryptoVcCreateProject } from '@/web3/contracts';
import React, { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';
import { Details } from '@/components/layout/company/details';
import { Progress } from '@/components/layout/company/progress';
import { Actions } from '@/components/layout/company/actions';
import { Section } from '@/components/layout/section';
import { UmaPromise } from '@/components/layout/company/promise';

export function Card({ company }: { company: Company }) {
  const { address } = useAccount();
  const creator = company.creator.address === address?.toLowerCase();
  const investor =
    company.status.investments.find((inv) => inv.investor.address === address?.toLowerCase()) !=
    null;

  const details = {
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
          <Section component={<Details details={details} />} />
          <Section component={<Progress company={company} />} />
          {creator ? <Section component={<UmaPromise context={context} />} /> : null}
          <Actions company={company} />
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

export function CreateCard({
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
