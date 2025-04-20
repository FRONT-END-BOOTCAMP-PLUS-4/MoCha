import { useState } from 'react';
import { Button } from '@/app/shared/ui/button/Button';
import { useFullModal } from '@/app/(core)/user/model/useFullModalStore';

export default function PasswoardBox() {
  const close = useFullModal((state) => state.action.close);
  const [next, setNext] = useState(false);
  const toggleNext = () => setNext(!next)
  return (
    <div className="border-main bg-main-bg flex flex-col gap-3 rounded-lg border p-3">
      {next ? (
        <>
          <div className="text-gray-6">
            <label>새로운비밀번호:</label>
            <input
              type="password"
              className="border-gray-5 grow border-b outline-none"
              defaultValue={'새로운비밀번호'}
            />
          </div>
          <div className="text-gray-6">
            <label>새로운비밀번호 확인:</label>
            <input
              type="password"
              className="border-gray-5 grow border-b outline-none"
              defaultValue={'새로운비밀번호'}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button intent="ghost" className="hover:bg-main px-4 py-2" onClick={toggleNext}>
              변경
            </Button>
            <Button intent="ghost" className="hover:bg-main px-4 py-2" onClick={close}>
              취소
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-gray-6">
            <label>기존비밀번호:</label>
            <input
              type="password"
              className="border-gray-5 grow border-b outline-none"
              defaultValue={'새로운비밀번호'}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button intent="ghost" className="hover:bg-main px-4 py-2" onClick={toggleNext}>
              다음
            </Button>
            <Button intent="ghost" className="hover:bg-main px-4 py-2" onClick={close}>
              취소
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
