"use client";
import Programme from "@/components/Programme/Programme";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";

const ProgrammeLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  return (
    <>
      <Programme
        filterInputChange={filterInputChange}
        filterText={filterText}
      />
    </>
  );
};

export default ProgrammeLogic;
