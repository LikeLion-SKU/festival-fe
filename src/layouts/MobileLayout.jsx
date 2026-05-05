import { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import Loading from '@/components/common/Loading';

export default function MobileLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="flex h-full flex-col">
      <div className="bg-gray-50 min-h-0 flex-1">
        <div className="relative mx-auto w-full max-w-112.5 h-full bg-white shadow-lg">
          <Outlet context={{ onModalChange: setIsModalOpen, isModalOpen, setIsLoading }} />
          {isLoading && <Loading />}
        </div>
      </div>
      <ScrollRestoration />
    </main>
  );
}
