import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { X } from "@phosphor-icons/react";
import { Modal1Props } from "./Modal1.type";

import "./Modal1.css"

export default function Modal1({
	title,
	entityIcon: EntityIcon,
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
				<X></X>
			</div>
			<div className="modal-1-header">
				<h1 className="modal-1-title">
					{title}
				</h1>
			</div>
			<div className="modal-1-content">
				{children}
			</div>
		</div>
	</ModalWrapper>
}