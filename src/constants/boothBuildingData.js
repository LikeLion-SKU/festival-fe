import BoothImagePlaceholder from '@/assets/images/booth_image.svg';

/**
 * 건물별 부스 학과명으로 가나다순 정렬됨
 * locationDetail은 추후 부스별 상세 주소로 교체 해야 함
 */

/** @typedef {{ department: string; locationDetail: string; id: string }} BoothDepartmentRow */

/** @type {Record<string, Omit<BoothDepartmentRow, 'id'>[]>} */
const RAW_DEPARTMENTS_BY_BUILDING = {
  cheongun: [
    { department: '융합대', locationDetail: '청운관 앞' },
    { department: '스포츠앤테크놀리지학과', locationDetail: '청운관 앞' },
    { department: '중어전공', locationDetail: '청운관 앞' },
    { department: '일어전공', locationDetail: '청운관 앞' },
    { department: '도시공학과', locationDetail: '청운관 앞' },
  ],
  daeil: [
    { department: '나노화학생명공학과', locationDetail: '대일관 앞' },
    { department: '토목건축공학과', locationDetail: '대일관 앞' },
    { department: '전자컴퓨터공학과', locationDetail: '대일관 앞' },
    { department: '금융정보공학과', locationDetail: '대일관 앞' },
    { department: '물류시스템공학과', locationDetail: '대일관 앞' },
    { department: '이공대', locationDetail: '대일관 앞' },
  ],
  eunju1: [
    { department: '소프트웨어학과', locationDetail: '은주1관 앞' },
    { department: '미래융합대학1', locationDetail: '은주1관 앞' },
    { department: '미래융합대학2', locationDetail: '은주1관 앞' },
    { department: '공공인재학부', locationDetail: '은주1관 앞' },
    { department: '경영학부', locationDetail: '은주1관 앞' },
    { department: '아동청소년학과', locationDetail: '은주1관 앞' },
  ],
  eunju2: [
    { department: '예술대', locationDetail: '은주2관 앞' },
    { department: '영화영상학과', locationDetail: '은주2관 앞' },
    { department: '디자인학부', locationDetail: '은주2관 앞' },
    { department: '실용음악학부', locationDetail: '은주2관 앞' },
    { department: '미용예술학부', locationDetail: '은주2관 앞' },
    { department: '광고홍보영상학과', locationDetail: '은주2관 앞' },
    { department: '사과대', locationDetail: '은주2관 앞' },
    { department: '군사학과', locationDetail: '은주2관 앞' },
  ],
  hyein: [
    { department: '총동아리연합회', locationDetail: '혜인관 앞' },
    { department: '신문사', locationDetail: '혜인관 앞' },
    { department: '총학생회', locationDetail: '혜인관 앞' },
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
      title:
        row.department === '스포츠앤테크놀리지학과'
          ? ['스포츠앤', '테크놀리지학과']
          : row.department,
    }))
);
