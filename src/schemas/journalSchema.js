// src/schemas/journalSchema.js
import { z } from 'zod';

// Sesuaikan dengan validasi Laravel Anda
const MIN_TITLE_CHARS = 5; // Sesuai Laravel
const MAX_TITLE_CHARS = 50; // Sesuai Laravel
const MIN_DESC_CHARS = 1; // Sesuai Laravel
const MAX_DESC_CHARS = 500;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB, sesuai 2048 KB di Laravel
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const jurnalSchema = (isEditing = false) => z.object({
    judulJurnal: z.string()
        .min(MIN_TITLE_CHARS, `Judul jurnal minimal ${MIN_TITLE_CHARS} karakter.`)
        .max(MAX_TITLE_CHARS, `Judul jurnal maksimal ${MAX_TITLE_CHARS} karakter.`),
    deskripsi: z.string()
        .min(MIN_DESC_CHARS, `Deskripsi minimal ${MIN_DESC_CHARS} karakter.`)
        .max(MAX_DESC_CHARS, `Deskripsi maksimal ${MAX_DESC_CHARS} karakter.`),
    
    // Logika ini tetap baik, karena di mode edit, gambar boleh null (tidak diganti)
    thumbnailFile: isEditing
        ? z.union([ 
            z.null(), // Boleh kosong jika tidak ada file baru
            z.instanceof(File)
                .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran file maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
                .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Hanya format .jpg, .jpeg, .png, dan .webp yang diizinkan.")
          ])
        : z.instanceof(File, "Thumbnail jurnal wajib diunggah.") 
             .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran file maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
             .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Hanya format .jpg, .jpeg, .png, dan .webp yang diizinkan."),
});