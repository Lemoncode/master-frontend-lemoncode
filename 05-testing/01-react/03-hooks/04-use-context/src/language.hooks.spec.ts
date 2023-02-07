import { renderHook, act } from '@testing-library/react';
import { LanguageProvider } from './language.context';
import { useLanguage } from './language.hooks';

describe('useLanguage specs', () => {
  it('should return a message with language equals "en" when it renders the hook', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    // Assert
    expect(result.current.message).toEqual('The current language is: en');
  });
});
