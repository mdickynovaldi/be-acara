// Import library Express.js untuk membuat router
import express from "express";
// Import controller autentikasi yang berisi fungsi-fungsi untuk menangani proses auth
import authController from "../controllers/auth.controller";

// Membuat instance router Express untuk mengelompok endpoint/route API
const router = express.Router();

// Mendefinisikan route POST untuk endpoint registrasi user
// Ketika ada request POST ke "/auth/register", akan memanggil fungsi register dari authController
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Export router agar bisa digunakan di file lain (seperti di index.ts)
export default router;
