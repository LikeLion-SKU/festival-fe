import Location from '@/assets/icons/location.svg?react';

import IsTakeOutButton from './IsTakeOutButton';

function IsTakeOut({ orderType, onTypeChange }) {
  return (
    <div className="flex flex-col gap-2">
      <IsTakeOutButton isActive={orderType === 'dine-in'} onClick={() => onTypeChange('dine-in')}>
        <div className="flex">
          <span
            className={
              orderType === 'takeout'
                ? 'text-order-button font-medium'
                : 'text-light-pink font-medium'
            }
          >
            매장
          </span>
          <div className="font-medium">에서 먹고 갈게요!</div>
        </div>
        {orderType === 'dine-in' && <Location />}
      </IsTakeOutButton>
      <IsTakeOutButton isActive={orderType === 'takeout'} onClick={() => onTypeChange('takeout')}>
        <div className="flex">
          <span
            className={
              orderType === 'takeout'
                ? 'text-light-pink font-medium'
                : 'text-order-button font-medium'
            }
          >
            포장
          </span>
          <div className="font-medium">해갈게요!</div>
        </div>
        {orderType === 'takeout' && <Location />}
      </IsTakeOutButton>
    </div>
  );
}

export default IsTakeOut;
