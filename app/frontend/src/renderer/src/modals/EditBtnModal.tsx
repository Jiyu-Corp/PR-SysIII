import { FloppyDiskIcon } from "@phosphor-icons/react";
import ButtonModal from "./ButtonModal/ButtonModal";

export default function EditBtnModal({ action }: { action: () => void }) {
  return <ButtonModal icon={FloppyDiskIcon} text="Editar" color="#FFFFFF" backgroundColor="#3BB373" action={action}/>
}