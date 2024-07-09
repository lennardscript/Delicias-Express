import Footer from '@/components/Footer/Footer'
import Breadcrumb from '@/components/Navbar/Breadcrumb'
import Sidebar from '@/components/Navbar/Sidebar'
import Head from 'next/head'
import React from 'react'

export default function Orders() {
  return (
    <>
    <Head>
      <title>Delicias Express | Ordenes</title>
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
      <Footer />
    </>
  )
}
