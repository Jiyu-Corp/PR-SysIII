import { IconProps } from "@phosphor-icons/react";

import './ButtonModal.css'

type ButtonModalProps = {
  icon: React.ComponentType<IconProps>;
  text: string;
  action: () => void;
  color: string;
  backgroundColor: string;
};

export default function ButtonModal({ icon: Icon, text, action, color, backgroundColor }: ButtonModalProps) {
  const handleClick = (_: React.MouseEvent<HTMLButtonElement>) => action();

  return <button className="button-modal" style={{color: color, backgroundColor: backgroundColor}} onClick={handleClick}>
    <Icon size={16} color={color} weight="fill"/>
    {text}
  </button>
}