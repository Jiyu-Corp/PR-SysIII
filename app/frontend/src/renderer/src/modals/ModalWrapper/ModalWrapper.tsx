import './ModalWrapper.css'
import { ModalWrapperProps } from './ModalWrapper.type'

export default function ModalWrapper({ isOpen, closeModal, children }: ModalWrapperProps) {
  if(!isOpen) return <></>
  return <div className='modal-wrapper'>
    {children}
  </div>
}