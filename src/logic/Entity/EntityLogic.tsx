"use client";
import { useState } from "react";
import CreateEntityModal from "@/components/AllModals/CreateEntityModal";
import Entity from "@/components/Entity/Entity";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import useModal from "@/utils/CustomHooks/useModal";

const EntityLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();
  const [collapse, setCollapse] = useState(false);
  // const [entity, setEntity] = useState({
  //   name: "",
  //   default_dashboard: "",
  //   default_dashboard_dataset: "",

  // });
  const [entity, setEntity] = useState<any>([
    {
      // ...entity,
      name: "",
      default_dashboard: "",
      default_dashboard_dataset: "",
    },
  ]);
  console.log(collapse, "collapse");
  const clickAdd = () => {
    setCollapse(!collapse);
  };

  const addEntity = () => {
    setEntity([
      ...entity,
      {
        name: "",
        default_dashboard: "",
        default_dashboard_dataset: "",
      },
    ]);
  };
  return (
    <>
      <Entity
        filterInputChange={filterInputChange}
        filterText={filterText}
        showModal={showModal}
      />

      <CreateEntityModal
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
        clickAdd={clickAdd}
        addEntity={addEntity}
        entity={entity}
        collapse={collapse}
      />
    </>
  );
};

export default EntityLogic;
