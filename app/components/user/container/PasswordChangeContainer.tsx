'use client';

import PasswordChange from '@/app/components/user/presentation/PasswordChange';
import { useFullModal } from '@/app/(core)/user/store/useFullModalStore';

export default function PasswordChangeContainer(){
    const closeModal = useFullModal((state) => state.action.close);
    const changeProcess = () => console.log("변경하기")

    return <PasswordChange closeModal={closeModal} changeProcess={changeProcess}/>
}