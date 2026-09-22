import type { Metadata } from 'next';
import './globals.css';
import { Tajawal } from 'next/font/google';
import { ThemeProvider } from './components/ThemeProvider';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'بديلك - ابحث عن بدائل الأدوية',
  description: 'منصة للبحث عن بدائل الأدوية ومقارنة الأسعار ومعرفة نسبة التوفير في مصر.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="font-tajawal bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased min-h-screen transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
