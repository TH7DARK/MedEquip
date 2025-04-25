'use client';

import RootLayout from '@/components/layout/RootLayout';
import ManutencaoFormContainer from './ManutencaoFormContainer';
import Providers from '@/lib/providers';

export default function NovaManutencaoPage({ searchParams }) {
  const equipamentoId = searchParams?.equipamento || null;
  
  return (
    <Providers>
      <RootLayout>
        <ManutencaoFormContainer equipamentoId={equipamentoId} />
      </RootLayout>
    </Providers>
  );
}
