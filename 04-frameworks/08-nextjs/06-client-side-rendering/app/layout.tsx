import 'normalize.css';
import './material-icons.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './theme.context';

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
