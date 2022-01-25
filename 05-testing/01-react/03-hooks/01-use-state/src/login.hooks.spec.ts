import { renderHook, act } from '@testing-library/react-hooks';
import { User } from 'model';
import { useLogin } from './login.hooks';

describe('useLogin specs', () => {
  it('should return an object: user with default values and setUser a function when it calls it', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useLogin());

    // Assert
    const defaultUser: User = { name: '', password: '' };
    expect(result.current.user).toEqual(defaultUser);
    expect(result.current.setUser).toEqual(expect.any(Function));
  });

  it('should update user when it calls setUser', () => {
    // Arrange
    const newUser: User = { name: 'admin', password: 'test' };

    // Act
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setUser(newUser);
    });

    // Assert
    expect(result.current.user).toEqual(newUser);
  });
});
