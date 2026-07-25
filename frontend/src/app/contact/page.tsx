"use client"

import { useState } from "react"
import { Zap, Mail, MessageSquare, Phone, MapPin, Send, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white">
      
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900">QMEET</span>
          </a>
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in touch</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Have a question or need help? We typically reply within 2 hours during business days.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Mail, title: "Email support", desc: "support@qmeet.ai", detail: "Reply within 2 hours" },
            { icon: MessageSquare, title: "Live chat", desc: "Available Mon-Fri", detail: "9 AM - 6 PM IST" },
            { icon: Phone, title: "Enterprise sales", desc: "+91 80 4567 8900", detail: "For Enterprise inquiries" }
          ].map((c, i) => (
            <div key={i} className="p-5 bg-white rounded-lg border border-gray-200 hover:border-[#2383E2] hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#2383E2]/10 flex items-center justify-center mb-3">
                <c.icon className="w-5 h-5 text-[#2383E2]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-[#2383E2] font-semibold">{c.desc}</p>
              <p className="text-xs text-gray-500 mt-1">{c.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Send us a message</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">What is this about?</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm">
                  <option>General question</option>
                  <option>Technical support</option>
                  <option>Bug report</option>
                  <option>Feature request</option>
                  <option>Enterprise inquiry</option>
                  <option>Billing question</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea rows="5" required placeholder="Tell us how we can help..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm resize-none"></textarea>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2383E2] text-white rounded-lg font-semibold text-sm hover:bg-[#1a6dc4]">
                <Send className="w-4 h-4" />
                Send message
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h2>
              <p className="text-gray-600 mb-6">We'll get back to you within 2 hours</p>
              <button onClick={() => router.push("/")} className="px-6 py-2 bg-[#2383E2] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6dc4]">
                Back to home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}