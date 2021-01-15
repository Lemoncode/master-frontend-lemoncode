import React from 'react';

export const useDebounce = (value, timeout) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);
    return () => {
      clearTimeout(timerId);
    };
  }, [value, timeout]);

  return debouncedValue;
};
