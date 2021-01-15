import * as React from 'react';

interface Context {
  language: string;
  setLanguage: (language: string) => void;
}

export const LanguageContext = React.createContext<Context>({
  language: '',
  setLanguage: () => {
    console.warn('Provider is not initialized');
  },
});

export const LanguageProvider: React.FunctionComponent = props => {
  const [language, setLanguage] = React.useState('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};
