import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'add' | 'subtract'; 
  id: number;
}

const ButtonModal: React.FC<ModalProps> = ({ isOpen, onClose, type, id }) => {
  const [quantity, setQuantity] = useState<number>(75);
  const [description, setDescription] = useState<string>('');
  const snackbar = useSnackbar();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    console.log('Confirmed:', { quantity, description });
    let queryAmount = quantity
    if(type=='subtract'){
      queryAmount = -queryAmount;
    }
    const response = await fetch('/api/addBucks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, queryAmount, description }),
    })
    if(response.status==200){
      snackbar.enqueueSnackbar({
        message: 'Updated Successfully',
        variant: 'success',
        key: 'success',
        autoHideDuration: 3000
      })
    }
    else{
      const result = await response.json(); // Parse the JSON response

      snackbar.enqueueSnackbar({
        message:result.error || 'An error occurred',
        variant: 'error',
        key: 'error',
        autoHideDuration: 3000
      })
    }

    onClose();
    setQuantity(75);
    setDescription('');
  };

  // Determine label and button styles based on type
  const labelText = type === 'add' ? 'Bucks to add' : 'Bucks to subtract';
  const buttonClass = type === 'add' ? 'bg-blue-500' : 'bg-red-500';
  const buttonText = type === 'add' ? 'Add' : 'Subtract';
  const buttonPlaceholder = type === 'add' ? 'Ex: "Finished yellow belt 8/14"' : 'Ex: "Redeemed ninja headband 8/14"';
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Enter Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{labelText}</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            placeholder={buttonPlaceholder}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 mb-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`${buttonClass} text-white px-4 py-2 rounded`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonModal;
