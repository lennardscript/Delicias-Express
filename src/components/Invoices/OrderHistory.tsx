import React, { useState, useEffect } from 'react';
import { getOrderHistory } from './api'; // Función para obtener historial de órdenes desde tu API

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    // Aquí obtienes el historial de órdenes desde tu API al cargar el componente
    const fetchOrderHistory = async () => {
      try {
        const data = await getOrderHistory(); // Función ficticia, reemplázala por tu lógica real
        setOrderHistory(data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  // Función para contar el número de facturas por estado
  const countOrdersByStatus = (status) => {
    return orderHistory.filter(order => order.data.estado === status).length;
  };

  return (
    <div>
      <h2>Historial de Órdenes</h2>
      <div>
        {/* Mostrar el conteo de facturas por estado */}
        <p>Número de facturas con estado Creado: {countOrdersByStatus(1)}</p>
        <p>Número de facturas con estado Rectificado: {countOrdersByStatus(2)}</p>
        <p>Número de facturas con estado Entregado: {countOrdersByStatus(3)}</p>
        <p>Número de facturas con estado Rechazado: {countOrdersByStatus(4)}</p>
        <p>Número de facturas con estado Anulado: {countOrdersByStatus(5)}</p>
        {/* Ajusta los valores numéricos según los estados que tengas en tu API */}
      </div>
      <h3>Historial de Órdenes Detallado:</h3>
      <div>
        {orderHistory.map((order, index) => (
          <div key={index}>
            <p><strong>Estado:</strong> {
              order.data.estado === 1 ? "Creado" :
              order.data.estado === 2 ? "Rectificado" :
              order.data.estado === 3 ? "Entregado" :
              order.data.estado === 4 ? "Rechazado" :
              order.data.estado === 5 ? "Anulado" :
              null
            }</p>
            {/* Aquí muestra el resto de los detalles de la orden según tu estructura actual */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
