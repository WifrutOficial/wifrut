import mongoose from 'mongoose';

const repeticionOrderSchema = new mongoose.Schema({
  numeroPedido: { type: String, required: true, unique: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [{ 
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number,
    precio: Number,
  }],
  total: Number,
  direccion: String,
  metodoPago: String,
  fecha: { type: Date, default: Date.now },
});

// Exportando el modelo como "default"
export default mongoose.model('RepeticionOrder', repeticionOrderSchema);
