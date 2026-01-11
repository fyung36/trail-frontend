"use client";
import CreateEntityModal from "@/components/AllModals/CreateEntityModal";
import AllMetric from "@/components/Metric/AllMetric";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import useModal from "@/utils/CustomHooks/useModal";
import CreateMetricModal from "@/components/AllModals/CreateMetricModal";

const MetricsLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();
  return (
    <>
      <AllMetric
        filterText={filterText}
        filterInputChange={filterInputChange}
        showModal={showModal}
      />
      <CreateMetricModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default MetricsLogic;
