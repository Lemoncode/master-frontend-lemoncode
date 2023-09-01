import React from 'react';

interface Theme {
  primaryColor: string;
}

interface Context {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<Context>({
  theme: null,
  setTheme: () => {
    console.warn('Provider is not initialized');
  },
});

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = (props) => {
  const [theme, setTheme] = React.useState<Theme>({
    primaryColor: 'white',
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
