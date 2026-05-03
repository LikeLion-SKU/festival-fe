export const ORDERED_DATES = ['5/13', '5/14', '5/15']; //축제 날짜 하드 코딩
export const TODAY = (() => {
  //오늘 날짜 값 구하기
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}`;
})();
export const FILTERS = [
  //필터 (전체 + 축제 날짜)
  { key: 'all', label: '전체' },
  ...ORDERED_DATES.map((d) => ({ key: d, label: d })),
];

//지난 날짜 판단
export const isPastDate = (date) => ORDERED_DATES.indexOf(date) < ORDERED_DATES.indexOf(TODAY);
