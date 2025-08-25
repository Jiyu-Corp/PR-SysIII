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
};

export default function ButtonModal({ icon: Icon, text, action, color, backgroundColor, fontSize, isDisabled }: ButtonModalProps) {
  const handleClick = (_: React.MouseEvent<HTMLButtonElement>) => action();

  return <button className="button-modal" style={{color: color, backgroundColor: backgroundColor, fontSize: fontSize}} disabled={isDisabled} onClick={handleClick}>
    <Icon size={16} color={color} weight="fill"/>
    {text}
  </button>
}