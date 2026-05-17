import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import type { ImageSize } from './types'

export function useFitContainer(
  containerRef: RefObject<HTMLElement | null>,
  imageSize: ImageSize | null,
): { width: number; height: number } | null {
  const [fit, setFit] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (!imageSize) {
      setFit(null)
      return
    }
    const el = containerRef.current
    if (!el) return

    function compute() {
      const node = containerRef.current
      if (!node || !imageSize) return
      const rect = node.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const scale = Math.min(rect.width / imageSize.width, rect.height / imageSize.height)
      setFit({
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      })
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(el)
    return () => observer.disconnect()
  }, [imageSize, containerRef])

  return fit
}
