import { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import Loading from '@/components/common/Loading';
import OrderHeader from '@/components/common/OrderHeader';

export default function AdminLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [headerConfig, setHeaderConfig] = useState({
    title: '',
    showBackButton: false,
    onBack: undefined,
  });

  return (
    <div className="bg-gray-50 h-full flex flex-col">
      <div className="relative mx-auto flex flex-col flex-1 w-full max-w-5xl h-full bg-white shadow-lg">
        {headerConfig.title && (
          <OrderHeader
            title={headerConfig.title}
            showBackButton={headerConfig.showBackButton}
            onBack={headerConfig.onBack}
          />
        )}
        <div className="min-h-0 flex-1">
          <Outlet context={{ setIsModalOpen, isModalOpen, setHeaderConfig, setIsLoading }} />
        </div>
        {isLoading && <Loading />}
      </div>
      <ScrollRestoration />
    </div>
  );
}
