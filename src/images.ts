export interface ColoringImage {
  id: string
  label: string
  src: string
}

export const IMAGES: ColoringImage[] = [
  { id: 'bear',     label: 'Misio',     src: `${import.meta.env.BASE_URL}images/bear.svg` },
  { id: 'dog',      label: 'Piesek',    src: `${import.meta.env.BASE_URL}images/dog.svg` },
]
