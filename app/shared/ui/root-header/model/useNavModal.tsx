import { useState, useEffect } from 'react';

type NavModalReturn = {
    isModal: boolean;
    toggleModal: () => void;
} & {};

/**
 * @Desc
 * 모바일 모달 상태관리
 * 768px 화면크기에 따른 상태변경
*/
export default function useNavModal():NavModalReturn {
  const [isModal, setIsModal] = useState<boolean>(false);
  const toggleModal = () => setIsModal(!isModal);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const changeModal = () => setIsModal(false);
    mediaQuery.addEventListener('change', changeModal);

    return () => {
      mediaQuery.removeEventListener('change', changeModal);
    };
  }, []);

  return { isModal, toggleModal };
}
