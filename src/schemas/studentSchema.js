import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const studentFormSchema = (isEditing) =>
  z
    .object({
      namaLengkap: z.string().min(1, { message: 'Nama Lengkap wajib diisi.' }),
      nisn: z.string().regex(/^\d{10}$/, { message: 'NISN harus terdiri dari 10 digit angka.' }),
      tanggalLahir: z.string().min(1, { message: 'Tanggal Lahir wajib diisi.' }),
      jenisKelamin: z.enum(['man', 'woman'], { message: 'Jenis Kelamin tidak valid.' }),
      alamat: z.string().min(5, { message: 'Alamat minimal 5 karakter.' }),
      noTelp: z
        .string()
        .min(10, { message: 'No Telepon minimal 10 karakter.' })
        .max(12, { message: 'No Telepon maksimal 12 karakter.' }),
      email: z.string().email({ message: 'Format email tidak valid.' }),

      password: isEditing
        ? z.string().optional()
        : z.string().min(6, { message: 'Password minimal 6 karakter.' }),

      password_confirmation: isEditing
        ? z.string().optional()
        : z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter.' }),

      fotoSiswaFile: isEditing
        ? z
            .any()
            .optional()
            .refine((file) => {
              if (!file) return true;
              return file instanceof File && file.size <= MAX_FILE_SIZE;
            }, {
              message: 'Ukuran foto maksimal 2MB.',
            })
            .refine((file) => {
              if (!file) return true;
              return ACCEPTED_IMAGE_TYPES.includes(file.type);
            }, {
              message: 'Format gambar harus JPG, PNG, atau WEBP.',
            })
        : z
            .instanceof(File, { message: 'Foto wajib diunggah.' })
            .refine((file) => file.size <= MAX_FILE_SIZE, {
              message: 'Ukuran foto maksimal 2MB.',
            })
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
              message: 'Format gambar harus JPG, PNG, atau WEBP.',
            }),
    })
    .refine((data) => {
      if (!isEditing) {
        return data.password === data.password_confirmation;
      }
      return true;
    }, {
      message: 'Konfirmasi password tidak sesuai.',
      path: ['password_confirmation'],
    });
