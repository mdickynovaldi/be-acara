// Import tipe-tipe dari Express.js untuk menangani HTTP request/response
import { NextFunction, Request, Response } from "express";
// Import fungsi dan interface dari utils JWT untuk memverifikasi token
import { getUserData, IUserToken } from "../utils/jwt";

// Interface yang memperluas Request Express untuk menambahkan properti user
// Ini memungkinkan kita mengakses data user yang sudah terverifikasi di request object
export interface IRequestUser extends Request {
  user: IUserToken; // Data user yang didecode dari JWT token
}

// Middleware autentikasi yang diekspor sebagai default function
// Parameter: req (Request) - object permintaan HTTP, res (Response) - object respons HTTP, next (NextFunction) - fungsi untuk melanjutkan ke middleware berikutnya
export default (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mengambil header authorization dari request
    // Header ini biasanya berisi token dalam format "Bearer <token>"
    const authorization = req.headers.authorization;

    // Mengecek apakah header authorization ada
    // Jika tidak ada, kembalikan error 401 (Unauthorized)
    if (!authorization) {
      return res.status(401).json({
        message: "Access token is required",
        error: "No authorization header provided",
      });
    }

    // Memisahkan header authorization menjadi prefix dan token
    // Contoh: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." menjadi ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."]
    const [prefix, accessToken] = authorization.split(" ");

    // Memvalidasi bahwa prefix adalah "Bearer"
    // Standar OAuth 2.0 mengharuskan token dikirim dengan format "Bearer <token>"
    if (prefix !== "Bearer") {
      return res.status(401).json({
        message: "Invalid token format",
        error: "Authorization header must start with 'Bearer '",
      });
    }

    // Mengecek apakah token ada setelah prefix "Bearer"
    // Jika tidak ada token setelah "Bearer ", kembalikan error
    if (!accessToken) {
      return res.status(401).json({
        message: "Access token is required",
        error: "No token provided after 'Bearer '",
      });
    }

    // Memverifikasi dan mendecode token menggunakan fungsi getUserData
    // Fungsi ini akan mengembalikan data user jika token valid, atau null jika tidak valid
    const user = getUserData(accessToken);

    // Mengecek apakah token berhasil diverifikasi
    // Jika gagal (user = null), kembalikan error 401
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
        error: "Token verification failed",
      });
    }

    // Menambahkan data user ke request object agar bisa diakses di controller
    // Type casting req sebagai IRequestUser untuk menambahkan properti user
    (req as IRequestUser).user = user;

    // Melanjutkan ke middleware atau controller berikutnya
    return next();
  } catch (error) {
    // Menangkap error yang mungkin terjadi selama proses verifikasi token
    const errorMessage = (error as Error).message;
    let message = "Unauthorized"; // Pesan default

    // Mengecek jenis error JWT dan memberikan pesan yang sesuai
    // jwt malformed: token tidak valid secara format
    if (errorMessage.includes("jwt malformed")) {
      message = "Invalid token format";
    }
    // jwt expired: token sudah kadaluarsa
    else if (errorMessage.includes("jwt expired")) {
      message = "Token has expired";
    }
    // invalid signature: signature token tidak valid (kemungkinan token dipalsukan)
    else if (errorMessage.includes("invalid signature")) {
      message = "Invalid token signature";
    }

    // Mengembalikan response error 401 dengan pesan yang sesuai
    return res.status(401).json({
      message,
      error: errorMessage,
    });
  }
};
