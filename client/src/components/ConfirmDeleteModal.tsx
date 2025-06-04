import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cropName: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, cropName }: ConfirmDeleteModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl transition-all">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Confirm Delete
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-gray-600">
              Are you sure you want to delete <strong>{cropName}</strong>?
            </Dialog.Description>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
