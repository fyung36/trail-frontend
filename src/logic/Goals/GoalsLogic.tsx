"use client";
import { useState } from "react";
import Goals from "@/components/Goals/Goals";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import CustomGoalModal from "@/components/AllModals/CustomGoalModal";
import useModal from "@/utils/CustomHooks/useModal";
import { IIndicator } from "@/types/goals";

const GoalsLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();
  const [indicatorGoal, setIndicatorGoal] = useState<IIndicator>([
    { indicator: "" },
  ]);

  const addIndicators = () => {
    setIndicatorGoal([
      ...indicatorGoal,
      {
        indicator: "",
      },
    ]);
  };
  return (
    <>
      <Goals
        filterInputChange={filterInputChange}
        filterText={filterText}
        showModal={showModal}
      />

      <CustomGoalModal
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
        indicatorGoal={indicatorGoal}
        addIndicators={addIndicators}
      />
    </>
  );
};

export default GoalsLogic;
