import React from 'react';

interface Props {
  children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
};

export default HomeLayout;
