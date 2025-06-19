// Import tipe Request dan Response dari Express untuk type checking
import { Request, Response } from "express";
// Import library Yup untuk validasi data input
import * as Yup from "yup";
// Import model User untuk operasi database
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IRequestUser } from "../middlewares/auth.middleware";

// Mendefinisikan tipe data untuk registrasi user
// Ini membantu TypeScript memahami struktur data yang diharapkan
type TRegister = {
  fullName: string; // Nama lengkap pengguna
  username: string; // Username unik pengguna
  email: string; // Email pengguna
  password: string; // Password pengguna
  confirmPassword: string; // Konfirmasi password untuk memastikan kecocokan
};
type TLogin = {
  identifier: string; // Username atau email
  password: string;
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

      const user = await UserModel.findOne({
        $or: [{ username }, { email }],
      });
      if (user) {
        return res.status(400).json({
          message: "User already exists",
          data: null,
        });
      }

      const passwordHash = encrypt(password);

      // Jika validasi berhasil, buat user baru di database
      // Hanya menyimpan data yang diperlukan (tanpa confirmPassword)
      const registerUser = await UserModel.create({
        fullName,
        username,
        email,
        password: passwordHash, // Note: Password ini sebaiknya di-hash terlebih dahulu sebelum disimpan
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
  // Fungsi async untuk menangani proses login pengguna
  // Parameter: req (Request) - object yang berisi data dari client, res (Response) - object untuk mengirim response ke client
  async login(req: Request, res: Response) {
    // Destructuring data dari request body dengan type casting ke TLogin
    // identifier bisa berupa username atau email, password adalah password yang diinput user
    const { identifier, password } = req.body as TLogin;

    try {
      // Mencari user di database berdasarkan identifier (username atau email)
      // Menggunakan operator $or MongoDB untuk mencari berdasarkan salah satu dari dua field
      // Jika identifier cocok dengan username ATAU email, maka user akan ditemukan
      const userByIdentifier = await UserModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      });

      // Mengecek apakah user ditemukan di database
      // Jika tidak ada user dengan username/email tersebut, kembalikan error 403 (Forbidden)
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      // Memvalidasi password dengan cara mengenkripsi password input dan membandingkannya
      // dengan password yang tersimpan di database (yang sudah terenkripsi)
      // encrypt(password) menghasilkan hash dari password input
      // userByIdentifier.password adalah password terenkripsi yang tersimpan di database
      const validationPassword =
        encrypt(password) === userByIdentifier.password;

      // Jika password tidak cocok (validasi gagal)
      // Kembalikan error 403 dengan pesan password salah
      if (!validationPassword) {
        return res.status(403).json({
          message: "Password is incorrect",
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      // Jika semua validasi berhasil (user ditemukan dan password benar)
      // Kembalikan response sukses dengan status 200 dan data user
      // Data user akan otomatis tidak menyertakan password karena sudah di-override di model
      return res.status(200).json({
        message: "Login success",
        data: {
          user: token,
        },
      });
    } catch (error) {
      // Menangkap error yang mungkin terjadi selama proses login
      // (misalnya error database connection, error validasi, dll)
      // Kembalikan response error dengan status 400 (Bad Request)
      return res.status(400).json({
        message: (error as Error).message, // Cast error ke tipe Error untuk mengakses property message
        data: null,
      });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const user = (req as IRequestUser).user;
      const userData = await UserModel.findById(user.id);
      return res.status(200).json({
        message: "Get user data success",
        data: userData,
      });
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
        data: null,
      });
    }
  },
};
