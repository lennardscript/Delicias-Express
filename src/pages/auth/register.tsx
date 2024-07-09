import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {

    // Verificar si algún campo está vacío

    if (!name || !email || !phone || !address || !password) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos, es obligatorio",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Si las contraseñas no coinciden, mostrar un mensaje de error

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Aceptar",
      })
      return;
    }

    // Lógica de registro

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        phone: phone,
        address: address,
      });

      //Redireccionar al home
      router.push("/home");

      Swal.fire({
        title: "Registro exitoso",
        text: "Ahora puedes iniciar sesión",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.log("Error registrando usuario: ", error);

      Swal.fire({
        title: "Error",
        text: "No se pudo registrar el usuario",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Delicias Express | Registro</title>
      </Head>
      <main className="main-content  mt-0">
        <section>
          <div className="page-header min-vh-100">
            <div className="container">
              <div className="row">
                <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                  <div
                    className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
                    style={{
                      backgroundImage:
                        "url('../assets/img/delicias-express-high-logo2.png')",
                      backgroundSize: "120% 100%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "30% center",
                    }}
                  ></div>
                </div>
                <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                  <div className="card card-plain">
                    <div className="card-header">
                      <h4 className="font-weight-bolder">Registrese</h4>
                      <p className="mb-0">
                        Rellene todos los campos para registrarse
                      </p>
                    </div>
                    <div className="card-body">
                      <form role="form">
                        <div className="form-floating mb-3 fade show">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="floatingInputName"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <label
                            className="form-label"
                            htmlFor="floatingInputName"
                          >
                            Nombre
                          </label>
                        </div>
                        <div className="form-floating mb-3 fade show">
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            id="floatingInputEmail"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label
                            className="form-label"
                            htmlFor="floatingInputEmail"
                          >
                            Correo
                          </label>
                        </div>
                        <div className="form-floating mb-3 fade show">
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            id="floatingInputPhone"
                            placeholder="Telefono"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          <label
                            className="form-label"
                            htmlFor="floatingInputPhone"
                          >
                            Telefono
                          </label>
                        </div>
                        <div className="form-floating mb-3 fade show">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="floatingInputAddress"
                            placeholder="Dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <label
                            className="form-label"
                            htmlFor="floatingInputAddress"
                          >
                            Dirección
                          </label>
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
                          <label
                            className="form-label"
                            htmlFor="floatingInputPassword"
                          >
                            Contraseña
                          </label>
                        </div>
                        <div className="form-floating mb-3 fade show">
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            id="floatingInputConfirmPassword"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <label
                            className="form-label"
                            htmlFor="floatingInputConfirmPassword"
                          >
                            Confirmar contraseña
                          </label>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-lg bg-danger btn-lg w-100 mt-4 mb-0 text-white"
                            onClick={handleRegister}
                          >
                            Registrarse
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-center pt-0">
                      <p className="mb-2 text-sm mx-auto p-1">
                        ¿Ya te has registrado?
                        <Link
                          href="/sign-in"
                          className="text-danger text-gradient font-weight-bold px-1"
                        >
                          Inicie sesión
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
