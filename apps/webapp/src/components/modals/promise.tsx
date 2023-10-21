import { useState } from 'react';
import { Modal } from './base';

const PromiseModal = ({
  onAssert,
  onCancel,
}: {
  onAssert: (assertion: string, amount: string) => void;
  onCancel: () => void;
}) => {
  const [amount, setAmount] = useState('');
  const [assertion, setAssertion] = useState('');
  const isDisabled = amount === '' || assertion === '';

  return (
    <Modal title="Post assertion to receive a tranche">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="border bg-white border-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="MVP is ready"
          value={assertion}
          onChange={(e) => setAssertion(e.target.value)}
        />
        <input
          type="text"
          className="border bg-white border-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="100 DAI"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          You will be asked to sign a company Safe transaction to post UMA assertion
        </p>
        <div className="flex gap-4">
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 ${
              isDisabled ? 'bg-gray-400 hover:bg-gray-400' : ''
            }`}
            onClick={() => !isDisabled && onAssert(assertion, amount)}
            disabled={isDisabled}
          >
            Assert
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PromiseModal;
