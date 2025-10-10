import { UserIcon } from "@phosphor-icons/react";
import AccessModal from "@renderer/modals/AccessModal/AccessModal";
import HelpModal from "@renderer/modals/HelpModal/HelpModal";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AcessoPage() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  function openHelpMenuWithF1(event: KeyboardEvent): void {
    if(event.key !== "F1") return;
    event.preventDefault();

    setIsHelpModalOpen(prev => !prev);
  }

  useEffect(() => {
    window.addEventListener("keydown", openHelpMenuWithF1);

    return () => {
      window.removeEventListener("keydown", openHelpMenuWithF1);
    }
  }, []);

  return (<>
    <Toaster
      position="top-right"
      reverseOrder={true}
    />
    <AccessModal isOpen={true} closeModal={() => {}} />
    {isHelpModalOpen && <HelpModal isOpen={isHelpModalOpen} closeModal={() => setIsHelpModalOpen(false)} helpIcon={UserIcon} 
      helpTitle="Acesso" 
      helpText={
        `Nesta aba podemos altera a senha de acesso ao sistema.\n`+
        `Vale dizer que se as senha nova não for igual a sua replica, a operação não funcionará`
      }/>
    }
  </>);
}