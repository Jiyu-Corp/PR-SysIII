import { format, generatePattern, InputMask, Replacement, useMask } from "@react-input/mask";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./InputModal.css"
import { useEffect, useState } from "react";

type InputModalProps = {
  width?: number | string;
  label?: string;
  value: string;
  placeholder?: string;
  setValue: (newValue: string) => void | React.Dispatch<React.SetStateAction<string>>;
  onChange?: (string) => void;
  mask?: string;
  replacement?: string | Replacement;
  formatInput?: (value: string) => string;
  unformat?: (value: string) => string;
  fontSize?: string | number
};

export default function InputModal({ width, label, value, placeholder, setValue, onChange, mask, replacement, unformat, formatInput, fontSize }: InputModalProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if(typeof formatInput !== 'undefined')
      value = formatInput(value);

    setValue(value);
    if(typeof onChange !== 'undefined')
      onChange(value);
  };

  const isMaskedInput = typeof mask !== 'undefined' && typeof replacement !== 'undefined';
  if(isMaskedInput) {
    const maskOptions = {
      mask: mask,
      replacement: replacement
    }

    const maskValue = () => {
      const maskPattern = RegExp(generatePattern('partial', maskOptions));

      const isValueMasked = maskPattern.test(value);
      if(!isValueMasked){
        const unformatedValue = typeof unformat !== 'undefined' 
          ? unformat(value)
          : value;
        setValue(format(unformatedValue, maskOptions));
      }
    }

    // Take the updated value and format it
    useEffect(() => {
      maskValue();
    }, [value]);

    return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" value={value} onChange={handleChange} style={{fontSize: fontSize}} placeholder={placeholder}/>
    </InputWrapperModal>

  } else return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" value={value} onChange={handleChange} style={{fontSize: fontSize}} placeholder={placeholder}/>
    </InputWrapperModal>
  
}