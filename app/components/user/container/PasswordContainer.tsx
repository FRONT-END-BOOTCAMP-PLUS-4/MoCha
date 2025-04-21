'use client';

import PasswordCheck from '@/app/components/user/presentation/PasswordCheck';
import PasswordChangeContainer from '@/app/components/user/container/PasswordChangeContainer';
import { useFullModal } from '@/app/(core)/user/store/useFullModalStore';

export default function PasswordContainer() {
  const action = useFullModal((state) => state.action);
  const closeModal = () => action.close();
  const nextProcess = () => action.open(<PasswordChangeContainer/>);

  return <PasswordCheck nextProcess={nextProcess} closeModal={closeModal} />;
}
