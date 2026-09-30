import type { Metadata } from 'next'
import './globals.css'
import { Navbar, MobileNav } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const metadata: Metadata = {
  title: 'Skillora | High-Trust Student Opportunity Intelligence',
  description: 'Verified internships, hackathons, fellowships, and scholarships tailored to your verified technical skills, university major, and career ambitions.',
  keywords: ['internships', 'hackathons', 'scholarships', 'fellowships', 'student opportunities', 'college jobs', 'coding competitions'],
  icons: {
    icon: [
      { url: '/logo-icon.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
  openGraph: {
    title: 'Skillora | Discover Opportunities Built For Your Skills',
    description: 'Stop sifting through spam. Access verified opportunities matched deterministically to your tech stack.',
    siteName: 'Skillora',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/logo-full.png', width: 1200, height: 630, alt: 'Skillora Logo' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <meta name="theme-color" content="#07090e" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('skillora-theme');var t=s||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" style={{ minHeight: 'calc(100vh - 68px - 300px)' }}>
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
