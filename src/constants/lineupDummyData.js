import Singer2 from '@/assets/images/singer2.png';

/**
 * 라인업 카드 -DAY 2: id 1→2→3, DAY 3: id 4→5→6 (커서 +1)
 * 화면 회전 느낌은 Lineup.jsx swapSideNeighbors로 DAY 2=반시계, DAY 3=시계로 바꿈
 */
export const LINEUP_DAY_GROUPS = [
  {
    items: [
      {
        id: 1,
        group: '00엔터',
        artist: '아티스트1',
        day: 'DAY 2',
        time: '18:00 ~ 18:30',
        image: Singer2,
        textPosition: { left: '6rem', bottom: '2.55rem' },
        textTilt: -3,
      },
      {
        id: 2,
        group: '00엔터',
        artist: '아티스트2',
        day: 'DAY 2',
        time: '18:40 ~ 19:10',
        image: Singer2,
        textPosition: { left: '5.85rem', bottom: '2.6rem' },
        textTilt: -2,
      },
      {
        id: 3,
        group: '00엔터',
        artist: '아티스트3',
        day: 'DAY 2',
        time: '19:20 ~ 19:50',
        image: Singer2,
        textPosition: { left: '6.15rem', bottom: '2.5rem' },
        textTilt: -4,
      },
    ],
  },
  {
    items: [
      {
        id: 4,
        group: '00엔터',
        artist: '아티스트4',
        day: 'DAY 3',
        time: '17:30 ~ 18:00',
        image: Singer2,
        textPosition: { left: '6rem', bottom: '2.55rem' },
        textTilt: -3,
      },
      {
        id: 5,
        group: '00엔터',
        artist: '아티스트5',
        day: 'DAY 3',
        time: '18:10 ~ 18:40',
        image: Singer2,
        textPosition: { left: '5.85rem', bottom: '2.6rem' },
        textTilt: -2,
      },
      {
        id: 6,
        group: '00엔터',
        artist: '아티스트6',
        day: 'DAY 3',
        time: '18:50 ~ 19:20',
        image: Singer2,
        textPosition: { left: '6.15rem', bottom: '2.5rem' },
        textTilt: -4,
      },
    ],
  },
];
