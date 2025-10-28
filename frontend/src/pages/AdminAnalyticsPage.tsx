// src/pages/AdminAnalyticsPage.tsx
import { useState, useEffect } from "react";
import { Send, Bot, User, BarChart3, TrendingUp, Users, FileText, Sparkles } from "lucide-react";
import { fetchWithAuth, postWithAuth } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  data?: any;
  chartType?: string;
}

interface AnalyticsResponse {
  answer: string;
  data?: any;
  chartType?: "bar" | "pie" | "line" | "table";
  queryType?: string;
  explanation?: string;
}

export default function AdminAnalyticsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts] = useState([
    "Show me top 5 fraud-prone users this week",
    "What's the fraud trend over the last 30 days?",
    "Which transaction channel has the highest fraud rate?",
    "Show me risk score distribution of fraud alerts",
    "Give me a system overview with key statistics",
    "How does fraud vary by account age?",
    "Compare fraud rates by KYC verification status"
  ]);

  // Add welcome message on component mount
  useEffect(() => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI Analytics Assistant. I can help you analyze fraud patterns, user behavior, and transaction trends using natural language. Ask me anything about your fraud detection data!",
        role: "assistant",
        timestamp: new Date()
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const token = localStorage.getItem("token");
      const response: AnalyticsResponse = await postWithAuth("/admin/analytics/query", token, {
        query: input
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: "assistant",
        timestamp: new Date(),
        data: response.data,
        chartType: response.chartType
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Analytics error:", error);
      
      // Try fallback endpoint
      try {
        const token = localStorage.getItem("token");
        const fallbackResponse: AnalyticsResponse = await postWithAuth("/admin/analytics/simple-query", token, {
          query: input
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse.answer,
          role: "assistant",
          timestamp: new Date(),
          data: fallbackResponse.data,
          chartType: fallbackResponse.chartType
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (fallbackError: any) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I encountered an error processing your request. Please try again or check if the backend is running.",
          role: "assistant",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderChart = (data: any[], chartType?: string) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    switch (chartType) {
      case "bar":
        return (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Chart Visualization</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case "pie":
        return (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case "line":
        return (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Trend Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Data Table</h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Analytics AI Assistant
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Ask questions about your fraud detection data in natural language and get instant insights with visualizations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Suggested Prompts & Quick Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Suggested Prompts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Suggested Prompts
            </h3>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickAction 
                icon={<Users className="h-4 w-4" />} 
                label="User Analysis" 
                onClick={() => handleSuggestedPrompt("Show me top fraud users")}
              />
              <QuickAction 
                icon={<TrendingUp className="h-4 w-4" />} 
                label="Trend Analysis" 
                onClick={() => handleSuggestedPrompt("Show me fraud trends")}
              />
              <QuickAction 
                icon={<FileText className="h-4 w-4" />} 
                label="System Overview" 
                onClick={() => handleSuggestedPrompt("Give me system statistics")}
              />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      {message.data && renderChart(message.data, message.chartType)}
                      <div className={`text-xs mt-2 ${
                        message.role === "user" ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your fraud data (e.g., 'Show me top fraud users this week')..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={2}
                    disabled={loading}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    Press Enter to send
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Action Component
function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
    >
      <div className="text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
}