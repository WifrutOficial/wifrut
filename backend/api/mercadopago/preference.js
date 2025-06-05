import { createOrderAndPreference } from "../../../controllers/mercadoPagoController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return createOrderAndPreference(req, res);
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
