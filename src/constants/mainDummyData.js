import BoothImage1 from '@/assets/images/booth_image.svg';

/** @typedef {{ id: string; buildingId: string; image: string; subtitle: string; title: string | string[] }} BoothCardConfig */

/** @type {{ id: string; label: string }[]} */
export const BUILDINGS = [
  { id: 'yudam', label: '유담관' },
  { id: 'eunju1', label: '은주1관' },
  { id: 'eunju2', label: '은주2관' },
  { id: 'cheongun', label: '청운관' },
  { id: 'daeil', label: '대일관' },
];

/** @type {BoothCardConfig[]} */
export const BOOTH_CARDS = [
  {
    id: 'yudam-1',
    buildingId: 'yudam',
    image: BoothImage1,
    subtitle: '혜인관 좌측',
    title: '경영학부',
  },
  {
    id: 'yudam-2',
    buildingId: 'yudam',
    image: BoothImage1,
    subtitle: '혜인관 좌측',
    title: '아동청소년학과',
  },
  {
    id: 'yudam-3',
    buildingId: 'yudam',
    image: BoothImage1,
    subtitle: '혜인관 좌측',
    title: '공공인재학부',
  },
  {
    id: 'yudam-4',
    buildingId: 'yudam',
    image: BoothImage1,
    subtitle: '혜인관 좌측',
    title: '군사학과',
  },
  {
    id: 'eunju1-1',
    buildingId: 'eunju1',
    image: BoothImage1,
    subtitle: '은주1관 1층',
    title: '군사학과',
  },
  {
    id: 'eunju1-2',
    buildingId: 'eunju1',
    image: BoothImage1,
    subtitle: '은주1관 로비',
    title: '일어전공',
  },
  {
    id: 'eunju1-3',
    buildingId: 'eunju1',
    image: BoothImage1,
    subtitle: '은주1관 중앙',
    title: '중어전공',
  },
  {
    id: 'eunju1-4',
    buildingId: 'eunju1',
    image: BoothImage1,
    subtitle: '은주1관 테라스',
    title: '금융정보공학과',
  },
  {
    id: 'eunju2-1',
    buildingId: 'eunju2',
    image: BoothImage1,
    subtitle: '은주2관 앞',
    title: '나노화학생명공학과',
  },
  {
    id: 'eunju2-2',
    buildingId: 'eunju2',
    image: BoothImage1,
    subtitle: '은주2관 복도',
    title: '토목건축공학과',
  },
  {
    id: 'eunju2-3',
    buildingId: 'eunju2',
    image: BoothImage1,
    subtitle: '은주2관 측면',
    title: '소프트웨어학과',
  },
  {
    id: 'eunju2-4',
    buildingId: 'eunju2',
    image: BoothImage1,
    subtitle: '은주2관 광장',
    title: '전자컴퓨터공학과',
  },
  {
    id: 'cheongun-1',
    buildingId: 'cheongun',
    image: BoothImage1,
    subtitle: '청운관 로비',
    title: '도시공학과',
  },
  {
    id: 'cheongun-2',
    buildingId: 'cheongun',
    image: BoothImage1,
    subtitle: '청운관 2층',
    title: '물류시스템공학과',
  },
  {
    id: 'cheongun-3',
    buildingId: 'cheongun',
    image: BoothImage1,
    subtitle: '청운관 입구',
    title: '영화영상학과',
  },
  {
    id: 'cheongun-4',
    buildingId: 'cheongun',
    image: BoothImage1,
    subtitle: '청운관 테라스',
    title: '미용예술학부',
  },
  {
    id: 'daeil-1',
    buildingId: 'daeil',
    image: BoothImage1,
    subtitle: '대일관 정문',
    title: '실용음악학부',
  },
  {
    id: 'daeil-2',
    buildingId: 'daeil',
    image: BoothImage1,
    subtitle: '대일관 중앙',
    title: '디자인학부',
  },
  {
    id: 'daeil-3',
    buildingId: 'daeil',
    image: BoothImage1,
    subtitle: '대일관 후문',
    title: '광고홍보영상학과',
  },
  {
    id: 'daeil-4',
    buildingId: 'daeil',
    image: BoothImage1,
    subtitle: '대일관 옆',
    title: ['스포츠앤', '테크놀로지학과'],
  },
];
