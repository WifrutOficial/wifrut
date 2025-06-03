import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

//verificaion
export const authRequired = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  console.log("Headers:", req.headers);

  // Try to get token from cookies
  let token = req.cookies && req.cookies.token;
  
  // If token is not in cookies, check if it's in the Authorization header
  // This is a fallback for when cookies aren't being sent by the browser
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader; // If not prefixed with Bearer, try to use it directly
    }
  }
  
  console.log("token", token);
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
    console.error("Error verifying token:", err);
    return res.status(403).json({ message: "token invalido" });
  }
};
