import { renderHook, waitFor } from '@testing-library/react';
import { usePolling } from './polling.hooks';

describe('usePolling specs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  it('should return count equals 0 when initialize the hook', () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    expect(result.current.count).toEqual(0);
  });

  it('should return count equals 1 when it waits for next update', async () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    await waitFor(() => {
      expect(result.current.count).toEqual(1);
    });
  });

  it('should return count equals 3 when it waits 3 times for next update', async () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    await waitFor(
      () => {
        expect(result.current.count).toEqual(3);
      },
      { timeout: 2000 }
    );
  });

  it('should call clearInterval when it unmounts the component', () => {
    // Arrange
    const pollingTime = 500;
    vi.spyOn(window, 'clearInterval');

    // Act
    const { unmount } = renderHook(() => usePolling(pollingTime));

    // Assert
    expect(clearInterval).not.toHaveBeenCalled();

    unmount();
    expect(clearInterval).toHaveBeenCalled();
  });
});
