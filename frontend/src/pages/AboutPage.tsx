"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  Brain,
  Activity,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          About <span className="text-blue-600">FraudGuard</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          FraudGuard AI is a next-gen{" "}
          <span className="font-semibold">BFSI Fraud Detection Platform</span>  
          built to secure financial transactions, detect anomalies in real time,  
          and protect institutions and customers against digital fraud.
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Our Mission 🔐
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            In the rapidly growing digital banking ecosystem, fraudsters are
            becoming more sophisticated. Our mission is to{" "}
            <span className="font-semibold">detect, prevent, and respond</span>{" "}
            to fraudulent activities using cutting-edge{" "}
            <span className="text-blue-600 font-semibold">AI & ML models</span>.
            FraudGuard ensures financial institutions stay ahead of threats and
            build customer trust.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: ShieldCheck,
                text: "Real-time Fraud Detection",
                color: "text-blue-500",
              },
              {
                icon: BarChart3,
                text: "Analytics & Dashboards",
                color: "text-green-500",
              },
              {
                icon: Brain,
                text: "AI-Powered Predictions",
                color: "text-purple-500",
              },
              {
                icon: Activity,
                text: "Risk Scoring & Alerts",
                color: "text-red-500",
              },
              {
                icon: Users,
                text: "Customer Insights",
                color: "text-orange-500",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <feature.icon className={`${feature.color} w-6 h-6`} />
                <span className="text-gray-800 dark:text-gray-200">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <motion.img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTODLOspHQAWcan3jaFqGq-_3WglPDhdicjfQ&s"
            alt="Fraud Protection Illustration"
            className="w-80 h-80"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-700 transition"
          >
            Get Started
          </motion.button>
        </Link>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Start exploring the Fraud Detection Dashboard and monitor your
          transactions in real-time.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPage;
