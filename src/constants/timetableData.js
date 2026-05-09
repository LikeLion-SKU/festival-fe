import animoonBg from '@/assets/images/animoon.jpg';
import bannerDay21 from '@/assets/images/banner-day2-1.png';
import bannerDay22 from '@/assets/images/banner-day2-2.png';
import bannerDay23 from '@/assets/images/banner-day2-3.png';
import bannerDay24 from '@/assets/images/banner-day2-4.png';
import bannerDay25 from '@/assets/images/banner-day2-5.png';
import bannerDay26 from '@/assets/images/banner-day2-6.png';
import bannerDay27 from '@/assets/images/banner-day2-7.png';
import bannerDay28 from '@/assets/images/banner-day2-8.png';
import bannerDay31 from '@/assets/images/banner-day3-1.png';
import bannerDay32 from '@/assets/images/banner-day3-2.png';
import bannerDay33 from '@/assets/images/banner-day3-3.png';
import bannerDay34 from '@/assets/images/banner-day3-4.png';
import bannerDay35 from '@/assets/images/banner-day3-5.png';
import bannerDay36 from '@/assets/images/banner-day3-6.png';
import bannerDay37 from '@/assets/images/banner-day3-7.png';
import gramiBg from '@/assets/images/grami.jpg';
import imagineBg from '@/assets/images/imagine.jpg';
import SDRBg from '@/assets/images/sdr.png';
import UdreamBg from '@/assets/images/udream.jpg';
import workersBg from '@/assets/images/workers.png';

export const TIMETABLE_DAY_BANNERS = {
  day2: [
    {
      id: 1,
      artist: 'House of SKU',
      team: '실용무용전공',
      time: '17:00 ★ ~ 17:05',
      variant: 1,
      bannerVariant: 3,
      bannerImageSrc: bannerDay21,
    },
    {
      id: 2,
      artist: '유드림',
      team: '동아리',
      time: '17:05 ★ ~ 17:30',
      variant: 2,
      bannerImageSrc: bannerDay22,
      imageSlotSrc: UdreamBg,
    },
    {
      id: 3,
      artist: '도파민',
      team: '실음 x 한무 연합',
      time: '17:30 ★ ~ 17:55',
      variant: 1,
      bannerImageSrc: bannerDay23,
    },
    {
      id: 4,
      artist: 'MSGA',
      team: '실용음악학부',
      time: '17:55 ★ ~ 18:15',
      variant: 2,
      bannerImageSrc: bannerDay24,
    },
    {
      id: 5,
      artist: '예술교육 실용무용',
      team: '실용무용전공',
      time: '18:15 ★ ~ 18:40',
      variant: 1,
      bannerVariant: 3,
      bannerImageSrc: bannerDay25,
    },
    {
      id: 6,
      artist: '스쿠',
      team: '실음 x 실무 연합',
      time: '18:40 ★ ~ 19:00',
      variant: 2,
      bannerImageSrc: bannerDay26,
    },
    {
      id: 7,
      artist: '애니문',
      team: '동아리',
      time: '19:00 ★ ~ 19:30',
      variant: 1,
      bannerImageSrc: bannerDay27,
      imageSlotSrc: animoonBg,
    },
    {
      id: 8,
      artist: '워커스',
      team: '동아리',
      time: '19:30 ★ ~ 20:00',
      variant: 2,
      bannerImageSrc: bannerDay28,
      imageSlotSrc: workersBg,
    },
  ],
  day3: [
    {
      id: 1,
      artist: 'SDR',
      team: '동아리',
      time: '16:30 ★ ~ 17:10',
      variant: 1,
      bannerImageSrc: bannerDay31,
      imageSlotSrc: SDRBg,
    },
    {
      id: 2,
      artist: '티미름',
      team: '실용음악학부',
      time: '17:10 ★ ~ 17:35',
      variant: 2,
      bannerImageSrc: bannerDay32,
    },
    {
      id: 3,
      artist: '그라미',
      team: '동아리',
      time: '17:35 ★ ~ 18:05',
      variant: 1,
      bannerImageSrc: bannerDay33,
      imageSlotSrc: gramiBg,
    },
    {
      id: 4,
      artist: '빡빡이 해적단',
      team: '실용음악학부',
      time: '18:05 ★ ~ 18:30',
      variant: 2,
      bannerImageSrc: bannerDay34,
    },
    {
      id: 5,
      artist: '야르',
      team: '실용음악학부',
      time: '18:30 ★ ~ 18:45',
      variant: 1,
      bannerImageSrc: bannerDay35,
    },
    {
      id: 6,
      artist: 'Time Sale',
      team: '실음 x 실무 연합',
      time: '18:45 ★ ~ 19:15',
      variant: 2,
      bannerImageSrc: bannerDay36,
    },
    {
      id: 7,
      artist: ['Imagine', 'The Impossible'],
      team: '실용음악학부',
      time: '19:15 ★ ~ 19:45',
      variant: 1,
      bannerVariant: 3,
      bannerImageSrc: bannerDay37,
      imageSlotSrc: imagineBg,
    },
  ],
};
