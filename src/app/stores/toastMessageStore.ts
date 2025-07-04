import { create } from 'zustand'
import { toast } from 'react-toastify';

/*
  A simple Zustand store for managing toast error message that changes when the selected language is changed
*/
interface ToastMessageStore {
  getMessage: () => string;
  setMessage: (fn: () => string) => void;
}

export const toastMessageStore = create<ToastMessageStore>((set) => ({
  getMessage: () => 'default message',
  setMessage: (fn) => set({ getMessage: fn }),
}));

export const setToastMessage = (message: string) => toastMessageStore.getState().setMessage(() => message);

export const toastOnError = (error: any) => {
  toast.error(toastMessageStore.getState().getMessage());
  
  console.error(error)
};