function MenuSection({ word, isNight, canToggle, onToggle, Image, Icon, menus }) {
  return (
    <div className="relative px-7 mt-5 flex-col w-full bg-white">
      <div className="flex w-full items-center justify-between">
        <div className="text-lg font-bold">메뉴</div>
        <div
          className={`flex items-center gap-2 ${canToggle ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={canToggle ? onToggle : undefined}
        >
          <Image />
          <div className={`text-xs font-semibold ${isNight ? 'text-blue' : 'text-text-orange'}`}>
            {word} 부스
          </div>
          {canToggle && <Icon />}
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-200 mt-3" />
      <div className="w-full inline-flex flex-wrap mt-2 ">
        {menus.map((menu, index) => (
          <div
            key={index}
            className="w-1/2 h-10 px-4 py-1 flex justify-between items-center overflow-hidden"
          >
            <div className="text-Main-Grayscale-700 text-xs font-medium">{menu.name}</div>
            <div className="text-Main-Grayscale-700 text-xs font-medium">
              {typeof menu.price === 'number' ? `${menu.price.toLocaleString()}원` : menu.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MenuSection;
