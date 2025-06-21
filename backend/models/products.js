import mongoose from "mongoose";

// Función para redondear a 2 decimales
const redondear = (valor) => {
  return Math.round(valor * 100) / 100;
};

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  precio: {
    type: Number,
    required: true,
    trim: true,
    set: redondear, // Redondea al guardar
  },
  descuento: {
    type: Number,
    trim: true,
    default: null,
    set: redondear,
  },
  precioConDescuento: {
    type: Number,
    set: redondear,
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  tipoVenta: {
    type: String,
    required: true,
    enum: ["unidad", "litro", "kilo"],
    trim: true,
  },
  kiloMinimo: {
    type: Number,
    enum: [0.5, 0.2, 0.25, 1, 2, 3],
    trim: true,
    set: redondear,
  },
  imagen: {
    type: String,
    trim: true,
  }
});

export const Product = mongoose.model("Product", productSchema);
