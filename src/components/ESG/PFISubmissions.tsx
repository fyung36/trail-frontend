"use client";
import React, { useState } from "react";
import { Table, Tag, Input, Button, Row, Col, Select, Space, Upload, Steps, Modal, Progress, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps, TabsProps } from "antd";
import { 
  SearchOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  FileExcelOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
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

// Mock PFI Submissions Data
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
    field: "Beneficiary Count",
    issue: "Value exceeds expected range",
    rowId: "PROJ-2024-003-004",
    severity: "Warning",
    status: "Open",
    action: "Verify data accuracy",
  },
];

export const PFISubmissions: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRow, setSelectedRow] = useState<PFISubmission | null>(null);
  const [errorLogVisible, setErrorLogVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions");

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
      sorter: (a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
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
      sorter: (a, b) => a.dataQualityScore - b.dataQualityScore,
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
      sorter: (a, b) => a.errorCount - b.errorCount,
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
      render: (_, record: PFISubmission) => (
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

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls,.csv",
    beforeUpload: (file) => {
      console.log("Uploading file:", file.name);
      // Simulate upload and validation
      setTimeout(() => {
        Modal.success({
          title: "File Uploaded Successfully",
          content: `File ${file.name} has been uploaded. Validation in progress...`,
        });
      }, 1000);
      return false; // Prevent auto upload for PoC
    },
  };

  const filteredSubmissions = mockPFISubmissions.filter((item) => {
    const matchesSearch = 
      item.pfiName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectId.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="col-12">
      <div style={{ marginBottom: "24px" }}>
        <h1 className="view-title">PFI Submissions</h1>
        <p style={{ color: "#666", marginTop: "8px" }}>
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
                    <Space>
                      <Upload {...uploadProps}>
                        <ButtonComponent
                          htmlType="button"
                          className="updateButton"
                        >
                          <UploadOutlined style={{ marginRight: "8px" }} /> Import Excel
                        </ButtonComponent>
                      </Upload>
                      <ButtonComponent
                        htmlType="button"
                        className="btn-outline"
                      >
                        <DownloadOutlined style={{ marginRight: "8px" }} /> Download Template
                      </ButtonComponent>
                    </Space>
                  </Col>
                </Row>

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
