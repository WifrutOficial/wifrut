import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      nombre: String,
      cantidad: Number,
      precio: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  direccion: {
    type: String,
    required: true,  
  },
  metodoPago: {
    type: String,
    enum: ["Efectivo", "Mercado Pago"],  
    required: true, 
  },
  status: {
    type: String,
    enum: ["pendiente", "procesando", "enviado", "entregado"],
    default: "pendiente",
  },
  paymentStatus: {  // Nuevo campo para el estado del pago
    type: String,
    enum: ["aprobado", "pendiente", "fallido"],
    default: "pendiente",
  },
  preferenceId: {  // Nuevo campo para el ID de la preferencia de pago de Mercado Pago
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);
