let hasPreloadedPaperManagementVendor = false

type IdleCallback = (deadline: {
  didTimeout: boolean
  timeRemaining: () => number
}) => void

type WindowWithIdleCallback = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleCallback, options?: { timeout: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }

function preloadPaperManagementVendor() {
  if (hasPreloadedPaperManagementVendor) {
    return
  }

  hasPreloadedPaperManagementVendor = true
  void import('lodash/startCase')
}

export function preloadPaperManagementVendorWhenIdle() {
  if (typeof window === 'undefined' || hasPreloadedPaperManagementVendor) {
    return undefined
  }

  const idleWindow = window as WindowWithIdleCallback
  let frameId: number | undefined
  let idleId: number | undefined
  let timeoutId: number | undefined

  frameId = window.requestAnimationFrame(() => {
    frameId = undefined

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(preloadPaperManagementVendor, {
        timeout: 4000,
      })
      return
    }

    timeoutId = window.setTimeout(preloadPaperManagementVendor, 0)
  })

  return () => {
    if (frameId !== undefined) {
      window.cancelAnimationFrame(frameId)
    }

    if (idleId !== undefined) {
      idleWindow.cancelIdleCallback?.(idleId)
    }

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId)
    }
  }
}
