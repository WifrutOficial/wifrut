import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";


export const authRequired = (req, res, next) => {
  let token = req.cookies && req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se encuentra el token, autorizacion denegada" });
  }

  try {
    const user = jwt.verify(token, TOKEN_SECRET);
    req.user = user;

    next();
  } catch (err) {

    return res.status(403).json({ message: "token invalido" });
  }
};
