import { useState } from 'react';
import { Modal } from './base';

const InvestModal = ({
  onInvest,
  onCancel,
}: {
  onInvest: (value: string) => void;
  onCancel: () => void;
}) => {
  const [value, setValue] = useState('');
  const isDisabled = value === '';

  return (
    <Modal title="Invest">
      <div className="flex flex-col gap-4 ">
        <input
          type="text"
          className="border bg-white border-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="100 DAI"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 ${
              isDisabled ? 'bg-gray-400 hover:bg-gray-400' : ''
            }`}
            onClick={() => !isDisabled && onInvest(value)}
            disabled={isDisabled}
          >
            Invest
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

export default InvestModal;
