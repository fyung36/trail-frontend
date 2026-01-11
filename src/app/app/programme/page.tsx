import React from "react";
import dynamic from "next/dynamic";

// Lazy load the ProgrammeLogic component
const ProgrammeLogic = dynamic(() => import("@/logic/Programme/ProgrammeLogic"), {
  ssr: true,
  loading: () => <div className="loading-spinner">Loading programme...</div>,
});

const Programme = () => {
  return (
    <>
      <ProgrammeLogic />
    </>
  );
};

export default Programme;
