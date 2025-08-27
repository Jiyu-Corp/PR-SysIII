import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { User, UserIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./AccessModal.css"
import SaveBtnModal from "../SaveBtnModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { PrsysError } from "@renderer/types/prsysErrorType";
import { getErrorMessage } from "@renderer/utils/utils";

type AccessModalProps = { 
  isOpen: boolean;
  closeModal: () => void; 
};

export default function AccessModal({isOpen, closeModal}: AccessModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);

  // Inputs
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');

  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchUsername()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);
  async function fetchUsername() {
    const response = await requestPRSYS('access', 'getDefault', 'GET');
    const defaultLogin = response;
    setUsername(defaultLogin);
  }

  // Behaviour

  // Actions
  async function changeAccessPassword() {
    if(password == newPassword) {
      toast.error("A nova senha e a antiga são a mesma. Elas devem ser diferentes.", errorToastStyle);
      return;
    }
    const params = {
      username: username,
      password: password,
      newPassword: newPassword
    }
    try {
      await requestPRSYS('access', 'changePassword', 'PUT', params);

      toast.success('Senha de acesso alterada.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

	return <Modal1 isLoading={isLoading} maxWidth="450px" title={"Mudar Senha"} isOpen={isOpen} closeModal={closeModal} entityIcon={UserIcon} noBackground={true} noExitBtn={true}>
    <div className="access-modal">
      <div className="inputs-wrapper">
        <InputModal width="150px" label="Login" value={username} setValue={setUsername} locked={true}/>
        <InputModal width="150px" label="Senha Atual" type="password" value={password} setValue={setPassword}/>
        <InputModal width="150px" label="Nova Senha" type="password" value={newPassword} setValue={setNewPassword}/>
      </div>
      <div className="btns-wrapper">
        <SaveBtnModal action={changeAccessPassword}/>
      </div>
    </div>
  </Modal1>
}