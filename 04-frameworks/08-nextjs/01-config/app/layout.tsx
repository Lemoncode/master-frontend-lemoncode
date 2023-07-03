import React from 'react';

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
