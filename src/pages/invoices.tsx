import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Navbar/Breadcrumb";
import Sidebar from "@/components/Navbar/Sidebar";
import Head from "next/head";
import React from "react";
import CardInfo from "@/components/Invoices/CardInfo";

export default function Invoices() {
  return (
    <>
      <Head>
        <title>Delicias Express | Facturas</title>
      </Head>
      <div className="d-flex flex-column min-vh-100">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <Sidebar />
            </div>
            <div className="col-md-9">
              <Breadcrumb />
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-md-10">
                    <div className="card my-1">
                      <div className="card-header p-0 position-relative mt-n5 ms-3 mx-12 z-index-3">
                        <div className="bg-danger shadow-primary border-radius-lg pt-4 pb-3">
                          <h6 className="text-white ps-3">
                            Información de las ordenes y facturas
                          </h6>
                        </div>
                      </div>
                      <CardInfo />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
