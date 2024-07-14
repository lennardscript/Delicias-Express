export interface OrderData {
  providerId: string;
  providerData: {
    rut_proveedor: string;
    nombre_razon: string;
    correo_proveedor: string;
    telefono_proveedor: string;
    direccion_proveedor: string;
  };
  customerId: string;
  customerData: {
    rut_cliente: string;
    nombre_cliente: string;
    correo_cliente: string;
    telefono_cliente: string;
    direccion_cliente: string;
    comuna_cliente: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  iva: number;
  subtotal: number;
  estado: 1 | 2 | 3 | 4 | 5; // 1: Creado, 2: Rectificado, 3: Entregado, 4: Rechazado, 5: Anulado
}
