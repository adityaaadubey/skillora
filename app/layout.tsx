import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { MobileNav } from '../components/MobileNav'

export const metadata: Metadata = {
  title: 'Skillora | High-Trust Student Opportunity Intelligence',
  description: 'Verified internships, hackathons, fellowships, and scholarships tailored to your verified technical skills, university major, and career ambitions.',
  keywords: ['internships', 'hackathons', 'scholarships', 'fellowships', 'student opportunities', 'college jobs', 'coding competitions'],
  openGraph: {
    title: 'Skillora | Discover Opportunities Built For Your Skills',
    description: 'Stop sifting through spam. Access verified opportunities matched deterministically to your tech stack.',
    siteName: 'Skillora',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#07090e" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
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
