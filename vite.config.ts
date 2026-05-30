import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/** Vite 配置：使用 React 与 Tailwind CSS v4 插件承载 GSAP 演示站。 */
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rolldownOptions: {
			output: {
				chunkFileNames: 'assets/chunks/[name]-[hash].js',
				codeSplitting: {
					groups: [
						{ name: 'react-vendor', test: /node_modules[\\/](react|react-dom)[\\/]/, priority: 40 },
						{ name: 'gsap-vendor', test: /node_modules[\\/]gsap[\\/]/, priority: 35 },
						{ name: 'radix-vendor', test: /node_modules[\\/]radix-ui[\\/]/, priority: 30 },
						{ name: 'icons-vendor', test: /node_modules[\\/]lucide-react[\\/]/, priority: 25 },
						{ name: 'vendor', test: /node_modules[\\/]/, priority: 10 }
					]
				}
			}
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})
