import mongoose from "mongoose";

const mercadoPagoTokenSchema = new mongoose.Schema({
  userId: String, // el ID de la cuenta de Mercado Pago (dueño)
  access_token: String,
  refresh_token: String,
  expires_in: Number, // en segundos
  obtained_at: { type: Date, default: Date.now }
});

export const MercadoPagoToken = mongoose.model("MercadoPagoToken", mercadoPagoTokenSchema);
