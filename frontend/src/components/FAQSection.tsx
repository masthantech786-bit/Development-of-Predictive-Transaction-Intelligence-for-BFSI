import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is the main objective of this project?",
    a: "The objective is to design an intelligent system that predicts customer transaction behavior and detects fraudulent activities in real time, using the advanced analytical capabilities of Large Language Models (LLMs).",
  },
  {
    q: "Why are LLMs used instead of traditional machine learning models?",
    a: "LLMs can analyze both structured data (such as transaction histories) and unstructured data (such as customer behavior and contextual information). This ability to capture deeper and more complex patterns makes them superior to traditional fraud detection models.",
  },
  {
    q: "How does transaction prediction help in fraud detection?",
    a: "By modeling expected customer behavior, the system establishes a baseline. Any deviation from this baseline—such as an unusual amount, location, or device—can be flagged as potentially fraudulent.",
  },
  {
    q: "What are the key advantages of real-time fraud detection?",
    a: "Real-time detection enables immediate action, such as blocking or flagging suspicious transactions. This reduces financial losses, protects customers instantly, and helps institutions comply with security regulations.",
  },
  {
    q: "Which industries benefit most from this solution?",
    a: "Industries with high transaction volumes benefit the most, particularly banking, fintech, e-commerce, insurance, and telecommunications.",
  },
  {
    q: "What type of data is required for the system?",
    a: "The model uses transaction histories, customer profiles, device and network metadata, and behavioral patterns to detect anomalies effectively.",
  },
  {
    q: "How is the system implemented in real time despite the computational cost of LLMs?",
    a: "The solution employs optimized inference pipelines, GPU/TPU acceleration, and scalable microservices, ensuring transaction checks within milliseconds.",
  },
  {
    q: "How does the system minimize false positives?",
    a: "Through advanced threshold tuning, ensemble learning techniques, and customer feedback loops, the system reduces the chances of blocking legitimate transactions.",
  },
  {
    q: "How does the system adapt to new fraud tactics?",
    a: "The model supports continuous learning, meaning it can update itself with new fraud data, ensuring resilience against evolving fraudulent methods.",
  },
  {
    q: "What measures are taken to protect customer data?",
    a: "Data is anonymized, encrypted, and handled in compliance with regulations such as GDPR and PCI DSS, ensuring maximum privacy and security.",
  },
  {
    q: "Can the system explain why a transaction was flagged as fraud?",
    a: "Yes. The solution incorporates Explainable AI (XAI), providing clear reasons for alerts, which helps build trust with both customers and regulatory bodies.",
  },
  {
    q: "What is the acceptable latency for real-time fraud detection?",
    a: "The system is designed to process and evaluate transactions in 200–500 milliseconds, ensuring minimal disruption to user experience.",
  },
  {
    q: "How does the system handle imbalanced datasets (since fraud cases are rare)?",
    a: "Techniques such as oversampling, anomaly detection, weighted loss functions, and synthetic data generation are applied to balance the dataset.",
  },
  {
    q: "How is the system integrated into existing financial platforms?",
    a: "Integration is achieved via APIs, webhooks, and dashboards, allowing financial institutions to embed the solution seamlessly into their existing workflows.",
  },
  {
    q: "What is the future scope of this project?",
    a: "Future enhancements include incorporating multimodal data (text, biometrics, voice, and image), integrating blockchain for audit trails, and leveraging next-generation LLMs for faster, more adaptive fraud detection.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          ❓ Project FAQs
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-2xl shadow-md p-5 bg-white dark:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {faq.q}
                </span>
                <span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`mt-3 text-gray-700 dark:text-gray-300 overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
