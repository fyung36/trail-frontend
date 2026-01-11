"use client";
import { useState } from "react";
import OrgStructure from "@/components/OrgStructure/OrgStructure";
import CreateStructureModal from "@/components/AllModals/CreateStructureModal";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import useModal from "@/utils/CustomHooks/useModal";

const OrgStructureLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();

  return (
    <>
      <OrgStructure
        showModal={showModal}
        filterText={filterText}
        filterInputChange={filterInputChange}
      />

      <CreateStructureModal
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

export default OrgStructureLogic;
