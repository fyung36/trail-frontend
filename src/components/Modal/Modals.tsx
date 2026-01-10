import React from "react";
import { Modal } from "antd";

interface Props {
  title: string;
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  children: React.ReactNode;
  modalwidth: string;
  footer: React.ReactNode;
  style?: any;
}

const Modals = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  children,
  modalwidth,
  footer,
  style,
}: Props) => {
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={modalwidth}
      footer={footer}
      style={style}
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};

export default Modals;
