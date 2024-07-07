import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from './Login';
import { AppProps } from 'next/app';
import Layout from '@/components/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Verificar si la ruta actual no es '/Login'
    if (router.pathname !== '/Login') {
      // Redirigir a la ruta '/Login'
      void router.replace('/Login');
    }
  }, [router]);

  return (
    <>
    <Layout>
      <Login />
    </Layout>
    </>
  );
}
