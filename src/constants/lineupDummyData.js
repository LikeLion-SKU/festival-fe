import DavichiBg from '@/assets/images/davichi.webp';
import DodriBg from '@/assets/images/dodri.webp';
import EnflyBg from '@/assets/images/enfly.webp';
import KiofBg from '@/assets/images/kiof.webp';
import LgnBg from '@/assets/images/lgnshot.webp';
import LimeBg from '@/assets/images/lime.webp';
import ParkBg from '@/assets/images/park.webp';

/**
 * 캐러셀 데이터
 */
export const LINEUP_ITEMS = [
  {
    id: 1,
    artist: '다비치',
    day: 'DAY 2',
    time: '20:00 ~ 20:30',
    image: DavichiBg,
    imageOffsetX: '-3rem',
    imageOffsetY: '2rem',
    textPosition: { left: '8rem', bottom: '2.8rem' },
    textTilt: -3,
  },
  {
    id: 2,
    artist: 'LNGSHOT',
    day: 'DAY 2',
    time: '21:00 ~ 21:30',
    image: LgnBg,
    imageScale: 1.4,
    imageOffsetY: '0.5rem',
    imageOffsetX: '0.2rem',
    textPosition: { left: '6.5rem', bottom: '2.7rem' },
    textTilt: -2,
  },
  {
    id: 3,
    artist: '박재범',
    day: 'DAY 2',
    time: '21:30 ~ 22:00',
    image: ParkBg,
    imageScale: 3,
    imageOffsetX: '0.5rem',
    imageOffsetY: '6rem',
    textPosition: { left: '8rem', bottom: '2.7rem' },
    textTilt: -4,
  },
  {
    id: 4,
    artist: '도드리',
    day: 'DAY 3',
    time: '20:30 ~ 21:00',
    image: DodriBg,
    imageScale: 3.3,
    imageOffsetX: '-0.5rem',
    imageOffsetY: '0.5rem',
    textPosition: { left: '8rem', bottom: '2.7rem' },
    textTilt: -3,
  },
  {
    id: 5,
    artist: '엔플라잉',
    day: 'DAY 3',
    time: '21:00 ~ 21:30',
    image: EnflyBg,
    imageScale: 1.66,
    imageOffsetX: '1.5rem',
    imageOffsetY: '1rem',
    textPosition: { left: '7rem', bottom: '2.7rem' },
    textTilt: -2,
  },
  {
    id: 6,
    artist: 'KISS OF LIFE',
    day: 'DAY 3',
    time: '21:30 ~ 22:00',
    image: KiofBg,
    imageScale: 1.55,
    imageOffsetX: '1.1rem',
    imageOffsetY: '1rem',
    textPosition: { left: '6.15rem', bottom: '2.7rem' },
    textTilt: -4,
  },
  {
    id: 7,
    artist: 'DJ LIME',
    day: 'DAY 3',
    time: '22:00 ~ 23:00',
    image: LimeBg,
    imageScale: 2.75,
    imageOffsetX: '0.2rem',
    imageOffsetY: '5.8rem',
    textPosition: { left: '7rem', bottom: '2.7rem' },
    textTilt: -4,
  },
];
