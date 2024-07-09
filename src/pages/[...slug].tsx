import { useRouter } from "next/router";
import Login from "./auth/login";
import Register from "./auth/register";

export default function DynamicRoute() {
  const router = useRouter();
  const { slug } = router.query;

  console.log(slug);

  // Renderiza el componente correspondiente a la ruta
  if (slug?.[0] === "sign-up") {
    return <Register />;
  } else if (slug?.[0] === "sign-in") {
    return <Login />;
  } else {
    // Si la ruta no coincide con ninguna de las anteriores, puedes redirigir a la página de inicio de sesión por defecto
    return <Login />;
  }
}
