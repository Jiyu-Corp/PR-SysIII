import './ModalWrapper.css'

type ModalWrapperProps = React.PropsWithChildren<{
  isOpen: boolean;
  closeModal?: () => void;
}>;

export default function ModalWrapper({ isOpen, closeModal, children }: ModalWrapperProps) {
  if(!isOpen) return <></>
  return <div className='modal-wrapper'>
    {children}
  </div>
}