import { useRouter } from "next/router";
import React from "react";

export default function Breadcrumb() {
  const router = useRouter();

  const getViewName = (pathname : any) => {
    switch (pathname) {
      case "/home":
        return "Home";
      case "/orders":
        return "Ordenes";
      case "/invoices":
        return "Facturas";
      default:
        return "Unknown";
    }
  };

  const viewName = getViewName(router.pathname);

  return (
    <>
      <div className="container my-5 d-flex justify-content-start ms-n8">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
            <li className="breadcrumb-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-house-door-fill"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
              </svg>
              <span className="visually-hidden">Home</span>
            </li>
            <li className="breadcrumb-item">
              <strong className="link-body-emphasis fw-semibold text-decoration-none">
                {viewName}
              </strong>
            </li>
          </ol>
        </nav>
      </div>
    </>
  );
}
