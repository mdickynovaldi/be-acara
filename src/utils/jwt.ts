// Import Types dari mongoose untuk type ObjectId
import { Types } from "mongoose";
// Import interface IUser dari model user untuk menjadi base interface
import { IUser } from "../models/user.model";
// Import library jsonwebtoken untuk membuat dan memverifikasi JWT token
import jwt from "jsonwebtoken";
// Import SECRET_KEY dari environment variables untuk signing token
import { SECRET_KEY } from "./env";

// Interface IUserToken adalah versi simplified dari IUser yang hanya berisi data
// yang diperlukan untuk JWT token. Menggunakan Omit untuk menghilangkan field-field
// yang tidak perlu disimpan dalam token karena alasan keamanan dan ukuran token.
//
// Kenapa membuat interface baru invece menggunakan IUser langsung?
// 1. KEAMANAN: Field seperti 'password' dan 'activationCode' tidak boleh ada di token
//    karena token bisa dibaca oleh client-side (base64 encoded, bukan encrypted)
// 2. UKURAN TOKEN: Semakin banyak data di token, semakin besar ukurannya. Token
//    dikirim di setiap request, jadi harus minimal
// 3. PERFORMA: Token yang kecil = parsing lebih cepat dan bandwidth lebih hemat
// 4. BEST PRACTICE: Token hanya boleh berisi data yang benar-benar diperlukan
//    untuk authorization/authentication (biasanya hanya id dan role)
export interface IUserToken
  extends Omit<
    IUser,
    | "password"
    | "activationCode"
    | "isActive" // Tidak perlu - bisa dicek real-time dari database
    | "email" // Tidak perlu - bisa diambil dari database jika diperlukan
    | "fullName" // Tidak perlu - bisa diambil dari database jika diperlukan
    | "profilePicture" // Tidak perlu - bisa diambil dari database jika diperlukan
    | "username" // Tidak perlu - bisa diambil dari database jika diperlukan
    | "isVerified" // Tidak perlu - bisa dicek real-time dari database
    | "isDeleted" // Tidak perlu - bisa dicek real-time dari database
    | "isBlocked" // Tidak perlu - bisa dicek real-time dari database
    | "isSuspended" // Tidak perlu - bisa dicek real-time dari database
  > {
  // Menambah field 'id' karena MongoDB menggunakan '_id' tapi lebih umum menggunakan 'id'
  // dalam aplikasi. Field ini akan berisi ObjectId dari user
  id: Types.ObjectId;
}

// Fungsi untuk membuat JWT token dari data user
// Parameter: user object yang sesuai dengan interface IUserToken
// Return: string token yang sudah di-sign dengan SECRET_KEY
export const generateToken = (user: IUserToken) => {
  // Membuat token JWT dengan:
  // - Payload: data user (hanya id dan role)
  // - Secret: SECRET_KEY untuk signing
  // - Options: expiresIn untuk menentukan masa berlaku token (1 jam)
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn: "1h", // Token akan expired dalam 1 jam
  });
  return token;
};

// Fungsi untuk mengekstrak dan memverifikasi data user dari JWT token
// Parameter: token string yang diterima dari client
// Return: object user data yang sudah diverifikasi
export const getUserData = (token: string) => {
  // Memverifikasi token dengan SECRET_KEY dan mengekstrak payload
  // Jika token invalid atau expired, akan throw error
  // Type casting ke IUserToken untuk memastikan struktur data yang benar
  const user = jwt.verify(token, SECRET_KEY) as IUserToken;
  return user;
};
