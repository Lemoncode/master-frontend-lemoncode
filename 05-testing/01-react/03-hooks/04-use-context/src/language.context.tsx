import React from 'react';

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

interface Props {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<Props> = props => {
  const [language, setLanguage] = React.useState('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};
