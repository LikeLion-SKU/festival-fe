import { useState } from 'react';
import { useNavigation } from 'react-router';
import { Outlet, ScrollRestoration } from 'react-router';

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
    <main className="flex h-full flex-col">
      {isLoading && <LoadingBar />}
      <OrderHeader
        title={headerConfig.title}
        showBackButton={headerConfig.showBackButton}
        onBack={headerConfig.onBack}
      />
      <div className="min-h-0 flex-1">
        <Outlet context={{ setIsModalOpen, isModalOpen, setHeaderConfig }} />
      </div>
      <ScrollRestoration />
    </main>
  );
}
