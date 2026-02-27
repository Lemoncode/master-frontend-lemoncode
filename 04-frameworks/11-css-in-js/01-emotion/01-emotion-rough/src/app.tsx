import React from 'react';
import { css, cx } from '@emotion/css';

const color = 'red';

const h1Class = css`
  color: ${color};
`;

const h12Class = (active: string) => css`
  color: ${active};
`;

export const App = () => {
  const [value, setValue] = React.useState('red');
  const [color, setColor] = React.useState(value);

  const handleClick = () => {
    setColor(value);
  };
  return (
    <h1 className={h12Class(color)}>
      Hello React !!
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button onClick={handleClick}>hola</button>
    </h1>
  );
};
