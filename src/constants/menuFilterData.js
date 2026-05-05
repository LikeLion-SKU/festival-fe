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

//"M/D" 문자열을 비교 가능한 숫자로 변환 (ex: "5/13" → 513)
const toMonthDay = (md) => {
  const [m, d] = md.split('/').map(Number);
  return m * 100 + d;
};

//지난 날짜 판단 (오늘보다 과거면 true)
export const isPastDate = (date) => toMonthDay(date) < toMonthDay(TODAY);

//날짜 + 검색어로 주문 목록 필터링
export const filterOrders = (orderData, dateFilter, searchQuery) => {
  const q = searchQuery.trim().toLowerCase();
  return orderData.filter((d) => {
    if (dateFilter !== 'all' && d.orderDate !== dateFilter) return false;
    if (!q) return true;
    return (
      d.customerName.toLowerCase().includes(q) ||
      String(d.tableNumber).includes(q) ||
      d.customerPhoneNumber.includes(q)
    );
  });
};
