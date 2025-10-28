import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Context value type
interface TransactionContextType {
  transactions: any[];
  setTransactions: (data: any[]) => void;
}

// Create context
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Provider
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token"); // ✅ get JWT

      if (!token) {
        setTransactions([]);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/transactions", { // ✅ backend URL
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ send JWT
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized or failed request");
        }

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

// ✅ Custom hook to use transactions
export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
