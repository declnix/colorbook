import { useEffect, useState } from 'react'
import { IMAGES } from '../../images'
import { TARGET_LONG_EDGE } from './constants'
import { buildRegionMap, regionAt } from './regionMap'
import type { ImageSize, RegionMap } from './types'

type State = {
  ready: boolean
  imageSize: ImageSize | null
  regionMap: RegionMap | null
}

const INITIAL: State = { ready: false, imageSize: null, regionMap: null }

export function useColoringImage(imageId: string): State & {
  regionAt: (x: number, y: number) => number
} {
  const [state, setState] = useState<State>(INITIAL)

  useEffect(() => {
    const entry = IMAGES.find((i) => i.id === imageId)
    if (!entry) {
      setState(INITIAL)
      return
    }

    let cancelled = false
    setState(INITIAL)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = entry.src

    img
      .decode()
      .then(() => {
        if (cancelled) return
        const longest = Math.max(img.naturalWidth, img.naturalHeight)
        if (longest === 0) return
        const scale = TARGET_LONG_EDGE / longest
        const width = Math.round(img.naturalWidth * scale)
        const height = Math.round(img.naturalHeight * scale)
        const regionMap = buildRegionMap(img, width, height)
        if (cancelled) return
        setState({ ready: true, imageSize: { width, height }, regionMap })
      })
      .catch(() => {
        if (!cancelled) setState(INITIAL)
      })

    return () => {
      cancelled = true
    }
  }, [imageId])

  return {
    ...state,
    regionAt: (x, y) => (state.regionMap ? regionAt(state.regionMap, x, y) : 0),
  }
}
