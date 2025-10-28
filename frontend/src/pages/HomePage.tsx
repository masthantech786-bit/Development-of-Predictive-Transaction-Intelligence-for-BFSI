import React, { useState, useEffect } from "react";
import UploadSection from "../components/UploadSection";
import ModelPerformance from "../components/ModelPerformance";
import TransactionTable from "../components/TransactionTable";
import { useTransactions } from "../context/TransactionContext";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import SummaryStats from "../components/SummaryStats";

const HomePage: React.FC = () => {
  const { transactions, setTransactions } = useTransactions();
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1_score: 0,
  });

  // 🔹 Fetch transactions from backend after login
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found, redirecting to login...");
          window.location.href = "/login";
          return;
        }

        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error("Failed to fetch transactions");
        }

        const data = await res.json();
        setTransactions(data);

        // compute metrics from backend data
        computeMetrics(data);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [setTransactions]);

  // 🔹 Handle CSV upload and compute metrics
  const handleFileUpload = (data: any[]) => {
    setTransactions(data);
    computeMetrics(data);
  };

  // 🔹 Utility: compute classification metrics
  const computeMetrics = (data: any[]) => {
    let TP = 0, TN = 0, FP = 0, FN = 0;

    data.forEach((row) => {
      const actual = Number(row.is_fraud);
      const predicted = Number(row.predicted);

      if (actual === 1 && predicted === 1) TP++;
      if (actual === 0 && predicted === 0) TN++;
      if (actual === 0 && predicted === 1) FP++;
      if (actual === 1 && predicted === 0) FN++;
    });

    const accuracy = (TP + TN) / (TP + TN + FP + FN || 1);
    const precision = TP / (TP + FP || 1);
    const recall = TP / (TP + FN || 1);
    const f1_score = (2 * precision * recall) / (precision + recall || 1);

    setMetrics({ accuracy, precision, recall, f1_score });
  };

  return (
    <div className="space-y-16 p-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-200">
          Welcome to BFSI Fraud Detection Portal
        </h1>
        <p className="mt-4 text-lg text-blue-800 dark:text-blue-300 max-w-3xl mx-auto">
          A powerful dashboard designed to predict customer transactions and detect
          fraudulent activities in real time. Secure, scalable, and powered by AI.
        </p>
        <img
          src="https://img.freepik.com/premium-vector/bfsi-banking-financial-services-insurance-concept-with-big-words-people-surrounded-by-related-icon-with-blue-color-style_25156-1615.jpg"
          alt="BFSI Illustration"
          className="mt-8 mx-auto rounded-2xl shadow-lg 
              w-64 sm:w-80 md:w-[28rem] 
              h-auto 
              transition-transform duration-500 ease-in-out 
              hover:scale-105 hover:shadow-2xl
              dark:shadow-blue-900/40"
        />
      </section>

      {/* Dashboard Section */}
      <section>
        <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-6 text-center">
          Fraud Detection Dashboard
        </h2>
        <div className="space-y-8 bg-blue-50 dark:bg-blue-900/40 p-6 rounded-xl shadow-md">
          <UploadSection onFileUpload={handleFileUpload} />
          <SummaryStats data={transactions} />
          <ModelPerformance metrics={metrics} />
          <TransactionTable data={transactions} />
        </div>
      </section>

      {/* Features Section */}
      <section>
        <Features />
      </section>

      {/* How It Works Section */}
      <section>
        <HowItWorks />
      </section>
    </div>
  );
};

export default HomePage;
