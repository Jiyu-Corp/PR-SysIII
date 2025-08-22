import { TrashIcon } from "@phosphor-icons/react";
import ButtonModal from "./ButtonModal/ButtonModal";

export default function DeleteBtnModal({ action }: { action: () => void }) {
  return <ButtonModal icon={TrashIcon} text="Deletar" color="#FFFFFF" backgroundColor="#C2292E" action={action}/>
}