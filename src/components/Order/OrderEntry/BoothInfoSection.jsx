function BoothInfoSection({ boothName, location, isOpen, content, images }) {
  return (
    <div className="relative px-7 top-18">
      <div className="relative flex justify-between items-center">
        <div className="text-2xl font-bold">{boothName}</div>
        {isOpen ? (
          <div className="flex w-12 h-6 rounded-[5px] outline justify-center items-center bg-button-red-bg outline-button-red">
            <div className="text-center justify-start text-button-red text-xs font-semibold font-['Pretendard']">
              영업 중
            </div>
          </div>
        ) : (
          <div className="flex w-12 h-6 rounded-[5px] outline justify-center items-center bg-button-gray-bg outline-button-gray">
            <div className="text-center justify-start text-button-gray text-xs font-semibold font-['Pretendard']">
              오픈 전
            </div>
          </div>
        )}
      </div>
      <div className="relative flex mt-2.5 gap-3">
        <div className="w-7 h-5 font-semibold text-text-gray">위치</div>
        <div className="w-16 h-5 font-semibold text-deep-gray">{location}</div>
      </div>
      <div className="relative mt-5 text-sm text-deep-gray">{content}</div>
      <div className="flex gap-1 mt-5">
        {images.map((src, index) => (
          <img className="w-27.5 h-28" key={index} src={src} />
        ))}
      </div>
    </div>
  );
}

export default BoothInfoSection;
