import React from "react";
import {
  TrendingUp,
  Shield,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  PieChart,
} from "lucide-react";

interface Transaction {
  transaction_id: string;
  customer_id: string;
  kyc_verified: boolean | string | number;
  account_age_days: number;
  transaction_amount: number | string;
  channel: string;
  timestamp: string;
  is_fraud: boolean | string | number;
}

interface AnalyticsSectionProps {
  data?: Transaction[]; // ✅ optional now
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ data = [] }) => {
  const totalTransactions = data.length;
  const fraudTransactions = data.filter(
    (t) => t.is_fraud === "1" || t.is_fraud === 1 || t.is_fraud === true
  ).length;
  const legitimateTransactions = totalTransactions - fraudTransactions;
  const fraudRate =
    totalTransactions > 0
      ? ((fraudTransactions / totalTransactions) * 100).toFixed(2)
      : "0";

  const avgAmount =
    data.length > 0
      ? (
          data.reduce(
            (sum, t) => sum + (parseFloat(String(t.transaction_amount)) || 0),
            0
          ) / data.length
        ).toFixed(2)
      : "0";

  const highValueTransactions = data.filter(
    (t) => parseFloat(String(t.transaction_amount)) > 50000
  ).length;

  // Percentages for pie chart
  const fraudPercentage =
    totalTransactions > 0 ? (fraudTransactions / totalTransactions) * 100 : 0;
  const legitimatePercentage =
    totalTransactions > 0
      ? (legitimateTransactions / totalTransactions) * 100
      : 0;

  const stats = [
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      icon: Activity,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Legitimate Transactions",
      value: legitimateTransactions.toLocaleString(),
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Fraudulent Transactions",
      value: fraudTransactions.toLocaleString(),
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      title: "Fraud Rate",
      value: `${fraudRate}%`,
      icon: Shield,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      title: "Average Amount",
      value: `₹${avgAmount}`,
      icon: DollarSign,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      title: "High Value Transactions",
      value: highValueTransactions.toLocaleString(),
      icon: TrendingUp,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Analytics Overview
          </h2>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Assessment */}
        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Risk Assessment
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      parseFloat(fraudRate) > 5
                        ? "bg-red-500"
                        : parseFloat(fraudRate) > 2
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Risk Level:{" "}
                    {parseFloat(fraudRate) > 5
                      ? "High"
                      : parseFloat(fraudRate) > 2
                      ? "Medium"
                      : "Low"}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {fraudRate}% fraud rate
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      {data.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Transaction Distribution
          </h3>
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12">
            <div className="relative">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="20"
                />
                {/* Legitimate arc */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${legitimatePercentage * 5.03} 502.4`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
                {/* Fraud arc */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${fraudPercentage * 5.03} 502.4`}
                  strokeDashoffset={`-${legitimatePercentage * 5.03}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    {totalTransactions}
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">
                    Legitimate Transactions
                  </p>
                  <p className="text-sm text-gray-600">
                    {legitimateTransactions.toLocaleString()} (
                    {legitimatePercentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">
                    Fraudulent Transactions
                  </p>
                  <p className="text-sm text-gray-600">
                    {fraudTransactions.toLocaleString()} (
                    {fraudPercentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnalyticsSection;
