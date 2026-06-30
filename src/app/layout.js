import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Community Hero - Hyperlocal Issue Resolution',
  description: 'Report, track, and resolve community issues with AI-powered intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  )
}
