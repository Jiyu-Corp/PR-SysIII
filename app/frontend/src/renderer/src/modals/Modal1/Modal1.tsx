import { ModalWrapperProps } from "../ModalWrapper/ModalWrapper.type";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { IconProps, X } from "@phosphor-icons/react";

type Modal1Props = ModalWrapperProps & {
  title: string;
  entityIcon: React.ComponentType<IconProps>;
};

export default function Modal1({
	title,
	entityIcon: EntityIcon,
	isOpen,
	closeModal,
	children
}: Modal1Props) {
	return <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
		<div className="modal-1">
			<div className="entity-icon-wrapper">
				<EntityIcon/>
			</div>
			<div className="modal-1-close-wrapper">
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