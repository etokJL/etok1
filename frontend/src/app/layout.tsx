import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './simple-globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/layout/navigation'
import { ChatProvider } from '@/components/providers/chat-provider'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'NFT',
    'Web3',
    'Blockchain',
    'Collection',
    'Energy',
    'Switzerland',
    'Decentralized',
    'Trading Cards',
  ],
  authors: [{ name: 'Booster Team' }],
  creator: 'Booster',
  publisher: 'Booster',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://booster-cards.swiss'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://booster-cards.swiss',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@booster_swiss',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning data-theme="marine">
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden overflow-y-auto">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <ChatProvider />
          </div>
        </Providers>
      </body>
    </html>
  )
}