'use client';
import { ThemeContext } from '@/theme.context';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Nav: React.FC<Props> = (props) => {
  const { children, className } = props;
  const { theme, onToggleThemeMode } = React.useContext(ThemeContext);
  return (
    <nav
      className={className}
      style={{ backgroundColor: theme.primary, color: theme.contrastText }}
    >
      {children}
      <button style={{ marginLeft: 'auto' }} onClick={onToggleThemeMode}>
        Toggle theme
      </button>
    </nav>
  );
};
