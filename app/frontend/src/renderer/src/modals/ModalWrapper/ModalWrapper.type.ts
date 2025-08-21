export type ModalWrapperProps = React.PropsWithChildren<{
  isOpen: boolean;
  closeModal: () => void;
}>;