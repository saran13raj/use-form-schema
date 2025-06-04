import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']]
			}
		}),
		tailwindcss()
	],
	server: {
		port: 3000
	},
	build: {
		rollupOptions: {
			external: [/src\/packages/] // Exclude all files in src/packages
		}
	}
});
