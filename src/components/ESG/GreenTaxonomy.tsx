"use client";
import React, { useState } from "react";
import { Table, Tag, Input, Button, Row, Col, Select, Space, Card, Upload, message, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, UploadOutlined, DownloadOutlined, FileTextOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ButtonComponent from "../Buttons/Button";
import FormFilter from "../FormFilter";

interface TaxonomyRule {
  key: string;
  category: string;
  criteria: string;
  threshold: string;
  evidenceRequired: string;
}

interface ProjectClassification {
  key: string;
  projectId: string;
  projectName: string;
  sector: string;
  classification: "Green" | "Transition" | "Not Green";
  evidenceStatus: "Provided" | "Missing";
  evidenceFile?: string;
  lastUpdated: string;
}

// Mock Taxonomy Rules
const mockTaxonomyRules: TaxonomyRule[] = [
  {
    key: "1",
    category: "Renewable Energy",
    criteria: "Projects generating energy from renewable sources",
    threshold: "≥80% renewable energy output",
    evidenceRequired: "Energy generation reports, renewable source certificates",
  },
  {
    key: "2",
    category: "Energy Efficiency",
    criteria: "Projects reducing energy consumption",
    threshold: "≥30% energy reduction vs baseline",
    evidenceRequired: "Energy audits, baseline comparison reports",
  },
  {
    key: "3",
    category: "Clean Transportation",
    criteria: "Electric or low-emission transport systems",
    threshold: "Zero direct emissions or <50g CO₂/km",
    evidenceRequired: "Vehicle specifications, emission certificates",
  },
  {
    key: "4",
    category: "Water & Wastewater",
    criteria: "Water conservation and treatment projects",
    threshold: "≥20% water savings or treatment capacity ≥10,000 m³/day",
    evidenceRequired: "Water impact assessments, treatment certifications",
  },
  {
    key: "5",
    category: "Waste Management",
    criteria: "Recycling, composting, or waste-to-energy",
    threshold: "≥60% waste diversion from landfill",
    evidenceRequired: "Waste audit reports, diversion certificates",
  },
  {
    key: "6",
    category: "Transition Activities",
    criteria: "Activities in transition towards green",
    threshold: "Meets transition pathway criteria",
    evidenceRequired: "Transition plans, improvement commitments",
  },
];

// Mock Project Classifications - Comprehensive and Consistent
const mockClassifications: ProjectClassification[] = [
  {
    key: "1",
    projectId: "PROJ-2024-001",
    projectName: "Lagos Solar Farm Initiative",
    sector: "Renewable Energy",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "solar_farm_evidence.pdf",
    lastUpdated: "2024-01-20",
  },
  {
    key: "2",
    projectId: "PROJ-2024-002",
    projectName: "Kano Water Treatment Plant",
    sector: "Water & Sanitation",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "water_treatment_evidence.pdf",
    lastUpdated: "2024-01-18",
  },
  {
    key: "3",
    projectId: "PROJ-2024-003",
    projectName: "Port Harcourt Refinery Upgrade",
    sector: "Oil & Gas",
    classification: "Transition",
    evidenceStatus: "Provided",
    evidenceFile: "refinery_transition_plan.pdf",
    lastUpdated: "2024-01-15",
  },
  {
    key: "4",
    projectId: "PROJ-2024-004",
    projectName: "Abuja Metro Rail Extension",
    sector: "Transportation",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "metro_rail_evidence.pdf",
    lastUpdated: "2024-01-22",
  },
  {
    key: "5",
    projectId: "PROJ-2024-005",
    projectName: "Kaduna Coal Power Plant",
    sector: "Energy",
    classification: "Not Green",
    evidenceStatus: "Missing",
    lastUpdated: "2024-01-10",
  },
  {
    key: "6",
    projectId: "PROJ-2024-006",
    projectName: "Enugu Waste Management Facility",
    sector: "Waste Management",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "waste_management_evidence.pdf",
    lastUpdated: "2024-01-25",
  },
  {
    key: "7",
    projectId: "PROJ-2024-007",
    projectName: "Ibadan Wind Energy Project",
    sector: "Renewable Energy",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "wind_energy_evidence.pdf",
    lastUpdated: "2024-01-19",
  },
  {
    key: "8",
    projectId: "PROJ-2024-008",
    projectName: "Benin City Water Supply Upgrade",
    sector: "Water & Sanitation",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "water_supply_evidence.pdf",
    lastUpdated: "2024-01-17",
  },
  {
    key: "9",
    projectId: "PROJ-2024-009",
    projectName: "Warri Refinery Modernization",
    sector: "Oil & Gas",
    classification: "Transition",
    evidenceStatus: "Provided",
    evidenceFile: "warri_refinery_transition.pdf",
    lastUpdated: "2024-01-14",
  },
  {
    key: "10",
    projectId: "PROJ-2024-010",
    projectName: "Lagos BRT System Expansion",
    sector: "Transportation",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "brt_expansion_evidence.pdf",
    lastUpdated: "2024-01-23",
  },
  {
    key: "11",
    projectId: "PROJ-2024-011",
    projectName: "Kano Gas Power Station",
    sector: "Energy",
    classification: "Transition",
    evidenceStatus: "Provided",
    evidenceFile: "gas_power_transition.pdf",
    lastUpdated: "2024-01-16",
  },
  {
    key: "12",
    projectId: "PROJ-2024-012",
    projectName: "Port Harcourt Recycling Plant",
    sector: "Waste Management",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "recycling_plant_evidence.pdf",
    lastUpdated: "2024-01-21",
  },
  {
    key: "13",
    projectId: "PROJ-2024-013",
    projectName: "Jos Solar Microgrid",
    sector: "Renewable Energy",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "solar_microgrid_evidence.pdf",
    lastUpdated: "2024-01-24",
  },
  {
    key: "14",
    projectId: "PROJ-2024-014",
    projectName: "Calabar Industrial Waste Treatment",
    sector: "Waste Management",
    classification: "Green",
    evidenceStatus: "Provided",
    evidenceFile: "industrial_waste_evidence.pdf",
    lastUpdated: "2024-01-20",
  },
  {
    key: "15",
    projectId: "PROJ-2024-015",
    projectName: "Kaduna Oil Refinery Expansion",
    sector: "Oil & Gas",
    classification: "Not Green",
    evidenceStatus: "Missing",
    lastUpdated: "2024-01-12",
  },
];

export const GreenTaxonomy: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [classificationFilter, setClassificationFilter] = useState<string>("all");

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Green":
        return "green";
      case "Transition":
        return "orange";
      case "Not Green":
        return "red";
      default:
        return "default";
    }
  };

  const classificationColumns: ColumnsType<ProjectClassification> = [
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
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
      width: 150,
      render: (classification: string) => (
        <Tag color={getClassificationColor(classification)}>
          {classification}
        </Tag>
      ),
      filters: [
        { text: "Green", value: "Green" },
        { text: "Transition", value: "Transition" },
        { text: "Not Green", value: "Not Green" },
      ],
      onFilter: (value, record) => record.classification === value,
    },
    {
      title: "Evidence Status",
      dataIndex: "evidenceStatus",
      key: "evidenceStatus",
      width: 150,
      render: (status: string, record: ProjectClassification) => (
        <Space>
          <Tag color={status === "Provided" ? "green" : "red"}>
            {status}
          </Tag>
          {record.evidenceFile && (
            <Button
              type="link"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => console.log("Download evidence:", record.evidenceFile)}
            >
              View
            </Button>
          )}
        </Space>
      ),
      filters: [
        { text: "Provided", value: "Provided" },
        { text: "Missing", value: "Missing" },
      ],
      onFilter: (value, record) => record.evidenceStatus === value,
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record: ProjectClassification) => (
        <Space>
          <Upload
            name="file"
            accept=".pdf,.doc,.docx"
            beforeUpload={() => false}
            showUploadList={false}
          >
            <Button size="small" icon={<UploadOutlined />}>
              {record.evidenceStatus === "Missing" ? "Upload" : "Replace"}
            </Button>
          </Upload>
          <Button size="small" onClick={() => console.log("Reclassify:", record)}>
            Reclassify
          </Button>
        </Space>
      ),
    },
  ];

  const filteredClassifications = mockClassifications.filter((item) => {
    const matchesSearch = 
      item.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchText.toLowerCase());
    const matchesClassification = 
      classificationFilter === "all" || item.classification === classificationFilter;
    return matchesSearch && matchesClassification;
  });

  const handleExportReport = () => {
    // Prepare CSV content with comprehensive Green Taxonomy report
    const BOM = "\uFEFF"; // UTF-8 BOM for Excel
    
    // Escape CSV cells (handle commas, quotes, newlines)
    const escapeCSVCell = (cell: string | number | undefined) => {
      const cellValue = String(cell || "");
      if (cellValue.includes(",") || cellValue.includes('"') || cellValue.includes("\n")) {
        return `"${cellValue.replace(/"/g, '""')}"`;
      }
      return cellValue;
    };

    // Report Header Section
    const reportHeader = [
      "DBN ESG INTEGRATED SOLUTION - GREEN TAXONOMY CLASSIFICATION REPORT",
      `Generated: ${new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}`,
      "",
      "CLASSIFICATION SUMMARY",
      "",
      `Green Projects,65%,27 projects`,
      `Transition Projects,25%,11 projects`,
      `Not Green Projects,10%,4 projects`,
      `Total Projects,100%,42 projects`,
      "",
      `Evidence Provided,38 projects`,
      `Evidence Missing,4 projects`,
      "",
      "",
      "TAXONOMY RULES",
      "",
    ];

    // Taxonomy Rules Table
    const rulesHeaders = [
      "Category",
      "Criteria",
      "Threshold",
      "Evidence Required"
    ];

    const rulesRows = mockTaxonomyRules.map(rule => [
      escapeCSVCell(rule.category),
      escapeCSVCell(rule.criteria),
      escapeCSVCell(rule.threshold),
      escapeCSVCell(rule.evidenceRequired)
    ]);

    // Project Classifications Table
    const classificationsHeader = [
      "",
      "PROJECT CLASSIFICATIONS",
      "",
    ];

    const classificationHeaders = [
      "Project ID",
      "Project Name",
      "Sector",
      "Classification",
      "Evidence Status",
      "Evidence File",
      "Last Updated"
    ];

    const classificationRows = filteredClassifications.map(project => [
      escapeCSVCell(project.projectId),
      escapeCSVCell(project.projectName),
      escapeCSVCell(project.sector),
      escapeCSVCell(project.classification),
      escapeCSVCell(project.evidenceStatus),
      escapeCSVCell(project.evidenceFile || "N/A"),
      escapeCSVCell(project.lastUpdated)
    ]);

    // Combine all sections
    const csvContent = [
      ...reportHeader,
      rulesHeaders.map(escapeCSVCell).join(","),
      ...rulesRows.map(row => row.join(",")),
      "",
      "",
      ...classificationsHeader,
      classificationHeaders.map(escapeCSVCell).join(","),
      ...classificationRows.map(row => row.join(",")),
      "",
      "",
      "CLASSIFICATION DEFINITIONS",
      "",
      "Green: Projects that meet DBN Green Taxonomy criteria and contribute significantly to environmental objectives",
      "Transition: Projects that are transitioning towards green criteria and have a clear pathway",
      "Not Green: Projects that do not meet green taxonomy criteria"
    ].join("\n");

    // Create blob and trigger download
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `DBN_Green_Taxonomy_Report_${today}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success("Green Taxonomy report exported successfully as Excel!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;
    
    // Colors
    const primaryColor: [number, number, number] = [19, 84, 211]; // #1354d3
    const darkColor: [number, number, number] = [15, 23, 42]; // #0f172a
    const lightGray: [number, number, number] = [241, 245, 249]; // #f1f5f9
    const greenColor: [number, number, number] = [39, 190, 99]; // #27be63
    const orangeColor: [number, number, number] = [251, 146, 60]; // #fb923c
    const redColor: [number, number, number] = [239, 68, 68]; // #ef4444
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("DBN ESG INTEGRATED SOLUTION", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("GREEN TAXONOMY CLASSIFICATION REPORT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleString("en-NG", { 
      timeZone: "Africa/Lagos",
      dateStyle: "long",
      timeStyle: "short"
    });
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;
    
    // Classification Summary Section
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("CLASSIFICATION SUMMARY", margin, yPosition);
    yPosition += 10;
    
    // Summary Box
    const summaryData = [
      ["Green Projects", "65%", "27 projects"],
      ["Transition Projects", "25%", "11 projects"],
      ["Not Green Projects", "10%", "4 projects"],
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [["Classification", "Percentage", "Count"]],
      body: summaryData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkColor,
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "bold" },
        1: { cellWidth: 40, halign: "center" },
        2: { cellWidth: 50, halign: "center" },
      },
      margin: { left: margin, right: margin },
      styles: { lineColor: lightGray },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 12;
    checkPageBreak(30);
    
    // Evidence Status
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("EVIDENCE STATUS", margin, yPosition);
    yPosition += 10;
    
    const evidenceData = [
      ["Evidence Provided", "38 projects"],
      ["Evidence Missing", "4 projects"],
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [["Status", "Count"]],
      body: evidenceData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkColor,
      },
      columnStyles: {
        0: { cellWidth: 120, fontStyle: "bold" },
        1: { cellWidth: 50, halign: "center" },
      },
      margin: { left: margin, right: margin },
      styles: { lineColor: lightGray },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    checkPageBreak(40);
    
    // Taxonomy Rules Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAXONOMY RULES", margin, yPosition);
    yPosition += 10;
    
    const rulesData = mockTaxonomyRules.map(rule => [
      rule.category,
      rule.criteria,
      rule.threshold,
      rule.evidenceRequired
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [["Category", "Criteria", "Threshold", "Evidence Required"]],
      body: rulesData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 40 },
        3: { cellWidth: 80 },
      },
      margin: { left: margin, right: margin },
      styles: { lineColor: lightGray, overflow: "linebreak" },
      didDrawPage: function (data: any) {
        yPosition = data.cursor.y;
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    checkPageBreak(40);
    
    // Project Classifications Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT CLASSIFICATIONS", margin, yPosition);
    yPosition += 10;
    
    const classificationsData = filteredClassifications.map(project => [
      project.projectId,
      project.projectName,
      project.sector,
      project.classification,
      project.evidenceStatus,
      project.evidenceFile || "N/A",
      project.lastUpdated
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [["Project ID", "Project Name", "Sector", "Classification", "Evidence Status", "Evidence File", "Last Updated"]],
      body: classificationsData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkColor,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
      },
      margin: { left: margin, right: margin },
      styles: { lineColor: lightGray, overflow: "linebreak" },
      didDrawPage: function (data: any) {
        yPosition = data.cursor.y;
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    checkPageBreak(25);
    
    // Classification Definitions
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CLASSIFICATION DEFINITIONS", margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const definitions = [
      "Green: Projects that meet DBN Green Taxonomy criteria and contribute significantly to environmental objectives",
      "Transition: Projects that are transitioning towards green criteria and have a clear pathway",
      "Not Green: Projects that do not meet green taxonomy criteria"
    ];
    
    definitions.forEach((def, index) => {
      checkPageBreak(10);
      doc.text(def, margin + 5, yPosition, { maxWidth: pageWidth - 2 * margin - 10 });
      yPosition += 8;
    });
    
    // Footer on last page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      doc.text(
        "DBN ESG Integrated Solution - Green Taxonomy Report",
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    }
    
    // Save PDF
    const today = new Date().toISOString().split('T')[0];
    doc.save(`DBN_Green_Taxonomy_Report_${today}.pdf`);
    message.success("Green Taxonomy report exported successfully as PDF!");
  };

  const handleExportBoth = () => {
    handleExportReport(); // Excel
    setTimeout(() => {
      handleExportPDF(); // PDF
    }, 500);
    message.success("Exporting both Excel and PDF formats...");
  };

  return (
    <div className="col-12">
      <div style={{ marginBottom: "24px" }}>
        <h1 className="view-title">Green Taxonomy Classification</h1>
        <p style={{ color: "#0f172a", marginTop: "8px", fontWeight: 400 }}>
          DBN Green Taxonomy rules and project classification status
        </p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={{ span: 24 }} lg={{ span: 14 }}>
          <Card 
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileTextOutlined style={{ fontSize: "18px", color: "#1354d3" }} />
                <span style={{ fontWeight: 600, fontSize: "16px" }}>Taxonomy Rules</span>
              </div>
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
              border: "1px solid #e4e7ec"
            }}
            headStyle={{
              borderBottom: "2px solid #f1f5f9",
              padding: "16px 20px"
            }}
            bodyStyle={{
              padding: "20px"
            }}
          >
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <Table
                dataSource={mockTaxonomyRules}
                columns={[
                  {
                    title: "Category",
                    dataIndex: "category",
                    key: "category",
                    width: 180,
                    render: (text: string) => (
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{text}</span>
                    ),
                  },
                  {
                    title: "Criteria",
                    key: "criteria",
                    render: (_, record) => (
                      <div style={{ paddingRight: "8px" }}>
                        <div style={{ marginBottom: "8px", color: "#334155", fontSize: "13px", lineHeight: "1.5" }}>
                          {record.criteria}
                        </div>
                        <Tag color="blue" style={{ margin: 0, fontWeight: 500, padding: "2px 10px" }}>
                          {record.threshold}
                        </Tag>
                      </div>
                    ),
                  },
                  {
                    title: "Evidence Required",
                    dataIndex: "evidenceRequired",
                    key: "evidenceRequired",
                    width: 280,
                    render: (text: string) => (
                      <span style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>{text}</span>
                    ),
                  },
                ]}
                pagination={false}
                size="small"
                rowKey="key"
              />
            </div>
          </Card>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 10 }}>
          <Card 
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <SearchOutlined style={{ fontSize: "18px", color: "#1354d3" }} />
                <span style={{ fontWeight: 600, fontSize: "16px" }}>Classification Summary</span>
              </div>
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
              border: "1px solid #e4e7ec"
            }}
            headStyle={{
              borderBottom: "2px solid #f1f5f9",
              padding: "16px 20px"
            }}
            bodyStyle={{
              padding: "20px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  By Classification
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Green Projects</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>27 projects</span>
                    </div>
                    <Tag color="green" style={{ fontSize: "14px", fontWeight: 600, padding: "4px 12px", margin: 0 }}>
                      65%
                    </Tag>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Transition Projects</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>11 projects</span>
                    </div>
                    <Tag color="orange" style={{ fontSize: "14px", fontWeight: 600, padding: "4px 12px", margin: 0 }}>
                      25%
                    </Tag>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Not Green Projects</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>4 projects</span>
                    </div>
                    <Tag color="red" style={{ fontSize: "14px", fontWeight: 600, padding: "4px 12px", margin: 0 }}>
                      10%
                    </Tag>
                  </div>
                </div>
              </div>
              
              <div style={{ paddingTop: "20px", borderTop: "2px solid #f1f5f9" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Evidence Status
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#166534", fontWeight: 500 }}>Evidence Provided</span>
                      <span style={{ fontSize: "11px", color: "#86efac" }}>Complete documentation</span>
                    </div>
                    <Tag color="green" style={{ fontSize: "14px", fontWeight: 600, padding: "4px 12px", margin: 0 }}>
                      38
                    </Tag>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#991b1b", fontWeight: 500 }}>Evidence Missing</span>
                      <span style={{ fontSize: "11px", color: "#fca5a5" }}>Requires attention</span>
                    </div>
                    <Tag color="red" style={{ fontSize: "14px", fontWeight: 600, padding: "4px 12px", margin: 0 }}>
                      4
                    </Tag>
                  </div>
                </div>
              </div>
              
              <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9", marginTop: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#eff6ff", borderRadius: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Total Projects</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#1354d3" }}>42</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <FormFilter
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Project ID, Name, or Sector"
            value={searchText}
          />
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <Select
            placeholder="Filter by Classification"
            style={{ width: "100%" }}
            size="large"
            value={classificationFilter}
            onChange={setClassificationFilter}
          >
            <Select.Option value="all">All Classifications</Select.Option>
            <Select.Option value="Green">Green</Select.Option>
            <Select.Option value="Transition">Transition</Select.Option>
            <Select.Option value="Not Green">Not Green</Select.Option>
          </Select>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
          <Dropdown
            menu={{
              items: [
                {
                  key: "excel",
                  label: "Export as Excel (.csv)",
                  icon: <FileExcelOutlined />,
                  onClick: handleExportReport,
                },
                {
                  key: "pdf",
                  label: "Export as PDF (.pdf)",
                  icon: <FilePdfOutlined />,
                  onClick: handleExportPDF,
                },
                {
                  key: "both",
                  label: "Export Both Formats",
                  icon: <DownloadOutlined />,
                  onClick: handleExportBoth,
                },
              ],
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <ButtonComponent
              htmlType="button"
              className="btn-outline"
              style={{ width: "100%" }}
            >
              <DownloadOutlined style={{ marginRight: "8px" }} /> Export Report
            </ButtonComponent>
          </Dropdown>
        </Col>
      </Row>

      <Table
        columns={classificationColumns}
        dataSource={filteredClassifications}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} projects`,
        }}
      />
    </div>
  );
};
