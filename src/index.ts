// Import library Express.js untuk membuat server web
import express from "express";
// Import router API yang berisi semua endpoint/route aplikasi
import router from "./routes/api";
// Import fungsi untuk koneksi ke database
import connectDB from "./utils/database";

// Fungsi async untuk menginisialisasi dan menjalankan server
async function init() {
  try {
    // Menghubungkan ke database dan menunggu hasilnya
    const result = await connectDB();
    console.log("Database connected", result);

    // Membuat instance aplikasi Express
    const app = express();
    // Menentukan port server akan berjalan (port 3000)
    const port = 3000;

    // Middleware untuk parsing JSON dari request body
    app.use(express.json());
    // Menggunakan router API dengan prefix "/api" untuk semua endpoint
    app.use("/api", router);

    // Menjalankan server dan mendengarkan pada port yang ditentukan
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    // Menangkap dan menampilkan error jika terjadi kesalahan
    console.log(error);
  }
}

// Memanggil fungsi init untuk memulai aplikasi
init();
