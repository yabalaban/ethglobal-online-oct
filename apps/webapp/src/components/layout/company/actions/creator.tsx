import { useChainId } from 'wagmi';
import { ActionsContext } from './types';
import { useEthersSigner } from '@/web3/ethersViem';
import { useState } from 'react';
import { broadcastMessage } from '@/lib/xmtp';
import Link from 'next/link';
import { sendPush } from '@/lib/push';

function XMTPAction({ loading, onSubmit }: { loading: boolean; onSubmit: any }) {
  return (
    <div className="pt-2">
      {!loading ? (
        <button
          type="submit"
          name="xmtp"
          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={onSubmit}
        >
          Message
        </button>
      ) : (
        <button
          disabled
          name="xmtp"
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
          Sending..
        </button>
      )}
    </div>
  );
}

function MessagingActionForm({ context }: { context: ActionsContext }) {
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [message, setMessage] = useState('');

  const onMsg = async () => {
    if (!signer) {
      return;
    }
    setLoading(true);
    const broadcast = context.company.status.investments.map((inv) => inv.investor.address);
    await broadcastMessage(signer, message, broadcast);
    setLoading(false);
  };

  const onPush = async () => {
    if (!signer) {
      return;
    }
    setLoading2(true);
    await sendPush(signer as any, '[Update] ' + context.company.creator.address, message);
    setMessage('');
    alert('Push sent!');
    setLoading2(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-col lg:gap-1 w-full">
        <textarea
          id="message"
          rows={4}
          className="description bg-neutral-50 border border-neutral-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-800 dark:placeholder-neutral-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg"
          placeholder={
            'Hi there. Here is the place to notify your bakers using XMTP or Push protocol!'
          }
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <div className="flex flex-row lg:flex-row lg:gap-2">
          <div className="grow"></div>
          <div className="hover:underline self-center text-sm text-neutral-400 pr-2">
            <Link href="https://xmtp.chat/inbox" className="" target="_blank">
              Inbox
            </Link>
          </div>
          <div>
            <XMTPAction loading={loading} onSubmit={() => onMsg()} />
          </div>
          <div>
            <div className="pt-2">
              {!loading2 ? (
                <button
                  name="push"
                  className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  onClick={() => onPush()}
                >
                  Push
                </button>
              ) : (
                <button
                  name="push"
                  disabled
                  className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
                  Pushing..
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreatorActions({ context }: { context: ActionsContext }) {
  return (
    <div className="flex row lg:flex-row lg:gap-1 w-full">
      <MessagingActionForm context={context} />
    </div>
  );
}
