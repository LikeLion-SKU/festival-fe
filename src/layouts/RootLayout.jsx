import { useState } from 'react';
import { useLocation, useNavigation } from 'react-router';
import { Outlet, ScrollRestoration } from 'react-router';

//import Navbar from "../commons/navbar";
// import Header from "../commons/Header";

export default function RootLayout() {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasToken = !!localStorage.getItem('accessToken');
  const hideNav = !hasToken && pathname === '/';
  const isLoading = navigation.state === 'loading';

  return (
    <main>
      {isLoading && <LoadingBar />}
      {/* <Header /> */}
      <Outlet context={{ onModalChange: setIsModalOpen }} />
      <ScrollRestoration />
      {!isModalOpen && !hideNav && <Navbar />}
    </main>
  );
}
