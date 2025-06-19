// Import library mongoose untuk berinteraksi dengan MongoDB
import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

// Interface TypeScript untuk mendefinisikan struktur data User
// Interface ini membantu dalam type checking dan autocomplete
export interface IUser {
  fullName: string; // Nama lengkap pengguna
  username: string; // Username unik pengguna
  email: string; // Email pengguna
  password: string; // Password yang sudah di-hash
  role: string; // Peran pengguna (admin/user)
  profilePicture: string; // URL atau nama file foto profil
  isActive: boolean; // Status aktif pengguna
  isVerified: boolean; // Status verifikasi email
  isDeleted: boolean; // Status soft delete
  isBlocked: boolean; // Status pemblokiran
  isSuspended: boolean; // Status penangguhan
  activationCode: string; // Kode aktivasi untuk verifikasi
  createdAt: Date; // Tanggal pembuatan akun
  updatedAt: Date; // Tanggal terakhir diupdate
}

// Membuat alias untuk mongoose.Schema agar lebih mudah digunakan
const schema = mongoose.Schema;

// Mendefinisikan schema MongoDB untuk koleksi User
const userSchema = new schema(
  {
    // Nama lengkap pengguna - wajib diisi
    fullName: {
      type: schema.Types.String,
      required: true,
      //required: true,              // Wajib diisi
      //       trim: true,                  // Menghapus spasi di awal dan akhir
      //       lowercase: true,             // Mengubah ke huruf kecil
      //       validate: {                  // Custom validation
      //         validator: function(v: string) {
      //           return v.length > 0;
      //         },
      //         message: 'Role tidak boleh kosong'
      //       },
      //       index: true,                 // Membuat index untuk performa query
      //       unique: false,               // Tidak harus unik (bisa ada banyak user dengan role sama)
      //       sparse: false,               // Index akan dibuat untuk semua dokumen
      //       immutable: false,            // Bisa diubah setelah dibuat
      //       select: true,                // Field akan disertakan saat query (default true)
      //       alias: 'userRole',           // Alias untuk field ini
      //       get: function(value: string) { // Getter function saat data diambil
      //         return value ? value.toUpperCase() : value;
      //       },
      //       set: function(value: string) { // Setter function saat data disimpan
      //         return value ? value.toLowerCase() : value;
      //       }
    },
    // Username unik - wajib diisi
    username: {
      type: schema.Types.String,
      required: true,
    },
    // Email pengguna - wajib diisi
    email: {
      type: schema.Types.String,
      required: true,
    },
    // Password yang sudah di-hash - wajib diisi
    password: {
      type: schema.Types.String,
      required: true,
    },
    // Peran pengguna dengan pilihan terbatas
    role: {
      type: schema.Types.String,
      enum: ["admin", "user"], // Hanya boleh "admin" atau "user"
      default: "user", // Default sebagai "user"
    },
    // Foto profil dengan default image
    profilePicture: {
      type: schema.Types.String,
      default: "user.png", // Default menggunakan user.png
    },
    // Status aktif pengguna - default false (tidak aktif)
    isActive: {
      type: schema.Types.Boolean,
      default: false,
    },
    // Status verifikasi email - default false (belum terverifikasi)
    isVerified: {
      type: schema.Types.Boolean,
      default: false,
    },
    // Status soft delete - default false (tidak dihapus)
    isDeleted: {
      type: schema.Types.Boolean,
      default: false,
    },
    // Status pemblokiran - default false (tidak diblokir)
    isBlocked: {
      type: schema.Types.Boolean,
      default: false,
    },
    // Status penangguhan - default false (tidak ditangguhkan)
    isSuspended: {
      type: schema.Types.Boolean,
      default: false,
    },
    // Kode aktivasi untuk verifikasi email (opsional)
    activationCode: {
      type: schema.Types.String,
    },
    // Tanggal pembuatan (akan diisi otomatis oleh timestamps)
    createdAt: {
      type: schema.Types.Date,
    },
    // Tanggal update terakhir (akan diisi otomatis oleh timestamps)
    updatedAt: {
      type: schema.Types.Date,
    },
  },
  {
    // Opsi timestamps: true akan otomatis menambahkan createdAt dan updatedAt
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this as IUser;
  user.password = encrypt(user.password);
  next();
});

// Membuat model User dari schema yang sudah didefinisikan
// Model ini akan digunakan untuk operasi CRUD ke database
const UserModel = mongoose.model("User", userSchema);

// Export model agar bisa digunakan di file lain
export default UserModel;
