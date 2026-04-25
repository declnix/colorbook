export interface ColoringImage {
  id: string
  label: string
  src: string
}

export const IMAGES: ColoringImage[] = [
  { id: 'bear',     label: 'Misio',     src: `${import.meta.env.BASE_URL}images/bear.svg` },
  { id: 'dog',      label: 'Piesek',    src: `${import.meta.env.BASE_URL}images/dog.svg` },
  { id: 'penguin',  label: 'Pingwinek', src: `${import.meta.env.BASE_URL}images/penguin.svg` },
  { id: 'cat',      label: 'Kotek',     src: `${import.meta.env.BASE_URL}images/cat.svg` },
  { id: 'pig',      label: 'Świnka',    src: `${import.meta.env.BASE_URL}images/pig.svg` },
  { id: 'giraffe',  label: 'Żyrafa',    src: `${import.meta.env.BASE_URL}images/giraffe.svg` },
]
