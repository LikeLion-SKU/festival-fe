import { useState } from 'react';
import { useNavigation } from 'react-router';
import { Outlet, ScrollRestoration } from 'react-router';

//import Navbar from "../commons/navbar";
// import Header from "../commons/Header";

export default function RootLayout() {
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = navigation.state === 'loading';

  return (
    <main>
      {isLoading && <LoadingBar />}
      {/* <Header /> */}
      <Outlet context={{ onModalChange: setIsModalOpen, isModalOpen: isModalOpen }} />
      <ScrollRestoration />
    </main>
  );
}
