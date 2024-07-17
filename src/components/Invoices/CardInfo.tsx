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
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";



export default function CardInfo() {
  const [orders, setOrders] = useState<{ id: string; data: OrderData }[]>([]);
  const [orderData, setOrderData] = useState({});

  // Contadores de estado
  const [counts, setCounts] = useState({
    creado: 0,
    rectificado: 0,
    entregado: 0,
    rechazado: 0,
    anulado: 0,
  });

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

      // Calcular contadores
      const estadoCounts = ordersData.reduce(
        (acc, order) => {
          switch (order.data.estado) {
            case 1:
              acc.creado++;
              break;
            case 2:
              acc.rectificado++;
              break;
            case 3:
              acc.entregado++;
              break;
            case 4:
              acc.rechazado++;
              break;
            case 5:
              acc.anulado++;
              break;
            default:
              break;
          }
          return acc;
        },
        {
          creado: 0,
          rectificado: 0,
          entregado: 0,
          rechazado: 0,
          anulado: 0,
        }
      );
      setCounts(estadoCounts);
    
    };

    fetchOrders();
  }, []);

  const handleViewOrder = async (order: { id: string; data: OrderData }) => {
    setOrderData(order.data);

    // Obtener la URL de la imagen subida solo si existe
  let imageUrl = "";
  if (order.data.imageName) {
    const storageRef = getStorage();
    const imageRef = ref(
      storageRef,
      `orders/${order.id}/images/${order.data.imageName}`
    );
    imageUrl = await getDownloadURL(imageRef);
  }

  // Obtener el motivo del rechazo si existe
  let motivoRechazo = "";
  if (order.data.estado === 4 && order.data.motivoRechazo) {
    motivoRechazo = order.data.motivoRechazo;
  }

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
          order.data.estado === 1
            ? "Creado"
            : order.data.estado === 2
            ? "Rectificado"
            : order.data.estado === 3
            ? "Entregado"
            : order.data.estado === 4
            ? "Rechazado"
            : order.data.estado === 5
            ? "Anulado"
            : null
        }
      </div>
      <div className="mb-3">
        ${
          order.data.estado === 3 && order.data.imageName
            ? `<img src="${imageUrl}" alt="Imagen del cliente" class="img-fluid" />`
            : ""
        }
      </div>
      ${
        order.data.estado === 4 && motivoRechazo
          ? `
            <div className="mb-3">
              <strong>Motivo del rechazo:</strong>
              <p>${motivoRechazo}</p>
            </div>
          `
          : ""
      }
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup-custom",
      },
    });
  };

  const handleEditOrder = (order: { id: string; data: OrderData }) => {
    
    let orderData = {
      products: order.data.products || [], // Inicializar con los valores existentes
      total: order.data.total || 0,
      iva: order.data.iva || 0,
      subtotal: order.data.subtotal || 0,
    };

    setOrderData(order.data);
  
    Swal.fire({
      title: `Editar Orden #${order.id}`,
      html: `
        <form>
          <div class="row">
            <div class="d-flex flex-column justify-content-center">
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
                <input type="tel" id="telefono_cliente" class="form-control" value="${order.data.customerData.telefono_cliente}" />
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
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="estado" id="estado-entregado" value="3" ${
                order.data.estado === 3 ? "checked" : ""
              }>
              <label class="form-check-label" for="estado-entregado">
                Entregado
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="estado" id="estado-rechazado" value="4" ${
                order.data.estado === 4 ? "checked" : ""
              }>
              <label class="form-check-label" for="estado-rechazado">
                Rechazado
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="estado" id="estado-anulado" value="5" ${
                order.data.estado === 5 ? "checked" : ""
              }>
              <label class="form-check-label" for="estado-anulado">
                Anulado
              </label>
            </div>
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
  
        // Validar que los campos requeridos no estén vacíos
        if (
          !updatedCustomerData.nombre_cliente ||
          !updatedCustomerData.rut_cliente ||
          !updatedCustomerData.correo_cliente
        ) {
          Swal.fire({
            title: "Error",
            text: "Por favor, no deje ningún campo vacío.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
  
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
  
        // Validar que la cantidad y el precio sean números válidos
        if (
          updatedProducts.some(
            (product) => isNaN(product.quantity) || isNaN(product.price)
          )
        ) {
          Swal.fire({
            title: "Error",
            text: "Por favor, ingresa valores numéricos válidos para la cantidad y el precio de los productos.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
  
        let total = 0;
        let iva = 0;
        let subtotal = 0;
  
        updatedProducts.forEach((product) => {
          total += product.quantity * product.price;
          iva += product.quantity * product.price * 0.19;
          subtotal += product.quantity * product.price * 1.19;
        });
  
        const estadoInput = document.querySelector('input[name="estado"]:checked');
        const estadoValue = estadoInput ? parseInt((estadoInput as HTMLInputElement).value) : 2; // Si no se selecciona estado, se asigna 2 (Rectificado)
  
        // Actualizar la orden según el estado seleccionado
        switch (estadoValue) {
          case 3: // Entregado
            await handleEstadoEntregado(order);
            break;
          case 4: // Rechazado
            await handleEstadoRechazado(order);
            break;
          default:
            break;
        }
  
        const updatedOrderData = {
          customerData: updatedCustomerData,
          products: updatedProducts,
          total,
          iva,
          subtotal,
          estado: estadoValue,
        };
  
        try {
          const firestore = getFirestore();
          const orderRef = doc(firestore, "orders", order.id);
          await updateDoc(orderRef, updatedOrderData);
  
          Swal.fire({
            title: "Orden actualizada",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Error al actualizar la orden:", error);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al actualizar la orden. Por favor, inténtalo de nuevo más tarde.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      },
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup-custom",
      },
    });
  
    const handleEstadoEntregado = async (order: {
      id: string;
      data: OrderData;
    }) => {
      const { value: rut, dismiss } = await Swal.fire({
        title: "Orden entregada",
        html: `
          <div class="mb-3">
            <label for="rut-cliente">RUT del cliente:</label>
            <input type="text" id="rut-cliente" class="form-control" placeholder="Ingresa el RUT del cliente" />
          </div>
          <div class="mb-3">
            <label for="direccion-cliente">Dirección del cliente:</label>
            <input type="text" id="direccion-cliente" class="form-control" placeholder="Ingresa la dirección del cliente" />
          </div>
          <div class="mb-3">
            <label for="imagen-cliente">Sube una imagen:</label>
            <input type="file" id="imagen-cliente" class="form-control" />
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      });
  
      if (rut && dismiss !== "cancel") {
        // Procesar RUT y la imagen
        const fileUpload = document.getElementById(
          "imagen-cliente"
        ) as HTMLInputElement;
        const fileData = fileUpload.files[0];
        const storageRef = getStorage();
        const storagePath = `orders/${order.id}/images`;
        const imageRef = ref(storageRef, `${storagePath}/${fileData.name}`);
        const uploadTask = uploadBytesResumable(imageRef, fileData);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            Swal.fire({
              title: "Subiendo imagen...",
              text: `Porcentaje de carga: ${progress.toFixed(2)}%`,
              icon: "info",
              showCancelButton: false,
              showConfirmButton: false,
              allowOutsideClick: false,
            });
          },
          (error) => {
            Swal.fire({
              title: "Error al subir la imagen",
              text: error.message,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          },
          () => {
            Swal.fire({
              title: "Imagen subida correctamente",
              text: "La imagen se ha subido correctamente.",
              icon: "success",
              confirmButtonText: "Aceptar",
            });
  
            // Actualizar la orden con la información de la imagen
            const updatedOrderData = {
              imageName: fileData.name,
            };
  
            const firestore = getFirestore();
            const orderRef = doc(firestore, "orders", order.id);
            updateDoc(orderRef, updatedOrderData);
          }
        );
      }
    };
      
  
    const handleEstadoRechazado = async (order: {
      id: string;
      data: OrderData;
    }) => {
      const { value: motivo, dismiss } = await Swal.fire({
        title: "Orden rechazada",
        input: "textarea",
        inputLabel: "Motivo del rechazo",
        inputPlaceholder: "Ingresa el motivo del rechazo...",
        inputAttributes: {
          "aria-label": "Ingresa el motivo del rechazo",
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      });
  
      if (motivo && dismiss !== "cancel") {
        // Actualizar la orden con el motivo del rechazo
        const updatedOrderData = {
          motivoRechazo: motivo,
          vecesRechazado: (order.data.vecesRechazado || 0) + 1,
        }

        try {
          const firestore = getFirestore();
          const orderRef = doc(firestore, "orders", order.id);
          await updateDoc(orderRef, updatedOrderData);

          Swal.fire({
            title: "Orden rechazada",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });

        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Ocurrio un error al rechazar la orden. Por favor, intenta de nuevo mas tarde.",
            icon: "error",
            confirmButtonText: "Aceptar",
          })
        }
      }
    };
  };
  
  return (
    <>
      {/* Contadores de estado */}
      <div className="d-flex justify-content-around mt-4 mb-4">
        <div className="badge bg-success">Creado: {counts.creado}</div>
        <div className="badge bg-warning">Rectificado: {counts.rectificado}</div>
        <div className="badge bg-primary">Entregado: {counts.entregado}</div>
        <div className="badge bg-danger">Rechazado: {counts.rechazado}</div>
        <div className="badge bg-secondary">Anulado: {counts.anulado}</div>
      </div>


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
                  ) : order.data.estado === 3 ? (
                    <span className="mb-2 text-xs">
                      Estado:{" "}
                      <span className="badge badge-sm bg-gradient-info">
                        Entregado
                      </span>
                    </span>
                  ) : order.data.estado === 4 ? (
                    <span className="mb-2 text-xs">
                      Estado:{" "}
                      <span className="badge badge-sm bg-gradient-danger p-lg-1">
                        Rechazado
                      </span>
                    </span>
                  ) : order.data.estado === 5 ? (
                    <span className="mb-2 text-xs">
                      Estado:{" "}
                      <span className="badge badge-sm bg-gradient-faded-dark p-lg-1">
                        Anulado
                      </span>
                    </span>
                  ) : null}
                </div>

                <div className="ms-auto text-end">
                  {order.data.estado === 4 && order.data.vecesRechazado > 0 && (
                    <div className="text-danger mb-2">
                      N° de veces rechazadas: {order.data.vecesRechazado}
                    </div>
                  )}
                  <button
                    className="btn btn-danger btn-sm mb-0"
                    onClick={() => handleViewOrder(order)}
                  >
                    Ver orden
                  </button>
                  {order.data.estado !== 3 ? (
                  <button
                    className="btn btn-link text-dark px-3 mb-0"
                    onClick={() => handleEditOrder(order)}
                  >
                    <i className="material-icons text-sm me-2">edit</i>
                    Editar
                  </button>
                ) : (
                  <button className="btn btn-link text-dark px-3 mb-0" disabled>
                    <i className="material-icons text-sm me-2">edit</i>
                    Editar
                  </button>
                )}
                  <PDFDownloadLink
                    document={<OrderPDF order={order} />}
                    fileName={`Orden_${order.id}.pdf`}
                    className="btn btn-link text-dark text-sm mb-0 px-0 ms-2"
                  >
                    <i className="material-icons text-lg position-relative me-1">
                      picture_as_pdf
                    </i>{" "}
                    PDF
                  </PDFDownloadLink>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
