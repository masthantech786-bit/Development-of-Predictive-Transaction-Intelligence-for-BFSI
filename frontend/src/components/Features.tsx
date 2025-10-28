import React from 'react'
import { Shield, BarChart3, Smartphone, Headphones, TrendingUp, FileCheck } from 'lucide-react'

const data = [
  { title: "Secure Transactions", desc: "End-to-end encryption and fraud detection systems keep your money safe.", icon: Shield },
  { title: "AI-Driven Analytics", desc: "Predictive models for risk assessment and customer insights.", icon: BarChart3 },
  { title: "Mobile Banking", desc: "Full-featured apps for convenient, on-the-go financial management.", icon: Smartphone },
  { title: "24/7 Support", desc: "Customer-first approach with always-available assistance.", icon: Headphones },
  { title: "Scalable Solutions", desc: "Cloud-native platforms that grow with your business.", icon: TrendingUp },
  { title: "Regulatory Compliance", desc: "Built-in tools for KYC, AML, and other financial regulations.", icon: FileCheck }
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-gray-100">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {data.map((f, i) => (
            <div 
              key={i} 
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
            >
              <f.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-100">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
