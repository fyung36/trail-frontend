"use client";
import React, { useState } from "react";
import { Table, Tag, Input, Button, Row, Col, Card, Progress, Space, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, DownloadOutlined, FireOutlined, EnvironmentOutlined } from "@ant-design/icons";
import ButtonComponent from "../Buttons/Button";
import FormFilter from "../FormFilter";
import { apiService } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

interface CarbonData {
  key: string;
  projectId: string;
  projectName: string;
  sector: string;
  scope1: number; // tCO₂e
  scope2: number; // tCO₂e
  scope3: number; // tCO₂e
  total: number; // tCO₂e
  baselineYear: number;
  baselineEmissions: number; // tCO₂e
  targetYear: number;
  targetReduction: number; // percentage
  currentProgress: number; // percentage
  status: "On Track" | "At Risk" | "Off Track";
}

export const CarbonNetZero: React.FC = () => {
  // Fetch data using React Query for caching and performance
  const { data: mockCarbonData = [], isLoading } = useQuery({
    queryKey: ['carbon-data'],
    queryFn: () => apiService.getCarbonData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [searchText, setSearchText] = useState("");

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const portfolioTotal = mockCarbonData.reduce((sum, item) => sum + item.total, 0);
  const portfolioScope1 = mockCarbonData.reduce((sum, item) => sum + item.scope1, 0);
  const portfolioScope2 = mockCarbonData.reduce((sum, item) => sum + item.scope2, 0);
  const portfolioScope3 = mockCarbonData.reduce((sum, item) => sum + item.scope3, 0);
  const portfolioBaseline = mockCarbonData.reduce((sum, item) => sum + item.baselineEmissions, 0);
  const portfolioTarget = portfolioBaseline * 0.7; // Assuming 30% average reduction
  const portfolioProgress = ((portfolioBaseline - portfolioTotal) / (portfolioBaseline - portfolioTarget)) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "green";
      case "At Risk":
        return "orange";
      case "Off Track":
        return "red";
      default:
        return "default";
    }
  };

  const carbonColumns: ColumnsType<CarbonData> = [
    {
      title: "Project ID",
      dataIndex: "projectId",
      key: "projectId",
      width: 180,
      fixed: "left",
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      width: 300,
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: 200,
    },
    {
      title: "Scope 1 (tCO₂e)",
      dataIndex: "scope1",
      key: "scope1",
      width: 150,
      render: (value: number) => formatNumber(value),
      sorter: (a, b) => a.scope1 - b.scope1,
    },
    {
      title: "Scope 2 (tCO₂e)",
      dataIndex: "scope2",
      key: "scope2",
      width: 150,
      render: (value: number) => formatNumber(value),
      sorter: (a, b) => a.scope2 - b.scope2,
    },
    {
      title: "Scope 3 (tCO₂e)",
      dataIndex: "scope3",
      key: "scope3",
      width: 150,
      render: (value: number) => formatNumber(value),
      sorter: (a, b) => a.scope3 - b.scope3,
    },
    {
      title: "Total (tCO₂e)",
      dataIndex: "total",
      key: "total",
      width: 150,
      render: (value: number) => <strong>{formatNumber(value)}</strong>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Baseline vs Current",
      key: "baseline",
      width: 250,
      render: (_, record: CarbonData) => (
        <div>
          <div style={{ marginBottom: "4px", fontSize: "12px" }}>
            Baseline ({record.baselineYear}): {formatNumber(record.baselineEmissions)} tCO₂e
          </div>
          <div style={{ marginBottom: "4px", fontSize: "12px" }}>
            Current: {formatNumber(record.total)} tCO₂e
          </div>
          <Progress
            percent={Math.round(((record.baselineEmissions - record.total) / record.baselineEmissions) * 100)}
            size="small"
            status={record.total < record.baselineEmissions * 0.85 ? "success" : "exception"}
          />
        </div>
      ),
    },
    {
      title: "Target & Progress",
      key: "target",
      width: 200,
      render: (_, record: CarbonData) => (
        <div>
          <div style={{ marginBottom: "4px", fontSize: "12px" }}>
            Target ({record.targetYear}): {record.targetReduction}% reduction
          </div>
          <Progress
            percent={record.currentProgress}
            size="small"
            strokeColor={getStatusColor(record.status)}
          />
          <div style={{ marginTop: "4px" }}>
            <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
          </div>
        </div>
      ),
    },
  ];

  const filteredData = mockCarbonData.filter(
    (item) =>
      item.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchText.toLowerCase())
  );

  const exportCarbonReport = () => {
    // Prepare CSV content with comprehensive carbon report
    const BOM = "\uFEFF"; // UTF-8 BOM for Excel
    
    // Report Header Section
    const reportHeader = [
      "DBN ESG INTEGRATED SOLUTION - CARBON & NET ZERO REPORT",
      `Generated: ${new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}`,
      "",
      "PORTFOLIO SUMMARY",
      "",
      `Total Portfolio Emissions,${formatNumber(portfolioTotal)},tCO₂e`,
      `Scope 1 Total,${formatNumber(portfolioScope1)},tCO₂e`,
      `Scope 2 Total,${formatNumber(portfolioScope2)},tCO₂e`,
      `Scope 3 Total,${formatNumber(portfolioScope3)},tCO₂e`,
      `Baseline Emissions (2023),${formatNumber(portfolioBaseline)},tCO₂e`,
      `Target Emissions (2030),${formatNumber(portfolioTarget)},tCO₂e`,
      `Current Progress,${Math.round(Math.max(0, Math.min(100, portfolioProgress)))},%`,
      `Reduction from Baseline,${((portfolioBaseline - portfolioTotal) / portfolioBaseline * 100).toFixed(1)},%`,
      "",
      "",
      "PROJECT-LEVEL CARBON DATA",
      "",
    ];

    // Column Headers
    const headers = [
      "Project ID",
      "Project Name",
      "Sector",
      "Scope 1 (tCO₂e)",
      "Scope 2 (tCO₂e)",
      "Scope 3 (tCO₂e)",
      "Total Emissions (tCO₂e)",
      "Baseline Year",
      "Baseline Emissions (tCO₂e)",
      "Target Year",
      "Target Reduction (%)",
      "Current Progress (%)",
      "Status",
      "Reduction from Baseline (%)"
    ];

    // Convert project data to CSV rows
    const csvRows = filteredData.map((project) => {
      const reductionPercent = ((project.baselineEmissions - project.total) / project.baselineEmissions * 100).toFixed(1);
      
      return [
        project.projectId,
        project.projectName,
        project.sector,
        formatNumber(project.scope1),
        formatNumber(project.scope2),
        formatNumber(project.scope3),
        formatNumber(project.total),
        project.baselineYear.toString(),
        formatNumber(project.baselineEmissions),
        project.targetYear.toString(),
        project.targetReduction.toString(),
        project.currentProgress.toString(),
        project.status,
        reductionPercent
      ];
    });

    // Escape CSV cells (handle commas, quotes, newlines)
    const escapeCSVCell = (cell: string | number) => {
      const cellValue = String(cell || "");
      if (cellValue.includes(",") || cellValue.includes('"') || cellValue.includes("\n")) {
        return `"${cellValue.replace(/"/g, '""')}"`;
      }
      return cellValue;
    };

    // Combine all sections
    const csvContent = [
      ...reportHeader.map(line => line),
      headers.map(escapeCSVCell).join(","),
      ...csvRows.map(row => row.map(escapeCSVCell).join(",")),
      "",
      "",
      "EMISSION CALCULATION LOGIC",
      "",
      "Scope 1: Direct emissions from owned or controlled sources",
      "Formula: Activity Data × Emission Factor = tCO₂e",
      "",
      "Scope 2: Indirect emissions from purchased energy",
      "Formula: Energy Consumption × Grid Emission Factor = tCO₂e",
      "",
      "Scope 3: Indirect emissions from value chain",
      "Formula: Activity Data × Value Chain Emission Factor = tCO₂e"
    ].join("\n");

    // Create blob and trigger download
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `DBN_Carbon_NetZero_Report_${today}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="col-12">
      <div style={{ marginBottom: "24px" }}>
        <h1 className="view-title">Carbon & Net Zero Tracking</h1>
        <p style={{ color: "#0f172a", marginTop: "8px", fontWeight: 400 }}>
          Portfolio and project-level carbon accounting and Net Zero target tracking
        </p>
      </div>
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner">Loading carbon data...</div>
        </div>
      )}

      {/* Portfolio Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <Card>
            <Statistic
              title="Portfolio Total Emissions"
              value={formatNumber(portfolioTotal)}
              suffix="tCO₂e"
              prefix={<FireOutlined />}
              valueStyle={{ color: "#FF6B6B" }}
            />
          </Card>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <Card>
            <Statistic
              title="Scope 1 Total"
              value={formatNumber(portfolioScope1)}
              suffix="tCO₂e"
              valueStyle={{ color: "#FF8787" }}
            />
          </Card>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <Card>
            <Statistic
              title="Scope 2 Total"
              value={formatNumber(portfolioScope2)}
              suffix="tCO₂e"
              valueStyle={{ color: "#FFA8A8" }}
            />
          </Card>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <Card>
            <Statistic
              title="Scope 3 Total"
              value={formatNumber(portfolioScope3)}
              suffix="tCO₂e"
              valueStyle={{ color: "#FFC9C9" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Net Zero Progress */}
      <Card style={{ marginBottom: "24px" }} title="Portfolio Net Zero Progress">
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>Baseline Emissions (2023):</span>
                <strong>{formatNumber(portfolioBaseline)} tCO₂e</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>Target Emissions (2030):</span>
                <strong>{formatNumber(portfolioTarget)} tCO₂e</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span>Current Emissions:</span>
                <strong>{formatNumber(portfolioTotal)} tCO₂e</strong>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Progress to Target:</strong>
              </div>
              <Progress
                percent={Math.round(Math.max(0, Math.min(100, portfolioProgress)))}
                strokeColor={{
                  "0%": "#FF6B6B",
                  "100%": "#27BE63",
                }}
                status={portfolioProgress > 50 ? "active" : "normal"}
              />
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#334155" }}>
                {((portfolioBaseline - portfolioTotal) / portfolioBaseline * 100).toFixed(1)}% reduction from baseline
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Calculation Logic Info */}
      <Card style={{ marginBottom: "24px" }} title="Emission Calculation Logic" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <div>
              <strong>Scope 1:</strong> Direct emissions from owned or controlled sources
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#334155" }}>
                Formula: Activity Data × Emission Factor = tCO₂e
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <div>
              <strong>Scope 2:</strong> Indirect emissions from purchased energy
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#334155" }}>
                Formula: Energy Consumption × Grid Emission Factor = tCO₂e
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <div>
              <strong>Scope 3:</strong> Indirect emissions from value chain
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#334155" }}>
                Formula: Activity Data × Value Chain Emission Factor = tCO₂e
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={{ span: 24 }} lg={{ span: 18 }}>
          <FormFilter
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Project ID, Name, or Sector"
            filterText={searchText}
          />
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <ButtonComponent
            htmlType="button"
            className="btn-outline"
            style={{ width: "100%" }}
            onClick={exportCarbonReport}
          >
            <DownloadOutlined style={{ marginRight: "8px" }} /> Export Carbon Report
          </ButtonComponent>
        </Col>
      </Row>

      <Table
        columns={carbonColumns}
        dataSource={filteredData}
        scroll={{ x: 1600 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} projects`,
        }}
      />
    </div>
  );
};
