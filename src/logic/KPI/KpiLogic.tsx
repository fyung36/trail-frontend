"use client";
import CreateKPIModal from "@/components/AllModals/CreateKPIModal";
import AllKpi from "@/components/KPI/AllKpi";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import useModal from "@/utils/CustomHooks/useModal";

const KpiLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();
  return (
    <>
      <AllKpi
        filterText={filterText}
        filterInputChange={filterInputChange}
        showModal={showModal}
      />

      <CreateKPIModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default KpiLogic;
