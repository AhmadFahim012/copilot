import { useState } from 'react';

export const useChatToggle = (initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggleChat };
};
