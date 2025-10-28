import React from "react";
import { useTransactions } from "../context/TransactionContext";
import EDAReports from "../components/EDAReports";

const EDAReportsPage: React.FC = () => {
  const { transactions } = useTransactions();

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 text-center">
        EDA Reports
      </h1>

      {transactions.length > 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/40 p-6 rounded-xl shadow-md">
          <EDAReports data={transactions} />
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/40 p-6 rounded-xl shadow-md text-center">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            No dataset found.  
          </p>
          <p className="text-blue-600 dark:text-blue-300 mt-2">
            Please upload a CSV file on the Home page to generate EDA reports.
          </p>
        </div>
      )}
    </div>
  );
};

export default EDAReportsPage;
