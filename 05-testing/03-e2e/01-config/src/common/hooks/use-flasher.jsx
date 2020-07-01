import React from 'react';

export const useFlasher = () => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current.setAttribute(
      'style',
      `box-shadow: 0 0 8px 1px red;
       background-color: tomatoe;
       transition: box-shadow 50ms ease-out;`
    );
    setTimeout(() => ref.current.setAttribute('style', ''), 300);
  });
  return ref;
};
