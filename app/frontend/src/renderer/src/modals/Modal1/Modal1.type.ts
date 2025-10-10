import { IconProps } from "@phosphor-icons/react";
import { ModalWrapperProps } from "../ModalWrapper/ModalWrapper.type";

export type Modal1Props = ModalWrapperProps & {
  className?: string;
  title: string;
  entityIcon: React.ComponentType<IconProps>;
  maxWidth?: string | number;
  maxHeight?: string | number;
  isLoading?: boolean;
  noBackground?: boolean;
  noExitBtn?: boolean;
};