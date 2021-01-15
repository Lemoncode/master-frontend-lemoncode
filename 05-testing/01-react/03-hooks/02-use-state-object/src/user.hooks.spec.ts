import { renderHook, act } from '@testing-library/react-hooks';
import { User } from './model';
import { useUser } from './user.hooks';

describe('useUser specs', () => {
  it('should return user with initial values and setUser method when it calls it', () => {
    // Arrange
    const initialUser: User = {
      name: 'John',
      surname: 'Doe',
    };

    // Act
    const { result } = renderHook(() => useUser(initialUser));

    // Assert
    expect(result.current.user).toEqual(initialUser);
    expect(result.current.setUser).toEqual(expect.any(Function));
  });

  it('should update user when it calls setUser', () => {
    // Arrange
    const initialUser: User = {
      name: 'John',
      surname: 'Doe',
    };

    // Act
    const { result } = renderHook(() => useUser(initialUser));

    act(() => {
      result.current.setUser({
        name: 'updated name',
        surname: 'updated surname',
      });
    });

    // Assert
    expect(result.current.user).toEqual({
      name: 'updated name',
      surname: 'updated surname',
    });
  });
});
