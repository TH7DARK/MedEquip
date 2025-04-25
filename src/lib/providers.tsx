'use client';

import { ReactNode } from 'react';
import ThemeProvider from '@/lib/theme-provider';
import { EquipamentoProvider } from '@/lib/contexts/EquipamentoContext';
import { ManutencaoProvider } from '@/lib/contexts/ManutencaoContext';
import { AlertaProvider } from '@/lib/contexts/AlertaContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <EquipamentoProvider>
        <ManutencaoProvider>
          <AlertaProvider>
            {children}
          </AlertaProvider>
        </ManutencaoProvider>
      </EquipamentoProvider>
    </ThemeProvider>
  );
}
