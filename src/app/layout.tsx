import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/lib/theme';
import { SessionProvider } from '@/app/components/sessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Koperasi Admin',
  description: 'Sistem Admin untuk Koperasi',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}