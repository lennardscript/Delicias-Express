import { useRouter } from 'next/router';
import Login from './Login';

export default function DynamicRoute() {
  const router = useRouter();
  const { slug } = router.query;

  // Verificar si la ruta actual es '/'
  if (slug?.[0] === '') {
    // Redirigir a la ruta '/Login'
    void router.replace('/Login');
  }

  return (
    <>
      <Login />
    </>
  );
}
