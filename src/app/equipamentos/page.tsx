'use client';

import RootLayout from '@/components/layout/RootLayout';
import EquipamentosListContainer from './EquipamentosListContainer';
import Providers from '@/lib/providers';

export default function EquipamentosPage() {
  return (
    <Providers>
      <RootLayout>
        <EquipamentosListContainer />
      </RootLayout>
    </Providers>
  );
}
