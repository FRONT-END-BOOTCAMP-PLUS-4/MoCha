import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { isValidNickname, isValidPhoneNumber } from '@/app/shared/utils/validation';
import ProfileSettings from '@/app/components/user/presentation/ProfileSettings';

export default function ProfileSettingsContainer() {
  const [isEdit, setIsEdit] = useState(false);

  const nickNameRef = useRef<HTMLInputElement>(null);
  const [nickNameValidation, setNickNameValidation] = useState<boolean | null>(null);

  const phoneRef = useRef<HTMLInputElement>(null);
  const [phoneValidation, setPhoneValidation] = useState<boolean | null>(null);

  const [userInfo, setUserInfo] = useState({
    userEmail: 'userEmail@gmail.com',
    userNickName: '치카치카치카치카',
    userPhone: '01012345678',
  });  

  const toggleEdit = () => {
    if (!nickNameRef.current || !phoneRef.current) return;
    setIsEdit(!isEdit);

    if (isEdit) {
      nickNameRef.current.value = userInfo.userNickName;
      phoneRef.current.value = userInfo.userPhone;
      setNickNameValidation(null);
      setPhoneValidation(null);
    }
  };

  const checkValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'userNickName') {
      const isValid = isValidNickname(value);
      setNickNameValidation(!isValid);
      
    }
  
    if (name === 'userPhone') {
      const isValid = isValidPhoneNumber(value);
      setPhoneValidation(!isValid);
    }
  };

  return (
    <ProfileSettings
      userInfo={userInfo}
      isEdit={isEdit}
      toggleEdit={toggleEdit}
      nickNameRef={nickNameRef}
      nickNameValidation={nickNameValidation}
      phoneRef={phoneRef}
      phoneValidation={phoneValidation}
      checkValidation={checkValidation}
    />
  );
}
