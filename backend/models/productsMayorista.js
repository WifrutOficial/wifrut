import mongoose from "mongoose";

const wholesaleProductSchema = new mongoose.Schema({
  nombre: 
  { type: String,
     required: true, 
     trim: true 
    },
  precio:
   { type: Number,
     required: true, 
     trim: true
     },
  categoria: 
  { type: String,
     required: true,
      trim: true
     },
  stock: { type: Number, 
    required: true, 
    trim: true
 },
  descripcion: { type: String,
     trim: true
     },
  tipoVenta: {
    type: String,
    required: true,
    enum: ["unidad", "litro", "kilo"],
    trim: true,
  },
});

export const WholesaleProduct = mongoose.model(
  "WholesaleProduct",
  wholesaleProductSchema
);
