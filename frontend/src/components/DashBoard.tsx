import React, { useState, useEffect } from "react";
import Header from "./Header";
import UploadSection from "./UploadSection";
import AnalyticsSection from "./AnalyticsSection";
import TransactionTable from "./TransactionTable";
import ModelPerformance from "./ModelPerformance";

interface Transaction {
  transaction_id: string;
  customer_id: string;
  kyc_verified: boolean;
  account_age_days: number;
  transaction_amount: number;
  channel: string;
  timestamp: string; // ISO string
  is_fraud: boolean;
}

const Dashboard: React.FC = () => {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "transactions" | "analytics" | "performance"
  >("transactions");

  // Example model metrics (replace with API fetch if available)
  const [modelMetrics] = useState({
    accuracy: 0.95,
    precision: 0.92,
    recall: 0.9,
    f1_score: 0.91,
  });

const fetchTransactionsFromAPI = async () => {
  try {
    setLoading(true);

    // Get token from localStorage (set it after login)
    const token = localStorage.getItem("token");

    const response = await fetch("/api/transactions", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // <-- send JWT
      },
    });

    if (response.status === 401) {
      console.error("Unauthorized! Please login.");
      setLoading(false);
      return;
    }

    if (response.ok) {
      const data = await response.json();

      const parsedData: Transaction[] = (data || []).map((txn: any) => ({
        transaction_id: txn.transaction_id ?? "",
        customer_id: txn.customer_id ?? "",
        kyc_verified: txn.kyc_verified === "Yes" || txn.kyc_verified === true,
        account_age_days: Number(txn.account_age_days) || 0,
        transaction_amount: Number(txn.transaction_amount) || 0,
        channel: txn.channel ?? "Unknown",
        timestamp: txn.timestamp ?? new Date().toISOString(),
        is_fraud:
          txn.is_fraud === "1" || txn.is_fraud === 1 || txn.is_fraud === true,
      }));

      setTransactionData(parsedData);
    } else {
      console.error("Error fetching transactions:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
  } finally {
    setLoading(false);
  }
};


  // Handle CSV uploads
  const handleFileUpload = (data: Transaction[]) => {
    setTransactionData((prev) => [...prev, ...(data || [])]);
  };

  useEffect(() => {
    fetchTransactionsFromAPI();
  }, []);

  const tabs = [
    { key: "transactions", label: "Transactions" },
    { key: "analytics", label: "Analytics" },
    { key: "performance", label: "Model Performance" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UploadSection onFileUpload={handleFileUpload} />

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex space-x-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "transactions" && (
              <TransactionTable data={transactionData} />
            )}
            {activeTab === "analytics" && (
              <AnalyticsSection data={transactionData || []} />
            )}
            {activeTab === "performance" && (
              <ModelPerformance metrics={modelMetrics} />
            )}
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 flex items-center space-x-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-gray-100">
              Loading data...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
