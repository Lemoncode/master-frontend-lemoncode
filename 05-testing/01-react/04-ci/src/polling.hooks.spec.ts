import { renderHook } from '@testing-library/react-hooks';
import { usePolling } from './polling.hooks';

describe('usePolling specs', () => {
  it('should return count equals 0 when initialize the hook', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => usePolling());

    // Assert
    expect(result.current.count).toEqual(0);
  });

  it('should return count equals 1 when it waits for next update', async () => {
    // Arrange

    // Act
    const { result, waitForNextUpdate } = renderHook(() => usePolling());

    await waitForNextUpdate();

    // Assert
    expect(result.current.count).toEqual(1);
  });

  it('should return count equals 3 when it waits 3 times for next update', async () => {
    // Arrange

    // Act
    const { result, waitForValueToChange } = renderHook(() => usePolling());

    await waitForValueToChange(() => result.current.count === 3, {
      timeout: 2000,
    });

    // Assert
    expect(result.current.count).toEqual(3);
  });

  it('should call clearInterval when it unmounts the component', () => {
    // Arrange
    const clearIntervalStub = jest.spyOn(window, 'clearInterval');

    // Act
    const { result, unmount } = renderHook(() => usePolling());

    // Assert
    expect(clearIntervalStub).not.toHaveBeenCalled();

    unmount();
    expect(clearIntervalStub).toHaveBeenCalled();
  });
});
