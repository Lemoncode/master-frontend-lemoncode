import '@testing-library/jest-dom/vitest';

// Workaround to fix vitest timers for `waitFor` in `@testing-library/react`
// Issue: https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
