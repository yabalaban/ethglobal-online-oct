import { ActionsContext } from './types';

export function InvestorActions({ context }: { context: ActionsContext }) {
  function handlePromiseClick() {
    console.log('promise', context);
  }
  function handleSafeClick() {
    console.log('safe', context);
  }
  function handleMessageClick() {
    console.log('message', context);
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
