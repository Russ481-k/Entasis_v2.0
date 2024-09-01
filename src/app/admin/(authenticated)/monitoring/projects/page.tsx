'use client';

import { Suspense } from 'react';

import PageAdminProjects from '@/features/monitoring/PageProjects';

export default function Page() {
  return (
    <Suspense>
      <PageAdminProjects />
    </Suspense>
  );
}
