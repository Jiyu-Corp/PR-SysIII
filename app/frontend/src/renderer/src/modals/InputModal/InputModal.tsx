import { format,  generatePattern,  InputMask, Replacement, unformat, useMask } from "@react-input/mask";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./InputModal.css"
import { useEffect } from "react";

type InputModalProps = {
  width?: number | string;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (string) => void;
  masks?: {
    maxLength: number
    mask: string
  }[];
  replacement?: string | Replacement;
};

export default function InputModal({ width, label, value, setValue, onChange, masks, replacement }: InputModalProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    if(typeof onChange !== 'undefined')
      onChange(e.currentTarget.value);
  };

  const isMaskedInput = typeof masks !== 'undefined' && typeof replacement !== 'undefined';
  if(isMaskedInput) {
    const getMask = (value: string) => (masks.find(m => m.maxLength > value.length) || masks[masks.length-1]).mask;
    const maskOptions = {
      mask: getMask(value),
      replacement: replacement
    }
    const inputRef = useMask(maskOptions);
    const defaultValue = format(value, maskOptions);

    const handleChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      setValue(newValue);
      maskOptions.mask = getMask(newValue);
      if(typeof onChange !== 'undefined')
        onChange(e.currentTarget.value);
    };

    return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" ref={inputRef} defaultValue={defaultValue} onInput={handleInput} onChange={handleChangeMask}/>
    </InputWrapperModal>

  } else return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" value={value} onChange={handleChange}/>
    </InputWrapperModal>
  
}