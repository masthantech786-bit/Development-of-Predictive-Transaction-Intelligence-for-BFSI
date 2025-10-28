"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Contact <span className="text-blue-600">FraudGuard</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We’re here to help you with{" "}
          <span className="font-semibold">queries, support, and feedback</span>.
          Reach us anytime and our team will respond quickly.
        </p>
      </motion.div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Mail,
            title: "Email Us",
            detail: "support@example.com",
            link: "mailto:support@example.com",
          },
          {
            icon: Phone,
            title: "Call Us",
            detail: "+91 12345 12345",
            link: "tel:+911234512345",
          },
          {
            icon: MapPin,
            title: "Visit Us",
            detail: "India",
            link: "https://goo.gl/maps/",
          },
        ].map((item, idx) => (
          <motion.a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-lg transition flex flex-col items-center space-y-4 text-center"
          >
            <item.icon className="w-10 h-10 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{item.detail}</p>
          </motion.a>
        ))}
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
            Back to Home
          </motion.button>
        </Link>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Or reach us directly at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 underline"
          >
            support@example.com
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default ContactPage;
