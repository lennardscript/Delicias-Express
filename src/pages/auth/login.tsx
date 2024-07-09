import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos, es obligatorio",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Lógica de iniciar sesión
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password)
      
      //Redireccionar al home
      router.push("/home");
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente",
        confirmButtonText: "Continuar",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Correo o contraseña incorrectas, intentalo de nuevo",
        confirmButtonText: "Aceptar",
      })
    }
  };

  return (
    <>
      <Head>
        <title>Delicias Express | Inicio de sesión</title>
      </Head>
      <main className="main-content mt-0">
        <div className="page-header align-items-start min-vh-100">
          <div className="container my-auto">
            <div className="row">
              <div className="col-lg-4 col-md-8 col-12 mx-auto">
                <div className="card z-index-0 fadeIn3 fadeInBottom">
                  <div className="card-header p-0 position-relative mt-n4 mx-3">
                    <div className="bg-danger shadow-primary border-radius-lg py-3 pe-1">
                      <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                        Iniciar sesión
                      </h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <form role="form">
                      <div className="form-floating mb-4 fade show">
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="floatingInputEmail"
                          placeholder="Correo"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="floatingInputEmail">Correo</label>
                      </div>
                      <div className="form-floating mb-3 fade show">
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          id="floatingInputPassword"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingInputPassword">
                          Contraseña
                        </label>
                      </div>
                    </form>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn bg-danger text-white w-100 my-4 mb-2"
                        onClick={handleLogin}
                      >
                        Iniciar sesión
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-center">
                      ¿No te has registrado?
                      <Link
                        href="/sign-up"
                        className="text-danger text-gradient font-weight-bold px-1"
                      >
                        Registrate
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
