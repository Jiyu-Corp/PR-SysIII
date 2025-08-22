import { format, InputMask, Replacement, useMask } from "@react-input/mask";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./InputModal.css"
import { useEffect } from "react";

type InputModalProps = {
  width?: number | string;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (string) => void;
  mask?: string;
  replacement?: string | Replacement;
};

export default function InputModal({ width, label, value, setValue, onChange, mask, replacement }: InputModalProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    if(typeof onChange !== 'undefined')
      onChange(e.currentTarget.value);
  };

  const isMaskedInput = typeof mask !== 'undefined' && typeof replacement !== 'undefined';
  if(isMaskedInput) {
    const maskOptions = {
      mask: mask,
      replacement: replacement
    }
    // const inputRef = useMask(maskOptions);
    setValue(format(value, maskOptions));

    return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" value={value} onChange={handleChange}/>
    </InputWrapperModal>

  } else return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" value={value} onChange={handleChange}/>
    </InputWrapperModal>
  
}