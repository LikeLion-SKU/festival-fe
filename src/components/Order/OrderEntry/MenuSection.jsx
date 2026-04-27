function MenuSection({ word, isNight, onToggle, Image, Icon, menus }) {
  return (
    <div className="relative px-7 mt-5 flex-col w-full bg-white">
      <div className="flex w-full items-center justify-between">
        <div className="text-lg font-bold">메뉴</div>
        <div className="flex items-center gap-2 cursor-pointer" onClick={onToggle}>
          <Image />
          <div className={`text-xs font-semibold ${isNight ? 'text-blue' : 'text-text-orange'}`}>
            {word} 부스
          </div>
          <Icon />
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-200 mt-3" />
      <div className="w-full inline-flex flex-wrap mt-2 bg-white">
        {menus.map((menu, index) => (
          <div
            key={index}
            className="w-1/2 h-10 px-4 py-1 flex justify-between items-center overflow-hidden"
          >
            <div className="text-Main-Grayscale-700 text-xs font-medium">{menu.name}</div>
            <div className="text-Main-Grayscale-700 text-xs font-medium">{menu.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MenuSection;
