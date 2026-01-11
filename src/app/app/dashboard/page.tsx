import React from "react";
import dynamic from "next/dynamic";

// Lazy load the Overview component
const Overview = dynamic(() => import("@/logic/Overview/Overview"), {
  ssr: true,
  loading: () => <div className="loading-spinner">Loading dashboard...</div>,
});

const Dashboard = () => {
  return (
    <>
      <Overview />
    </>
  );
};

export default Dashboard;
