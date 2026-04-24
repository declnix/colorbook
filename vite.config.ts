import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'os'
import qrcode from 'qrcode-terminal'

function qrPlugin() {
  return {
    name: 'qr-code',
    configureServer(server: any) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer!.address()
        const port = typeof addr === 'object' ? addr?.port : 5173
        const ip = Object.values(os.networkInterfaces())
          .flat()
          .find((iface: any) => iface?.family === 'IPv4' && !iface.internal)?.address
        if (ip) {
          const url = `http://${ip}:${port}`
          qrcode.generate(url, { small: true })
          console.log(`  Network: ${url}`)
        }
      })
    }
  }
}

export default defineConfig({
  base: '/colorbook/',
  plugins: [tailwindcss(), react(), qrPlugin()],
  server: {
    host: true,
  }
})
