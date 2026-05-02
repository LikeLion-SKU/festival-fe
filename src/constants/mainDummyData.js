import { BOOTH_CARDS_FROM_BUILDINGS } from '@/constants/boothBuildingData';

/** @typedef {{ id: string; buildingId: string; image: string; subtitle: string; title: string | string[] }} BoothCardConfig */

/** @type {{ id: string; label: string }[]} */
export const BUILDINGS = [
  { id: 'eunju1', label: '은주1관' },
  { id: 'eunju2', label: '은주2관' },
  { id: 'cheongun', label: '청운관' },
  { id: 'daeil', label: '대일관' },
  { id: 'hyein', label: '혜인관' },
];

/** @type {BoothCardConfig[]} */
export const BOOTH_CARDS = BOOTH_CARDS_FROM_BUILDINGS;
