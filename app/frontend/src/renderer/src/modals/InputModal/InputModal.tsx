import { format, generatePattern, InputMask, Replacement, useMask } from "@react-input/mask";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./InputModal.css"
import { useEffect, useState } from "react";

type InputModalProps = {
  className?: string;
  width?: number | string;
  label?: string;
  value: string;
  type?: string;
  placeholder?: string;
  locked?: boolean;
  disabled?: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>> | ((string) => void);
  onChange?: (string) => void;
  mask?: string;
  replacement?: string | Replacement;
  formatInput?: (value: string) => string;
  unformat?: (value: string) => string;
  fontSize?: string | number;
  textAreaData?: {
    rows: number; 
    cols?: number;
  };
  required?: boolean;
};

export default function InputModal({ className, width, label, value, type, placeholder, disabled, locked, setValue, onChange, mask, replacement, unformat, formatInput, fontSize, textAreaData, required }: InputModalProps) {
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
      <div style={{width: width}}>
        {required && <span className="input-modal-required">*</span>}
        <input className={`input-modal ${className ?? ""}`} value={value} onChange={handleChange} style={{fontSize: fontSize, width: width}} placeholder={placeholder} disabled={disabled}/>
      </div>
    </InputWrapperModal>
  } else if(typeof textAreaData !== 'undefined') {
    const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let value = e.target.value;
      if(typeof formatInput !== 'undefined')
        value = formatInput(value);

      setValue(value);  
      if(typeof onChange !== 'undefined')
        onChange(value);
    };

    return <InputWrapperModal label={label} width={width}>
      <div style={{width: width}}>
        {required && <span className="input-modal-required">*</span>}
        <textarea className={`input-modal ${className ?? ""} ${required ? "input-modal-required" : ""}`} value={value} onChange={handleChangeTextArea} style={{fontSize: fontSize, resize: "none"}} rows={textAreaData.rows} cols={textAreaData.cols} placeholder={placeholder} disabled={disabled}/>
      </div>
    </InputWrapperModal>
  } else return <InputWrapperModal label={label} width={width}>
      <div style={{width: width}}>
        {required && <span className="input-modal-required">*</span>}
        <input className={`input-modal ${locked ? "input-modal-locked" : ""} ${className ?? ""} ${required ? "input-modal-required" : ""}`} type={type ?? "text"} value={value} onChange={handleChange} style={{fontSize: fontSize, width: width}} placeholder={placeholder} disabled={disabled || locked}/>
      </div>
    </InputWrapperModal>
  
}