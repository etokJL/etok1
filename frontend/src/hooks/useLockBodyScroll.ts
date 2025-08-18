'use client'

import { useLayoutEffect } from 'react'

/**
 * Locks body scroll when `locked` is true and restores on cleanup.
 * Accounts for scrollbar width to avoid layout shift.
 */
export function useLockBodyScroll(locked: boolean): void {
  useLayoutEffect(() => {
    if (!locked) return
    const { body, documentElement } = document

    // Calculate scrollbar width
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [locked])
}






