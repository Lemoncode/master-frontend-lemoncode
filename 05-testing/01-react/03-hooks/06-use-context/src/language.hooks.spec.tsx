import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { LanguageProvider } from './language.context';
import { useLanguage } from './language.hooks';

describe('useLanguage specs', () => {
  it('should return a message with language equals "es" when it renders the hook', () => {
    // Arrange
    const provider: React.FunctionComponent = (props) => (
      <LanguageProvider>{props.children}</LanguageProvider>
    );

    // Act
    const { result } = renderHook(() => useLanguage(), { wrapper: provider });

    result.current.setLanguage('es');

    // Assert
    expect(result.current.message).toEqual('The current language is: es');
  });

  it('should return a message with language equals "english" when it call setLanguage with "english"', () => {
    // Arrange
    const provider: React.FunctionComponent = (props) => (
      <LanguageProvider>{props.children}</LanguageProvider>
    );

    // Act
    const { result } = renderHook(() => useLanguage(), { wrapper: provider });

    act(() => {
      result.current.setLanguage('english');
    });

    // Assert
    expect(result.current.message).toEqual('The current language is: english');
  });
});
