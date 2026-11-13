import { nextTick } from 'vue'

type TransitionCallback = () => void | Promise<void>

export async function useViewTransition(callback: TransitionCallback) {
  if (typeof document.startViewTransition !== 'function') {
    await callback()
    return
  }

  // The new state is snapshotted as soon as this promise resolves, so flush
  // Vue's pending DOM/style updates (e.g. viewTransitionName) before that.
  await document.startViewTransition(async () => {
    await callback()
    await nextTick()
  }).finished
}
