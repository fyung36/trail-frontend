# Trail V3 - DBN ESG Integrated Solution POC Documentation

This document summarizes the changes implemented to transform the Trail application into a DBN-specific ESG Integrated Solution.

## 1. Visual & UI/UX Improvements
- **Typography**: Updated global font to **Inter** for a modern and professional feel.
- **Theme System**: Implemented a smooth **Dark/Light mode** system using Ant Design's `ConfigProvider`.
- **FOUC Fix**: Added mounting logic to `ThemeProvider.tsx` to prevent style flashing on load.

---

## 2. Page-Specific Changes & Navigation Guide

### A. Dashboard (Module A - Portfolio Overview)
- **File**: `src/app/app/dashboard/page.tsx` (Component: `src/components/ESG/PortfolioOverview.tsx`)
- **Changes**: 
    - Replaced program stats with **6 Executive ESG KPIs**.
    - Displays: Portfolio Value (₦), ESG Data Completeness %, PFI Reporting Timeliness, Green Taxonomy %, Carbon Summary (tCO₂e), and Top ESG Flags (RAG).

### B. Projects Register (Module B - Portfolio Drilldown)
- **File**: `src/app/app/projects-drilldown/page.tsx` (Component: `src/components/ESG/PortfolioDrilldown.tsx`)
- **Changes**: 
    - Full register of facilities/projects with DBN-specific fields.
    - Includes: Taxonomy Status, ESG RAG status, Carbon Scope (1/2/3) presence, and Data Quality Scores.

### C. PFI Submissions (Module C - Forms Management)
- **File**: `src/app/app/form/page.tsx` (Component: `src/components/ESG/PFISubmissions.tsx`)
- **Changes**: 
    - Repurposed from "Forms Management" to handle **PFI ESG Excel Imports**.
    - Includes: Validation workflows (Draft -> Submitted -> Validated -> Approved) and an Error Log table for data quality checks.

### D. Green Taxonomy (Module D)
- **File**: `src/app/app/green-taxonomy/page.tsx` (Component: `src/components/ESG/GreenTaxonomy.tsx`)
- **Changes**: 
    - Digitized DBN Taxonomy rules table (Category, Criteria, Evidence required).
    - Project classification view showing Green / Transition / Not Green status and evidence upload placeholders.

### E. Carbon & Net Zero (Module E)
- **File**: `src/app/app/carbon-netzero/page.tsx` (Component: `src/components/ESG/CarbonNetZero.tsx`)
- **Changes**: 
    - Carbon accounting module showing Scope 1, 2, and 3 totals.
    - Progress tracking against Net Zero targets with baseline and target year comparisons.

### F. Reports & Export (Module F)
- **File**: `src/app/app/reports/page.tsx` (Component: `src/components/ESG/ReportsExport.tsx`)
- **Changes**: 
    - Added DBN-specific export buttons: **DBN ESG Portfolio Pack (PDF)**, **PFI Compliance Summary (Excel)**, and **Carbon & Net Zero Summary (PDF)**.

---

## 3. Sidebar Naming Updates
The following menus were renamed to match DBN terminology:
- **Programmes** → *Projects / Facilities*
- **Goals & Indicators** → *ESG Metrics & Standards*
- **Forms Management** → *PFI Submissions*
- **Insights** → *ESG Analytics*
