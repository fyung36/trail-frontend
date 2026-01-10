# DBN ESG Integrated Solution Dashboard

A comprehensive ESG (Environmental, Social, and Governance) management dashboard for Development Bank of Nigeria (DBN). This Next.js application provides end-to-end ESG data management, tracking, and reporting capabilities.

## 🚀 Features

### Module A - Portfolio Overview (Executive Snapshot)

- Real-time portfolio ESG metrics and KPIs
- Portfolio value and project count tracking
- ESG data completeness monitoring
- PFI reporting timeliness indicators
- Green Taxonomy classification overview
- Carbon summary and emissions tracking
- ESG flags with RAG (Red/Amber/Green) status

### Module B - Portfolio Drilldown (Projects/Facilities Register)

- Comprehensive project and facility database
- Advanced search and filtering capabilities
- Taxonomy status tracking
- ESG compliance status monitoring
- Export functionality for reporting

### Module C - PFI Submissions (Excel Import + Validation + Approval)

- Excel template import for PFI ESG data
- Automated validation and error logging
- Data quality scoring per PFI
- Approval workflow (Draft → Submitted → Validated → Approved → Published)
- Error log with field-level issue tracking

### Module D - Green Taxonomy Classification

- DBN Green Taxonomy rules and criteria
- Project classification (Green / Transition / Not Green)
- Evidence status tracking and management
- Classification history and audit trail

### Module E - Carbon & Net Zero

- Portfolio and project-level carbon accounting
- Scope 1, 2, and 3 emissions tracking
- Emission calculation logic (Activity Data × Emission Factor)
- Net Zero target tracking with progress indicators
- Baseline and target year management

### Module F - Reports / Export

- Export DBN ESG Portfolio Pack (PDF)
- Export PFI Compliance Summary (Excel)
- Export Carbon & Net Zero Summary (PDF)

## 🛠️ Technology Stack


- **Framework**: Next.js 14.0.4 (App Router)
- **Language**: TypeScript 5.9.3
- **UI Library**: Ant Design 5.29.3
- **Styling**: SCSS/SASS
- **State Management**: React Hooks (useState, useContext)
- **Charts**: React Google Charts
- **Form Handling**: Ant Design Forms

## 📋 Prerequisites


- Node.js 18+
- npm or yarn

## 🔧 Installation


1. Clone the repository:
```bash
git clone https://github.com/fyung36/trail-frontend.git
cd trail-frontend
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

## 🚀 Development


Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000) (or configured host/port).

## 🏗️ Build


Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Production server runs on port 5000 by default.

## 📁 Project Structure


```
trail-frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ESG/            # ESG-specific components
│   │   ├── Forms/          # Form components
│   │   └── ...
│   ├── pages/              # Page components
│   ├── styles/             # Global styles (SCSS)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions and hooks
├── public/                 # Static assets
└── next.config.js          # Next.js configuration
```

## ⚙️ Configuration


### Next.js Configuration
The project uses `next.config.js` with transpilation settings for Ant Design and rc-* packages to ensure proper ESM module resolution:

```javascript
transpilePackages: [
  'antd',
  'rc-util',
  'rc-table',
  'rc-tree',
  // ... other rc-* packages
]
```

## 🔐 Authentication


For PoC (Proof of Concept) purposes, the login system accepts any credentials and redirects to the dashboard. In production, implement proper authentication with your backend API.

## 📊 Data

The application uses mock data for demonstration purposes. Replace mock data sources with API calls to your backend services for production use.

## 🐛 Troubleshooting


### Build Errors
If you encounter module resolution errors:
1. Clear `.next` build cache: `Remove-Item -Recurse -Force .next`
2. Clear `node_modules` and reinstall: `npm install --legacy-peer-deps`

### Port Configuration

Default development port is 5000. Modify `package.json` scripts to change the port:

```json
"dev": "next dev -H 0.0.0.0 -p 5000"
```

## 📝 Notes


- This is a Proof of Concept (PoC) application
- Mock data is used throughout for demonstration
- Production deployment requires backend API integration
- Authentication is simplified for PoC purposes

## 🤝 Contributing

This project is maintained by DBN. For issues or feature requests, please contact the development team.

## 📄 License

Proprietary - Development Bank of Nigeria
