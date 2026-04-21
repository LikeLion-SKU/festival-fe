import { Outlet, ScrollRestoration, useNavigation } from 'react-router';

export default function ServiceLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
      {isLoading && <LoadingBar />}
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
