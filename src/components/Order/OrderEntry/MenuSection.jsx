function MenuSection({ word, isNight, canToggle, onToggle, Image, Icon, menus, isQR }) {
  return (
    <div className={`relative px-7 mt-7 flex-col w-full ${isQR ? 'bg-white' : 'bg-[#1A1A1A]'}`}>
      <div className="flex w-full items-center justify-between">
        <div className={`text-lg font-bold ${isQR ? 'text-black' : 'text-white'}`}>메뉴</div>
        <div
          className={`flex items-center gap-2 ${canToggle ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={canToggle ? onToggle : undefined}
        >
          <Image />
          <div
            className={`text-xs font-semibold ${isNight ? 'text-text-blue' : 'text-text-orange'}`}
          >
            {word} 부스
          </div>
          {canToggle && <Icon />}
        </div>
      </div>
      <div className={`w-full h-0.5 mt-3 ${isQR ? 'bg-gray-200' : 'bg-white'}`} />
      <div className="w-full inline-flex flex-wrap mt-2">
        {menus.map((menu, index) => (
          <div key={index} className="w-1/2 px-4 py-1 flex justify-between items-start gap-2">
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
