import  { useState, createContext, useContext,type ReactNode } from 'react';
import caution_icon from '../assets/svgs/caution.svg'
import tick_icon from '../assets/svgs/tick.svg'

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] animate-fade-in-down font-sans">
          <div className={`px-6 py-3.5 rounded shadow-xl text-white text-[14px] font-bold tracking-wide flex items-center gap-3 min-w-[280px] border
            ${toast.type === 'success' 
              ? 'bg-emerald-600 border-emerald-500' 
              : 'bg-rose-600 border-rose-500'}`}
          >
            {toast.type === 'success' ? (
              <img className='h-7 w-7' src={tick_icon}/>
            ) : (
              <img className='h-7 w-7' src={caution_icon}/>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}