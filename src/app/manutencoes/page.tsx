'use client';

import RootLayout from '@/components/layout/RootLayout';
import ManutencoesListContainer from './ManutencoesListContainer';
import Providers from '@/lib/providers';

export default function ManutencoesPage() {
  return (
    <Providers>
      <RootLayout>
        <ManutencoesListContainer />
      </RootLayout>
    </Providers>
  );
}
