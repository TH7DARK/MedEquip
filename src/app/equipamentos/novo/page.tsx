'use client';

import RootLayout from '@/components/layout/RootLayout';
import EquipamentoFormContainer from '@/app/equipamentos/EquipamentoFormContainerAI';
import Providers from '@/lib/providers';

export default function NovoEquipamentoPage() {
  return (
    <Providers>
      <RootLayout>
        <EquipamentoFormContainer />
      </RootLayout>
    </Providers>
  );
}
