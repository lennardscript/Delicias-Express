import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Componente MyDocument que acepta props y los muestra en el PDF
const MyDocument = ({ proveedor, cliente, productos, total, iva, subtotal }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Proveedor: {proveedor}</Text>
        <Text>Cliente: {cliente}</Text>
        {/* Mapear cada producto a un Text */}
        {productos.map((producto, index) => (
          <Text key={index}>{producto.nombre} - ${producto.precio}</Text>
        ))}
        <Text>Subtotal: ${subtotal}</Text>
        <Text>IVA: ${iva}</Text>
        <Text>Total: ${total}</Text>
      </View>
    </Page>
  </Document>
);

// Componente Pdf que renderiza MyDocument con datos de ejemplo
function Pdf() {
  const datosEjemplo = {
    proveedor: 'Proveedor XYZ',
    cliente: 'Cliente ABC',
    productos: [
      { nombre: 'Producto 1', precio: 100 },
      { nombre: 'Producto 2', precio: 200 }
    ],
    subtotal: 300,
    iva: 60,
    total: 360
  };

  return (
    <MyDocument 
      proveedor={datosEjemplo.proveedor}
      cliente={datosEjemplo.cliente}
      productos={datosEjemplo.productos}
      subtotal={datosEjemplo.subtotal}
      iva={datosEjemplo.iva}
      total={datosEjemplo.total}
    />
  );
}

export default Pdf;