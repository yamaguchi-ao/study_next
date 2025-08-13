"use client"

import { ToastContainer } from "react-toastify";
import '@/lib/toast.css';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        pauseOnHover={false}
        closeOnClick={true} />
    </>
  );
}