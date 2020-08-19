import React from 'react';

export const useMenu = (): {
  isOpen: boolean;
  menuElement: HTMLElement;
  onOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
  onCloseMenu: () => void;
} => {
  const [isOpen, setOpen] = React.useState(false);
  const [menuElement, setMenuElement] = React.useState<HTMLElement>(null);

  const onOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setMenuElement(e.currentTarget);
  };

  const onCloseMenu = () => {
    setOpen(false);
    setMenuElement(null);
  };

  return {
    isOpen,
    menuElement,
    onOpenMenu,
    onCloseMenu,
  };
};
