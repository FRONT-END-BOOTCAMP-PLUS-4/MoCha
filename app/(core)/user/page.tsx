'use client';
import { useState } from 'react';
import { Button } from '@/app/shared/ui/button/Button';
import ChartTab from '@/app/components/user/widgets/ChartTab';
import ProfileTab from '@/app/components/user/widgets/ProfileTab';
import FullModal from '@/app/components/user/ui/FullModal';

export default function Mypage() {
  const [selectTab, setSelectTab] = useState(0);
  const selectKey = (key: number) => setSelectTab(key);

  const tabList = [
    {
      label: '통계차트',
      children: <ChartTab />,
    },
    {
      label: '프로필설정',
      children: <ProfileTab />,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 p-4 text-base">
      <div className="text-gray-5 flex gap-3">
        {tabList.map((value, idx) => {
          return (
            <Button
              key={idx}
              intent={selectTab === idx ? 'primary' : 'ghost'}
              onClick={() => selectKey(idx)}
              className="hover:bg-main"
            >
              {value.label}
            </Button>
          );
        })}
      </div>
      <hr className="text-gray-4 my-2" />
      {tabList[selectTab].children}
      <FullModal/>
    </div>
  );
}
