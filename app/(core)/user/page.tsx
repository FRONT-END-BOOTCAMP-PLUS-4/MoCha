'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/app/shared/ui/button';
import ChartTab from '@/app/components/user/composite/ChartTab';
import SettingTab from '@/app/components/user/composite/SettingTab';
import FullScreenModal from '@/app/components/user/composite/FullScreenModal';
import { useRouter } from 'next/navigation';

export default function Mypage() {
  const router = useRouter();
  const [selectTab, setSelectTab] = useState(0);
  const selectKey = (key: number) => setSelectTab(key);
  const token = localStorage.getItem('access_token');

  useEffect(()=>{
    if (!token) router.push('/');

  },[])

  const tabList = [
    {
      label: '통계차트',
      children: <ChartTab />,
    },
    {
      label: '프로필설정',
      children: <SettingTab />,
    },
  ];

  return (
    <>
      {token && (
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
          <FullScreenModal />
        </div>
      )}
    </>
  );
}
