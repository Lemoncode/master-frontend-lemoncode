import { ThemeProvider } from '#core/theme.context';
import { Inter } from 'next/font/google';
import 'normalize.css';
import React from 'react';
import './material-icons.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ThemeProvider>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
