"use client"

import { useState } from "react"
import { Zap, Mail, ArrowLeft, Check } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA] px-6">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#2383E2] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">QMEET</span>
        </a>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
              <p className="text-gray-600 mb-6 text-sm">Enter your email and we'll send you a reset link</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/10 text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#2383E2] text-white rounded-lg font-semibold text-sm hover:bg-[#1a6dc4] transition-colors">
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-600 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
              <p className="text-xs text-gray-500">Didn't receive it? Check spam or <button onClick={() => setSent(false)} className="text-[#2383E2] font-semibold hover:underline">try again</button></p>
            </div>
          )}
        </div>

        <a href="/login" className="flex items-center gap-2 justify-center mt-6 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </a>
      </div>
    </div>
  )
}