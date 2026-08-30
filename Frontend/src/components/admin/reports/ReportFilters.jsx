import {
  FaFileAlt,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";

import "./ReportFilters.css";

function ReportFilters({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  status,
  setStatus,
  onGenerate,
}) {
  return (
    <div className="report-filters">

      <div className="report-filter-header">

        <div className="report-filter-title">
          <FaFilter />

          <div>
            <h3>Report Filters</h3>

            <p>
              Select the criteria for generating your report.
            </p>
          </div>
        </div>

      </div>


      <div className="report-filter-grid">

        {/* Report Type */}

        <div className="report-filter-group">

          <label>
            <FaFileAlt />
            Report Type
          </label>

          <select
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value)
            }
          >
            <option value="transactions">
              Transaction Report
            </option>

            <option value="customers">
              Customer Report
            </option>

            <option value="employees">
              Employee Report
            </option>

            <option value="loans">
              Loan Report
            </option>

            <option value="npa">
              NPA Report
            </option>
          </select>

        </div>


        {/* Date Range */}

        <div className="report-filter-group">

          <label>
            <FaCalendarAlt />
            Date Range
          </label>

          <select
            value={dateRange}
            onChange={(e) =>
              setDateRange(e.target.value)
            }
          >
            <option value="today">
              Today
            </option>

            <option value="week">
              This Week
            </option>

            <option value="month">
              This Month
            </option>

            <option value="quarter">
              This Quarter
            </option>

            <option value="year">
              This Year
            </option>
          </select>

        </div>


        {/* Status */}

        <div className="report-filter-group">

          <label>
            <FaFilter />
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="success">
              Successful
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="failed">
              Failed
            </option>
          </select>

        </div>


        {/* Generate */}

        <div className="report-filter-action">

          <button onClick={onGenerate}>
            Generate Report
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReportFilters;