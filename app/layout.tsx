import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Chatbot } from '@/components/chatbot/chatbot'
import { SearchModal } from '@/components/SearchModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cinema Management - Rạp Chiếu Phim Hiện Đại',
  description: 'Hệ thống quản lý rạp chiếu phim với AI và đặt vé online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster />
          <Chatbot />
          <SearchModal />
        </Providers>
      </body>
    </html>
  )
}
