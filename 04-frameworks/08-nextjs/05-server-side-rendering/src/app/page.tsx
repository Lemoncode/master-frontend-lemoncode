import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rent a car - Home',
};

const RootPage = () => {
  return (
    <>
      <h2>Hello from Nextjs</h2>
      <Link href="/cars">Navigate to car list</Link>
    </>
  );
};

export default RootPage;
