import React from "react";
import FAQSection from "../components/FAQSection";

const FAQPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Frequently Asked Questions
      </h1>
      <FAQSection />
    </div>
  );
};

export default FAQPage;
