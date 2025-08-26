import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { X, XIcon } from "@phosphor-icons/react";
import { Modal1Props } from "./Modal1.type";

import "./Modal1.css"
import { Grid } from "react-loader-spinner";

export default function Modal1({
	title,
	entityIcon: EntityIcon,
  isLoading,
  maxWidth,
	isOpen,
	closeModal,
	children
}: Modal1Props) {
	return <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
		<div className="modal-1" style={{maxWidth: maxWidth}}>
			<div className="entity-icon-wrapper">
				<EntityIcon size={64} color="#4A87E8"/>
			</div>
			<div className="modal-1-close-wrapper" onClick={() => closeModal()}>
				<XIcon/>
			</div>
			<div className="modal-1-header">
				<h1 className="modal-1-title">
					{title}
				</h1>
			</div>
			<div className="modal-1-content">
				{isLoading
          ? <div style={{ margin: "24px 64px" }}>
            <Grid
              visible={true}
              height="80"
              width="80"
              color="#4A87E8"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{justifyContent: "center"}}
              wrapperClass="grid-wrapper"
            />
          </div>
          : children
        }
			</div>
		</div>
	</ModalWrapper>
}