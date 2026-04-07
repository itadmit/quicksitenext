import type { Metadata } from 'next';
import { Assistant, Bellefair, Noto_Sans_Hebrew } from 'next/font/google';
import './globals.css';

const assistant = Assistant({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-assistant',
  display: 'swap',
});

const notoHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-noto-hebrew',
  display: 'swap',
});

const bellefair = Bellefair({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bellefair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SaaS CMS Platform',
  description: 'פלטפורמת ניהול אתרים',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${assistant.variable} ${notoHebrew.variable} ${bellefair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
