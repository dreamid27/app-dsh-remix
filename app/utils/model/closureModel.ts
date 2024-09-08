export interface IClosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
