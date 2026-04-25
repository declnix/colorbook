export interface ColoringImage {
  id: string
  label: string
  src: string
}

export const IMAGES: ColoringImage[] = [
  { id: 'cat',       label: 'Kot',        src: '/colorbook/images/cat.svg' },
  { id: 'car',       label: 'Samochód',   src: '/colorbook/images/car.svg' },
  { id: 'butterfly', label: 'Motyl',      src: '/colorbook/images/butterfly.svg' },
  { id: 'star',      label: 'Gwiazdka',   src: '/colorbook/images/star.svg' },
  { id: 'apple',     label: 'Jabłko',     src: '/colorbook/images/apple.svg' },
  { id: 'dog',       label: 'Pies',       src: '/colorbook/images/dog.svg' },
  { id: 'flower',    label: 'Kwiatek',    src: '/colorbook/images/flower.svg' },
  { id: 'rocket',    label: 'Rakieta',    src: '/colorbook/images/rocket.svg' },
  { id: 'icecream',  label: 'Lody',       src: '/colorbook/images/icecream.svg' },
  { id: 'boat',      label: 'Łódka',      src: '/colorbook/images/boat.svg' },
  { id: 'dinosaur', label: 'Dinozaur',   src: '/colorbook/images/dinosaur.svg' },
]
