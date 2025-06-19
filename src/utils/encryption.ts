// Import modul crypto bawaan Node.js untuk operasi kriptografi
import crypto from "crypto";
// Import SECRET_KEY dari file env untuk digunakan sebagai salt
import { SECRET_KEY } from "./env";

// Fungsi untuk mengenkripsi password menggunakan algoritma PBKDF2
// Parameter: password (string) - password yang akan dienkripsi
// Return: string - password yang sudah di-hash dalam format hexadecimal
export const encrypt = (password: string): string => {
  // Menggunakan PBKDF2 (Password-Based Key Derivation Function 2) untuk hash password
  // - password: password asli yang akan di-hash
  // - SECRET_KEY: salt untuk menambah keamanan (dari environment variable)
  // - 1000: jumlah iterasi hashing (semakin tinggi semakin aman tapi lambat)
  // - 64: panjang key yang dihasilkan dalam bytes
  // - "sha512": algoritma hash yang digunakan (SHA-512)
  const encryptionKey = crypto
    .pbkdf2Sync(password, SECRET_KEY, 1000, 64, "sha512")
    .toString("hex"); // Mengkonversi hasil hash ke format hexadecimal string

  // Mengembalikan password yang sudah di-hash
  return encryptionKey;
};
