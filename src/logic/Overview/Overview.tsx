"use client";
import React, { memo } from "react";
import dynamic from "next/dynamic";

// Lazy load PortfolioOverview with React.memo for performance
const PortfolioOverview = dynamic(
  () => import("@/components/ESG/PortfolioOverview").then(mod => ({
    default: memo(mod.PortfolioOverview)
  })),
  { 
    ssr: true,
    loading: () => <div className="loading-spinner">Loading overview...</div>
  }
);

const Overview = () => {
  return (
    <div className="col-12">
      <PortfolioOverview />
    </div>
  );
};

export default Overview;
