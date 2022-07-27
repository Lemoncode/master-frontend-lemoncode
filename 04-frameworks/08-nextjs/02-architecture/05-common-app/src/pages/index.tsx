import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useUser } from 'common-app/user';

const HomePage = () => {
  const { credentials, setCredentials, onLogin } = useUser();

  const handleCredentials = () => {
    setCredentials({
      email: 'john@email.com',
      password: 'test',
    });
  };

  return (
    <>
      <Head>
        <title>Rent a car - Home</title>
      </Head>
      <h2>Hello {credentials.email}</h2>
      <button onClick={() => handleCredentials()}>Add credentials</button>
      <button onClick={() => onLogin()}>Login</button>
      <Link href="/cars">Navigate to car list</Link>
    </>
  );
};

export default HomePage;
