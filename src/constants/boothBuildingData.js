import BoothImagePlaceholder from '@/assets/images/booth_image.svg';

/**
 * 건물별 부스 학과명으로 가나다순 정렬됨
 * locationDetail은 추후 부스별 상세 주소로 교체 해야 함
 */

/** @typedef {{ department: string; locationDetail: string; id: string }} BoothDepartmentRow */

/** @type {Record<string, Omit<BoothDepartmentRow, 'id'>[]>} */
const RAW_DEPARTMENTS_BY_BUILDING = {
  cheongun: [
    { department: '융합대', locationDetail: '청운관 내' },
    { department: '스텍', locationDetail: '청운관 내' },
    { department: '중어', locationDetail: '청운관 내' },
    { department: '일어', locationDetail: '청운관 내' },
    { department: '도공', locationDetail: '청운관 내' },
  ],
  daeil: [
    { department: '나화생', locationDetail: '대일관 내' },
    { department: '토목', locationDetail: '대일관 내' },
    { department: '전컴', locationDetail: '대일관 내' },
    { department: '금공', locationDetail: '대일관 내' },
    { department: '물공', locationDetail: '대일관 내' },
    { department: '이공대', locationDetail: '대일관 내' },
  ],
  eunju1: [
    { department: '소웨', locationDetail: '은주1관 내' },
    { department: '미융1', locationDetail: '은주1관 내' },
    { department: '미융2', locationDetail: '은주1관 내' },
    { department: '공공', locationDetail: '은주1관 내' },
    { department: '경영', locationDetail: '은주1관 내' },
    { department: '아동', locationDetail: '은주1관 내' },
  ],
  eunju2: [
    { department: '예술대', locationDetail: '은주2관 내' },
    { department: '영화', locationDetail: '은주2관 내' },
    { department: '디자인', locationDetail: '은주2관 내' },
    { department: '실음', locationDetail: '은주2관 내' },
    { department: '미예', locationDetail: '은주2관 내 (A)' },
    { department: '미예', locationDetail: '은주2관 내 (B)' },
    { department: '광홍영', locationDetail: '은주2관 내' },
    { department: '사과대', locationDetail: '은주2관 내' },
    { department: '군사', locationDetail: '은주2관 내' },
  ],
  hyein: [
    { department: '총동연', locationDetail: '혜인관 내' },
    { department: '신문사', locationDetail: '혜인관 내' },
    { department: '총학', locationDetail: '혜인관 내' },
  ],
};

function sortByDepartmentKo(rows) {
  return [...rows].sort((a, b) => {
    const byDept = a.department.localeCompare(b.department, 'ko', { sensitivity: 'base' });
    if (byDept !== 0) return byDept;
    return a.locationDetail.localeCompare(b.locationDetail, 'ko');
  });
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

/**
 * 메인 랜딩 `Booth.jsx` 호환용 카드 목록 (기존 BOOTH_CARDS 필드 형식)
 * @type {{ id: string; buildingId: string; image: string; subtitle: string; title: string | string[] }[]}
 */
export const BOOTH_CARDS_FROM_BUILDINGS = Object.keys(RAW_DEPARTMENTS_BY_BUILDING).flatMap(
  (buildingId) =>
    getSortedBoothRowsByBuilding(buildingId).map((row) => ({
      id: row.id,
      buildingId,
      image: BoothImagePlaceholder,
      subtitle: row.locationDetail,
      title: row.department,
    }))
);
