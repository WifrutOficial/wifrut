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
  categoria: {
    type: String,
    required: true,
    trim: true,
  },
  stock:{
    type:Number,
    required:true,
    trim:true,
  },
  descripcion:{
    type:String,
    trim:true,
  }
});

export const Product = mongoose.model("Product", productSchema);
