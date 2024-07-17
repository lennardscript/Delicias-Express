import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Asume que anulado.png está en la carpeta public
const anuladoImage = "./assets/img/anulado.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  badge: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    zIndex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    position: "relative",
    zIndex: 2,
  },
  separator: {
    borderBottom: "1px solid #ccc",
    marginVertical: 10,
  },
});

const OrderPDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.content}>
        {order.data.estado === 5 && (
          <Image src={anuladoImage} style={styles.watermark} fixed />
        )}
        <View style={[styles.section, { zIndex: 2 }]}>
          <View style={styles.row}>
            <Text style={styles.header}>Factura #{order.id}</Text>
            <Text style={styles.text}>
              Fecha: {new Date().toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.separator} />
          <View>
            <Text style={styles.header}>Información del Cliente</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Nombre:</Text>
              <Text style={styles.text}>
                {order.data.customerData.nombre_cliente}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>RUT:</Text>
              <Text style={styles.text}>
                {order.data.customerData.rut_cliente}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Correo:</Text>
              <Text style={styles.text}>
                {order.data.customerData.correo_cliente}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Teléfono:</Text>
              <Text style={styles.text}>
                {order.data.customerData.telefono_cliente}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Dirección:</Text>
              <Text style={styles.text}>
                {order.data.customerData.direccion_cliente}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Comuna:</Text>
              <Text style={styles.text}>
                {order.data.customerData.comuna_cliente}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View>
            <Text style={styles.header}>Información del Proveedor</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Nombre:</Text>
              <Text style={styles.text}>
                {order.data.providerData.nombre_razon}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>RUT:</Text>
              <Text style={styles.text}>
                {order.data.providerData.rut_proveedor}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Correo:</Text>
              <Text style={styles.text}>
                {order.data.providerData.correo_proveedor}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Teléfono:</Text>
              <Text style={styles.text}>
                {order.data.providerData.telefono_proveedor}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Dirección:</Text>
              <Text style={styles.text}>
                {order.data.providerData.direccion_proveedor}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View>
            <Text style={styles.header}>Producto(s)</Text>
            {order.data.products.map((product, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.text}>{product.name}</Text>
                <Text style={styles.text}>Cantidad: {product.quantity}</Text>
                <Text style={styles.text}>Precio: ${product.price}</Text>
              </View>
            ))}
          </View>
          <View style={styles.separator} />
          <View>
            <View style={styles.row}>
              <Text style={styles.text}>Total:</Text>
              <Text style={styles.text}>${order.data.total}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>IVA:</Text>
              <Text style={styles.text}>${order.data.iva}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Subtotal:</Text>
              <Text style={styles.text}>${order.data.subtotal}</Text>
            </View>
            <Text style={[styles.total, { marginTop: 20 }]}>
              Total a pagar: ${order.data.subtotal}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.text}>Estado:</Text>
            {order.data.estado === 1 ? (
              <Text style={[styles.text, styles.badge]}>Creado</Text>
            ) : order.data.estado === 2 ? (
              <Text style={[styles.text, styles.badge]}>Rectificado</Text>
            ) : order.data.estado === 3 ? (
              <Text
                style={[
                  styles.text,
                  styles.badge,
                  { backgroundColor: "#2196f3" },
                ]}
              >
                Entregado
              </Text>
            ) : order.data.estado === 4 ? (
              <Text
                style={[
                  styles.text,
                  styles.badge,
                  { backgroundColor: "#f44336" },
                ]}
              >
                Rechazado
              </Text>
            ) : order.data.estado === 5 ? (
              <Text
                style={[
                  styles.text,
                  styles.badge,
                  { backgroundColor: "#9e9e9e" },
                ]}
              >
                Anulado
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default OrderPDF;