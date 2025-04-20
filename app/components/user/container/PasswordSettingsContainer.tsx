import { useState } from 'react';
import { useFullModal } from '@/app/(core)/user/store/useFullModalStore';
import PasswordSettings from '@/app/components/user/presentation/PasswordSettings';
export default function PasswordSettingsContainer(){
    const close = useFullModal((state) => state.action.close);
      const [next, setNext] = useState(false);
      const toggleNext = () => setNext(!next)
      
    return <PasswordSettings
    close={close}
    next={next}
    toggleNext={toggleNext}
    />;
}