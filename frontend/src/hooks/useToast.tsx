import  { useState, createContext, useContext,type ReactNode } from 'react';

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
              <svg className="w-5 h-5 shrink-0 toast-icon" viewBox="0 0 24 24">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5 shrink-0 toast-icon" viewBox="0 0 24 24">
                <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
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