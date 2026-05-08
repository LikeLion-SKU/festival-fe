import BoothDefaultImage from '@/assets/images/booth-default.png';
import BoothImagePlaceholder from '@/assets/images/booth_image.svg';
import CheongunChineseImage from '@/assets/images/cheongun-chinese.png';
import CheongunDoshiImage from '@/assets/images/cheongun-doshi.png';
import CheongunJapanImage from '@/assets/images/cheongun-japan.png';
import CheongunSportImage from '@/assets/images/cheongun-sport.png';
import CheongunYoongImage from '@/assets/images/cheongun-yoong.png';
import DaeilElectricImage from '@/assets/images/daeil-electric.png';
import DaeilIgongImage from '@/assets/images/daeil-igong.png';
import DaeilMoneyImage from '@/assets/images/daeil-money.png';
import DaeilMullImage from '@/assets/images/daeil-mull.png';
import DaeilNanoImage from '@/assets/images/daeil-nano.png';
import DaeilTomokImage from '@/assets/images/daeil-tomok.png';
import Eunju1AdongImage from '@/assets/images/eunju1-adong.png';
import Eunju1GongongImage from '@/assets/images/eunju1-gongong.png';
import Eunju1GyoungImage from '@/assets/images/eunju1-gyoung.png';
import Eunju1Mirae1Image from '@/assets/images/eunju1-mirae1.png';
import Eunju1Mirae2Image from '@/assets/images/eunju1-mirae2.png';
import Eunju1SoftwareImage from '@/assets/images/eunju1-software.png';
import Eunju2BeautyImage from '@/assets/images/eunju2-beauty.png';
import Eunju2Design11Image from '@/assets/images/eunju2-design1.png';
import Eunju2Design2Image from '@/assets/images/eunju2-design2.png';
import Eunju2GunsaImage from '@/assets/images/eunju2-gunsa.png';
import Eunju2GwangImage from '@/assets/images/eunju2-gwang.png';
import Eunju2IeumImage from '@/assets/images/eunju2-ieum.png';
import Eunju2MovieImage from '@/assets/images/eunju2-movie.png';
import Eunju2SocialImage from '@/assets/images/eunju2-social.png';
import HyeinChongdongImage from '@/assets/images/hyein-chongdong.png';
import HyeinCoreImage from '@/assets/images/hyein-core.png';
import HyeinShinmunImage from '@/assets/images/hyein-shinmun.png';

/** 지도 건물 id → `GET /booths?location=` 쿼리 값 */
export const BUILDING_ID_TO_API_LOCATION = {
  hyein: 'HYEIN',
  eunju1: 'EUNJU_1',
  eunju2: 'EUNJU_2',
  cheongun: 'CHEONGUN',
  daeil: 'DAEIL',
};

/** 건물 id → 한글 이름  */
const BUILDING_ID_TO_LOCATION_LABEL_KO = {
  hyein: '혜인관',
  eunju1: '은주1관',
  eunju2: '은주2관',
  cheongun: '청운관',
  daeil: '대일관',
};

/** 백엔드 `GET /booths` 응답의 `location` 코드 → 화면 표기 한글 */
export const BOOTH_API_LOCATION_TO_LABEL_KO = Object.fromEntries(
  Object.entries(BUILDING_ID_TO_API_LOCATION).map(([buildingId, code]) => [
    code,
    BUILDING_ID_TO_LOCATION_LABEL_KO[buildingId],
  ])
);

/** 백엔드에서 받은 `location`(예: HYEIN)을 카드 등에 쓸 한글 건물명으로 바꿈*/
export function formatBoothLocationKo(location) {
  if (location == null) return '';
  const key = String(location).trim();
  if (!key) return '';
  return BOOTH_API_LOCATION_TO_LABEL_KO[key] ?? key;
}

/**
 * 건물별 부스 카드는 학과명 가나다순 정렬 (`getSortedBoothRowsByBuilding`).
 */

const RAW_DEPARTMENTS_BY_BUILDING = {
  cheongun: [
    { department: '도시공학과', boothNumber: 32 },
    { department: '일어전공', boothNumber: 33 },
    { department: '중어전공', boothNumber: 34 },
    { department: '스포츠앤테크놀리지학과', boothNumber: 35 },
    { department: '융합대', boothNumber: 36 },
  ],
  daeil: [
    { department: '학생처', boothNumber: 24 },
    { department: '이공대', boothNumber: 25 },
    { department: '물류시스템공학과', boothNumber: 26 },
    { department: '금융정보공학과', boothNumber: 27 },
    {
      department: '전자컴퓨터공학과',
      boothNumber: 28,
      boothNumberEnd: 29,
    },
    { department: '토목건축공학과', boothNumber: 30 },
    { department: '나노화학생명공학과', boothNumber: 31 },
  ],
  eunju1: [
    { department: '아동청소년학과', boothNumber: 16 },
    { department: '경영학부', boothNumber: 17, boothNumberEnd: 18 },
    { department: '공공인재학부', boothNumber: 19 },
    { department: '미래융합대학2', boothNumber: 20 },
    { department: '미래융합대학1', boothNumber: 21 },
    {
      department: '소프트웨어학과',
      boothNumber: 22,
      boothNumberEnd: 23,
    },
  ],
  eunju2: [
    { department: '예술대', boothNumber: 6 },
    { department: '영화영상학과', boothNumber: 7 },
    { department: '디자인학부', boothNumber: 8, boothNumberEnd: 9 },
    { department: '실용음악학부', boothNumber: 10 },
    {
      department: '미용예술학부',
      boothNumber: 11,
      boothNumberEnd: 12,
    },
    { department: '광고홍보영상학과', boothNumber: 13 },
    { department: '사회과학대', boothNumber: 14 },
    { department: '군사학과', boothNumber: 15 },
  ],
  hyein: [
    { department: '총학생회', boothNumber: 1, boothNumberEnd: 2 },
    { department: '축제기획단', boothNumber: 3 },
    { department: '신문사', boothNumber: 4 },
    { department: '총동아리연합회', boothNumber: 5 },
  ],
};

function sortByDepartmentKo(rows) {
  return [...rows].sort((a, b) =>
    a.department.localeCompare(b.department, 'ko', { sensitivity: 'base' })
  );
}

/**
 * 건물 id 기준 정렬된 부스 행 (지도 모달 / 메인 부스 등에서 공통 사용)
 * @param {string} buildingId
 * @returns {BoothDepartmentRow[]}
 */
export function getSortedBoothRowsByBuilding(buildingId) {
  const raw = RAW_DEPARTMENTS_BY_BUILDING[buildingId];
  if (!raw?.length) return [];
  const sorted = sortByDepartmentKo(raw);
  return sorted.map((row, index) => ({
    ...row,
    id: `${buildingId}-${row.department}-${index}`,
  }));
}

/** 부스 지도 하단 시트 탭 순서와 동일 */
export const BOOTH_MAP_TAB_BUILDING_IDS = ['hyein', 'eunju1', 'eunju2', 'cheongun', 'daeil'];

/** 건물 미선택 시: 탭 순서대로 모든 부스 카드 행 */
export function getAllBoothRowsInMapTabOrder() {
  return BOOTH_MAP_TAB_BUILDING_IDS.flatMap((id) => getSortedBoothRowsByBuilding(id));
}

const BOOTH_CARD_CONTENT_BY_BUILDING = {
  hyein: {
    총학생회: {
      image: HyeinCoreImage,
      subtitle: '혜인관 앞',
      title: '총학생회',
    },
    축제기획단: {
      image: HyeinCoreImage,
      subtitle: '혜인관 앞',
      title: '축제기획단',
    },
    신문사: {
      image: HyeinShinmunImage,
      subtitle: '혜인관 앞',
      title: '신문사',
    },
    총동아리연합회: {
      image: HyeinChongdongImage,
      subtitle: '혜인관 앞',
      title: '총동아리연합회',
    },
  },
  daeil: {
    금융정보공학과: {
      image: DaeilMoneyImage,
      subtitle: '대일관 앞',
      title: '금융정보공학과',
    },
    물류시스템공학과: {
      image: DaeilMullImage,
      subtitle: '대일관 앞',
      title: '물류시스템공학과',
    },
    이공대: {
      image: DaeilIgongImage,
      subtitle: '대일관 앞',
      title: '이공대',
    },
    나노화학생명공학과: {
      image: DaeilNanoImage,
      subtitle: '대일관 앞',
      title: ['나노화학', '생명공학과&', '환경화학공학과'],
    },
    전자컴퓨터공학과: {
      image: DaeilElectricImage,
      subtitle: '대일관 앞',
      title: '전자컴퓨터공학과',
    },
    토목건축공학과: {
      image: DaeilTomokImage,
      subtitle: '대일관 앞',
      title: '토목건축공학과',
    },
    학생처: {
      image: BoothDefaultImage,
      subtitle: '대일관 앞',
      title: '학생처 학생과',
    },
  },
  eunju2: {
    영화영상학과: {
      image: Eunju2MovieImage,
      subtitle: '은주2관 앞',
      title: '영화영상학과',
    },
    사회과학대: {
      image: Eunju2SocialImage,
      subtitle: '은주2관 앞',
      title: '사회과학대',
    },
    광고홍보영상학과: {
      image: Eunju2GwangImage,
      subtitle: '은주2관 앞',
      title: '광고홍보영상학과',
    },
    군사학과: {
      image: Eunju2GunsaImage,
      subtitle: '은주2관 앞',
      title: '군사학과',
    },
    미용예술학부: {
      image: Eunju2BeautyImage,
      subtitle: '은주2관 앞',
      title: ['미용예술학부', '(헤디,메디,코뷰)'],
    },
    디자인학부1: {
      image: Eunju2Design11Image,
      subtitle: '은주2관 앞',
      title: ['디자인학부', '(비다/라디)'],
    },
    디자인학부2: {
      image: Eunju2Design2Image,
      subtitle: '은주2관 앞',
      title: ['디자인학부', '(VOID(보이드)/sesi)'],
    },
    실용음악학부: {
      image: BoothDefaultImage,
      subtitle: '은주2관 앞',
      title: '실용음악학부',
    },
    예술대: {
      image: Eunju2IeumImage,
      subtitle: '은주2관 앞',
      title: '예술대',
    },
  },
  cheongun: {
    도시공학과: {
      image: CheongunDoshiImage,
      subtitle: '청운관 앞',
      title: '도시공학과',
    },
    일어전공: {
      image: CheongunJapanImage,
      subtitle: '청운관 앞',
      title: '일어전공',
    },
    스포츠앤테크놀리지학과: {
      image: CheongunSportImage,
      subtitle: '청운관 앞',
      title: ['스포츠앤', '테크놀리지학과'],
    },
    융합대: {
      image: CheongunYoongImage,
      subtitle: '청운관 앞',
      title: '융합대',
    },
    중어전공: {
      image: CheongunChineseImage,
      subtitle: '청운관 앞',
      title: '중어전공',
    },
  },
  eunju1: {
    소프트웨어학과: {
      image: Eunju1SoftwareImage,
      subtitle: '은주1관 앞',
      title: '소프트웨어학과',
    },
    공공인재학부: {
      image: Eunju1GongongImage,
      subtitle: '은주1관 앞',
      title: '공공인재학부',
    },
    미래융합대학1: {
      image: Eunju1Mirae1Image,
      subtitle: '은주1관 앞',
      title: '미래융합대학1',
    },
    경영학부: {
      image: Eunju1GyoungImage,
      subtitle: '은주1관 앞',
      title: '경영학부',
    },
    미래융합대학2: {
      image: Eunju1Mirae2Image,
      subtitle: '은주1관 앞',
      title: '미래융합대학2',
    },
    아동청소년학과: {
      image: Eunju1AdongImage,
      subtitle: '은주1관 앞',
      title: '아동청소년학과',
    },
  },
};

export const BOOTH_CARDS_BY_BUILDING = Object.fromEntries(
  Object.keys(RAW_DEPARTMENTS_BY_BUILDING).map((buildingId) => [
    buildingId,
    getSortedBoothRowsByBuilding(buildingId).flatMap((row) => {
      const contentByBuilding = BOOTH_CARD_CONTENT_BY_BUILDING[buildingId] ?? {};
      const toCard = (departmentKey, idSuffix = '') => ({
        ...(contentByBuilding[departmentKey] ?? {}),
        id: `${row.id}${idSuffix}`,
        buildingId,
        image: contentByBuilding[departmentKey]?.image ?? BoothImagePlaceholder,
        subtitle:
          contentByBuilding[departmentKey]?.subtitle ??
          `${BUILDING_ID_TO_LOCATION_LABEL_KO[buildingId]} 앞`,
        title:
          contentByBuilding[departmentKey]?.title ??
          (row.department === '스포츠앤테크놀리지학과'
            ? ['스포츠앤', '테크놀리지학과']
            : row.department),
      });

      // 디자인학부(8~9번)는 메인 카드에서 2장으로 분리 노출
      if (buildingId === 'eunju2' && row.department === '디자인학부') {
        return [toCard('디자인학부1', '-1'), toCard('디자인학부2', '-2')];
      }

      return [toCard(row.department)];
    }),
  ])
);

/**
 * 메인 부스 섹션에서 보여줄 카드 4개를 건물별로 지정
 * 배열 순서가 화면 노출 순서가 된다.
 */
export const MAIN_BOOTH_CARD_DEPARTMENTS_BY_BUILDING = {
  hyein: ['총동아리연합회', '신문사', '총학생회', '축제기획단'],
  eunju1: ['경영학부', '공공인재학부', '미래융합대학1', '소프트웨어학과'],
  eunju2: ['영화영상학과', '사회과학대', '광고홍보영상학과', '군사학과'],
  cheongun: ['도시공학과', '일어전공', '스포츠앤테크놀리지학과', '융합대'],
  daeil: ['물류시스템공학과', '금융정보공학과', '이공대', '나노화학생명공학과'],
};

export function getMainBoothCardsByBuilding(buildingId) {
  const cards = BOOTH_CARDS_BY_BUILDING[buildingId] ?? [];
  return cards;
}

export const BOOTH_CARDS_FROM_BUILDINGS = Object.values(BOOTH_CARDS_BY_BUILDING).flat();
