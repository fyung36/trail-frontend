"use client";
import React, { useState } from "react";
import { Table, Tag, Input, Button, Row, Col, Select, Space, Upload, Steps, Modal, Progress, Tabs, Radio, List, message, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps, TabsProps } from "antd";
import { 
  SearchOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  FileExcelOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import ButtonComponent from "../Buttons/Button";
import FormFilter from "../FormFilter";

interface PFISubmission {
  key: string;
  pfiName: string;
  projectId: string;
  submissionDate: string;
  status: "Draft" | "Submitted" | "Validated" | "Approved" | "Published";
  dataQualityScore: number;
  errorCount: number;
  validator: string;
  lastUpdated: string;
}

interface ErrorLog {
  key: string;
  field: string;
  issue: string;
  rowId: string;
  severity: "Critical" | "Warning" | "Info";
  status: "Open" | "Resolved";
  action: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: "excel" | "form";
  file: File;
  uploadDate: string;
  size: number;
}

// Mock PFI Submissions Data - Comprehensive and Consistent
const mockPFISubmissions: PFISubmission[] = [
  {
    key: "1",
    pfiName: "Lagos Solar Farm Initiative",
    projectId: "PROJ-2024-001",
    submissionDate: "2024-01-20",
    status: "Approved",
    dataQualityScore: 95,
    errorCount: 2,
    validator: "John Doe",
    lastUpdated: "2024-01-22",
  },
  {
    key: "2",
    pfiName: "Kano Water Treatment Plant",
    projectId: "PROJ-2024-002",
    submissionDate: "2024-01-18",
    status: "Validated",
    dataQualityScore: 88,
    errorCount: 5,
    validator: "Jane Smith",
    lastUpdated: "2024-01-21",
  },
  {
    key: "3",
    pfiName: "Port Harcourt Refinery Upgrade",
    projectId: "PROJ-2024-003",
    submissionDate: "2024-01-15",
    status: "Submitted",
    dataQualityScore: 72,
    errorCount: 12,
    validator: "-",
    lastUpdated: "2024-01-16",
  },
  {
    key: "4",
    pfiName: "Abuja Metro Rail Extension",
    projectId: "PROJ-2024-004",
    submissionDate: "2024-01-25",
    status: "Published",
    dataQualityScore: 92,
    errorCount: 1,
    validator: "John Doe",
    lastUpdated: "2024-01-26",
  },
  {
    key: "5",
    pfiName: "Kaduna Coal Power Plant",
    projectId: "PROJ-2024-005",
    submissionDate: "2024-01-10",
    status: "Draft",
    dataQualityScore: 45,
    errorCount: 28,
    validator: "-",
    lastUpdated: "2024-01-12",
  },
  {
    key: "6",
    pfiName: "Enugu Waste Management Facility",
    projectId: "PROJ-2024-006",
    submissionDate: "2024-01-22",
    status: "Approved",
    dataQualityScore: 89,
    errorCount: 3,
    validator: "Jane Smith",
    lastUpdated: "2024-01-24",
  },
  {
    key: "7",
    pfiName: "Ibadan Wind Energy Project",
    projectId: "PROJ-2024-007",
    submissionDate: "2024-01-19",
    status: "Approved",
    dataQualityScore: 93,
    errorCount: 1,
    validator: "John Doe",
    lastUpdated: "2024-01-21",
  },
  {
    key: "8",
    pfiName: "Benin City Water Supply Upgrade",
    projectId: "PROJ-2024-008",
    submissionDate: "2024-01-17",
    status: "Validated",
    dataQualityScore: 87,
    errorCount: 4,
    validator: "Jane Smith",
    lastUpdated: "2024-01-20",
  },
  {
    key: "9",
    pfiName: "Warri Refinery Modernization",
    projectId: "PROJ-2024-009",
    submissionDate: "2024-01-14",
    status: "Submitted",
    dataQualityScore: 68,
    errorCount: 15,
    validator: "-",
    lastUpdated: "2024-01-15",
  },
  {
    key: "10",
    pfiName: "Lagos BRT System Expansion",
    projectId: "PROJ-2024-010",
    submissionDate: "2024-01-23",
    status: "Published",
    dataQualityScore: 91,
    errorCount: 2,
    validator: "John Doe",
    lastUpdated: "2024-01-25",
  },
  {
    key: "11",
    pfiName: "Kano Gas Power Station",
    projectId: "PROJ-2024-011",
    submissionDate: "2024-01-16",
    status: "Validated",
    dataQualityScore: 75,
    errorCount: 8,
    validator: "Jane Smith",
    lastUpdated: "2024-01-18",
  },
  {
    key: "12",
    pfiName: "Port Harcourt Recycling Plant",
    projectId: "PROJ-2024-012",
    submissionDate: "2024-01-21",
    status: "Approved",
    dataQualityScore: 90,
    errorCount: 2,
    validator: "John Doe",
    lastUpdated: "2024-01-23",
  },
  {
    key: "13",
    pfiName: "Jos Solar Microgrid",
    projectId: "PROJ-2024-013",
    submissionDate: "2024-01-24",
    status: "Published",
    dataQualityScore: 94,
    errorCount: 1,
    validator: "Jane Smith",
    lastUpdated: "2024-01-26",
  },
  {
    key: "14",
    pfiName: "Calabar Industrial Waste Treatment",
    projectId: "PROJ-2024-014",
    submissionDate: "2024-01-20",
    status: "Validated",
    dataQualityScore: 86,
    errorCount: 5,
    validator: "John Doe",
    lastUpdated: "2024-01-22",
  },
  {
    key: "15",
    pfiName: "Kaduna Oil Refinery Expansion",
    projectId: "PROJ-2024-015",
    submissionDate: "2024-01-12",
    status: "Draft",
    dataQualityScore: 52,
    errorCount: 32,
    validator: "-",
    lastUpdated: "2024-01-13",
  },
];

// Mock Error Log Data
const mockErrorLog: ErrorLog[] = [
  {
    key: "1",
    field: "Carbon Scope 1",
    issue: "Missing emission factor for diesel consumption",
    rowId: "PROJ-2024-003-001",
    severity: "Critical",
    status: "Open",
    action: "Require emission factor input",
  },
  {
    key: "2",
    field: "ESG Compliance Status",
    issue: "Incomplete evidence documentation",
    rowId: "PROJ-2024-003-002",
    severity: "Warning",
    status: "Open",
    action: "Upload missing documents",
  },
  {
    key: "3",
    field: "Green Taxonomy Classification",
    issue: "Classification does not match sector criteria",
    rowId: "PROJ-2024-003-003",
    severity: "Critical",
    status: "Open",
    action: "Review and update classification",
  },
  {
    key: "4",
    field: "Project Amount",
    issue: "Value exceeds expected range for sector",
    rowId: "PROJ-2024-003-004",
    severity: "Warning",
    status: "Open",
    action: "Verify data accuracy",
  },
  {
    key: "5",
    field: "Carbon Scope 2",
    issue: "Missing grid emission factor",
    rowId: "PROJ-2024-005-001",
    severity: "Critical",
    status: "Open",
    action: "Provide grid emission factor",
  },
  {
    key: "6",
    field: "End Date",
    issue: "End date is before start date",
    rowId: "PROJ-2024-005-002",
    severity: "Critical",
    status: "Open",
    action: "Correct project timeline",
  },
  {
    key: "7",
    field: "Taxonomy Evidence",
    issue: "Evidence file not uploaded",
    rowId: "PROJ-2024-005-003",
    severity: "Warning",
    status: "Open",
    action: "Upload evidence document",
  },
  {
    key: "8",
    field: "Location",
    issue: "Location field is empty",
    rowId: "PROJ-2024-009-001",
    severity: "Warning",
    status: "Open",
    action: "Provide project location",
  },
  {
    key: "9",
    field: "Carbon Scope 3",
    issue: "Upstream emissions data incomplete",
    rowId: "PROJ-2024-009-002",
    severity: "Warning",
    status: "Open",
    action: "Complete scope 3 emissions data",
  },
  {
    key: "10",
    field: "Data Quality Score",
    issue: "Score below acceptable threshold",
    rowId: "PROJ-2024-015-001",
    severity: "Critical",
    status: "Open",
    action: "Improve data completeness",
  },
  {
    key: "11",
    field: "Sector Classification",
    issue: "Sector does not match project description",
    rowId: "PROJ-2024-015-002",
    severity: "Warning",
    status: "Resolved",
    action: "Updated sector classification",
  },
  {
    key: "12",
    field: "Project Start Date",
    issue: "Date format incorrect",
    rowId: "PROJ-2024-011-001",
    severity: "Info",
    status: "Resolved",
    action: "Corrected date format",
  },
  {
    key: "13",
    field: "ESG Status",
    issue: "Status workflow violation",
    rowId: "PROJ-2024-011-002",
    severity: "Warning",
    status: "Open",
    action: "Review approval workflow",
  },
  {
    key: "14",
    field: "Beneficiary Count",
    issue: "Value missing",
    rowId: "PROJ-2024-009-003",
    severity: "Warning",
    status: "Open",
    action: "Provide beneficiary count",
  },
  {
    key: "15",
    field: "Energy Consumption",
    issue: "Units not specified",
    rowId: "PROJ-2024-005-004",
    severity: "Info",
    status: "Open",
    action: "Specify measurement units",
  },
];

export const PFISubmissions: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRow, setSelectedRow] = useState<PFISubmission | null>(null);
  const [errorLogVisible, setErrorLogVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions");
  const [uploadType, setUploadType] = useState<"excel" | "form">("excel");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "green";
      case "Approved":
        return "blue";
      case "Validated":
        return "cyan";
      case "Submitted":
        return "orange";
      case "Draft":
        return "default";
      default:
        return "default";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "red";
      case "Warning":
        return "orange";
      case "Info":
        return "blue";
      default:
        return "default";
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "orange";
    return "red";
  };

  const handleViewErrors = (record: PFISubmission) => {
    setSelectedRow(record);
    setErrorLogVisible(true);
  };

  const submissionColumns: ColumnsType<PFISubmission> = [
    {
      title: "PFI Name",
      dataIndex: "pfiName",
      key: "pfiName",
      width: 250,
      fixed: "left",
    },
    {
      title: "Project ID",
      dataIndex: "projectId",
      key: "projectId",
      width: 180,
    },
    {
      title: "Submission Date",
      dataIndex: "submissionDate",
      key: "submissionDate",
      width: 150,
      sorter: (a: PFISubmission, b: PFISubmission) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: "Draft", value: "Draft" },
        { text: "Submitted", value: "Submitted" },
        { text: "Validated", value: "Validated" },
        { text: "Approved", value: "Approved" },
        { text: "Published", value: "Published" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Data Quality Score",
      dataIndex: "dataQualityScore",
      key: "dataQualityScore",
      width: 180,
      render: (score: number, record: PFISubmission) => (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Tag color={getQualityScoreColor(score)}>{score}%</Tag>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={getQualityScoreColor(score)}
            showInfo={false}
          />
        </Space>
      ),
      sorter: (a: PFISubmission, b: PFISubmission) => a.dataQualityScore - b.dataQualityScore,
    },
    {
      title: "Error Count",
      dataIndex: "errorCount",
      key: "errorCount",
      width: 120,
      render: (count: number, record: PFISubmission) => (
        <Button
          type="link"
          onClick={() => handleViewErrors(record)}
          danger={count > 0}
        >
          {count} {count === 1 ? "error" : "errors"}
        </Button>
      ),
      sorter: (a: PFISubmission, b: PFISubmission) => a.errorCount - b.errorCount,
    },
    {
      title: "Validator",
      dataIndex: "validator",
      key: "validator",
      width: 150,
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
      render: (_: unknown, record: PFISubmission) => (
        <Space>
          {record.status === "Draft" && (
            <Button size="small" type="primary">
              Submit
            </Button>
          )}
          {record.status === "Submitted" && (
            <Button size="small" type="primary">
              Validate
            </Button>
          )}
          {record.status === "Validated" && (
            <Button size="small" type="primary">
              Approve
            </Button>
          )}
          {record.status === "Approved" && (
            <Button size="small" type="primary">
              Publish
            </Button>
          )}
          <Button size="small" onClick={() => handleViewErrors(record)}>
            View Errors
          </Button>
        </Space>
      ),
    },
  ];

  const errorLogColumns: ColumnsType<ErrorLog> = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: 200,
    },
    {
      title: "Issue",
      dataIndex: "issue",
      key: "issue",
      width: 300,
    },
    {
      title: "Row/Record ID",
      dataIndex: "rowId",
      key: "rowId",
      width: 200,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      width: 120,
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>{severity}</Tag>
      ),
      filters: [
        { text: "Critical", value: "Critical" },
        { text: "Warning", value: "Warning" },
        { text: "Info", value: "Info" },
      ],
      onFilter: (value, record) => record.severity === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "Resolved" ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 200,
    },
  ];

  const handleFileUpload = (file: File, type: "excel" | "form") => {
    const uploadedFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      type: type,
      file: file,
      uploadDate: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
      size: file.size,
    };

    setUploadedFiles((prev: UploadedFile[]) => [...prev, uploadedFile]);
    
    if (type === "excel") {
      message.success(`Excel file "${file.name}" uploaded successfully. Validation in progress...`);
      // Simulate validation
      setTimeout(() => {
        Modal.success({
          title: "File Uploaded Successfully",
          content: `File ${file.name} has been uploaded. Validation in progress...`,
        });
      }, 1000);
    } else {
      message.success(`Form document "${file.name}" uploaded successfully.`);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev: UploadedFile[]) => prev.filter((f: UploadedFile) => f.id !== fileId));
    message.success("File removed successfully");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: "excel" | "form", fileName: string) => {
    if (type === "excel") {
      return <FileExcelOutlined style={{ fontSize: "20px", color: "#27BE63" }} />;
    }
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return <FilePdfOutlined style={{ fontSize: "20px", color: "#ef4444" }} />;
    } else if (ext === "doc" || ext === "docx") {
      return <FileWordOutlined style={{ fontSize: "20px", color: "#1354d3" }} />;
    }
    return <FileOutlined style={{ fontSize: "20px", color: "#64748b" }} />;
  };

  const excelUploadProps: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls,.csv",
    beforeUpload: (file: File) => {
      handleFileUpload(file, "excel");
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const formUploadProps: UploadProps = {
    name: "file",
    accept: ".pdf,.doc,.docx,.txt",
    beforeUpload: (file: File) => {
      handleFileUpload(file, "form");
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const filteredSubmissions = mockPFISubmissions.filter((item) => {
    const matchesSearch = 
      item.pfiName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectId.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportErrorLog = () => {
    // Prepare CSV content for error log
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
      "DBN ESG INTEGRATED SOLUTION - PFI SUBMISSIONS ERROR LOG",
      `Generated: ${new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}`,
      "",
      `Total Errors: ${mockErrorLog.length}`,
      `Critical Errors: ${mockErrorLog.filter(e => e.severity === "Critical").length}`,
      `Warning Errors: ${mockErrorLog.filter(e => e.severity === "Warning").length}`,
      `Info Errors: ${mockErrorLog.filter(e => e.severity === "Info").length}`,
      `Open Issues: ${mockErrorLog.filter(e => e.status === "Open").length}`,
      `Resolved Issues: ${mockErrorLog.filter(e => e.status === "Resolved").length}`,
      "",
      "",
      "ERROR LOG DETAILS",
      "",
    ];

    // Error Log Table Headers
    const errorHeaders = [
      "Field",
      "Issue",
      "Row/Record ID",
      "Severity",
      "Status",
      "Action Required"
    ];

    // Error Log Data Rows
    const errorRows = mockErrorLog.map(error => [
      escapeCSVCell(error.field),
      escapeCSVCell(error.issue),
      escapeCSVCell(error.rowId),
      escapeCSVCell(error.severity),
      escapeCSVCell(error.status),
      escapeCSVCell(error.action)
    ]);

    // Combine all sections
    const csvContent = [
      ...reportHeader,
      errorHeaders.map(escapeCSVCell).join(","),
      ...errorRows.map(row => row.join(",")),
      "",
      "",
      "SEVERITY DEFINITIONS",
      "",
      "Critical: Errors that must be resolved before submission can proceed",
      "Warning: Issues that should be addressed but do not block submission",
      "Info: Informational messages or suggestions for improvement",
      "",
      "STATUS DEFINITIONS",
      "",
      "Open: Error has been identified and requires action",
      "Resolved: Error has been fixed and verified"
    ].join("\n");

    // Create blob and trigger download
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `DBN_PFI_Error_Log_${today}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success("Error log exported successfully as Excel!");
  };

  return (
    <div className="col-12">
      <div style={{ marginBottom: "24px" }}>
        <h1 className="view-title">PFI Submissions</h1>
        <p style={{ color: "#0f172a", marginTop: "8px", fontWeight: 400 }}>
          Manage PFI ESG submissions with Excel import, validation, and approval workflow
        </p>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: "submissions",
            label: "All Submissions",
            children: (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                  <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                    <FormFilter
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by PFI Name or Project ID"
                      filterText={searchText}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    <Select
                      placeholder="Filter by Status"
                      style={{ width: "100%" }}
                      size="large"
                      value={statusFilter}
                      onChange={setStatusFilter}
                    >
                      <Select.Option value="all">All Status</Select.Option>
                      <Select.Option value="Draft">Draft</Select.Option>
                      <Select.Option value="Submitted">Submitted</Select.Option>
                      <Select.Option value="Validated">Validated</Select.Option>
                      <Select.Option value="Approved">Approved</Select.Option>
                      <Select.Option value="Published">Published</Select.Option>
                    </Select>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                    <Space direction="vertical" style={{ width: "100%" }} size="small">
                      <Radio.Group 
                        value={uploadType} 
                        onChange={(e) => setUploadType(e.target.value)}
                        buttonStyle="solid"
                        size="small"
                      >
                        <Radio.Button value="excel">
                          <FileExcelOutlined /> Excel
                        </Radio.Button>
                        <Radio.Button value="form">
                          <FilePdfOutlined /> Forms
                        </Radio.Button>
                      </Radio.Group>
                      <Space>
                        {uploadType === "excel" ? (
                          <Upload {...excelUploadProps}>
                            <ButtonComponent
                              htmlType="button"
                              className="updateButton"
                            >
                              <UploadOutlined style={{ marginRight: "8px" }} /> Import Excel
                            </ButtonComponent>
                          </Upload>
                        ) : (
                          <Upload {...formUploadProps}>
                            <ButtonComponent
                              htmlType="button"
                              className="updateButton"
                            >
                              <UploadOutlined style={{ marginRight: "8px" }} /> Upload Form
                            </ButtonComponent>
                          </Upload>
                        )}
                        {uploadType === "excel" && (
                          <ButtonComponent
                            htmlType="button"
                            className="btn-outline"
                          >
                            <DownloadOutlined style={{ marginRight: "8px" }} /> Download Template
                          </ButtonComponent>
                        )}
                      </Space>
                    </Space>
                  </Col>
                </Row>

                {uploadedFiles.length > 0 && (
                  <Card 
                    title="Uploaded Files" 
                    size="small" 
                    style={{ marginBottom: "24px" }}
                    extra={
                      <Tag color="blue">{uploadedFiles.length} file(s) uploaded</Tag>
                    }
                  >
                    <List
                      dataSource={uploadedFiles}
                      renderItem={(item) => (
                        <List.Item
                          actions={[
                            <Button
                              key="remove"
                              type="link"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveFile(item.id)}
                            >
                              Remove
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={getFileIcon(item.type, item.name)}
                            title={
                              <Space>
                                <span style={{ fontWeight: 500 }}>{item.name}</span>
                                <Tag color={item.type === "excel" ? "green" : "blue"}>
                                  {item.type === "excel" ? "Excel" : "Form"}
                                </Tag>
                              </Space>
                            }
                            description={
                              <Space>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>
                                  {formatFileSize(item.size)}
                                </span>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>•</span>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>
                                  Uploaded: {item.uploadDate}
                                </span>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                )}

                <div style={{ marginBottom: "16px", padding: "16px", background: "#f5f5f5", borderRadius: "4px" }}>
                  <Steps
                    current={3}
                    items={[
                      { title: "Draft", icon: <FileExcelOutlined /> },
                      { title: "Submitted", icon: <ClockCircleOutlined /> },
                      { title: "Validated", icon: <CheckCircleOutlined /> },
                      { title: "Approved", icon: <CheckCircleOutlined /> },
                      { title: "Published", icon: <CheckCircleOutlined /> },
                    ]}
                  />
                </div>

                <Table
                  columns={submissionColumns}
                  dataSource={filteredSubmissions}
                  scroll={{ x: 1400 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} submissions`,
                  }}
                />
              </>
            ),
          },
          {
            key: "errors",
            label: "Error Log",
            children: (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <Input
                        placeholder="Search error log by field, issue, or row ID"
                        prefix={<SearchOutlined />}
                        size="large"
                      />
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <Space>
                        <ButtonComponent
                          htmlType="button"
                          className="btn-outline"
                          onClick={handleExportErrorLog}
                        >
                          <DownloadOutlined style={{ marginRight: "8px" }} /> Export Error Log
                        </ButtonComponent>
                      </Space>
                    </Col>
                  </Row>
                </div>

                <Table
                  columns={errorLogColumns}
                  dataSource={mockErrorLog}
                  scroll={{ x: 1200 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} errors`,
                  }}
                />
              </>
            ),
          },
        ]}
      />

      <Modal
        title={`Error Log - ${selectedRow?.pfiName}`}
        open={errorLogVisible}
        onCancel={() => setErrorLogVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          columns={errorLogColumns}
          dataSource={mockErrorLog}
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
};
