import './ModalWrapper.css'
import { ModalWrapperProps } from './ModalWrapper.type'

export default function ModalWrapper({ isOpen, closeModal, noBackground, children }: ModalWrapperProps) {
  if(!isOpen) return <></>
  return <div className='modal-wrapper' style={noBackground ? {backgroundColor: "white"} : {}}>
    {children}
  </div>
}