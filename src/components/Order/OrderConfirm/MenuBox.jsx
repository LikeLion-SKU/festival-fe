function MenuBox({ cart }) {
  return (
    <div className="bg-white rounded-2xl px-4">
      {cart.map((item, i) => (
        <div key={item.key}>
          <div className="py-6 flex items-center justify-between">
            <div className="flex flex-col gap-2 py-1">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-gray-400">개 당 {item.price.toLocaleString()}원</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-medium">{(item.price * item.quantity).toLocaleString()}원</span>
              <span className="text-xs text-order-button font-normal">{item.quantity}개</span>
            </div>
          </div>
          {i < cart.length - 1 && <div className="border-b border-gray-100" />}
        </div>
      ))}
    </div>
  );
}

export default MenuBox;
