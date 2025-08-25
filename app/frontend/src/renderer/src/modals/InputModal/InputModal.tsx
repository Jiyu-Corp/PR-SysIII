import { format, generatePattern, InputMask, Replacement, useMask } from "@react-input/mask";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./InputModal.css"
import { useEffect, useState } from "react";

type InputModalProps = {
  width?: number | string;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>> | ((string) => void);
  onChange?: (string) => void;
  mask?: string;
  replacement?: string | Replacement;
  unformat?: (value: string) => string;
};

export default function InputModal({ width, label, value, setValue, onChange, mask, replacement, unformat }: InputModalProps) {
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
      <input className="input-modal" value={value} onChange={handleChange}/>
    </InputWrapperModal>

  } else return <InputWrapperModal label={label} width={width}>
      <input className="input-modal" value={value} onChange={handleChange}/>
    </InputWrapperModal>
  
}