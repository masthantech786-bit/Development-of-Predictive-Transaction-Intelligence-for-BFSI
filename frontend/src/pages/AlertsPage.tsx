// src/pages/AlertsPage.tsx
import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, TrendingUp, Activity } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Dialog } from "@headlessui/react";
import { fetchWithAuth, postWithAuth } from "../api";

interface Alert {
  alert_id: number;
  transaction_id: number;
  customer_id: string;
  risk_score: number;
  reason: string;
  ml_prob: number;
  rule_score: number;
  created_at: string;
}

// --- UPDATED INTERFACE ---
interface Transaction {
  id: number;
  data: any; // data is now a full transaction object
  predicted: number;
  probability: number;
  created_at: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [llmText, setLlmText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const alertsData = await fetchWithAuth("/alerts?limit=100", token);
      setAlerts(alertsData.alerts || []);

      const txnData = await fetchWithAuth("/transactions", token);
      setTransactions(Array.isArray(txnData) ? txnData : []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATED FUNCTION ---
  const fetchLlmExplanation = async (alert: Alert) => {
    setLlmText("Loading AI explanation..."); // Show loading text immediately
    setModalOpen(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLlmText("Authentication error. Please log in again.");
        return;
      }

      // 1. Find the full transaction data from the state
      const fullTransaction = transactions.find(
        (t) => t.id === alert.transaction_id
      );

      // 2. Prepare transaction_data, using defaults as a fallback
      let transactionDetails = {
        transaction_amount: 0,
        account_age_days: 0,
        channel: 0,
        kyc_verified: 0,
        timestamp: null,
      };

      if (fullTransaction && fullTransaction.data) {
        transactionDetails = {
          transaction_amount: fullTransaction.data.transaction_amount || 0,
          account_age_days: fullTransaction.data.account_age_days || 0,
          channel: fullTransaction.data.channel || 0,
          kyc_verified: fullTransaction.data.kyc_verified || 0,
          timestamp: fullTransaction.data.timestamp || null,
        };
      } else {
         console.warn(`Could not find full transaction data for alert ${alert.alert_id}`);
      }
      
      // 3. Prepare the payload
      const requestData = {
        transaction_data: transactionDetails, // Use the real data
        prediction: alert.risk_score >= 0.45 ? "Fraud" : "Suspicious",
        risk_score: alert.risk_score,
        ml_prob: alert.ml_prob,
        rule_score: alert.rule_score,
        reasons: alert.reason ? alert.reason.split('; ') : [], // Split string into array
        category: "Fraud Alert"
      };

      // 4. Use POST request with the full data
      const data = await postWithAuth("/llm_explanation", token, requestData);
      setLlmText(data.explanation || "No explanation available.");
      
    } catch (err: any) {
      console.error("LLM explanation error:", err);
      setLlmText("Failed to fetch LLM explanation. The AI explanation service is currently unavailable.");
    }
  };

  // -------------------- Stats --------------------
  const fraudCount = transactions.filter((t) => t.predicted === 1).length;
  const legitCount = transactions.filter((t) => t.predicted === 0).length;
  const totalCount = transactions.length;
  const fraudPercentage =
    totalCount > 0 ? ((fraudCount / totalCount) * 100).toFixed(1) : "0";

  const pieData = [
    { name: "Fraud", value: fraudCount, color: "#ef4444" },
    { name: "Legit", value: legitCount, color: "#22c55e" },
  ];

  const fraudOverTime = transactions
    .filter((t) => t.predicted === 1)
    .reduce((acc: Record<string, number>, t) => {
      const date = new Date(t.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const lineData = Object.entries(fraudOverTime).map(([date, count]) => ({
    date,
    fraudCases: count,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Fraud Detection Dashboard
      </h1>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={totalCount}
          icon={<Activity className="h-10 w-10 text-blue-500" />}
        />
        <StatCard
          title="Fraud Detected"
          value={fraudCount}
          color="text-red-600 dark:text-red-400"
          icon={<AlertTriangle className="h-10 w-10 text-red-500" />}
        />
        <StatCard
          title="Legitimate"
          value={legitCount}
          color="text-green-600 dark:text-green-400"
          icon={<CheckCircle className="h-10 w-10 text-green-500" />}
        />
        <StatCard
          title="Fraud Rate"
          value={`${fraudPercentage}%`}
          color="text-orange-600 dark:text-orange-400"
          icon={<TrendingUp className="h-10 w-10 text-orange-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Fraud vs Legitimate Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fraud Cases Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="fraudCases"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Alerts */}
      <AlertsTable alerts={alerts} fetchLlmExplanation={fetchLlmExplanation} />

      {/* ---------------- Modal for LLM Explanation ---------------- */}
      {modalOpen && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg w-full mx-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              AI Explanation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {llmText}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

/* ---------------- Helper Components ---------------- */
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p
            className={`text-2xl font-bold ${
              color || "text-gray-900 dark:text-white"
            }`}
          >
            {value}
          </p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

function AlertsTable({
  alerts,
  fetchLlmExplanation,
}: {
  alerts: Alert[];
  fetchLlmExplanation: (alert: Alert) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Fraud Alerts
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {[
                "Alert ID",
                "Customer ID",
                "Risk Score",
                "ML Prob",
                "Rule Score",
                "Reason",
                "Time",
                "LLM Explanation",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {alerts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No fraud alerts yet
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.alert_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{alert.alert_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {alert.customer_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.risk_score >= 0.7
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : alert.risk_score >= 0.4
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {(alert.risk_score * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {(alert.ml_prob * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {(alert.rule_score * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {alert.reason || "No specific reason provided"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(alert.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => fetchLlmExplanation(alert)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Explanation
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}