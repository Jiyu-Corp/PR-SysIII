import AccessModal from "@renderer/modals/AccessModal/AccessModal";
import { Toaster } from "react-hot-toast";

export default function AcessoPage() {
  return (<>
    <Toaster
      position="top-right"
      reverseOrder={true}
    />
    <AccessModal isOpen={true} closeModal={() => {}} />
  </>);
}