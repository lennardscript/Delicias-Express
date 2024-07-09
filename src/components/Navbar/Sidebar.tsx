import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark"
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        ></i>
        <a className="navbar-brand m-0" href="#">
          <span className="ms-1 font-weight-bold text-white">
            Delicias Express
          </span>
        </a>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div
        className="collapse navbar-collapse  w-auto "
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className={`nav-link text-white ${router.pathname === "/home" ? "bg-danger" : ""}`} href="/home">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">dashboard</i>
              </div>
              <span className="nav-link-text ms-1">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-white ${router.pathname === "/orders" ? "bg-danger" : ""}`} href="/orders">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">table_view</i>
              </div>
              <span className="nav-link-text ms-1">Ordenes</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-white ${router.pathname === "/invoices" ? "bg-danger" : ""}`} href="/invoices">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">receipt_long</i>
              </div>
              <span className="nav-link-text ms-1">Facturas</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white " href="/sig-in">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">login</i>
              </div>
              <span className="nav-link-text ms-1">Cerrar sesión</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
