import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/app/providers'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'GetDu.ae — du Authorized Partner | Home & Corporate Internet UAE',
  description:
    'Personalized du home and business packages at your doorstep. Callback on 800 - 43838 · customercare@getdu.ae — fiber, 5G, TV & landline offers (T&C apply).',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'GetDu.ae — du Authorized Partner | Home & Corporate Internet UAE',
    description:
      'Personalized du home and business packages at your doorstep. 800 - 43838 · customercare@getdu.ae',
    images: [{ url: '/logo.png', width: 200, height: 56, alt: 'GetDu.ae' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetDu.ae — du Authorized Partner',
    description: 'Home & corporate internet UAE · 800 - 43838',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
