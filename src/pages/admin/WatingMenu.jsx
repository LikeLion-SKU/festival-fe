import OrderCard from '@/components/Admin/OrderCard';

const orderData = [
  {
    id: 1,
    tableNumber: 1,
    peopleCount: 4,
    orderTime: '18:27',
    customerName: '김멋사',
    phone: '010-1234-5678',
    items: [
      { name: '해물야끼우동', quantity: 2, price: 26000 },
      { name: '주먹밥', quantity: 1, price: 2000 },
      { name: '음료수', quantity: 3, price: 6000 },
    ],
    totalAmount: 28000,
  },
  {
    id: 2,
    tableNumber: 2,
    peopleCount: 2,
    orderTime: '18:32',
    customerName: '박싸피',
    phone: '010-2345-6789',
    items: [
      { name: '해물야끼우동', quantity: 1, price: 13000 },
      { name: '음료수', quantity: 2, price: 4000 },
    ],
    totalAmount: 17000,
  },
  {
    id: 3,
    tableNumber: 3,
    peopleCount: 5,
    orderTime: '18:35',
    customerName: '이멋사',
    phone: '010-3456-7890',
    items: [
      { name: '해물야끼우동', quantity: 3, price: 39000 },
      { name: '주먹밥', quantity: 2, price: 4000 },
    ],
    totalAmount: 43000,
  },
  {
    id: 4,
    tableNumber: 4,
    peopleCount: 3,
    orderTime: '18:41',
    customerName: '최멋사',
    phone: '010-4567-8901',
    items: [
      { name: '주먹밥', quantity: 3, price: 6000 },
      { name: '음료수', quantity: 3, price: 6000 },
    ],
    totalAmount: 12000,
  },
];

export default function WaitingMenu() {
  return (
    <div className="flex flex-1 w-full h-full bg-[#EFEFEF] justify-center pt-7">
      <div className="flex flex-col gap-2 overflow-auto no-scrollbar">
        {orderData.map((data) => (
          <OrderCard
            key={data.id}
            tableNumber={data.tableNumber}
            peopleCount={data.peopleCount}
            orderTime={data.orderTime}
            customerName={data.customerName}
            phone={data.phone}
            items={data.items}
            totalAmount={data.totalAmount}
          />
        ))}
      </div>
    </div>
  );
}
