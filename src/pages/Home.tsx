import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer/Footer";
import CardHeader from "@/components/Home/CardHeader";
import CardIcon from "@/components/Home/CardIcon";
import Breadcrumb from "@/components/Navbar/Breadcrumb";
import Sidebar from "@/components/Navbar/Sidebar";
import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Delicias Express | Home</title>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Breadcrumb />
          </div>
        </div>
      </div>
      <div className="container">
        <CardHeader />
        <div className="row justify-content-center">
          <CardIcon />
        </div>
      </div>
      <Footer />
    </>
  );
}
