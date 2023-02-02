import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <h2>Hello from Nextjs</h2>
      <Link href="/cars">Navigate to car list</Link>
    </>
  );
};

export default HomePage;
