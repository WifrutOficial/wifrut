import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';


//creacion de token 
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}

// Verificar un token ---- NO USAR PERO LO DEJO POR LAS DUDAS, DESPUES BORRAR!!!
export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) reject("Token inválido");
            resolve(decoded);
        });
    });
}