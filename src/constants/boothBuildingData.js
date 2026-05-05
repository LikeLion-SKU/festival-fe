import BoothImagePlaceholder from '@/assets/images/booth_image.svg';

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
    { department: '사과대', boothNumber: 14 },
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

export const BOOTH_CARDS_FROM_BUILDINGS = Object.keys(RAW_DEPARTMENTS_BY_BUILDING).flatMap(
  (buildingId) =>
    getSortedBoothRowsByBuilding(buildingId).map((row) => ({
      id: row.id,
      buildingId,
      image: BoothImagePlaceholder,
      subtitle: `${BUILDING_ID_TO_LOCATION_LABEL_KO[buildingId]} 앞`,
      title:
        row.department === '스포츠앤테크놀리지학과'
          ? ['스포츠앤', '테크놀리지학과']
          : row.department,
    }))
);
