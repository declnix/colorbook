export interface ColoringImage {
  id: string
  label: string
  src: string
}

export const IMAGES: ColoringImage[] = [
  { id: 'dinosaur', label: 'Dinozaur', src: `${import.meta.env.BASE_URL}images/dinosaur.svg` },
]
