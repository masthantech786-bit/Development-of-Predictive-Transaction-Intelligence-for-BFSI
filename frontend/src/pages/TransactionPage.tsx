// src/pages/TransactionPage.tsx
import { useState, useRef } from "react"; // useRef might not be needed anymore if KycCheckBot was the only user
// import KycCheckBot from "../components/KycCheckBot"; // <-- 1. REMOVE THIS IMPORT

interface PredictionResult {
  transaction_id: string;
  db_transaction_id: number;
  prediction: string;
  risk_score: number;
  ml_probability: number;
  rule_score: number;
  reasons: string[];
  message: string;
}

export default function TransactionPage() {
  const [formData, setFormData] = useState({
    customer_id: "",
    account_age_days: "",
    transaction_amount: "",
    channel: "Mobile",
    timestamp: "",
    transaction_id: "",
  });

  const [panFile, setPanFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPanFile(e.target.files[0]);
    } else {
      setPanFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const data = new FormData();
      const channelMapping: { [key: string]: number } = {
        "Mobile": 0, "POS": 1, "ATM": 2, "Web": 3
      };
      const channelValue = channelMapping[formData.channel] ?? 0;

      data.append("customer_id", formData.customer_id);
      data.append("account_age_days", formData.account_age_days || "0");
      data.append("transaction_amount", formData.transaction_amount || "0");
      data.append("channel", channelValue.toString());
      data.append("timestamp", formData.timestamp);
      data.append("transaction_id", formData.transaction_id || `tx_${Date.now()}`);

      if (panFile) {
        data.append("pan_card", panFile);
      } else {
        console.warn("Submitting transaction without a PAN card file.");
        // If mandatory, uncomment below:
        // throw new Error("PAN card upload is required.");
      }

      const response = await fetch("/api/predict", { // Ensure URL is correct
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      if (responseData.results && responseData.results.length > 0) {
        setResult(responseData.results[0]);
      } else {
        throw new Error("No results returned from API");
      }
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        New Transaction
      </h2>

      {/* --- KycCheckBot component REMOVED from here --- */}

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields remain the same */}
        <input type="text" name="transaction_id" placeholder="Transaction ID (optional)" value={formData.transaction_id} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
        <input type="text" name="customer_id" placeholder="Customer ID" value={formData.customer_id} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
        <input type="number" name="account_age_days" placeholder="Account Age (days)" value={formData.account_age_days} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
        <input type="number" step="0.01" name="transaction_amount" placeholder="Transaction Amount (₹)" value={formData.transaction_amount} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
        <select name="channel" value={formData.channel} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600">
          <option value="Mobile">Mobile</option>
          <option value="POS">POS</option>
          <option value="ATM">ATM</option>
          <option value="Web">Web</option>
        </select>
        <div>
          <label htmlFor="pan-upload" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">Upload PAN Card (KYC)</label>
          <input type="file" name="pan_card" id="pan-upload" onChange={handleFileChange} accept="image/jpeg, image/png, application/pdf" className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"/>
          {panFile && (<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selected for submission: {panFile.name}</p>)}
        </div>
        <input type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Processing..." : "Submit Transaction"}
        </button>
      </form>

      {/* Error Display */}
      {error && (<div className="mt-4 p-3 text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg"><strong>Error:</strong> {error}</div>)}

      {/* Result Display (Unchanged) */}
      {result && (<div className="mt-6 p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Prediction Result</h3>
        <div className="space-y-3">
          <ResultRow label="Transaction ID" value={result.transaction_id} />
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Prediction:</span>
            <span className={`font-bold text-lg ${ result.prediction === "Fraud" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{result.prediction}</span>
          </div>
          <ResultRow label="Risk Score" value={`${(result.risk_score * 100).toFixed(2)}%`} bold />
          <ResultRow label="ML Probability" value={`${(result.ml_probability * 100).toFixed(2)}%`} />
          <ResultRow label="Rule Score" value={`${(result.rule_score * 100).toFixed(2)}%`} />
          {result.reasons && result.reasons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <span className="text-gray-700 dark:text-gray-300 font-medium block mb-2">Risk Reasons:</span>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">{result.reasons.map((reason, idx) => (<li key={idx}>{reason}</li>))}</ul>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <span className="text-gray-700 dark:text-gray-300 font-medium block mb-1">Summary:</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.message}</p>
          </div>
        </div>
      </div>)}
    </div>
  );
}

// Helper component (Unchanged)
function ResultRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean;}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
      <span className={`text-gray-900 dark:text-white ${bold ? 'font-semibold' : ''}`}>{value}</span>
    </div>
  );
}