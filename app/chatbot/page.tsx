"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Send, Loader } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const BOT_RESPONSES = {
  greeting: [
    "Xin chào! Tôi là trợ lý ăn uống của EatIT. Bạn muốn ăn gì hôm nay?",
    "Chào bạn! Tôi có thể giúp bạn tìm kiếm những món ăn ngon. Bạn có sở thích gì không?",
  ],
  recommendation: [
    "Dựa trên sở thích của bạn, tôi gợi ý Phở Bò hoặc Bún Chả Hà Nội. Cả hai đều rất ngon!",
    "Bạn có thể thử Cơm Tấm Sườn Nướng hoặc Bánh Mì Thịt Nướng. Chúng đều là những lựa chọn tuyệt vời!",
  ],
  help: [
    "Tôi có thể giúp bạn tìm kiếm món ăn, gợi ý nhà hàng, hoặc trả lời các câu hỏi về thực đơn. Bạn cần gì?",
    "Tôi sẵn sàng giúp bạn! Bạn có thể hỏi tôi về các món ăn, nhà hàng, hoặc bất cứ điều gì liên quan đến ăn uống.",
  ],
  default: "Cảm ơn bạn! Tôi hiểu rồi. Bạn muốn tìm kiếm gì tiếp theo?",
}

function getBotResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  if (message.includes("xin chào") || message.includes("hello") || message.includes("hi") || message.includes("chào")) {
    return BOT_RESPONSES.greeting[Math.floor(Math.random() * BOT_RESPONSES.greeting.length)]
  }

  if (
    message.includes("gợi ý") ||
    message.includes("recommend") ||
    message.includes("đề nghị") ||
    message.includes("ăn gì")
  ) {
    return BOT_RESPONSES.recommendation[Math.floor(Math.random() * BOT_RESPONSES.recommendation.length)]
  }

  if (message.includes("giúp") || message.includes("help") || message.includes("làm sao")) {
    return BOT_RESPONSES.help[Math.floor(Math.random() * BOT_RESPONSES.help.length)]
  }

  return BOT_RESPONSES.default
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý ăn uống của EatIT. Bạn muốn ăn gì hôm nay?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          {/* Chat Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trợ lý ăn uống</h1>
            <p className="text-gray-600 dark:text-gray-400">Hỏi tôi bất cứ điều gì về ăn uống</p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto mb-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm">Đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
              title="Send message"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
