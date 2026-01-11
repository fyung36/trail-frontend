"use client";
import FormTable from "@/components/FormModule/FormTable";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import useModal from "@/utils/CustomHooks/useModal";

const FormLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();
  return (
    <div className="dashboard-card">
      <FormTable
        filterText={filterText}
        filterInputChange={filterInputChange}
        showModal={showModal}
      />
    </div>
  );
};

export default FormLogic;
