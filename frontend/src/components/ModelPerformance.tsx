import React from "react";
import { CheckCircle, Target, Search, BarChart3 } from "lucide-react";

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

interface ModelPerformanceProps {
  metrics: ModelMetrics;
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ metrics }) => {
  const metricItems = [
    { label: "Accuracy", value: metrics.accuracy, icon: CheckCircle, color: "text-green-600" },
    { label: "Precision", value: metrics.precision, icon: Target, color: "text-blue-600" },
    { label: "Recall", value: metrics.recall, icon: Search, color: "text-purple-600" },
    { label: "F1 Score", value: metrics.f1_score, icon: BarChart3, color: "text-orange-600" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Model Performance</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center hover:shadow-md transition"
            >
              <Icon className={`w-6 h-6 ${item.color} mb-2`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {(item.value * 100).toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelPerformance;
