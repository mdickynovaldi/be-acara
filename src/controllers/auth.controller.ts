// Import tipe Request dan Response dari Express untuk type checking
import { Request, Response } from "express";
// Import library Yup untuk validasi data input
import * as Yup from "yup";
// Import model User untuk operasi database
import UserModel from "../models/user.model";

// Mendefinisikan tipe data untuk registrasi user
// Ini membantu TypeScript memahami struktur data yang diharapkan
type TRegister = {
  fullName: string; // Nama lengkap pengguna
  username: string; // Username unik pengguna
  email: string; // Email pengguna
  password: string; // Password pengguna
  confirmPassword: string; // Konfirmasi password untuk memastikan kecocokan
};

// Membuat schema validasi menggunakan Yup untuk memvalidasi data registrasi
const registerValidateSchema = Yup.object({
  // Validasi nama lengkap: harus berupa string dan wajib diisi
  fullName: Yup.string().required("Full name is required"),
  // Validasi username: harus berupa string dan wajib diisi
  username: Yup.string().required("Username is required"),
  // Validasi email: harus berupa string, format email valid, dan wajib diisi
  email: Yup.string().email().required("Email is required"),
  // Validasi password: harus berupa string dan wajib diisi
  password: Yup.string().required("Password is required"),
  // Validasi konfirmasi password: wajib diisi dan harus sama dengan password
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Password not match"), // Memastikan confirmPassword sama dengan password
});

// Export default object yang berisi fungsi-fungsi controller autentikasi
export default {
  // Fungsi async untuk menangani registrasi user baru
  register: async (req: Request, res: Response) => {
    // Mengecek apakah request body ada/tidak kosong
    // Jika tidak ada body, kembalikan error 400 (Bad Request)
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is required",
        data: null,
      });
    }

    // Destructuring data dari request body dengan type casting ke TRegister
    // Ini mengambil field-field yang diperlukan dari req.body
    const { fullName, username, email, password, confirmPassword } =
      req.body as TRegister;

    try {
      // Memvalidasi data input menggunakan schema yang sudah didefinisikan
      // Jika validasi gagal, akan throw error dan masuk ke catch block
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      // Jika validasi berhasil, buat user baru di database
      // Hanya menyimpan data yang diperlukan (tanpa confirmPassword)
      const registerUser = await UserModel.create({
        fullName,
        username,
        email,
        password, // Note: Password ini sebaiknya di-hash terlebih dahulu sebelum disimpan
      });

      // Mengembalikan response sukses dengan status 200 dan data user yang baru dibuat
      return res.status(200).json({
        message: "Register success",
        data: {
          registerUser,
        },
      });
    } catch (error) {
      // Jika terjadi error (validasi gagal atau error database)
      // Kembalikan response error dengan status 400 dan pesan error
      return res.status(400).json({
        message: (error as Error).message, // Cast error ke tipe Error untuk mengakses property message
        data: null,
      });
    }
  },
};
