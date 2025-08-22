import { useState } from "react";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./SelectModal.css"
import Select, { SingleValue } from 'react-select';

type InputModalProps = {
  width?: number | string;
  label: string;
  placeholder?: string;
  disabled?: boolean
  value: number | null;
  setValue: React.Dispatch<React.SetStateAction<number | null>>;
  options: SelectOption[]
};

export default function SelectModal({ width, label, placeholder, disabled, value, setValue, options }: InputModalProps) {
  const [inputValue, setInputValue] = useState('');

  const handleOnChange = (newValue: SingleValue<SelectOption>) => {
    setValue(newValue?.id || null);
  };

  const handleOnInputChange = (newValue: string) => {
    setInputValue(newValue);
  }
  
  return <InputWrapperModal label={label} width={width}>
    <Select
      inputValue={inputValue}
      onInputChange={handleOnInputChange}
      placeholder={placeholder || "Selecione"}
      value={options.find(o => o.id == value)}
      options={options}
      onChange={handleOnChange}
      isClearable={true}
      isDisabled={disabled || false}
      styles={{
        control: (styles) => ({ ...styles, border: "1.5px solid rgba(0, 0, 0, 0.75)", padding: "0px 4px", minHeight: "0px" }),
        placeholder: (styles) => ({ ...styles, padding: "0px", margin: "0px"}),
        valueContainer: (styles) => ({ ...styles, padding: "0px 8px", margin: "0px"}),
        option: (styles) => ({ ...styles, fontSize: "14px" }),
        indicatorsContainer: (styles) => ({ ...styles, padding: "0px !important" }),
      }}
    />
  </InputWrapperModal> 
}