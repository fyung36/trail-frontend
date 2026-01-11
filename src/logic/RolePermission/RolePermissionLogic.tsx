"use client";
import { useState } from "react";
import Permission from "@/components/Roles-Permission/Permission";
import AddRoleModal from "@/components/AllModals/AddRoleModal";
import useModal from "@/utils/CustomHooks/useModal";

const RolePermissionLogic = () => {
  const [isModalVisible, showModal, handleCancel] = useModal();

  return (
    <>
      <Permission showModal={showModal} />

      <AddRoleModal
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

export default RolePermissionLogic;
