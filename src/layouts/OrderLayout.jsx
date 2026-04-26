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
    <main>
      {isLoading && <LoadingBar />}
      <OrderHeader
        title={headerConfig.title}
        showBackButton={headerConfig.showBackButton}
        onBack={headerConfig.onBack}
      />
      <Outlet context={{ setIsModalOpen, isModalOpen, setHeaderConfig }} />
      <ScrollRestoration />
    </main>
  );
}
