import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import classes from './layout.module.css';

interface Props {
  children: React.ReactNode;
}

const CarsLayout = (props: Props) => {
  const { children } = props;
  return (
    <>
      <nav className={classes.nav}>
        <Link href="/" className={classes.link}>
          <Image src="/home-logo.png" alt="logo" width="32" height="23" />
        </Link>
        <h1 className={classes.title}>Rent a car</h1>
      </nav>
      <div className={classes.content}>{children}</div>
    </>
  );
};

export default CarsLayout;
