// Import library mongoose untuk berinteraksi dengan MongoDB
import mongoose from "mongoose";
// Import variabel DATABASE_URL dari file konfigurasi environment
import { DATABASE_URL } from "./env";

// Fungsi asinkron untuk menghubungkan aplikasi ke database MongoDB
const connectDB = async () => {
  try {
    // Validasi: Pastikan DATABASE_URL sudah terdefinisi di environment variables
    // Jika tidak ada, lempar error untuk mencegah koneksi gagal
    if (!DATABASE_URL) {
      throw new Error("Variabel lingkungan DATABASE_URL belum didefinisikan");
    }

    // Melakukan koneksi ke MongoDB menggunakan mongoose
    // Parameter pertama: URL koneksi database
    // Parameter kedua: opsi konfigurasi (dbName untuk menentukan nama database)
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-acara", // Nama database yang akan digunakan
    });

    // Log sukses ke console jika koneksi berhasil
    console.log("Connected to MongoDB");

    // Return Promise yang resolved dengan pesan sukses
    return Promise.resolve("Connected to MongoDB");
  } catch (error) {
    // Jika terjadi error, log error ke console
    console.log(error);

    // Return Promise yang rejected dengan error yang terjadi
    // Ini memungkinkan caller function untuk menangani error
    return Promise.reject(error);
  }
};

// Export fungsi connectDB sebagai default export
// Sehingga bisa diimport dan digunakan di file lain
export default connectDB;
