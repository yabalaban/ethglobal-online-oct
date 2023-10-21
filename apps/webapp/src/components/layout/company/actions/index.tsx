import { getClaimed, getFunds, isCreatorContext, isInvestorContext } from '@/lib';
import { Company } from '@/lib/types';
import { useAccount } from 'wagmi';
import { InvestorActions } from './investor';
import { CreatorActions } from './creator';
import { ViewerActions } from './viewer';

export function Actions({
  company,
  onModifyAction,
}: {
  company: Company;
  onModifyAction: () => void;
}) {
  const { address } = useAccount();
  if (!address) {
    alert('hey');
    return <></>;
  }
  console.log(company);

  const funds = getFunds(company);
  const goal = Number(company.status.goal);
  const claimed = getClaimed(company);
  const isCreator = isCreatorContext(address, company);
  const isInvestor = isInvestorContext(address, company);
  const isViewer = !(isCreator || isInvestor);

  const funded = funds >= goal;
  const completed = claimed >= goal;

  const context = {
    company: company,
    funded: funded,
    completed: completed,
    onModifyAction: onModifyAction,
  };

  return (
    <>
      <div className="h-full w-full basis-full py-4 grow">
        {isViewer ? <ViewerActions context={context} /> : null}
        {isInvestor ? <InvestorActions context={context} /> : null}
        {isCreator ? <CreatorActions context={context} /> : null}
      </div>
    </>
  );
}

// <<<<<<< HEAD
// =======
//     <div className="flex row lg:flex-row lg:gap-1">
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={handleSaveClick}
//       >
//         Save
//       </button>
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={() => setIsInvestModalOpen(true)}
//       >
//         Invest
//       </button>
//       {isInvestModalOpen && (
//         <InvestModal onCancel={() => setIsInvestModalOpen(false)} onInvest={onInvest} />
//       )}
//     </div>
//   );
// }

// function InvestorActions({ company }: { company: Company }) {
//   const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

//   const chainId = useChainId();
//   const signer = useEthersSigner({ chainId });

//   function handlePromiseClick() {
//     console.log('promise', company);
//   }
//   function handleSafeClick() {
//     console.log('safe', company);
//   }

//   const onMessage = async (message: string) => {
//     if (!signer) {
//       alert('Connect wallet first');
//       return;
//     }
//     await xmtp.sendMessage(signer, message, company.creator.address);
//     setIsMessageModalOpen(false);
//     alert('Message has been sent');
//   };

//   return (
//     <div className="flex row lg:flex-row lg:gap-1">
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={handlePromiseClick}
//       >
//         Promise
//       </button>
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={handleSafeClick}
//       >
//         Safe
//       </button>
//       <button
//         type="button"
//         className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//         onClick={() => setIsMessageModalOpen(true)}
//       >
//         Message
//       </button>
//       {isMessageModalOpen && (
//         <MessageModal onCancel={() => setIsMessageModalOpen(false)} onMessage={onMessage} />
//       )}
//     </div>
//   );
// }

// function CreatorActions({ company }: { company: Company }) {
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

// export function Actions({
//   context,
// }: {
//   context: { investor: boolean; creator: boolean; company: Company };
// }) {
//   const justViewer = !context.investor && !context.creator;
//   return (
// >>>>>>> 6c4072e32e775d7ec1698ded2889c0f3d2d5a835
