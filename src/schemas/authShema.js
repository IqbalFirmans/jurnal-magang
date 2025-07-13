import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email tidak boleh kosong." }).email({ message: "Format email tidak valid." }), 
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

export const registerSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok.",
  path: ["confirmPassword"],
});