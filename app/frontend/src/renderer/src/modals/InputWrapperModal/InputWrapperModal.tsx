import { PropsWithChildren } from "react";

import "./InputWrapperModal.css"

export type InputWrapperModalProps = React.PropsWithChildren<{
  label: string;
}>;

export default function InputWrapperModal({ label, children }: InputWrapperModalProps) {
  return <div className="input-wrapper-modal">
    <label className="input-label-modal" htmlFor="">{label}</label>
    {children}
  </div>
}