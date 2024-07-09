import React from "react";

export default function Footer() {
  return (
    <>
      <div className="container-fluid">
        <footer className="footer py-4 position-absolute bottom-0 start-0 w-100 fixed-bottom d-flex justify-content-end">
          <div className="container-fluid">
            <div className="row align-items-center justify-content-lg-between">
              <div className="col-lg-6">
                <div className="copyright text-center text-sm text-muted text-lg-end me-lg-6">
                  © 2024, made with ♥️ by
                  <strong> Delicias Express</strong> for a better web.
                </div>
              </div>
              <div className="col-lg-6 mt-lg-0 mt-2">
                <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                  <li className="nav-item">
                    <a
                      href="https://github.com/lennardscript"
                      className="nav-link text-muted"
                      target="_blank"
                    >
                      Leandro Burgos
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://github.com/jersonL01"
                      className="nav-link text-muted"
                      target="_blank"
                    >
                      Jerson Lienlaf
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://github.com/Naxozz"
                      className="nav-link text-muted"
                      target="_blank"
                    >
                      Ignacio Godoy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
