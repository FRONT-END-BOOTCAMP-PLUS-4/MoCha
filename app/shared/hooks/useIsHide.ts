import { useState } from 'react';

export default function useIsHide() {
  const [isHide, setIsHide] = useState(false);

  const onToggle = () => setIsHide((prev) => !prev);

  return { isHide, onToggle };
}
