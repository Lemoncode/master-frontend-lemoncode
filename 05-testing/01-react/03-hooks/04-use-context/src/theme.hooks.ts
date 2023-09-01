import React from 'react';
import { ThemeContext } from './theme.context';

export const useTheme = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  const onChangeLightTheme = () => {
    setTheme({ primaryColor: 'white' });
  };

  const onChangeDarkTheme = () => {
    setTheme({ primaryColor: 'black' });
  };

  return {
    theme,
    onChangeLightTheme,
    onChangeDarkTheme,
  };
};
