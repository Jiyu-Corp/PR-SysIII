import { InputMask, Replacement } from "@react-input/mask";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./InputModal.css"

type InputModalProps = {
  width?: number | string;
  label: string;
  value: string | number | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  mask?: string;
  replacement?: string | Replacement;
};

export default function InputModal({ width, label, value, setValue, mask, replacement }: InputModalProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };
  
  return <InputWrapperModal label={label} width={width}>
    {typeof mask === 'undefined'
      ? <input className="input-modal" value={value} onChange={handleChange}/>
      : <InputMask className="input-modal" value={value} onChange={handleChange} mask={mask} replacement={replacement}/>
    }
  </InputWrapperModal>
}