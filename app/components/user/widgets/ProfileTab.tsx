import Profile from '@/app/components/user/ui/Profile';
import PasswoardBox from '@/app/components/user/ui/PasswordBox';
import { useFullModal } from '@/app/(core)/user/model/useFullModalStore';

export default function ProfileTab() {
  const open = useFullModal((state) => state.action.open);

  return (
    <div>
      {/* 프로필 */}
      <Profile />
      <hr className="text-gray-4 my-3" />
      <div className="flex flex-col gap-3 text-sm">
        <button
          className="border-gray-5 text-gray-5 hover:text-main hover:border-main cursor-pointer rounded-lg border p-1"
          onClick={() => open(<PasswoardBox />)}
        >
          비밀번호 변경
        </button>
        <button className="border-gray-5 text-gray-5 hover:text-main hover:border-main cursor-pointer rounded-lg border p-1">
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
