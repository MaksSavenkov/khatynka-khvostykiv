import type { ImageSource } from 'expo-image';

import type { PetProfile } from '@/data/pets';

// Риси характеру й способу життя для підбору тваринки («Знайди свого хвостика»)
export type Trait = 'active' | 'slow' | 'chaos' | 'hugs' | 'kids' | 'flat';

export const TRAITS: { key: Trait; label: string; icon: ImageSource }[] = [
  { key: 'active', label: 'Завжди в русі', icon: require('../../assets/images/icon-footprints.svg') },
  { key: 'slow', label: 'Повільні ранки', icon: require('../../assets/images/icon-coffee.svg') },
  { key: 'chaos', label: 'Готовий до хаосу', icon: require('../../assets/images/icon-zap.svg') },
  { key: 'hugs', label: 'Любить обійми', icon: require('../../assets/images/chip-hug.svg') },
  { key: 'kids', label: 'Ладнає з дітьми', icon: require('../../assets/images/chip-kids.svg') },
  { key: 'flat', label: 'Для квартири', icon: require('../../assets/images/chip-flat.svg') },
];

// Тваринки, що мають хоча б одну з обраних рис; ті, що збігаються більше, — першими
export function matchPets(pets: PetProfile[], selected: Trait[]) {
  if (selected.length === 0) return [];
  const score = (pet: PetProfile) => (pet.traits ?? []).filter((t) => selected.includes(t)).length;
  return pets
    .map((pet) => ({ pet, score: score(pet) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((p) => p.pet);
}
