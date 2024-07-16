import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  badge: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
    marginLeft: "5px",
  },
});

const OrderPDF = ({ order }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Orden #{order.id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Información del Cliente</Text>
        <Text style={styles.text}>Nombre: {order.data.customerData.nombre_cliente}</Text>
        <Text style={styles.text}>RUT: {order.data.customerData.rut_cliente}</Text>
        <Text style={styles.text}>Correo: {order.data.customerData.correo_cliente}</Text>
        <Text style={styles.text}>Teléfono: {order.data.customerData.telefono_cliente}</Text>
        <Text style={styles.text}>Dirección: {order.data.customerData.direccion_cliente}</Text>
        <Text style={styles.text}>Comuna: {order.data.customerData.comuna_cliente}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Información del Proveedor</Text>
        <Text style={styles.text}>Nombre: {order.data.providerData.nombre_razon}</Text>
        <Text style={styles.text}>RUT: {order.data.providerData.rut_proveedor}</Text>
        <Text style={styles.text}>Correo: {order.data.providerData.correo_proveedor}</Text>
        <Text style={styles.text}>Teléfono: {order.data.providerData.telefono_proveedor}</Text>
        <Text style={styles.text}>Dirección: {order.data.providerData.direccion_proveedor}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Producto(s)</Text>
        {order.data.products.map((product, index) => (
          <Text style={styles.text} key={index}>{`${product.name} - Cantidad: ${product.quantity} - Precio: $${product.price}`}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Total: ${order.data.total}</Text>
        <Text style={styles.text}>IVA: ${order.data.iva}</Text>
        <Text style={styles.text}>Subtotal: ${order.data.subtotal}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>
          Estado:{" "}
          {order.data.estado === 1
            ? "Creado"
            : order.data.estado === 2
            ? "Rectificado"
            : order.data.estado === 3
            ? "Entregado"
            : order.data.estado === 4
            ? "Rechazado"
            : order.data.estado === 5
            ? "Anulado"
            : null}
        </Text>
      </View>
    </Page>
  </Document>
);

export default OrderPDF;
