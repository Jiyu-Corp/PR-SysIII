import { IconProps } from "@phosphor-icons/react";
import { ModalWrapperProps } from "../ModalWrapper/ModalWrapper.type";

export type Modal1Props = ModalWrapperProps & {
  title: string;
  entityIcon: React.ComponentType<IconProps>;
  maxWidth?: string | number;
  isLoading?: boolean;
};