import { renderHook, act } from '@testing-library/react';
import { Credential } from './model';
import { useLogin } from './login.hooks';

describe('useLogin specs', () => {
  it('should return an object: credential with default values and setCredential a function when it calls it', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useLogin());

    // Assert
    const defaultCredential: Credential = { name: '', password: '' };
    expect(result.current.credential).toEqual(defaultCredential);
    expect(result.current.setCredential).toEqual(expect.any(Function));
  });

  it('should update credential when it calls setCredential', () => {
    // Arrange
    const newCredential: Credential = { name: 'admin', password: 'test' };

    // Act
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setCredential(newCredential);
    });

    // Assert
    expect(result.current.credential).toEqual(newCredential);
  });
});
