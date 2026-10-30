type TransitionCallback = () => void | Promise<void>

export async function useViewTransition(callback: TransitionCallback) {
  if (typeof document.startViewTransition !== 'function') {
    await callback()
    return
  }

  await document.startViewTransition(callback).finished
}
