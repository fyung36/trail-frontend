import React from "react";
import dynamic from "next/dynamic";

// Lazy load the GoalsLogic component
const GoalsLogic = dynamic(() => import("@/logic/Goals/GoalsLogic"), {
  ssr: true,
  loading: () => <div className="loading-spinner">Loading goals...</div>,
});

const GoalsPage = () => {
  return (
    <>
      <GoalsLogic />
    </>
  );
};

export default GoalsPage;
