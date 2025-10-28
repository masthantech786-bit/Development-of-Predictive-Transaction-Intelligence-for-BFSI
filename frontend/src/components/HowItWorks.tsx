import React from 'react'
import { UserPlus, Link, BarChart3, CheckCircle } from 'lucide-react'

const steps = [
  { title: "Sign Up", desc: "Create a secure account with KYC verification.", icon: UserPlus },
  { title: "Connect Accounts", desc: "Link your bank, insurance, and financial data sources.", icon: Link },
  { title: "Get Insights", desc: "View real-time dashboards, reports, and AI predictions.", icon: BarChart3 },
  { title: "Take Action", desc: "Use recommendations to optimize operations & grow.", icon: CheckCircle }
]

export default function HowItWorks() {
  return (
    <section id="howitworks" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="p-6 rounded-xl shadow bg-gray-50 hover:bg-gray-100 transition">
              <s.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
