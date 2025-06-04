import mongoose from "mongoose";

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
  },
  descuento: {
    type: Number,
    trim: true,
    default: null,
  },
  precioConDescuento: Number,
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
  kiloMinimo:{
    type:Number,
     enum: [0.5, 1],
    trim: true,

  },
  imagen:{
    type: String,
    trim : true
  }
});

export const Product = mongoose.model("Product", productSchema);
