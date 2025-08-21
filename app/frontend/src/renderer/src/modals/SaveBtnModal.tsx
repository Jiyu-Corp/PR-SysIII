import { FloppyDiskIcon } from "@phosphor-icons/react";
import ButtonModal from "./ButtonModal/ButtonModal";

export default function SaveBtnModal({ action }: { action: () => void }) {
  return <ButtonModal icon={FloppyDiskIcon} text="Salvar" color="#FFFFFF" backgroundColor="#3BB373" action={action}/>
}