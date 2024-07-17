import "bootstrap/dist/css/bootstrap.min.css";
import { OrderData } from "@/utils/lib/interface/orderData";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Navbar/Breadcrumb";
import Sidebar from "@/components/Navbar/Sidebar";
import { getFirestore, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Orders() {
  const [proveedorData, setProveedorData] = useState(null);
  const [orderData, setOrderData] = useState<OrderData>({
    providerId: '',
    providerData: {
      rut_proveedor: '',
      nombre_razon: '',
      correo_proveedor: '',
      telefono_proveedor: '',
      direccion_proveedor: '',
    },
    customerId: '',
    customerData: {
      rut_cliente: '',
      nombre_cliente: '',
      correo_cliente: '',
      telefono_cliente: '',
      direccion_cliente: '',
      comuna_cliente: '',
    },
    products: [],
    total: 0,
    iva: 0,
    subtotal: 0,
    estado: 1,
    vecesRechazado: 0,
  });

  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);

  useEffect(() => {
    const fetchProveedorData = async () => {
      const firestore = getFirestore();
      const proveedorCollection = collection(firestore, "proveedor");
      const proveedorSnapshot = await getDocs(proveedorCollection);
      const proveedorData = proveedorSnapshot.docs.map((doc) => doc.data());
      setProveedorData(proveedorData[0]);
      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        providerId: proveedorData[0].id,
        providerData: {
          rut_proveedor: proveedorData[0].rut_proveedor,
          nombre_razon: proveedorData[0].nombre_razon,
          correo_proveedor: proveedorData[0].correo_proveedor,
          telefono_proveedor: proveedorData[0].telefono_proveedor,
          direccion_proveedor: proveedorData[0].direccion_proveedor,
        },
      }));
    };

    fetchProveedorData();
  }, []);

  const validateOrderData = () => {
    if (
      orderData.customerData.rut_cliente === '' ||
      orderData.customerData.nombre_cliente === '' ||
      orderData.customerData.correo_cliente === '' ||
      orderData.customerData.telefono_cliente === '' ||
      orderData.customerData.direccion_cliente === '' ||
      orderData.customerData.comuna_cliente === ''
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete los campos del cliente',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return false;
    }
  
    if (orderData.products.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, añada al menos un producto',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return false;
    }
  
    return true;
  };

  const handleAddProduct = () => {

    const newProducto = {
      name: productName,
      quantity: productQuantity,
      price: productPrice,
    };

    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      products: (prevOrderData.products || []).concat([newProducto]),
      total: prevOrderData.total + productQuantity * productPrice,
      iva: prevOrderData.iva + (productPrice * productQuantity * 0.19),
    }));

    setProductName('');
    setProductQuantity(0);
    setProductPrice(0);

    console.log(orderData);
  };

  const saveOrder = async () => {
    if (!validateOrderData()) {
      return;
    }

    try {
      const firestore = getFirestore();
      const ordersCollection = collection(firestore, 'orders');
      const orderDataWithProviderId = {
        ...orderData,
        providerId: proveedorData, // Agrega el valor de providerId aquí
        estado: 1,
        createdAt: Timestamp.now(),
      };
      await addDoc(ordersCollection, orderDataWithProviderId);
      setOrderData({
        providerId: '',
        providerData: {
          rut_proveedor: '',
          nombre_razon: '',
          correo_proveedor: '',
          telefono_proveedor: '',
          direccion_proveedor: '',
        },
        customerId: '',
        customerData: {
          rut_cliente: '',
          nombre_cliente: '',
          correo_cliente: '',
          telefono_cliente: '',
          direccion_cliente: '',
          comuna_cliente: '',
        },
        products: [],
        total: 0,
        iva: 0,
        subtotal: 0,
        estado: 1,
        imageName: '',
        motivoRechazo: '',
        vecesRechazado: 0,
      });
      Swal.fire({
        title: 'Orden guardada',
        text: 'La orden se ha guardado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      })
      console.log('Order saved successfully');
    } catch (error) {
      Swal.fire({
        title: 'Error al guardar la orden',
        text: 'Ocurrio un error al guardar la orden, intentelo nuevamente',
        icon: 'error',
        confirmButtonText: 'Ok',
      })
      console.error('Error saving order:', error);
    }
  }

  return (
    <>
      <Head>
        <title>Delicias Express | Ordenes</title>
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
                            Información del proveedor y cliente
                          </h6>
                        </div>
                      </div>
                      <div
                        className="card-body px-3 pb-2"
                        style={{ padding: "1rem" }}
                      >
                        <div className="row">
                          {/* Información del proveedor */}
                          <div className="col-md-5">
                            <div className="p-2">
                              <div className="form-floating mb-4 mx-1 fade show">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="floatingInputRutProveedor"
                                  value={
                                    proveedorData
                                      ? proveedorData.rut_proveedor
                                      : ""
                                  }
                                  disabled
                                />
                                <label htmlFor="floatingInputRutProveedor">
                                  RUT proveedor
                                </label>
                              </div>

                              <div className="form-floating mb-4 mx-1 fade show">
                                <input
                                  className="form-control form-control-sm"
                                  id="floatingInputNombreRazonProveedor"
                                  value={
                                    proveedorData
                                      ? proveedorData.nombre_razon
                                      : ""
                                  }
                                  disabled
                                />
                                <label htmlFor="floatingInputRutProveedor">
                                  Nombre o razón social
                                </label>
                              </div>

                              <div className="form-floating mb-4 mx-1 fade show">
                                <input
                                  className="form-control form-control-sm"
                                  id="floatingInputCorreoProveedor"
                                  value={
                                    proveedorData
                                      ? proveedorData.correo_proveedor
                                      : ""
                                  }
                                  disabled
                                />
                                <label htmlFor="floatingInputRutProveedor">
                                  Correo del proveedor
                                </label>
                              </div>

                              <div className="form-floating mb-4 mx-1 fade show">
                                <input
                                  className="form-control form-control-sm"
                                  id="floatingInputTelefonoProveedorr"
                                  value={
                                    proveedorData
                                      ? proveedorData.telefono_proveedor
                                      : ""
                                  }
                                  disabled
                                />
                                <label htmlFor="floatingInputRutProveedor">
                                  Teléfono del proveedor
                                </label>
                              </div>

                              <div className="form-floating mb-4 mx-1 fade show">
                                <input
                                  className="form-control form-control-sm"
                                  id="floatingInputDireccionProveedor"
                                  value={
                                    proveedorData
                                      ? proveedorData.direccion_proveedor
                                      : ""
                                  }
                                  disabled
                                />
                                <label htmlFor="floatingInputRutProveedor">
                                  Dirección del proveedor
                                </label>
                              </div>
                            </div>
                          </div>
                          {/* Información del cliente */}
                          <div className="col-md-7">
                            <div className="p-2">
                              <form role="form" className="w-100">
                                <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="floatingInputRutCliente"
                                    onChange={(e) =>
                                      setOrderData((prevOrderData) => ({
                                        ...prevOrderData,
                                        customerData: {
                                          ...prevOrderData.customerData,
                                          rut_cliente: e.target.value,
                                        }
                                      }))
                                    }
                                    required
                                  />
                                  <label htmlFor="floatingInputRutCliente">
                                    RUT del cliente
                                  </label>
                                </div>

                                <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="floatingInputNombreCliente"
                                    onChange={(e) =>
                                      setOrderData((prevOrderData) => ({
                                        ...prevOrderData,
                                        customerData: {
                                          ...prevOrderData.customerData,
                                          nombre_cliente: e.target.value,
                                        }
                                      }))
                                    }
                                    required
                                  />
                                  <label htmlFor="floatingInputNombreCliente">
                                    Nombre del cliente
                                  </label>
                                </div>

                                <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="email"
                                    className="form-control form-control-sm"
                                    id="floatingInputCorreoCliente"
                                    onChange={(e) =>
                                      setOrderData((prevOrderData) => ({
                                        ...prevOrderData,
                                        customerData: {
                                          ...prevOrderData.customerData,
                                          correo_cliente: e.target.value,
                                        }
                                      }))
                                    }
                                    required
                                  />
                                  <label htmlFor="floatingInputCorreoCliente">
                                    Correo del cliente
                                  </label>
                                </div>

                                <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="tel"
                                    className="form-control form-control-sm"
                                    id="floatingInputTelefonoCliente"
                                    onChange={(e) =>
                                      setOrderData((prevOrderData) => ({
                                        ...prevOrderData,
                                        customerData: {
                                          ...prevOrderData.customerData,
                                          telefono_cliente: e.target.value,
                                        }
                                      }))
                                    }
                                    required
                                  />
                                  <label htmlFor="floatingInputTelefonoCliente">
                                    Telefono del cliente
                                  </label>
                                </div>

                                <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="floatingInputDireccionCliente"
                                    onChange={(e) =>
                                      setOrderData((prevOrderData) => ({
                                        ...prevOrderData,
                                        customerData: {
                                          ...prevOrderData.customerData,
                                          direccion_cliente: e.target.value,
                                        }
                                      }))
                                    }
                                    required
                                  />
                                  <label htmlFor="floatingInputDireccionCliente">
                                    Dirección del cliente
                                  </label>
                                </div>
                                <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="floatingInputComunaCliente"
                                    onChange={(e) =>
                                      setOrderData((prevOrderData) => ({
                                        ...prevOrderData,
                                        customerData: {
                                          ...prevOrderData.customerData,
                                          comuna_cliente: e.target.value,
                                        }
                                      }))
                                    }
                                    required
                                  />
                                  <label htmlFor="floatingInputComunaCliente">
                                    Comuna del cliente
                                  </label>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Información de la orden */}
                <div className="row justify-content-start">
                  <div className="col-md-10">
                    <div className="card my-6">
                      <div className="card-header p-0 position-relative mt-n5 ms-3 mx-12 z-index-3">
                        <div className="bg-danger shadow-primary border-radius-lg pt-4 pb-3">
                          <h6 className="text-white ps-3">
                            Información del (los) producto(s)
                          </h6>
                        </div>
                      </div>
                      <div
                        className="card-body px-3 pb-2"
                        style={{ padding: "1rem" }}
                      >
                        <div className="container">
                          <div className="row g-5">
                            <div className="col-md-5 col-lg-4 order-md-last">
                              <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-danger">Productos</span>
                                <span className="badge bg-danger rounded-pill">
                                  {orderData.products.length}
                                </span>
                              </h4>
                              <ul className="list-group mb-3">
                                {orderData.products.map((product, index) => (
                                  
                                <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                                  <div>
                                    <h6 className="my-0">{product.name}</h6>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <span className="text-body-secondary">
                                      {product.price}
                                    </span>
                                  </div>
                                </li>
                                ))}
{/*                                 <li className="list-group-item d-flex justify-content-between lh-sm">
                                  <div>
                                    <h6 className="my-0">Second product</h6>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <span className="text-body-secondary">
                                      $12
                                    </span>
                                  </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                  <div>
                                    <h6 className="my-0">Third item</h6>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <span className="text-body-secondary">
                                      $12
                                    </span>
                                  </div>
                                </li> */}
                                <li className="list-group-item d-flex justify-content-between">
                                  <span>Total (CLP)</span>
                                  <strong>{orderData.total}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                  <span>IVA (19%)</span>
                                  <strong>{orderData.iva}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                  <span>Subtotal (Total + IVA)</span>
                                  <strong>{orderData.subtotal}</strong>
                                </li>
                              </ul>
                              <div className="text-center">
                                <button
                                  type="submit"
                                  className="btn btn-lg bg-danger btn-lg w-100 mt-2 mb-3 text-white"
                                  onClick={saveOrder}
                                >
                                  Generar orden
                                </button>
                              </div>
                            </div>
                            <div className="col-md-7 col-lg-8">
                              <form className="needs-validation">
                                <div className="row">
                                  <div className="col">
                                  <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="floatingInputNombreProducto"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                  />
                                  <label htmlFor="floatingInputNombreProducto">
                                    Nombre del producto
                                  </label>
                                </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col">
                                  <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="floatingInputCantidadStock"
                                    value={productQuantity}
                                    onChange={(e) => setProductQuantity(parseInt(e.target.value))}
                                    required
                                  />
                                  <label htmlFor="floatingCantidadStock">
                                    Cantidad (stock)
                                  </label>
                                </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col">
                                  <div className="form-floating mb-4 mx-1 fade show">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="floatingInputPrecio"
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(parseInt(e.target.value))}
                                    required
                                  />
                                  <label htmlFor="floatingInputPrecio">
                                    Precio
                                  </label>
                                </div>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                  <button
                                    className="btn btn-danger btn-lg"
                                    type="submit"
                                    onClick={handleAddProduct}
                                  >
                                    Añadir producto
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer  />
      </div>
    </>
  );
}
