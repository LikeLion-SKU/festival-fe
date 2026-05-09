function MenuSection({ word, isNight, canToggle, onToggle, Image, Icon, menus, isQR }) {
  return (
    <div className={`relative px-7 mt-7 flex-col w-full ${isQR ? 'bg-white' : 'bg-[#1A1A1A]'}`}>
      <div className="flex w-full items-center justify-between">
        <div className={`text-base font-bold ${isQR ? 'text-black' : 'text-white'}`}>메뉴</div>
        <div
          className={`flex items-center gap-2 ${canToggle ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={canToggle ? onToggle : undefined}
        >
          <Image className={isNight && !isQR ? 'text-[#7190FF]' : 'text-text-blue'} />
          <div
            className={`text-xs font-semibold ${isNight && !isQR ? 'text-[#7190FF]' : isNight ? 'text-text-blue' : 'text-text-orange'}`}
          >
            {word} 부스
          </div>
          {canToggle && <Icon className={isNight && !isQR ? 'text-[#7190FF]' : 'text-text-blue'} />}
        </div>
      </div>
      <div className={`w-full h-0.25 mt-4 mb-9 ${isQR ? 'bg-gray-200' : 'bg-white'}`} />
      <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
        {menus.map((menu, index) => (
          <div key={index} className="py-1 flex justify-between items-start gap-2">
            <div
              className={`text-xs font-medium min-w-0 ${isQR ? 'text-Main-Grayscale-700' : 'text-white/80'}`}
            >
              {menu.name}
            </div>
            <div
              className={`text-xs font-medium shrink-0 whitespace-nowrap ${isQR ? 'text-Main-Grayscale-700' : 'text-white/80'}`}
            >
              {typeof menu.price === 'number' ? `${menu.price.toLocaleString()}원` : menu.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MenuSection;
