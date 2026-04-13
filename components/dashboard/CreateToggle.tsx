'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type CreateToggleContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
};

const CreateToggleContext = createContext<CreateToggleContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  open: () => {},
});

export function CreateToggleProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(p => !p), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);
  return (
    <CreateToggleContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </CreateToggleContext.Provider>
  );
}

export function useCreateToggle() {
  return useContext(CreateToggleContext);
}

export function CreateToggleButton({ label }: { label: string }) {
  const { isOpen, toggle } = useCreateToggle();
  return (
    <button
      onClick={toggle}
      className={`cursor-pointer rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ${
        isOpen
          ? 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-navy'
          : 'bg-navy text-white hover:bg-navy/85'
      }`}
    >
      {isOpen ? 'ביטול' : label}
    </button>
  );
}
