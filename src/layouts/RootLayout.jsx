import { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

export default function RootLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <Outlet context={{ onModalChange: setIsModalOpen, isModalOpen: isModalOpen }} />
      </div>
      <ScrollRestoration />
    </main>
  );
}
