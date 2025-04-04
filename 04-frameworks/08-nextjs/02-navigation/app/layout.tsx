import React from 'react';

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
