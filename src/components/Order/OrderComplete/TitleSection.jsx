function TitleSection() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-15 bg-gray-bg pb-5">
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
        <style>{`
          @keyframes draw-circle-orange {
            from { stroke-dashoffset: 116; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes draw-check-orange {
            from { stroke-dashoffset: 26; }
            to   { stroke-dashoffset: 0; }
          }
          .check-circle {
            stroke-dasharray: 116;
            stroke-dashoffset: 116;
            animation: draw-circle-orange 0.35s ease-out forwards;
          }
          .check-mark {
            stroke-dasharray: 26;
            stroke-dashoffset: 26;
            animation: draw-check-orange 0.5s ease-out 0.32s forwards;
          }
        `}</style>
        <circle
          className="check-circle"
          cx="21"
          cy="21"
          r="18.5"
          stroke="#FE5F54"
          strokeWidth="2.5"
        />
        <path
          className="check-mark"
          d="M13 21l6 6 10-11"
          stroke="#FE5F54"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col items-center gap-1">
        <p className="text-xl font-semibold text-order-button">주문 요청이 완료됐어요!</p>
        <p className="text-sm font-medium text-gray-400">입금 확인 후 조리가 시작돼요</p>
      </div>
    </div>
  );
}
export default TitleSection;
