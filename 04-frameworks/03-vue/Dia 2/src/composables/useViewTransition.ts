export function useViewTransition(callback: () => void) {
  // Progessive Enhancement
  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(() => {
      callback();
    });
  } else {
    callback();
  }
}
