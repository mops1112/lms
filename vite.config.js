import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite'
dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
		allowedHosts: true
	},
  base: '/', // รองรับเส้นทางที่ถูกต้อง
});
