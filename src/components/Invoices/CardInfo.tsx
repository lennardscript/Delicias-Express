import { OrderData } from "@/utils/lib/interface/orderData";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CardInfo() {
  const [orders, setOrders] = useState<{ id: string; data: OrderData }[]>([]);
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const firestore = getFirestore();
      const ordersCollection = collection(firestore, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as OrderData,
      }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (order: { id: string; data: OrderData }) => {
    Swal.fire({
      title: `Orden #${order.id}`,
      html: `
        <div class="row">
          <div class="col-md-6">
            <h5 class="mb-3">Información del Cliente</h5>
            <div class="mb-3">
              <strong>Nombre:</strong> ${order.data.customerData.nombre_cliente}
            </div>
            <div class="mb-3">
              <strong>RUT:</strong> ${order.data.customerData.rut_cliente}
            </div>
            <div class="mb-3">
              <strong>Correo:</strong> ${order.data.customerData.correo_cliente}
            </div>
            <div class="mb-3">
              <strong>Teléfono:</strong> +${
                order.data.customerData.telefono_cliente
              }
            </div>
            <div class="mb-3">
              <strong>Dirección:</strong> ${
                order.data.customerData.direccion_cliente
              }
            </div>
            <div class="mb-3">
              <strong>Comuna:</strong> ${order.data.customerData.comuna_cliente}
            </div>
          </div>
          <div class="col-md-6">
            <h5 class="mb-3">Información del Proveedor</h5>
            <div class="mb-3">
              <strong>Nombre:</strong> ${order.data.providerData.nombre_razon}
            </div>
            <div class="mb-3">
              <strong>RUT:</strong> ${order.data.providerData.rut_proveedor}
            </div>
            <div class="mb-3">
              <strong>Correo:</strong> ${
                order.data.providerData.correo_proveedor
              }
            </div>
            <div class="mb-3">
              <strong>Teléfono:</strong> +${
                order.data.providerData.telefono_proveedor
              }
            </div>
            <div class="mb-3">
              <strong>Dirección:</strong> ${
                order.data.providerData.direccion_proveedor
              }
            </div>
          </div>
        </div>
        <hr>
        <h5 class="mb-3">Productos</h5>
        <ul>
          ${order.data.products
            .map(
              (product) => `
            <li>${product.name} - Cantidad: ${product.quantity} - Precio: $${product.price}</li>
          `
            )
            .join("")}
        </ul>
        <hr>
        <div class="row">
          <div class="col-md-4">
            <div class="mb-3">
              <strong>Total:</strong> $${order.data.total}
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <strong>IVA:</strong> $${order.data.iva}
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <strong>Subtotal:</strong> $${order.data.subtotal}
            </div>
          </div>
        </div>
        <div class="mb-3">
        <strong>Estado:</strong> ${
          order.data.estado === 1 ? "Creado" : order.data.estado === 2 ? "Rectificado" : "No creado"
        }
      </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup-custom",
      },
    });
  };

  /* const handleEditOrder = (order: { id: string; data: OrderData }) => {
    setOrderData(order.data);
  
    Swal.fire({
      title: `Editar Orden #${order.id}`,
      html: `
        <form>
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-3">Información del Cliente</h5>
              <div class="mb-3">
                <label for="nombre_cliente">Nombre del cliente:</label>
                <input type="text" id="nombre_cliente" class="form-control" value="${order.data.customerData.nombre_cliente}" />
              </div>
              <div class="mb-3">
                <label for="rut_cliente">RUT del cliente:</label>
                <input type="text" id="rut_cliente" class="form-control" value="${order.data.customerData.rut_cliente}" />
              </div>
              <div class="mb-3">
                <label for="correo_cliente">Correo del cliente:</label>
                <input type="email" id="correo_cliente" class="form-control" value="${order.data.customerData.correo_cliente}" />
              </div>
              <div class="mb-3">
                <label for="telefono_cliente">Teléfono del cliente:</label>
                <input type="tel" id="telefono_cliente" class="form-control" value="+${order.data.customerData.telefono_cliente}" />
              </div>
              <div class="mb-3">
                <label for="direccion_cliente">Dirección del cliente:</label>
                <input type="text" id="direccion_cliente" class="form-control" value="${order.data.customerData.direccion_cliente}" />
              </div>
              <div class="mb-3">
                <label for="comuna_cliente">Comuna del cliente:</label>
                <input type="text" id="comuna_cliente" class="form-control" value="${order.data.customerData.comuna_cliente}" />
              </div>
            </div>
            <div class="col-md-6">
              <h5 class="mb-3">Información del Proveedor</h5>
              <div class="mb-3">
                <label for="nombre_razon">Nombre del proveedor:</label>
                <input type="text" id="nombre_razon" class="form-control" value="${order.data.providerData.nombre_razon}" disabled />
              </div>
              <div class="mb-3">
                <label for="rut_proveedor">RUT del proveedor:</label>
                <input type="text" id="rut_proveedor" class="form-control" value="${order.data.providerData.rut_proveedor}" disabled />
              </div>
              <div class="mb-3">
                <label for="correo_proveedor">Correo del proveedor:</label>
                <input type="email" id="correo_proveedor" class="form-control" value="${order.data.providerData.correo_proveedor}" disabled />
              </div>
              <div class="mb-3">
                <label for="telefono_proveedor">Teléfono del proveedor:</label>
                <input type="tel" id="telefono_proveedor" class="form-control" value="+${order.data.providerData.telefono_proveedor}" disabled />
              </div>
              <div class="mb-3">
                <label for="direccion_proveedor">Dirección del proveedor:</label>
                <input type="text" id="direccion_proveedor" class="form-control" value="${order.data.providerData.direccion_proveedor}" disabled />
              </div>
            </div>
          </div>
          <hr>
          <h5 class="mb-3">Productos</h5>
          <div class="product-list">
          ${order.data.products.map((product, index) => `
            <div class="product-item">
              <input type="text" id="nombre_producto_${index}" class="form-control" value="${product.name}" />
              <input type="number" id="cantidad_producto_${index}" class="form-control" value="${product.quantity}" />
              <input type="number" id="precio_producto_${index}" class="form-control" value="${product.price}" />
            </div>
          `).join('')}
          </div>
          <div className="mb-3">
            <label for="estado">Estado:</label>
            <select id="estado" className="form-select">
              <option value="1" ${order.data.estado === 1 ? "selected" : ""}>Creado</option>
              <option value="2" ${order.data.estado === 2 ? "selected" : ""}>Entregado</option>
            </select>
          </div>
        </form>
      `,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Guardar cambios",
      confirmButtonColor: "#3085d6",
      preConfirm: async () => {
        const updatedCustomerData = {
          nombre_cliente: (document.getElementById("nombre_cliente") as HTMLInputElement).value,
          rut_cliente: (document.getElementById("rut_cliente") as HTMLInputElement).value,
          correo_cliente: (document.getElementById("correo_cliente") as HTMLInputElement).value,
          telefono_cliente: (document.getElementById("telefono_cliente") as HTMLInputElement).value,
          direccion_cliente: (document.getElementById("direccion_cliente") as HTMLInputElement).value,
          comuna_cliente: (document.getElementById("comuna_cliente") as HTMLInputElement).value,
        };
  
        const updatedProducts = orderData.products
          ? orderData.products.map((product, index) => ({
              name: (document.getElementById(`nombre_producto_${index}`) as HTMLInputElement).value,
              quantity: parseInt((document.getElementById(`cantidad_producto_${index}`) as HTMLInputElement).value),
              price: parseFloat((document.getElementById(`precio_producto_${index}`) as HTMLInputElement).value),
            }))
          : [];
  
        let total = 0;
        let iva = 0;
        let subtotal = 0;
  
        updatedProducts.forEach((product) => {
          total += product.quantity * product.price;
          iva += product.quantity * product.price * 0.19;
          subtotal += product.quantity * product.price * 1.19;
        });
  
        const updatedOrderData = {
          customerData: updatedCustomerData,
          products: updatedProducts,
          total,
          iva,
          subtotal,
        };
  
        const firestore = getFirestore();
        const orderRef = doc(firestore, "orders", order.id);
        await updateDoc(orderRef, updatedOrderData);
  
        Swal.fire({
          title: "Orden actualizada",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      },
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup-custom",
      },
    });
  }; */

  const handleEditOrder = (order: { id: string; data: OrderData }) => {
    setOrderData(order.data);

    Swal.fire({
      title: `Editar Orden #${order.id}`,
      html: `
        <form>
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-3">Información del Cliente</h5>
              <div class="mb-3">
                <label for="nombre_cliente">Nombre del cliente:</label>
                <input type="text" id="nombre_cliente" class="form-control" value="${
                  order.data.customerData.nombre_cliente
                }" />
              </div>
              <div class="mb-3">
                <label for="rut_cliente">RUT del cliente:</label>
                <input type="text" id="rut_cliente" class="form-control" value="${
                  order.data.customerData.rut_cliente
                }" />
              </div>
              <div class="mb-3">
                <label for="correo_cliente">Correo del cliente:</label>
                <input type="email" id="correo_cliente" class="form-control" value="${
                  order.data.customerData.correo_cliente
                }" />
              </div>
              <div class="mb-3">
                <label for="telefono_cliente">Teléfono del cliente:</label>
                <input type="tel" id="telefono_cliente" class="form-control" value="+${
                  order.data.customerData.telefono_cliente
                }" />
              </div>
              <div class="mb-3">
                <label for="direccion_cliente">Dirección del cliente:</label>
                <input type="text" id="direccion_cliente" class="form-control" value="${
                  order.data.customerData.direccion_cliente
                }" />
              </div>
              <div class="mb-3">
                <label for="comuna_cliente">Comuna del cliente:</label>
                <input type="text" id="comuna_cliente" class="form-control" value="${
                  order.data.customerData.comuna_cliente
                }" />
              </div>
            </div>
            <div class="col-md-6">
              <h5 class="mb-3">Información del Proveedor</h5>
              <div class="mb-3">
                <label for="nombre_razon">Nombre del proveedor:</label>
                <input type="text" id="nombre_razon" class="form-control" value="${
                  order.data.providerData.nombre_razon
                }" disabled />
              </div>
              <div class="mb-3">
                <label for="rut_proveedor">RUT del proveedor:</label>
                <input type="text" id="rut_proveedor" class="form-control" value="${
                  order.data.providerData.rut_proveedor
                }" disabled />
              </div>
              <div class="mb-3">
                <label for="correo_proveedor">Correo del proveedor:</label>
                <input type="email" id="correo_proveedor" class="form-control" value="${
                  order.data.providerData.correo_proveedor
                }" disabled />
              </div>
              <div class="mb-3">
                <label for="telefono_proveedor">Teléfono del proveedor:</label>
                <input type="tel" id="telefono_proveedor" class="form-control" value="+${
                  order.data.providerData.telefono_proveedor
                }" disabled />
              </div>
              <div class="mb-3">
                <label for="direccion_proveedor">Dirección del proveedor:</label>
                <input type="text" id="direccion_proveedor" class="form-control" value="${
                  order.data.providerData.direccion_proveedor
                }" disabled />
              </div>
            </div>
          </div>
          <hr>
          <h5 class="mb-3">Productos</h5>
          <div class="product-list">
          ${order.data.products
            .map(
              (product, index) => `
            <div class="product-item">
              <input type="text" id="nombre_producto_${index}" class="form-control" value="${product.name}" />
              <input type="number" id="cantidad_producto_${index}" class="form-control" value="${product.quantity}" />
              <input type="number" id="precio_producto_${index}" class="form-control" value="${product.price}" />
            </div>
          `
            )
            .join("")}
          </div>
          <div className="mb-3">
            <label for="estado">Estado:</label>
            <select id="estado" className="form-select">
              <option value="2" ${
                order.data.estado === 2 ? "selected" : ""
              }>Entregado</option>
            </select>
          </div>
        </form>
      `,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Guardar cambios",
      confirmButtonColor: "#3085d6",
      preConfirm: async () => {
        const updatedCustomerData = {
          nombre_cliente: (
            document.getElementById("nombre_cliente") as HTMLInputElement
          ).value,
          rut_cliente: (
            document.getElementById("rut_cliente") as HTMLInputElement
          ).value,
          correo_cliente: (
            document.getElementById("correo_cliente") as HTMLInputElement
          ).value,
          telefono_cliente: (
            document.getElementById("telefono_cliente") as HTMLInputElement
          ).value,
          direccion_cliente: (
            document.getElementById("direccion_cliente") as HTMLInputElement
          ).value,
          comuna_cliente: (
            document.getElementById("comuna_cliente") as HTMLInputElement
          ).value,
        };

        const updatedProducts = orderData.products.map((product, index) => ({
          name: (
            document.getElementById(
              `nombre_producto_${index}`
            ) as HTMLInputElement
          ).value,
          quantity: parseInt(
            (
              document.getElementById(
                `cantidad_producto_${index}`
              ) as HTMLInputElement
            ).value
          ),
          price: parseFloat(
            (
              document.getElementById(
                `precio_producto_${index}`
              ) as HTMLInputElement
            ).value
          ),
        }));

        let total = 0;
        let iva = 0;
        let subtotal = 0;

        updatedProducts.forEach((product) => {
          total += product.quantity * product.price;
          iva += product.quantity * product.price * 0.19;
          subtotal += product.quantity * product.price * 1.19;
        });

        const updatedOrderData = {
          customerData: updatedCustomerData,
          products: updatedProducts,
          total,
          iva,
          subtotal,
          estado: 2, // Estado: Rectificado
        };

        const firestore = getFirestore();
        const orderRef = doc(firestore, "orders", order.id);
        await updateDoc(orderRef, updatedOrderData);

        Swal.fire({
          title: "Orden actualizada",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      },
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup-custom",
      },
    });
  };

  return (
    <>
      {/* Card de ordenes y facturas */}
      <div className="card-body pt-4 p-3">
        {orders.length === 0 ? (
          <div className="text-center">
            <h5 className="text-muted">No hay órdenes enlistadas</h5>
            <p className="text-muted">Aún no se ha emitido ninguna orden.</p>
          </div>
        ) : (
          <ul className="list-group">
            {orders.map((order, index) => (
              <li
                key={index}
                className="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
              >
                <div className="d-flex flex-column">
                  {order.data.customerData && (
                    <h6 className="mb-3 text-sm">
                      {order.data.customerData.nombre_cliente}
                    </h6>
                  )}
                  <span className="mb-2 text-xs">
                    Orden:{" "}
                    <span className="text-dark ms-sm-2 font-weight-bold">
                      {order.id}
                    </span>
                  </span>
                  {order.data.customerData && (
                    <span className="mb-2 text-xs">
                      Correo del cliente:{" "}
                      <span className="text-dark ms-sm-2 font-weight-bold">
                        {order.data.customerData.correo_cliente}
                      </span>
                    </span>
                  )}
                  {order.data.customerData && (
                    <span className="mb-2 text-xs">
                      Número de telefono:{" "}
                      <span className="text-dark ms-sm-2 font-weight-bold">
                        +{order.data.customerData.telefono_cliente}
                      </span>
                    </span>
                  )}
                  {order.data.customerData && (
                    <span className="mb-2 text-xs">
                      Dirección:{" "}
                      <span className="text-dark ms-sm-2 font-weight-bold">
                        {order.data.customerData.direccion_cliente}
                      </span>
                    </span>
                  )}
                  {order.data.customerData && (
                    <span className="mb-2 text-xs">
                      Fecha:{" "}
                      <span className="text-dark ms-sm-2 font-weight-bold">
                        {new Date(
                          order.data.createdAt.toDate()
                        ).toLocaleDateString()}
                      </span>
                    </span>
                  )}
                  {order.data.estado === 1 ? (
                    <span className="mb-2 text-xs">
                      Estado:{" "}
                      <span className="badge badge-sm bg-gradient-success">
                        Creado
                      </span>
                    </span>
                  ) : order.data.estado === 2 ? (
                    <span className="mb-2 text-xs">
                      Estado:{" "}
                      <span className="badge badge-sm bg-gradient-warning">
                        Rectificado
                      </span>
                    </span>
                  ) : (
                    <span className="mb-2 text-xs">
                      Estado:{" "}
                      <span className="badge badge-sm bg-gradient-success">
                        No creado
                      </span>
                    </span>
                  )}
                </div>

                <div className="ms-auto text-end">
                  <button
                    className="btn btn-danger btn-sm mb-0"
                    onClick={() => handleViewOrder(order)}
                  >
                    Ver orden
                  </button>
                  <button
                    className="btn btn-link text-dark px-3 mb-0"
                    onClick={() => handleEditOrder(order)}
                  >
                    <i className="material-icons text-sm me-2">edit</i>
                    Editar
                  </button>
                  <button className="btn btn-link text-dark text-sm mb-0 px-0 ms-4">
                    <i className="material-icons text-lg position-relative me-1">
                      picture_as_pdf
                    </i>{" "}
                    PDF
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
