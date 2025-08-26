import { PropsWithChildren } from "react";

import "./InputWrapperModal.css"

export type InputWrapperModalProps = React.PropsWithChildren<{
  width?: string | number
  label?: string;
}>;

export default function InputWrapperModal({ width, label, children }: InputWrapperModalProps) {
  return <div className="input-wrapper-modal" style={{width: width}}>
    {label && <label className="input-label-modal" htmlFor="">{label}</label>}
    {children}
  </div>
}