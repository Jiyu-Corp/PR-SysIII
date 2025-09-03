import { useEffect, useRef } from "react";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import "./SelectModal.css"
import Select, { SelectInstance, SingleValue } from 'react-select';
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";

type SelectModalProps = {
  width?: number | string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  value: string | number | null;
  setValue: React.Dispatch<React.SetStateAction<string | number | null>> | ((number) => void);
  options: SelectOption[] | SelectOptionGroup[]
  selectClass?: string;
  menuMaxHeight?: number | string;
  required?: boolean;
};

export default function SelectModal({ width, label, placeholder, disabled, value, setValue, options, selectClass, menuMaxHeight, required}: SelectModalProps) {
  // const [inputValue, setInputValue] = useState('');
  const selectRef = useRef<SelectInstance<SelectOption | SelectOptionGroup> | null>(null);

  const handleOnChange = (newValue: SingleValue<SelectOption | SelectOptionGroup>) => {
    setValue((newValue as SelectOption)?.id || null);
    // setInputValue('');
  };

  // const handleOnInputChange = (newValue: string) => {
  //   setInputValue(newValue);
  // }

  useEffect(() => {
    if (value === null) selectRef.current?.clearValue()
  }, [value]);

  if(options.length < 1) return <></>;
  
  return <InputWrapperModal label={label} width={width}><div>
    {required && <span className="input-modal-required">*</span>}
    <Select
      ref={selectRef}
      // onInputChange={handleOnInputChange}
      placeholder={placeholder || "Selecione"}
      value={"options" in options[0]
        ? (options as SelectOptionGroup[])
            .flatMap(g => g.options)
            .find(o => o.id === value)
        : (options as SelectOption[]).find(o => o.id === value) ?? null
      }
      getOptionLabel={ o => o.label }
      getOptionValue={ o => String("id" in o
        ? o.id
        : o.options.find(opt => opt.id == value)?.id
      ) }
      options={options.sort((a: SelectOption | SelectOptionGroup, b : SelectOption | SelectOptionGroup) => a.label.localeCompare(b.label))}
      onChange={handleOnChange}
      isClearable={true}
      isDisabled={disabled || false}
      styles={{
        control: (styles) => ({ ...styles, border: "1.5px solid rgba(0, 0, 0, 0.75)", padding: "0px 4px", minHeight: "0px" }),
        placeholder: (styles) => ({ ...styles, padding: "0px", margin: "0px"}),
        valueContainer: (styles) => ({ ...styles, padding: "0px 8px", margin: "0px"}),
        option: (styles) => ({ ...styles, fontSize: "14px" }),
        indicatorsContainer: (styles) => ({ ...styles, padding: "0px !important" }),
        menuList: (styles) => ({ ...styles, maxHeight: menuMaxHeight ?? "120px" })
      }}
      className={selectClass ?? undefined} 
      classNamePrefix="custom-select"     
      noOptionsMessage={() => "Sem opções."}
    />
  </div>
  </InputWrapperModal> 
}