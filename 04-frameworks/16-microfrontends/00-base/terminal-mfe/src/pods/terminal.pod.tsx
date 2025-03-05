import React from 'react';
import type { ExposeProps } from '@cns-microfrontend/react-18';
import './terminal.css';

interface Props extends ExposeProps {
  value: string;
}

export const Terminal: React.FC<Props> = props => {
  const { value } = props;

  return (
    <div id="terminal">
      <div className="crt" />
      {value.substring(0, 6).padEnd(6, '·')}
    </div>
  );
};
