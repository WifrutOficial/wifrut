import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

//verificaion
export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se encuentra el token, autorizacion denegada" });
  }

  try {
    const user = jwt.verify(token, TOKEN_SECRET);
    req.user = user;
    console.log("User en authRequired:", req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: "token invalido" });
  }
};
