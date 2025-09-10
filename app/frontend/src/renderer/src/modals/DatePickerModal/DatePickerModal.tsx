import "./DatePickerModal.css"
import DatePickerField from "@renderer/components/DatePicker/DatePicker";

type DatePickerModalProps = {
  width?: number | string;
  label: string;
  value: string | null | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>> | ((string) => void);
  required?: boolean;
};

export default function DatePickerModal({ width, label, value, setValue, required }: DatePickerModalProps) {
  
  return <div style={{position: "relative", display: "flex", alignItems: "end", width: width}}>
    {required && <span className="input-modal-required">*</span>}
    <DatePickerField
      modal={true}
      label={label}
      value={value}
      onChange={(newIsoString) => setValue(newIsoString)}
      size="small"
    />
  </div>
}