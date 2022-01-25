import React from 'react';

export const usePolling = (pollingTime: number) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // Simulate calls to api and count it
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, pollingTime);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { count };
};
