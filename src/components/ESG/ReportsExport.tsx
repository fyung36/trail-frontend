"use client";
import React, { useState } from "react";
import { Card, Row, Col, Button, Space, Modal, message } from "antd";
import { 
  DownloadOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined,
  FileWordOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ButtonComponent from "../Buttons/Button";
import { apiService } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

export const ReportsExport: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  // Define types for portfolio data
  interface PortfolioData {
    portfolioValue: number;
    projectCount: number;
    esgCompleteness: number;
    reportingTimeliness: { onTime: number; late: number; total: number };
    greenTaxonomy: { green: number; transition: number; notGreen: number };
    carbonSummary: { scope1: number; scope2: number; scope3: number; total: number };
    esgFlags: { red: number; amber: number; green: number };
  }
  
  // Fetch data using React Query for caching and performance
  const { data: mockPortfolioData = {} as PortfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio-data'],
    queryFn: () => apiService.getPortfolioData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: mockProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiService.getProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: mockPFISubmissions = [], isLoading: pfiLoading } = useQuery({
    queryKey: ['pfi-submissions'],
    queryFn: () => apiService.getPFISubmissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: mockCarbonData = [], isLoading: carbonLoading } = useQuery({
    queryKey: ['carbon-data'],
    queryFn: () => apiService.getCarbonData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const exportToCSV = (data: any[][], headers: string[], filename: string) => {
    const BOM = "\uFEFF";
    const escapeCSVCell = (cell: string | number | undefined) => {
      const cellValue = String(cell || "");
      if (cellValue.includes(",") || cellValue.includes('"') || cellValue.includes("\n")) {
        return `"${cellValue.replace(/"/g, '""')}"`;
      }
      return cellValue;
    };

    const csvContent = [
      headers.map(escapeCSVCell).join(","),
      ...data.map(row => row.map(escapeCSVCell).join(","))
    ].join("\n");

    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (content: any, filename: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(content.title, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" });
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Content sections
    content.sections.forEach((section: any) => {
      checkPageBreak(30);

      // Section title
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, margin, yPosition);
      yPosition += 10;

      // Section content
      if (section.type === "table") {
        autoTable(doc, {
          startY: yPosition,
          head: [section.headers],
          body: section.data,
          theme: "striped",
          headStyles: {
            fillColor: [19, 84, 211],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 10,
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [15, 23, 42],
          },
          margin: { left: margin, right: margin },
        });
        yPosition = (doc as any).lastAutoTable.finalY + 12;
      } else if (section.type === "text") {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        section.data.forEach((line: string) => {
          checkPageBreak(10);
          doc.text(line, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
          yPosition += 8;
        });
        yPosition += 5;
      }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    doc.save(`${filename}.pdf`);
  };

  const handleExport = (reportType: string, format: string) => {
    setLoading(`${reportType}-${format}`);
    
    setTimeout(() => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const formatLower = format.toLowerCase();

        switch (reportType) {
          case "DBN ESG Portfolio Pack":
            if (formatLower === "excel" || formatLower === "csv") {
              const headers = ["Metric", "Value"];
              const data = [
                ["Portfolio Value", formatCurrency(mockPortfolioData.portfolioValue)],
                ["Project Count", mockPortfolioData.projectCount.toString()],
                ["ESG Data Completeness", `${mockPortfolioData.esgCompleteness}%`],
                ["PFI Reporting Timeliness", `${((mockPortfolioData.reportingTimeliness.onTime / mockPortfolioData.reportingTimeliness.total) * 100).toFixed(1)}%`],
                ["Green Taxonomy Classified", `${mockPortfolioData.greenTaxonomy.green}%`],
                ["Carbon Summary (tCO₂e)", formatNumber(mockPortfolioData.carbonSummary.total)],
                ["ESG Flags - Red", mockPortfolioData.esgFlags.red.toString()],
                ["ESG Flags - Amber", mockPortfolioData.esgFlags.amber.toString()],
                ["ESG Flags - Green", mockPortfolioData.esgFlags.green.toString()],
              ];
              exportToCSV(data, headers, `DBN_ESG_Portfolio_Pack_${today}`);
            } else {
              exportToPDF({
                title: "DBN ESG PORTFOLIO PACK",
                sections: [
                  {
                    title: "PORTFOLIO SUMMARY",
                    type: "table",
                    headers: ["Metric", "Value"],
                    data: [
                      ["Portfolio Value", formatCurrency(mockPortfolioData.portfolioValue)],
                      ["Project Count", mockPortfolioData.projectCount.toString()],
                      ["ESG Data Completeness", `${mockPortfolioData.esgCompleteness}%`],
                      ["PFI Reporting Timeliness", `${((mockPortfolioData.reportingTimeliness.onTime / mockPortfolioData.reportingTimeliness.total) * 100).toFixed(1)}%`],
                      ["Green Taxonomy Classified", `${mockPortfolioData.greenTaxonomy.green}%`],
                      ["Carbon Summary (tCO₂e)", formatNumber(mockPortfolioData.carbonSummary.total)],
                    ]
                  },
                  {
                    title: "ESG FLAGS STATUS",
                    type: "table",
                    headers: ["Status", "Count"],
                    data: [
                      ["Red", mockPortfolioData.esgFlags.red.toString()],
                      ["Amber", mockPortfolioData.esgFlags.amber.toString()],
                      ["Green", mockPortfolioData.esgFlags.green.toString()],
                    ]
                  }
                ]
              }, `DBN_ESG_Portfolio_Pack_${today}`);
            }
            break;

          case "PFI Compliance Summary":
            if (formatLower === "excel" || formatLower === "csv") {
              const headers = ["PFI Name", "Project ID", "Status", "Data Quality Score", "Error Count"];
              const data = mockPFISubmissions.map(sub => [
                sub.pfiName,
                sub.projectId,
                sub.status,
                `${sub.dataQualityScore}%`,
                sub.errorCount.toString()
              ]);
              exportToCSV(data, headers, `PFI_Compliance_Summary_${today}`);
            } else {
              exportToPDF({
                title: "PFI COMPLIANCE SUMMARY",
                sections: [
                  {
                    title: "PFI SUBMISSIONS",
                    type: "table",
                    headers: ["PFI Name", "Project ID", "Status", "Quality Score", "Errors"],
                    data: mockPFISubmissions.map(sub => [
                      sub.pfiName,
                      sub.projectId,
                      sub.status,
                      `${sub.dataQualityScore}%`,
                      sub.errorCount.toString()
                    ])
                  }
                ]
              }, `PFI_Compliance_Summary_${today}`);
            }
            break;

          case "Carbon & Net Zero Summary":
            if (formatLower === "excel" || formatLower === "csv") {
              const headers = ["Project ID", "Project Name", "Scope 1 (tCO₂e)", "Scope 2 (tCO₂e)", "Scope 3 (tCO₂e)", "Total (tCO₂e)", "Baseline Year", "Target Year", "Target Reduction (%)", "Progress (%)"];
              const data = mockCarbonData.map(carbon => [
                carbon.projectId,
                carbon.projectName,
                formatNumber(carbon.scope1),
                formatNumber(carbon.scope2),
                formatNumber(carbon.scope3),
                formatNumber(carbon.total),
                carbon.baselineYear.toString(),
                carbon.targetYear.toString(),
                carbon.targetReduction.toString(),
                carbon.currentProgress.toString()
              ]);
              exportToCSV(data, headers, `Carbon_NetZero_Summary_${today}`);
            } else {
              exportToPDF({
                title: "CARBON & NET ZERO SUMMARY",
                sections: [
                  {
                    title: "CARBON EMISSIONS BY PROJECT",
                    type: "table",
                    headers: ["Project ID", "Project Name", "Scope 1", "Scope 2", "Scope 3", "Total"],
                    data: mockCarbonData.map(carbon => [
                      carbon.projectId,
                      carbon.projectName,
                      formatNumber(carbon.scope1),
                      formatNumber(carbon.scope2),
                      formatNumber(carbon.scope3),
                      formatNumber(carbon.total)
                    ])
                  },
                  {
                    title: "NET ZERO TARGETS",
                    type: "table",
                    headers: ["Project ID", "Baseline Year", "Target Year", "Target Reduction", "Current Progress"],
                    data: mockCarbonData.map(carbon => [
                      carbon.projectId,
                      carbon.baselineYear.toString(),
                      carbon.targetYear.toString(),
                      `${carbon.targetReduction}%`,
                      `${carbon.currentProgress}%`
                    ])
                  }
                ]
              }, `Carbon_NetZero_Summary_${today}`);
            }
            break;

          case "Green Taxonomy Report":
            if (formatLower === "pdf") {
              exportToPDF({
                title: "GREEN TAXONOMY CLASSIFICATION REPORT",
                sections: [
                  {
                    title: "CLASSIFICATION SUMMARY",
                    type: "table",
                    headers: ["Classification", "Percentage", "Count"],
                    data: [
                      ["Green Projects", "65%", "27 projects"],
                      ["Transition Projects", "25%", "11 projects"],
                      ["Not Green Projects", "10%", "4 projects"],
                    ]
                  },
                  {
                    title: "PROJECT CLASSIFICATIONS",
                    type: "table",
                    headers: ["Project ID", "Project Name", "Sector", "Classification"],
                    data: mockProjects.map(proj => [
                      proj.projectId,
                      proj.pfiName,
                      proj.sector,
                      proj.taxonomyStatus
                    ])
                  }
                ]
              }, `Green_Taxonomy_Report_${today}`);
            } else {
              // Word format (export as CSV)
              const headers = ["Project ID", "Project Name", "Sector", "Classification", "Evidence Status"];
              const data = mockProjects.map(proj => [
                proj.projectId,
                proj.pfiName,
                proj.sector,
                proj.taxonomyStatus,
                "Provided"
              ]);
              exportToCSV(data, headers, `Green_Taxonomy_Report_${today}`);
            }
            break;

          case "ESG Data Quality Report":
            if (formatLower === "excel" || formatLower === "csv") {
              const headers = ["PFI Name", "Project ID", "Data Quality Score", "Error Count", "Status", "Last Updated"];
              const data = mockPFISubmissions.map(sub => [
                sub.pfiName,
                sub.projectId,
                `${sub.dataQualityScore}%`,
                sub.errorCount.toString(),
                sub.status,
                new Date().toISOString().split('T')[0]
              ]);
              exportToCSV(data, headers, `ESG_Data_Quality_Report_${today}`);
            } else {
              exportToPDF({
                title: "ESG DATA QUALITY REPORT",
                sections: [
                  {
                    title: "DATA QUALITY METRICS",
                    type: "table",
                    headers: ["PFI Name", "Project ID", "Quality Score", "Error Count", "Status"],
                    data: mockPFISubmissions.map(sub => [
                      sub.pfiName,
                      sub.projectId,
                      `${sub.dataQualityScore}%`,
                      sub.errorCount.toString(),
                      sub.status
                    ])
                  },
                  {
                    title: "QUALITY SUMMARY",
                    type: "text",
                    data: [
                      `Total PFIs: ${mockPFISubmissions.length}`,
                      `Average Quality Score: ${Math.round(mockPFISubmissions.reduce((sum, s) => sum + s.dataQualityScore, 0) / mockPFISubmissions.length)}%`,
                      `Total Errors: ${mockPFISubmissions.reduce((sum, s) => sum + s.errorCount, 0)}`,
                    ]
                  }
                ]
              }, `ESG_Data_Quality_Report_${today}`);
            }
            break;

          case "Executive Dashboard Summary":
            if (formatLower === "pdf") {
              exportToPDF({
                title: "EXECUTIVE DASHBOARD SUMMARY",
                sections: [
                  {
                    title: "KEY ESG KPIs",
                    type: "table",
                    headers: ["KPI", "Value"],
                    data: [
                      ["Portfolio Value", formatCurrency(mockPortfolioData.portfolioValue)],
                      ["Total Projects", mockPortfolioData.projectCount.toString()],
                      ["ESG Data Completeness", `${mockPortfolioData.esgCompleteness}%`],
                      ["Green Taxonomy Classified", `${mockPortfolioData.greenTaxonomy.green}%`],
                      ["Total Carbon Emissions", `${formatNumber(mockPortfolioData.carbonSummary.total)} tCO₂e`],
                      ["ESG Flags - Critical", mockPortfolioData.esgFlags.red.toString()],
                    ]
                  },
                  {
                    title: "PORTFOLIO BREAKDOWN",
                    type: "table",
                    headers: ["Category", "Value"],
                    data: [
                      ["Green Projects", `${mockPortfolioData.greenTaxonomy.green}%`],
                      ["Transition Projects", `${mockPortfolioData.greenTaxonomy.transition}%`],
                      ["Not Green Projects", `${mockPortfolioData.greenTaxonomy.notGreen}%`],
                    ]
                  }
                ]
              }, `Executive_Dashboard_Summary_${today}`);
            } else {
              // PowerPoint format (export as CSV)
              const headers = ["KPI", "Value"];
              const data = [
                ["Portfolio Value", formatCurrency(mockPortfolioData.portfolioValue)],
                ["Total Projects", mockPortfolioData.projectCount.toString()],
                ["ESG Data Completeness", `${mockPortfolioData.esgCompleteness}%`],
                ["Green Taxonomy Classified", `${mockPortfolioData.greenTaxonomy.green}%`],
              ];
              exportToCSV(data, headers, `Executive_Dashboard_Summary_${today}`);
            }
            break;

          case "Complete Portfolio Report":
            exportToPDF({
              title: "COMPLETE PORTFOLIO REPORT",
              sections: [
                {
                  title: "PORTFOLIO OVERVIEW",
                  type: "table",
                  headers: ["Metric", "Value"],
                  data: [
                    ["Portfolio Value", formatCurrency(mockPortfolioData.portfolioValue)],
                    ["Project Count", mockPortfolioData.projectCount.toString()],
                    ["ESG Completeness", `${mockPortfolioData.esgCompleteness}%`],
                  ]
                },
                {
                  title: "ALL PROJECTS",
                  type: "table",
                  headers: ["Project ID", "PFI Name", "Sector", "Location", "Amount"],
                  data: mockProjects.map(proj => [
                    proj.projectId,
                    proj.pfiName,
                    proj.sector,
                    proj.location,
                    formatCurrency(proj.amount)
                  ])
                }
              ]
            }, `Complete_Portfolio_Report_${today}`);
            break;

          case "All Project Data":
            const projectHeaders = ["Project ID", "PFI Name", "Sector", "Location", "Amount", "Taxonomy Status", "ESG Status"];
            const projectData = mockProjects.map(proj => [
              proj.projectId,
              proj.pfiName,
              proj.sector,
              proj.location,
              formatCurrency(proj.amount),
              proj.taxonomyStatus,
              proj.esgStatus
            ]);
            exportToCSV(projectData, projectHeaders, `All_Project_Data_${today}`);
            break;

          case "Complete Dataset":
            const datasetHeaders = ["Project ID", "PFI Name", "Sector", "Status", "Quality Score", "Carbon Total"];
            const datasetData = [
              ["PROJ-2024-001", "Lagos Solar Farm Initiative", "Renewable Energy", "Complete", "95%", "2,900"],
              ["PROJ-2024-002", "Kano Water Treatment Plant", "Water & Sanitation", "Complete", "88%", "5,680"],
              ["PROJ-2024-003", "Port Harcourt Refinery Upgrade", "Oil & Gas", "Incomplete", "72%", "22,300"],
            ];
            exportToCSV(datasetData, datasetHeaders, `Complete_Dataset_${today}`);
            break;

          default:
            message.warning(`Export for "${reportType}" in ${format} format is not yet implemented.`);
            setLoading(null);
            return;
        }

        message.success(`${reportType} exported successfully as ${format.toUpperCase()}!`);
        setLoading(null);
      } catch (error) {
        console.error("Export error:", error);
        message.error(`Failed to export ${reportType}. Please try again.`);
        setLoading(null);
      }
    }, 500);
  };

  const reportButtons = [
    {
      title: "DBN ESG Portfolio Pack",
      description: "Comprehensive ESG portfolio report including all projects, taxonomy classifications, and compliance status",
      formats: ["PDF", "Excel"],
      icon: <FilePdfOutlined />,
      color: "#1354D3",
    },
    {
      title: "PFI Compliance Summary",
      description: "Summary of all PFI submissions, validation status, and compliance metrics",
      formats: ["Excel", "PDF"],
      icon: <FileExcelOutlined />,
      color: "#27BE63",
    },
    {
      title: "Carbon & Net Zero Summary",
      description: "Portfolio and project-level carbon emissions, targets, and Net Zero progress tracking",
      formats: ["PDF", "Excel"],
      icon: <FilePdfOutlined />,
      color: "#FF6B6B",
    },
    {
      title: "Green Taxonomy Report",
      description: "Complete taxonomy classifications with evidence status for all projects",
      formats: ["PDF", "Word"],
      icon: <FileWordOutlined />,
      color: "#D66F0F",
    },
    {
      title: "ESG Data Quality Report",
      description: "Data completeness scores, error logs, and validation metrics across all PFIs",
      formats: ["Excel", "PDF"],
      icon: <FileExcelOutlined />,
      color: "#4431B4",
    },
    {
      title: "Executive Dashboard Summary",
      description: "High-level executive summary with key ESG KPIs and portfolio performance",
      formats: ["PDF", "PowerPoint"],
      icon: <FilePdfOutlined />,
      color: "#1354D3",
    },
  ];

  const getIconForFormat = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FilePdfOutlined />;
      case "excel":
        return <FileExcelOutlined />;
      case "word":
        return <FileWordOutlined />;
      case "powerpoint":
        return <PrinterOutlined />;
      default:
        return <DownloadOutlined />;
    }
  };

  return (
    <div className="col-12">
      <div style={{ marginBottom: "24px" }}>
        <h1 className="view-title">Reports & Export</h1>
        <p style={{ color: "#0f172a", marginTop: "8px", fontWeight: 400 }}>
          Generate and export comprehensive ESG reports in various formats
        </p>
      </div>
      
      {(portfolioLoading || projectsLoading || pfiLoading || carbonLoading) && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner">Loading report data...</div>
        </div>
      )}

      <Row gutter={[16, 16]}>
        {reportButtons.map((report, index) => (
          <Col xs={{ span: 24 }} lg={{ span: 12 }} key={index}>
            <Card
              hoverable
              style={{
                height: "100%",
                borderLeft: `4px solid ${report.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "32px",
                    color: report.color,
                    marginRight: "16px",
                    marginTop: "4px",
                  }}
                >
                  {report.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 600 }}>
                    {report.title}
                  </h3>
                  <p style={{ margin: 0, color: "#334155", fontSize: "14px" }}>
                    {report.description}
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
                <Space wrap>
                  {report.formats.map((format) => {
                    const isLoading = loading === `${report.title}-${format}`;
                    return (
                      <ButtonComponent
                        key={format}
                        htmlType="button"
                        className="updateButton"
                        onClick={() => handleExport(report.title, format)}
                        style={{ minWidth: "120px", opacity: isLoading ? 0.6 : 1 }}
                        disabled={isLoading}
                      >
                        {getIconForFormat(format)} {isLoading ? "Exporting..." : `Export ${format}`}
                      </ButtonComponent>
                    );
                  })}
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Export Actions */}
      <Card
        title="Quick Export Actions"
        style={{ marginTop: "24px" }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <ButtonComponent
              htmlType="button"
              className="updateButton"
              style={{ width: "100%" }}
              onClick={() => handleExport("Complete Portfolio Report", "PDF")}
            >
              <FilePdfOutlined style={{ marginRight: "8px" }} /> Export Complete Portfolio (PDF)
            </ButtonComponent>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <ButtonComponent
              htmlType="button"
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => handleExport("All Project Data", "Excel")}
            >
              <FileExcelOutlined style={{ marginRight: "8px" }} /> Export All Project Data (Excel)
            </ButtonComponent>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <ButtonComponent
              htmlType="button"
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => handleExport("Complete Dataset", "CSV")}
            >
              <DownloadOutlined style={{ marginRight: "8px" }} /> Export Complete Dataset (CSV)
            </ButtonComponent>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
