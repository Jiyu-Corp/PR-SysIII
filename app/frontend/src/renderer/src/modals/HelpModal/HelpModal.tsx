import { IconProps } from "@phosphor-icons/react";
import Modal1 from "../Modal1/Modal1";

import "./HelpModal.css";

type HelpModalProps = {
  helpTitle: string;
  helpText: string;
  helpIcon: React.ComponentType<IconProps>;
  isOpen: boolean;
  closeModal: () => void; 
}

export default function HelpModal({
  helpTitle,
  helpText,
  helpIcon: HelpIcon,
  isOpen,
  closeModal
}: HelpModalProps) {
  return <Modal1 className="help-modal" title={helpTitle} isOpen={isOpen} closeModal={closeModal} entityIcon={HelpIcon} maxWidth={"800px"}>
    <div className="help-content">
      {helpText}
    </div>
  </Modal1>
}