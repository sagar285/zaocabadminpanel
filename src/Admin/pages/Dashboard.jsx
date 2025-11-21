import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import Sidebar from "../Component/Sidebar";
import {
  useGetDashboardQuery,
  useGetVerifiedDriversQuery,
  useGetVerifiedTravelsQuery,
  useGetAllAlertsQuery,
} from "../Redux/Api";
import { useNavigate } from "react-router-dom";

// Top Summary Card Component
const TopSummaryCard = ({ title, value, bgColor = "bg-white" }) => (
  <div
    className={`${bgColor} shadow-lg rounded-lg p-6 text-center border border-gray-200`}
  >
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const StatCard = ({
  title,
  total,
  today,
  lastWeek,
  lastMonth,
  weeklyGrowth,
  monthlyGrowth,
  isCarpool,
  navigateUrl,
  onClick
}) => {
  const navigate = useNavigate();
  const getGrowthColor = (growth) =>
    growth > 0 ? "text-green-500" : "text-red-500";
  const goToTrips = () => {
    // navigate(`/trips/AlertTrip`);
    navigate(`${navigateUrl}`);
    return;
    const words = title
      .toLowerCase()
      .split(" ")
      .filter((word) => word);
    if (words.length === 2 && words.includes("trips")) {
      const otherWord = words.find((word) => word !== "trips");
      navigate(`/trips/${otherWord}`);
    }
  };

  const cardBackground = isCarpool ? "bg-green-300" : "bg-white";

  return (
    <div
      className={`${cardBackground} shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
      onClick={goToTrips}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm md:text-base">
        <div>
          <p className="text-gray-600">Total</p>
          <p className="text-xl font-bold">{total}</p>
        </div>
        <div>
          <p className="text-gray-600">Today</p>
          <p>{today}</p>
        </div>
        <div>
          <p className="text-gray-600">Last Week</p>
          <p>{lastWeek}</p>
        </div>
        <div>
          <p className="text-gray-600">Last Month</p>
          <p>{lastMonth}</p>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs md:text-sm">
        <p className={`${getGrowthColor(weeklyGrowth)}`}>
          Weekly Growth: {weeklyGrowth}%
        </p>
        <p className={`${getGrowthColor(monthlyGrowth)}`}>
          Monthly Growth: {monthlyGrowth}%
        </p>
      </div>
    </div>
  );
};

// Enhanced Individual Filter Component with Multiple Year/Month Selection
const IndividualFilterButtons = ({
  activeFilter,
  onFilterChange,
  chartType,
  selectedYearsMonths,
}) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [currentStep, setCurrentStep] = useState("year");
  const [selectedYears, setSelectedYears] = useState(
    selectedYearsMonths?.years || []
  );
  const [selectedMonths, setSelectedMonths] = useState(
    selectedYearsMonths?.months || []
  );
  const [tempSelectedYears, setTempSelectedYears] = useState([]);
  const [tempSelectedMonths, setTempSelectedMonths] = useState([]);
  const text = "print";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = ["2021", "2022", "2023", "2024", "2025", "2026"];

  const handleMonthYearClick = () => {
    setShowMonthPicker(!showMonthPicker);
    setCurrentStep("year");
    setTempSelectedYears([...selectedYears]);
    setTempSelectedMonths([...selectedMonths]);
  };

  const handleYearToggle = (year) => {
    setTempSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      } else {
        return [...prev, year];
      }
    });
  };

  const handleMonthToggle = (month) => {
    setTempSelectedMonths((prev) => {
      if (prev.includes(month)) {
        return prev.filter((m) => m !== month);
      } else {
        return [...prev, month];
      }
    });
  };

  const proceedToMonths = () => {
    if (tempSelectedYears.length > 0) {
      setCurrentStep("month");
    } else {
      alert("Please select at least one year");
    }
  };

  const goBackToYears = () => {
    setCurrentStep("year");
  };

  const applySelection = () => {
    if (tempSelectedYears.length === 0) {
      alert("Please select at least one year");
      return;
    }

    setSelectedYears([...tempSelectedYears]);
    setSelectedMonths([...tempSelectedMonths]);

    const selection = {
      years: tempSelectedYears,
      months: tempSelectedMonths.length > 0 ? tempSelectedMonths : months,
    };

    onFilterChange("month", selection);
    setShowMonthPicker(false);
  };

  const resetSelection = () => {
    setTempSelectedYears([]);
    setTempSelectedMonths([]);
  };

  const selectAllYears = () => {
    setTempSelectedYears([...years]);
  };

  const selectAllMonths = () => {
    setTempSelectedMonths([...months]);
  };

  const getSelectionSummary = () => {
    if (selectedYears.length === 0) return "None selected";

    const yearText =
      selectedYears.length === 1
        ? selectedYears[0]
        : selectedYears.length === years.length
        ? "All years"
        : `${selectedYears.length} years`;

    const monthText =
      selectedMonths.length === 0
        ? "All months"
        : selectedMonths.length === 1
        ? selectedMonths[0]
        : selectedMonths.length === months.length
        ? "All months"
        : `${selectedMonths.length} months`;

    return `${yearText}, ${monthText}`;
  };

  return (
    <div className="relative print:hidden">
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => onFilterChange("today")}
          className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
            activeFilter === "today"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
          }`}
        >
          {activeFilter === "today" ? "✓" : "☐"} Today
        </button>

        <button
          onClick={() => onFilterChange("tomorrow")}
          className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
            activeFilter === "tomorrow"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
          }`}
        >
          {activeFilter === "tomorrow" ? "✓" : "☐"} Tomorrow
        </button>

        <button
          onClick={() => onFilterChange("lastweek")}
          className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
            activeFilter === "lastweek"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
          }`}
        >
          {activeFilter === "lastweek" ? "✓" : "☐"} Last week
        </button>

        <button
          onClick={handleMonthYearClick}
          className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
            activeFilter === "month"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
          }`}
        >
          {activeFilter === "month" ? "✓" : "☐"} Month & year
        </button>
      </div>

      {/* Show current selection summary */}
      {activeFilter === "month" && selectedYears.length > 0 && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <span className="font-medium text-blue-800">Selected: </span>
          <span className="text-blue-600">{getSelectionSummary()}</span>
        </div>
      )}

      {/* Enhanced Month/Year Picker Dropdown */}
      {showMonthPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-2xl z-50 min-w-80 max-w-96">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {currentStep === "year" ? "Select Years" : "Select Months"}
              </h3>
              <button
                onClick={() => setShowMonthPicker(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center mt-2 space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep === "year"
                    ? "bg-white text-blue-600"
                    : "bg-blue-400 text-white"
                }`}
              >
                1
              </div>
              <div
                className={`h-1 flex-1 rounded transition-all ${
                  currentStep === "month" ? "bg-white" : "bg-blue-400"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep === "month"
                    ? "bg-white text-blue-600"
                    : "bg-blue-400 text-white"
                }`}
              >
                2
              </div>
            </div>

            <div className="mt-2 text-sm opacity-90">
              {currentStep === "year"
                ? "Choose one or multiple years"
                : "Choose specific months (optional)"}
            </div>
          </div>

          <div className="p-4">
            {currentStep === "year" ? (
              /* Year Selection */
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Selected: {tempSelectedYears.length} of {years.length} years
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={selectAllYears}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={resetSelection}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearToggle(year)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        tempSelectedYears.includes(year)
                          ? "bg-blue-500 text-white border-blue-500 shadow-md transform scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {tempSelectedYears.includes(year) && (
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {year}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowMonthPicker(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={proceedToMonths}
                    disabled={tempSelectedYears.length === 0}
                    className={`px-6 py-2 rounded font-medium transition-all ${
                      tempSelectedYears.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                    }`}
                  >
                    Next: Select Months
                  </button>
                </div>
              </div>
            ) : (
              /* Month Selection */
              <div>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Selected Years:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tempSelectedYears.map((year) => (
                      <span
                        key={year}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Selected: {tempSelectedMonths.length} of {months.length}{" "}
                    months
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={selectAllMonths}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setTempSelectedMonths([])}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-3 bg-yellow-50 p-2 rounded border border-yellow-200">
                  💡 If no months are selected, all months will be included in
                  the filter
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 max-h-48 overflow-y-auto">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => handleMonthToggle(month)}
                      className={`p-2 rounded border-2 transition-all duration-200 text-sm font-medium ${
                        tempSelectedMonths.includes(month)
                          ? "bg-blue-500 text-white border-blue-500 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {tempSelectedMonths.includes(month) && (
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span className="truncate">{month.slice(0, 3)}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={goBackToYears}
                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    ← Back to Years
                  </button>
                  <button
                    onClick={applySelection}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium shadow-md"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Print Report Button for Individual Charts
const IndividualPrintReportButton = ({
  chartType,
  chartData,
  title,
  activeFilter,
  selection,
}) => {
  const handlePrintReport = () => {
    const chartContainer = document.querySelector(
      `[data-chart-type="${chartType}"] .recharts-wrapper`
    );
    let chartImageHTML = "";

    if (chartContainer) {
      const svgElement = chartContainer.querySelector("svg");
      if (svgElement) {
        const clonedSvg = svgElement.cloneNode(true);
        clonedSvg.setAttribute("width", "600");
        clonedSvg.setAttribute("height", "400");
        const svgString = new XMLSerializer().serializeToString(clonedSvg);
        const encodedSvg = encodeURIComponent(svgString);

        chartImageHTML = `
          <div style="text-align: center; margin: 30px 0; page-break-inside: avoid;">
            <h3 style="margin-bottom: 15px; color: #374151;">${title} Chart</h3>
            <img src="data:image/svg+xml,${encodedSvg}" 
                 style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                 alt="${title} Chart" />
          </div>
        `;
      }
    }

    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleDateString();

    const getFilterDescription = () => {
      if (activeFilter === "month" && selection) {
        const yearText =
          selection.years.length === 1
            ? selection.years[0]
            : `${selection.years.length} years (${selection.years.join(", ")})`;
        const monthText =
          selection.months.length === 12
            ? "All months"
            : `${selection.months.length} months (${selection.months.join(
                ", "
              )})`;
        return `${yearText}, ${monthText}`;
      }
      return activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
    };

    // Create table HTML based on chart type
    let tableHTML = "";

    if (chartType === "trip-commission" || chartType === "user-commission") {
      tableHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Category</th>
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Percentage (%)</th>
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${chartData
              .map(
                (item) => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 12px;">${item.name}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">${item.value}%</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">
                  <div style="width: 20px; height: 20px; background-color: ${item.fill}; margin: 0 auto; border-radius: 3px;"></div>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    } else if (chartType === "sales") {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      tableHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Sales Category</th>
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Amount (₹)</th>
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            ${chartData
              .map(
                (item) => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 12px;">${
                  item.name
                }</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">₹${item.value.toLocaleString()}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">${(
                  (item.value / total) *
                  100
                ).toFixed(1)}%</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background-color: #f9fafb; font-weight: bold;">
              <td style="border: 1px solid #d1d5db; padding: 12px;">Total</td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">₹${total.toLocaleString()}</td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">100%</td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (chartType === "trip-growth" || chartType === "all-users") {
      const dataKeys = Object.keys(chartData[0]).filter(
        (key) => key !== "month"
      );
      tableHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Month</th>
              ${dataKeys
                .map(
                  (key) =>
                    `<th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">${key}</th>`
                )
                .join("")}
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${chartData
              .map((item) => {
                const total = dataKeys.reduce(
                  (sum, key) => sum + (item[key] || 0),
                  0
                );
                return `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 12px; font-weight: bold;">${
                    item.month
                  }</td>
                  ${dataKeys
                    .map(
                      (key) =>
                        `<td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">${
                          item[key] || 0
                        }</td>`
                    )
                    .join("")}
                  <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: bold; background-color: #f9fafb;">${total}</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      `;
    }

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} Report - ${getFilterDescription()}</title>
          <style>
            @media print {
              @page { margin: 0.5in; size: A4; }
              body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4285F4; padding-bottom: 20px; }
              h1 { color: #1f2937; font-size: 28px; margin-bottom: 10px; }
              h2 { color: #374151; font-size: 20px; margin-bottom: 15px; }
              h3 { color: #4b5563; font-size: 16px; margin-bottom: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title} Report</h1>
            <p style="font-size: 18px; color: #6b7280;">Filter: ${getFilterDescription()}</p>
            <p style="font-size: 14px; color: #9ca3af;">Generated on: ${currentDate}</p>
          </div>
          <div style="margin-bottom: 30px;">
            ${chartImageHTML}
            <h3>Data Table</h3>
            ${tableHTML}
          </div>
          <div style="margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p>This report was generated from the Dashboard Analytics System</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  return (
    <button
      onClick={handlePrintReport}
      className={` text-white  rounded text-xs   transition-colors flex items-center gap-1 print:hidden`}
    >
      <div className="flex items-center   space-x-2">
        <div className="relative   flex items-center space-x-2">
          {/* Percentage Box */}
          <div className="w-5 h-5 border  rounded text-black bg-green-500 flex items-center justify-center">
            <p className="text-xs">%</p>
          </div>

          {/* SVG Icon with Tooltip */}
          <div className="bg-green-500 w-5 h-5  rounded flex items-center justify-center relative group cursor-pointer">
            <svg
              className="w-3 h-3 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>

            {/* Tooltip */}
            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              Print
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Enhanced state for each chart with detailed selection data
  const [tripCommissionFilter, setTripCommissionFilter] = useState("today");
  const [tripCommissionSelection, setTripCommissionSelection] = useState(null);

  const [salesFilter, setSalesFilter] = useState("today");
  const [salesSelection, setSalesSelection] = useState(null);

  const [userCommissionFilter, setUserCommissionFilter] = useState("today");
  const [userCommissionSelection, setUserCommissionSelection] = useState(null);

  const [tripGrowthFilter, setTripGrowthFilter] = useState("today");
  const [tripGrowthSelection, setTripGrowthSelection] = useState(null);

  const [allUsersFilter, setAllUsersFilter] = useState("today");
  const [allUsersSelection, setAllUsersSelection] = useState(null);

  const { data } = useGetDashboardQuery();
  const { data: verifiedDriver } = useGetVerifiedDriversQuery();
  const { data: verifiedTravels } = useGetVerifiedTravelsQuery();
  const { data: AlertsData } = useGetAllAlertsQuery();

  // Top Summary Cards Data
  const topSummaryData = [
    { title: "All Passengers", value: "5437", bgColor: "bg-blue-50" },
    { title: "All Drivers", value: "5437", bgColor: "bg-green-50" },
    { title: "All Travels", value: "5437", bgColor: "bg-purple-50" },
    { title: "Total Trip", value: "5437", bgColor: "bg-yellow-50" },
    { title: "Total Vehicles", value: "5437", bgColor: "bg-red-50" },
    { title: "Total Trip Kms", value: "5437", bgColor: "bg-indigo-50" },
  ];



  // Define all stat cards with their properties
  const statCards = [
    { title: "Passengers", dataSource: data?.data?.users, isCarpool: false,navigateUrl :"/passenger-travels" },
    {
      title: "Travels",
      dataSource: data?.data?.travelOwners,
      isCarpool: false,
      navigateUrl:"/travels"
    },
    { title: "Driver", dataSource: data?.data?.drivers, isCarpool: false ,navigateUrl:"/drivers"},
    { title: "Trip Alert", dataSource: AlertsData?.Trips?.length, isCarpool: false ,navigateUrl:"/trips/AlertTrip",total:AlertsData?.Trips?.length},

    {
      title: "Pickup Today",
      dataSource: data?.data?.drivers,
      isCarpool: false,
      
    },
    {
      title: "Verified Drivers",
      dataSource: data?.data?.drivers?.verified,
      isCarpool: false,
    },
    {
      title: "Verified Travels",
      dataSource: data?.data?.travelOwners?.verified,
      isCarpool: false,
    },
    // { title: "Trip Alert", dataSource: AlertsData?.Trips[0], isCarpool: false },
    {
      title: "Create Trips",
      dataSource: data?.data?.tripsByStatus?.completed,
      isCarpool: false,
    },
    {
      title: "Pending",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Accept",
      dataSource: data?.data?.tripsByStatus?.started,
      isCarpool: false,
    },
    {
      title: "Go to Pickup",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Start",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Drop Off",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Completed",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Cancel Trip",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Carpool Create Trip",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Pending",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Accept",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Pick Up Passengers",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Drop Off",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Pickup Today",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Cancel trip",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Expire",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: true,
    },
    {
      title: "Expire",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Total Earnings",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Total Admin Commission",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
    },
    {
      title: "Carpool Trip Alert",
      dataSource: data?.data?.tripsByStatus?.pending,
      isCarpool: false,
     
    },
  ];

  // Data sets for different time periods
  const dataByTimeFilter = {
    today: {
      userCommissionData: [
        { name: "Passengers", value: 59, fill: "#4285F4" },
        {
          name: "Travels",
          value: 18,
          fill: "#03A9F4",
          breakdown: [
            { name: "One-way", value: 10, fill: "#8BC34A" },
            { name: "Round Trip", value: 8, fill: "#673AB7" },
          ],
        },
        { name: "Driver", value: 23, fill: "#DB4437" },
      ],
      tripCommissionData: [
        { name: "Carpool", value: 59, fill: "#4285F4" },
        { name: "Local Rental", value: 23, fill: "#DB4437" },
        { name: "City Ride", value: 24, fill: "#f97347" },
        { name: "One-way", value: 18, fill: "#8BC34A" },
        { name: "Round Trip", value: 8, fill: "#673AB7" },
      ],
      salesData: [
        { name: "Total Revenue", value: 5876, fill: "#4285F4" },
        { name: "Commission", value: 1435, fill: "#DB4437" },
        { name: "GST", value: 567, fill: "#8BC34A" },
        { name: "Partner Incentive", value: 1160, fill: "#673AB7" },
      ],
      tripGrowthData: [
        {
          month: "Jan",
          "Local Rental": 532,
          "One-way": 224,
          Carpool: 112,
          "City Ride": 114,
          "Round Trip": 92,
        },
        {
          month: "Feb",
          "Local Rental": 332,
          "One-way": 24,
          Carpool: 62,
          "City Ride": 34,
          "Round Trip": 12,
        },
        {
          month: "Mar",
          "Local Rental": 432,
          "One-way": 24,
          Carpool: 42,
          "City Ride": 54,
          "Round Trip": 52,
        },
        {
          month: "Apr",
          "Local Rental": 45,
          "One-way": 245,
          Carpool: 15,
          "City Ride": 9,
          "Round Trip": 4,
        },
      ],
      allUsersData: [
        { month: "Jan", Passengers: 432, Travels: 24, Drivers: 2 },
        { month: "Feb", Passengers: 25, Travels: 44, Drivers: 2 },
        { month: "Mar", Passengers: 35, Travels: 18, Drivers: 3 },
        { month: "Apr", Passengers: 245, Travels: 45, Drivers: 5 },
      ],
    },
    tomorrow: {
      userCommissionData: [
        { name: "Passengers", value: 45, fill: "#4285F4" },
        {
          name: "Travels",
          value: 25,
          fill: "#03A9F4",
          breakdown: [
            { name: "One-way", value: 15, fill: "#8BC34A" },
            { name: "Round Trip", value: 10, fill: "#673AB7" },
          ],
        },
        { name: "Driver", value: 30, fill: "#DB4437" },
      ],
      tripCommissionData: [
        { name: "Carpool", value: 45, fill: "#4285F4" },
        { name: "Local Rental", value: 30, fill: "#DB4437" },
        { name: "City Ride", value: 20, fill: "#f97347" },
        { name: "One-way", value: 25, fill: "#8BC34A" },
        { name: "Round Trip", value: 15, fill: "#673AB7" },
      ],
      salesData: [
        { name: "Total Revenue", value: 4200, fill: "#4285F4" },
        { name: "Commission", value: 1050, fill: "#DB4437" },
        { name: "GST", value: 420, fill: "#8BC34A" },
        { name: "Partner Incentive", value: 840, fill: "#673AB7" },
      ],
      tripGrowthData: [
        {
          month: "Jan",
          "Local Rental": 400,
          "One-way": 180,
          Carpool: 90,
          "City Ride": 95,
          "Round Trip": 75,
        },
        {
          month: "Feb",
          "Local Rental": 280,
          "One-way": 20,
          Carpool: 50,
          "City Ride": 28,
          "Round Trip": 10,
        },
        {
          month: "Mar",
          "Local Rental": 350,
          "One-way": 20,
          Carpool: 35,
          "City Ride": 45,
          "Round Trip": 40,
        },
        {
          month: "Apr",
          "Local Rental": 35,
          "One-way": 200,
          Carpool: 12,
          "City Ride": 7,
          "Round Trip": 3,
        },
      ],
      allUsersData: [
        { month: "Jan", Passengers: 350, Travels: 20, Drivers: 1 },
        { month: "Feb", Passengers: 20, Travels: 35, Drivers: 1 },
        { month: "Mar", Passengers: 28, Travels: 15, Drivers: 2 },
        { month: "Apr", Passengers: 200, Travels: 35, Drivers: 4 },
      ],
    },
    lastweek: {
      userCommissionData: [
        { name: "Passengers", value: 65, fill: "#4285F4" },
        {
          name: "Travels",
          value: 15,
          fill: "#03A9F4",
          breakdown: [
            { name: "One-way", value: 8, fill: "#8BC34A" },
            { name: "Round Trip", value: 7, fill: "#673AB7" },
          ],
        },
        { name: "Driver", value: 20, fill: "#DB4437" },
      ],
      tripCommissionData: [
        { name: "Carpool", value: 65, fill: "#4285F4" },
        { name: "Local Rental", value: 20, fill: "#DB4437" },
        { name: "City Ride", value: 18, fill: "#f97347" },
        { name: "One-way", value: 15, fill: "#8BC34A" },
        { name: "Round Trip", value: 10, fill: "#673AB7" },
      ],
      salesData: [
        { name: "Total Revenue", value: 8200, fill: "#4285F4" },
        { name: "Commission", value: 2050, fill: "#DB4437" },
        { name: "GST", value: 820, fill: "#8BC34A" },
        { name: "Partner Incentive", value: 1640, fill: "#673AB7" },
      ],
      tripGrowthData: [
        {
          month: "Jan",
          "Local Rental": 650,
          "One-way": 280,
          Carpool: 140,
          "City Ride": 145,
          "Round Trip": 115,
        },
        {
          month: "Feb",
          "Local Rental": 420,
          "One-way": 30,
          Carpool: 78,
          "City Ride": 42,
          "Round Trip": 15,
        },
        {
          month: "Mar",
          "Local Rental": 520,
          "One-way": 30,
          Carpool: 52,
          "City Ride": 68,
          "Round Trip": 65,
        },
        {
          month: "Apr",
          "Local Rental": 55,
          "One-way": 290,
          Carpool: 18,
          "City Ride": 11,
          "Round Trip": 5,
        },
      ],
      allUsersData: [
        { month: "Jan", Passengers: 520, Travels: 30, Drivers: 3 },
        { month: "Feb", Passengers: 30, Travels: 55, Drivers: 3 },
        { month: "Mar", Passengers: 42, Travels: 22, Drivers: 4 },
        { month: "Apr", Passengers: 290, Travels: 55, Drivers: 6 },
      ],
    },
    month: {
      userCommissionData: [
        { name: "Passengers", value: 55, fill: "#4285F4" },
        {
          name: "Travels",
          value: 20,
          fill: "#03A9F4",
          breakdown: [
            { name: "One-way", value: 12, fill: "#8BC34A" },
            { name: "Round Trip", value: 8, fill: "#673AB7" },
          ],
        },
        { name: "Driver", value: 25, fill: "#DB4437" },
      ],
      tripCommissionData: [
        { name: "Carpool", value: 55, fill: "#4285F4" },
        { name: "Local Rental", value: 25, fill: "#DB4437" },
        { name: "City Ride", value: 22, fill: "#f97347" },
        { name: "One-way", value: 20, fill: "#8BC34A" },
        { name: "Round Trip", value: 12, fill: "#673AB7" },
      ],
      salesData: [
        { name: "Total Revenue", value: 15600, fill: "#4285F4" },
        { name: "Commission", value: 3900, fill: "#DB4437" },
        { name: "GST", value: 1560, fill: "#8BC34A" },
        { name: "Partner Incentive", value: 3120, fill: "#673AB7" },
      ],
      tripGrowthData: [
        {
          month: "Jan",
          "Local Rental": 800,
          "One-way": 350,
          Carpool: 175,
          "City Ride": 180,
          "Round Trip": 145,
        },
        {
          month: "Feb",
          "Local Rental": 500,
          "One-way": 35,
          Carpool: 95,
          "City Ride": 52,
          "Round Trip": 18,
        },
        {
          month: "Mar",
          "Local Rental": 650,
          "One-way": 35,
          Carpool: 65,
          "City Ride": 85,
          "Round Trip": 80,
        },
        {
          month: "Apr",
          "Local Rental": 65,
          "One-way": 350,
          Carpool: 22,
          "City Ride": 14,
          "Round Trip": 6,
        },
      ],
      allUsersData: [
        { month: "Jan", Passengers: 650, Travels: 35, Drivers: 4 },
        { month: "Feb", Passengers: 35, Travels: 65, Drivers: 4 },
        { month: "Mar", Passengers: 52, Travels: 28, Drivers: 5 },
        { month: "Apr", Passengers: 350, Travels: 65, Drivers: 7 },
      ],
    },
  };

  // Enhanced filter change handlers
  const handleTripCommissionFilterChange = (filterType, selectionData) => {
    setTripCommissionFilter(filterType);
    if (filterType === "month") {
      setTripCommissionSelection(selectionData);
      console.log(
        "Trip Commission Filter - Years:",
        selectionData.years,
        "Months:",
        selectionData.months
      );
    }
  };

  const handleSalesFilterChange = (filterType, selectionData) => {
    setSalesFilter(filterType);
    if (filterType === "month") {
      setSalesSelection(selectionData);
      console.log(
        "Sales Filter - Years:",
        selectionData.years,
        "Months:",
        selectionData.months
      );
    }
  };

  const handleUserCommissionFilterChange = (filterType, selectionData) => {
    setUserCommissionFilter(filterType);
    if (filterType === "month") {
      setUserCommissionSelection(selectionData);
      console.log(
        "User Commission Filter - Years:",
        selectionData.years,
        "Months:",
        selectionData.months
      );
    }
  };

  const handleTripGrowthFilterChange = (filterType, selectionData) => {
    setTripGrowthFilter(filterType);
    if (filterType === "month") {
      setTripGrowthSelection(selectionData);
      console.log(
        "Trip Growth Filter - Years:",
        selectionData.years,
        "Months:",
        selectionData.months
      );
    }
  };

  const handleAllUsersFilterChange = (filterType, selectionData) => {
    setAllUsersFilter(filterType);
    if (filterType === "month") {
      setAllUsersSelection(selectionData);
      console.log(
        "All Users Filter - Years:",
        selectionData.years,
        "Months:",
        selectionData.months
      );
    }
  };

  // Enhanced data retrieval based on selection
  const getTripCommissionDataByFilter = () => {
    if (tripCommissionFilter === "month" && tripCommissionSelection) {
      console.log(
        "Filtering trip commission data for:",
        tripCommissionSelection
      );
    }
    return (
      dataByTimeFilter[tripCommissionFilter]?.tripCommissionData ||
      dataByTimeFilter.today.tripCommissionData
    );
  };

  const getSalesDataByFilter = () => {
    if (salesFilter === "month" && salesSelection) {
      console.log("Filtering sales data for:", salesSelection);
    }
    return (
      dataByTimeFilter[salesFilter]?.salesData ||
      dataByTimeFilter.today.salesData
    );
  };

  const getUserCommissionDataByFilter = () => {
    if (userCommissionFilter === "month" && userCommissionSelection) {
      console.log(
        "Filtering user commission data for:",
        userCommissionSelection
      );
    }
    return (
      dataByTimeFilter[userCommissionFilter]?.userCommissionData ||
      dataByTimeFilter.today.userCommissionData
    );
  };

  const getTripGrowthDataByFilter = () => {
    if (tripGrowthFilter === "month" && tripGrowthSelection) {
      console.log("Filtering trip growth data for:", tripGrowthSelection);
    }
    return (
      dataByTimeFilter[tripGrowthFilter]?.tripGrowthData ||
      dataByTimeFilter.today.tripGrowthData
    );
  };

  const getAllUsersDataByFilter = () => {
    if (allUsersFilter === "month" && allUsersSelection) {
      console.log("Filtering all users data for:", allUsersSelection);
    }
    return (
      dataByTimeFilter[allUsersFilter]?.allUsersData ||
      dataByTimeFilter.today.allUsersData
    );
  };

  // Interactive tooltip handlers for Admin User Commission
  const handleMouseEnter = (data, event) => {
    if (data.name === "Travels") {
      setHoveredSegment(data);
      const rect = event.currentTarget.getBoundingClientRect();
      const containerRect = event.currentTarget
        .closest(".h-64")
        .getBoundingClientRect();
      setMousePosition({
        x: containerRect.left + containerRect.width + 15,
        y: containerRect.top + containerRect.height / 2,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  const handleTooltipMouseEnter = () => {
    setHoveredSegment(hoveredSegment);
  };

  const handleTooltipMouseLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main
        className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Dashboard Overview
        </h1>

        {/* Top Summary Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {topSummaryData.map((card, index) => (
            <TopSummaryCard
              key={index}
              title={card.title}
              value={card.value}
              bgColor={card.bgColor}
            />
          ))}
        </div>

        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, index) => (
            <StatCard
              key={`${card.title}-${index}`}
              title={card.title}
              isCarpool={card.isCarpool}
              navigateUrl={card.navigateUrl}
              {...card.dataSource}
            />
          ))}
{/* 
          <StatCard
            title={"Trip Alert"}
            isCarpool={false}
            total={AlertsData?.Trips?.length}
            onClick={()=>navigate(`/trips/AlertTrip`)}
            navigateUrl={"/trips/AlertTrip"}
          /> */}
        </div>

        {/* Analytics Dashboard - Pie Charts Section */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Analytics Dashboard
        </h2>
        <div className="flex flex-wrap mb-6">
          {/* Admin Trip Commission */}
          <div className="w-full md:w-1/3 pr-2 mb-4">
            <div
              className="bg-white rounded shadow p-4 h-full"
              data-chart-type="trip-commission"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Admin trip commission</h2>
                <IndividualPrintReportButton
                  chartType="trip-commission"
                  chartData={getTripCommissionDataByFilter()}
                  title="Admin Trip Commission"
                  activeFilter={tripCommissionFilter}
                  selection={tripCommissionSelection}
                />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTripCommissionDataByFilter()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {getTripCommissionDataByFilter().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <IndividualFilterButtons
                activeFilter={tripCommissionFilter}
                onFilterChange={handleTripCommissionFilterChange}
                chartType="trip-commission"
                selectedYearsMonths={tripCommissionSelection}
              />
            </div>
          </div>

          {/* Sales */}
          <div className="w-full md:w-1/3 px-2 mb-4">
            <div
              className="bg-white rounded shadow p-4 h-full"
              data-chart-type="sales"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Sales</h2>
                <IndividualPrintReportButton
                  chartType="sales"
                  chartData={getSalesDataByFilter()}
                  title="Sales Report"
                  activeFilter={salesFilter}
                  selection={salesSelection}
                />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSalesDataByFilter()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}, ${value}`}
                    >
                      {getSalesDataByFilter().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <IndividualFilterButtons
                activeFilter={salesFilter}
                onFilterChange={handleSalesFilterChange}
                chartType="sales"
                selectedYearsMonths={salesSelection}
              />
            </div>
          </div>

          {/* Admin User Commission with Interactive Tooltip */}
          <div className="w-full md:w-1/3 pl-2 mb-4">
            <div
              className="bg-white rounded shadow p-4 h-full relative"
              data-chart-type="user-commission"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Admin user commission</h2>
                <IndividualPrintReportButton
                  chartType="user-commission"
                  chartData={getUserCommissionDataByFilter()}
                  title="Admin User Commission"
                  activeFilter={userCommissionFilter}
                  selection={userCommissionSelection}
                />
              </div>

              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getUserCommissionDataByFilter()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {getUserCommissionDataByFilter().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          style={{
                            cursor:
                              entry.name === "Travels" ? "pointer" : "default",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Travels breakdown tooltip */}
                {hoveredSegment && (
                  <div
                    className="absolute z-20 bg-white border-2 border-blue-200 rounded-lg shadow-2xl p-4"
                    style={{
                      left: "-70%",
                      top: "120%",
                      transform: "translateY(-50%)",
                      minWidth: "280px",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                  >
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2 ring-2 ring-white shadow-md"
                          style={{ backgroundColor: hoveredSegment.fill }}
                        ></div>
                        <span className="font-bold text-gray-800">
                          {hoveredSegment.name}
                        </span>
                      </div>
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {hoveredSegment.value}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {hoveredSegment.breakdown.map((item, index) => (
                        <div
                          key={index}
                          className="relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${item.fill}15 0%, ${item.fill}05 100%)`,
                          }}
                        >
                          <div
                            className="absolute top-0 left-0 w-full h-1"
                            style={{ backgroundColor: item.fill }}
                          ></div>

                          <div className="p-4">
                            <div className="flex items-center mb-2">
                              <div
                                className="w-3 h-3 rounded-full mr-2 ring-2 ring-white shadow-sm"
                                style={{ backgroundColor: item.fill }}
                              ></div>
                              <span className="text-sm font-semibold text-gray-700">
                                {item.name}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  Share
                                </span>
                                <span
                                  className="text-lg font-bold"
                                  style={{ color: item.fill }}
                                >
                                  {item.value}%
                                </span>
                              </div>

                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500 ease-out"
                                  style={{
                                    backgroundColor: item.fill,
                                    width: `${(item.value / 18) * 100}%`,
                                    boxShadow: `0 0 4px ${item.fill}40`,
                                  }}
                                ></div>
                              </div>

                              <div className="text-xs text-gray-500 mt-1">
                                {item.name === "One-way"
                                  ? "Single destination trips"
                                  : "Return journey trips"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Total Travel Revenue</span>
                        <span className="font-semibold">
                          ₹{((hoveredSegment.value * 5376) / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-blue-200"></div>
                  </div>
                )}
              </div>

              <IndividualFilterButtons
                activeFilter={userCommissionFilter}
                onFilterChange={handleUserCommissionFilterChange}
                chartType="user-commission"
                selectedYearsMonths={userCommissionSelection}
              />
            </div>
          </div>
        </div>

        {/* Bar Charts Section */}
        <div className="flex flex-wrap mb-6">
          {/* Trip Growth */}
          <div className="w-full md:w-1/2 pr-2 mb-4">
            <div
              className="bg-white rounded shadow p-4 h-full"
              data-chart-type="trip-growth"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Trip Growth</h2>
                <IndividualPrintReportButton
                  chartType="trip-growth"
                  chartData={getTripGrowthDataByFilter()}
                  title="Trip Growth"
                  activeFilter={tripGrowthFilter}
                  selection={tripGrowthSelection}
                />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getTripGrowthDataByFilter()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Local Rental" fill="#4285F4" />
                    <Bar dataKey="One-way" fill="#DB4437" />
                    <Bar dataKey="Carpool" fill="#8BC34A" />
                    <Bar dataKey="City Ride" fill="#f97347" />
                    <Bar dataKey="Round Trip" fill="#673AB7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <IndividualFilterButtons
                activeFilter={tripGrowthFilter}
                onFilterChange={handleTripGrowthFilterChange}
                chartType="trip-growth"
                selectedYearsMonths={tripGrowthSelection}
              />
            </div>
          </div>

          {/* All Users */}
          <div className="w-full md:w-1/2 pl-2 mb-4">
            <div
              className="bg-white rounded shadow p-4 h-full"
              data-chart-type="all-users"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">All Users</h2>
                <IndividualPrintReportButton
                  chartType="all-users"
                  chartData={getAllUsersDataByFilter()}
                  title="All Users"
                  activeFilter={allUsersFilter}
                  selection={allUsersSelection}
                />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getAllUsersDataByFilter()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Passengers" fill="#4285F4" />
                    <Bar dataKey="Travels" fill="#DB4437" />
                    <Bar dataKey="Drivers" fill="#8BC34A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <IndividualFilterButtons
                activeFilter={allUsersFilter}
                onFilterChange={handleAllUsersFilterChange}
                chartType="all-users"
                selectedYearsMonths={allUsersSelection}
              />
            </div>
          </div>
        </div>

        {/* Dashboard/Vehicles Tabs Section */}
        <div className="flex border-t pt-4 mt-4">
          <div className="w-1/2 flex justify-center border-r">
            <button className="flex items-center font-bold text-gray-800">
              {/* Add your dashboard tab content here */}
            </button>
          </div>
          <div className="w-1/2 flex justify-center">
            <button className="flex items-center font-bold text-gray-800">
              {/* Add your vehicles tab content here */}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
