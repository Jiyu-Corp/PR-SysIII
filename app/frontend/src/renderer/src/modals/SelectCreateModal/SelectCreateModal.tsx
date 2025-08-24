import { useEffect, useRef } from "react";
import InputWrapperModal from "../InputWrapperModal/InputWrapperModal";

import { SelectInstance, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";

type SelectCreateModalProps = {
  width?: number | string;
  label: string;
  placeholder?: string;
  disabled?: boolean
  value: SelectOption | null;
  setValue: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  options: SelectOption[] | SelectOptionGroup[];
  setOptions: React.Dispatch<React.SetStateAction<(SelectOption & any)[]>> | React.Dispatch<React.SetStateAction<(SelectOptionGroup & any)[]>>
  isGroupSelect?: boolean;
};

export default function SelectCreateModal({ width, label, placeholder, disabled, value, setValue, options, setOptions, isGroupSelect }: SelectCreateModalProps) {
  // const [inputValue, setInputValue] = useState('');
  const selectRef = useRef<SelectInstance<SelectOption | SelectOptionGroup> | null>(null);

  const handleOnChange = (newValue: SingleValue<SelectOption | SelectOptionGroup>) => {
    setValue((newValue as SelectOption) );
    // setInputValue('');
  };

  const clearOptionsFromPreviousCreatedOpt = () => {
    if(options.length > 0){
      if(isGroupSelect) {
        options.forEach((o: SelectOption | SelectOptionGroup) => {
          const optGroup = o as SelectOptionGroup;
          optGroup.options = optGroup.options.filter(o => o.id !== -1)
        });
        setOptions(options as any);
        return options;
      } else {
        const optionsWithoutPreviousCreatedOpt = options.filter(o => (o as SelectOption).id !== -1) as SelectOption[] | SelectOptionGroup[];
        setOptions(optionsWithoutPreviousCreatedOpt as any); 
        return optionsWithoutPreviousCreatedOpt;
      }
    }
    return options;
  }
  const handleCreateOption = (newOptionLabel: string) => {
    const clearedOptions = clearOptionsFromPreviousCreatedOpt();

    const selectOption = {
      id: -1,
      label: newOptionLabel
    } as SelectOption;
    const newOption = isGroupSelect
      ? { label: "Não agrupado", options: [
        selectOption
      ] } as SelectOptionGroup
      : selectOption;

    clearedOptions.push(newOption as any);

    setValue(isGroupSelect
      ? (newOption as SelectOptionGroup).options[0]
      : newOption as SelectOption
    );
  }

  // const handleOnInputChange = (newValue: string) => {
  //   setInputValue(newValue);
  // }

  useEffect(() => {
    if (value === null) selectRef.current?.clearValue()
  }, [value]);
  
  return <InputWrapperModal label={label} width={width}>
    <CreatableSelect
      ref={selectRef}
      // onInputChange={handleOnInputChange}
      placeholder={placeholder || "Selecione"}
      value={options.length < 1 ? null
        : "options" in options[0]
          ? (options as SelectOptionGroup[])
              .flatMap(g => g.options)
              .find(o => o.id === value?.id)
          : (options as SelectOption[]).find(o => o.id === value?.id) ?? null
      }
      getOptionLabel={ o => o.label }
      getOptionValue={ o => String("id" in o
        ? o.id
        : -1
      )}
      options={options}
      formatCreateLabel={(input) => `Criar "${input}"` }
      onChange={handleOnChange}
      onCreateOption={handleCreateOption}
      isClearable={true}
      isDisabled={disabled || false}
      styles={{
        control: (styles) => ({ ...styles, border: "1.5px solid rgba(0, 0, 0, 0.75)", padding: "0px 4px", minHeight: "0px" }),
        placeholder: (styles) => ({ ...styles, padding: "0px", margin: "0px"}),
        valueContainer: (styles) => ({ ...styles, padding: "0px 8px", margin: "0px"}),
        option: (styles) => ({ ...styles, fontSize: "14px" }),
        indicatorsContainer: (styles) => ({ ...styles, padding: "0px !important" }),
      }}
      noOptionsMessage={() => "Sem opções."}
      createOptionPosition="first"
    />
  </InputWrapperModal> 
}