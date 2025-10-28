import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";

interface SummaryStatsProps {
  data: any[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  const stats = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        fraud: 0,
        legit: 0,
        fraudRate: "0.00",
        avgAmount: "0.00",
        highValue: 0,
      };
    }

    const total = data.length;
    const fraud = data.filter((d) => Number(d.is_fraud) === 1).length;
    const legit = total - fraud;

    const fraudRate = total > 0 ? ((fraud / total) * 100).toFixed(2) : "0.00";

    const amounts = data.map((d) => {
      const val = parseFloat(d.transaction_amount);
      return isNaN(val) ? 0 : val;
    });
    const avgAmount =
      total > 0 ? (amounts.reduce((a, b) => a + b, 0) / total).toFixed(2) : "0.00";

    const highValue = data.filter((d) => Number(d.is_high_value) === 1).length;

    return { total, fraud, legit, fraudRate, avgAmount, highValue };
  }, [data]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  const cards = [
    {
      title: "Total Transactions",
      value: stats.total,
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      gradient: "from-blue-500/10 to-blue-500/5",
    },
    {
      title: "Legitimate",
      value: stats.legit,
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      gradient: "from-green-500/10 to-green-500/5",
    },
    {
      title: "Fraudulent",
      value: stats.fraud,
      icon: <AlertCircle className="h-8 w-8 text-red-600" />,
      gradient: "from-red-500/10 to-red-500/5",
    },
    {
      title: "Fraud Rate",
      value: `${stats.fraudRate}%`,
      icon: <Activity className="h-8 w-8 text-purple-600" />,
      gradient: "from-purple-500/10 to-purple-500/5",
    },
    {
      title: "Avg. Transaction",
      value: `₹${Number(stats.avgAmount).toLocaleString()}`,
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      gradient: "from-indigo-500/10 to-indigo-500/5",
    },
    {
      title: "High-Value Txns",
      value: stats.highValue,
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      gradient: "from-orange-500/10 to-orange-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.97 }}
          className={`p-6 rounded-2xl shadow-md bg-gradient-to-br ${card.gradient} 
            dark:bg-gray-800/80 transition-all duration-300`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/70 dark:bg-gray-700/60 rounded-xl shadow">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {card.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryStats;
