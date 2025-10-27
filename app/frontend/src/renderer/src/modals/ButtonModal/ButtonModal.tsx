import { IconProps } from "@phosphor-icons/react";

import './ButtonModal.css'

type ButtonModalProps = {
  icon: React.ComponentType<IconProps>;
  text: string;
  action: () => void;
  color: string;
  backgroundColor: string;
  fontSize?: string | number;
  isDisabled?: boolean;
  hint?: string;
};

export default function ButtonModal({ icon: Icon, text, action, color, backgroundColor, fontSize, isDisabled, hint }: ButtonModalProps) {
  const handleClick = (_: React.MouseEvent<HTMLButtonElement>) => action();

  return <button className="button-modal" style={{color: color, backgroundColor: backgroundColor, fontSize: fontSize}} disabled={isDisabled} onClick={handleClick} title={hint}>
    <Icon size={16} color={color} weight="fill"/>
    {text}
  </button>
}