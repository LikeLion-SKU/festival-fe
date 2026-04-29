import { useState } from 'react';
import { useNavigation } from 'react-router';
import { Outlet, ScrollRestoration } from 'react-router';

import LoadingIcon from '@/assets/icons/loading_icon.svg?react';
import OrderHeader from '@/components/common/OrderHeader';

export default function OrderLayout() {
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerConfig, setHeaderConfig] = useState({
    title: '',
    showBackButton: false,
    onBack: undefined,
  });

  const isLoading = navigation.state === 'loading';

  return (
    <main className="relative flex h-full flex-col ">
      <OrderHeader
        title={headerConfig.title}
        showBackButton={headerConfig.showBackButton}
        onBack={headerConfig.onBack}
      />
      <div className="min-h-0 flex-1">
        <Outlet context={{ setIsModalOpen, isModalOpen, setHeaderConfig }} />
      </div>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
          <LoadingIcon />
        </div>
      )}
      <ScrollRestoration />
    </main>
  );
}
