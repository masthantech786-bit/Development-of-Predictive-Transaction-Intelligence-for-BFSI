// src/components/EDAReports.tsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  transaction_id: string;
  customer_id: string;
  kyc_verified: string; // "Yes" or "No"
  account_age_days: number;
  transaction_amount: number;
  channel: string;
  timestamp: string;
  is_fraud: number; // 0 or 1
  hour: number;
  weekday: number; // 0-6
  is_high_value: number; // 0 or 1
  predicted?: number;
}

interface Props {
  data: Transaction[];
}

// Distinct color sets
const FRAUD_PIE_COLORS = ["#4CAF50", "#F44336"]; // Legit (green), Fraud (red)
const COLORS2 = ["#42A5F5", "#FFA726", "#66BB6A", "#AB47BC", "#EC407A"];
const COLORS3 = ["#29B6F6", "#EF5350", "#8E24AA", "#66BB6A"];
const COLORS4 = ["#FF7043", "#26C6DA", "#7E57C2", "#9CCC65"];
const COLORS5 = ["#26A69A", "#FFCA28", "#5C6BC0", "#EF5350"];
const COLORS6 = ["#5C6BC0", "#26C6DA", "#FF7043", "#9CCC65"];

const weekdayMap: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const EDAReports: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available for EDA reports.</p>;
  }

  // ✅ Summary Stats (use predicted to match HomePage)
  const totalTxns = data.length;
  const fraudCount = data.filter((d) => Number(d.is_fraud) === 1).length;
  const legitCount = data.filter((d) => Number(d.is_fraud) === 0).length;

  const fraudRate = ((fraudCount / (totalTxns || 1)) * 100).toFixed(2);
  const avgTxn =
    data.reduce((sum, d) => sum + d.transaction_amount, 0) / (totalTxns || 1);

  // ✅ Fraud vs Legitimate (for charts)
  const fraudVsLegit = [
    { name: "Legitimate", value: legitCount },
    { name: "Fraudulent", value: fraudCount },
  ];

  // ✅ Transactions over time
  const transactionsByDate = Object.values(
    data.reduce((acc: any, curr) => {
      const date = curr.timestamp ? curr.timestamp.split(" ")[0] : null;
      if (!date) return acc;
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  // ✅ Transactions by channel
  const channelData = Object.values(
    data.reduce((acc: any, curr) => {
      const channel = curr.channel || "Unknown";
      if (!acc[channel]) acc[channel] = { channel, count: 0 };
      acc[channel].count += 1;
      return acc;
    }, {})
  );

  // ✅ KYC Verified
  const kycData = Object.values(
    data.reduce((acc: any, curr) => {
      const kyc = curr.kyc_verified === "Yes" ? "Yes" : "No";
      if (!acc[kyc]) acc[kyc] = { kyc, count: 0 };
      acc[kyc].count += 1;
      return acc;
    }, {})
  );

  // ✅ Transactions by Weekday
  const weekdayData = Object.values(
    data.reduce((acc: any, curr) => {
      const day = weekdayMap[curr.weekday] || "Unknown";
      if (!acc[day]) acc[day] = { weekday: day, count: 0 };
      acc[day].count += 1;
      return acc;
    }, {})
  );

  // ✅ Transactions by Hour
  const hourData = Object.values(
    data.reduce((acc: any, curr) => {
      const hour = curr.hour ?? -1;
      if (!acc[hour]) acc[hour] = { hour, count: 0 };
      acc[hour].count += 1;
      return acc;
    }, {})
  );

  // ✅ Transaction Amount Buckets
  const buckets = [
    { name: "<10k", min: 0, max: 10000 },
    { name: "10k-50k", min: 10000, max: 50000 },
    { name: "50k-100k", min: 50000, max: 100000 },
    { name: "100k+", min: 100000, max: Infinity },
  ];

  const amountDist = buckets.map((b) => ({
    range: b.name,
    count: data.filter(
      (d) => d.transaction_amount >= b.min && d.transaction_amount < b.max
    ).length,
  }));

  return (
    <div className="space-y-8">
      {/* ✅ Summary Cards (Removed High-Value) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Txns</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{totalTxns}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Legitimate</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">{legitCount}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Fraudulent</p>
          <p className="text-xl font-bold text-red-700 dark:text-red-300">{fraudCount}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900/40 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Fraud Rate</p>
          <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{fraudRate}%</p>
        </div>
      </div>

      {/* ✅ Fraudulent vs Legitimate (Pie Chart without numbers) */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
          Fraudulent vs Legitimate Transactions
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={fraudVsLegit} dataKey="value" nameKey="name" outerRadius={120}>
              {fraudVsLegit.map((_, idx) => (
                <Cell key={idx} fill={FRAUD_PIE_COLORS[idx % FRAUD_PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Other Graphs with distinct colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Transactions over Time */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
            Transactions Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionsByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#42A5F5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions by Channel */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
            Transactions by Channel
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {channelData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS2[idx % COLORS2.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* KYC Verified */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
            KYC Verified (Yes vs No)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={kycData} dataKey="count" nameKey="kyc" outerRadius={120}>
                {kycData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS3[idx % COLORS3.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions by Weekday */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
            Transactions by Weekday
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekdayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekday" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {weekdayData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS4[idx % COLORS4.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions by Hour */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
            Transactions by Hour
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {hourData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS5[idx % COLORS5.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Amount Distribution */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
            Transaction Amount Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amountDist}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {amountDist.map((_, idx) => (
                  <Cell key={idx} fill={COLORS6[idx % COLORS6.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EDAReports;
