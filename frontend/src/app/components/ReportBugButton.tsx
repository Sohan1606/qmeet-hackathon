"use client"

import { useState } from "react"
import { Bug, X, Send, Check, MessageSquare, Lightbulb, AlertTriangle } from "lucide-react"

export default function ReportBugButton() {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [type, setType] = useState("bug")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production: send to backend
    const report = {
      type,
      description,
      email,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? navigator.userAgent : ""
    }
    console.log("Bug report submitted:", report)
    
    // Save to localStorage for demo
    try {
      const existing = JSON.parse(localStorage.getItem("qmeet_bug_reports") || "[]")
      existing.push(report)
      localStorage.setItem("qmeet_bug_reports", JSON.stringify(existing))
    } catch (e) {}
    
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setOpen(false)
      setDescription("")
      setEmail("")
    }, 2500)
  }

  const types = [
    { id: "bug", label: "Bug", icon: Bug, color: "red", desc: "Something is broken" },
    { id: "feature", label: "Feature", icon: Lightbulb, color: "yellow", desc: "Suggest an improvement" },
    { id: "feedback", label: "Feedback", icon: MessageSquare, color: "blue", desc: "General comments" }
  ]

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 rounded-full transition-all group"
        title="Report a bug or suggest a feature"
      >
        <Bug className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Feedback</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Bug className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Send us feedback</h2>
                  <p className="text-xs text-gray-500">We usually respond within 24 hours</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit}>
                
                {/* Type selector */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">What kind of feedback?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {types.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={"p-3 rounded-lg border-2 transition-all text-left " + 
                          (type === t.id 
                            ? (t.color === "red" ? "border-red-500 bg-red-50" : 
                               t.color === "yellow" ? "border-yellow-500 bg-yellow-50" :
                               "border-blue-500 bg-blue-50")
                            : "border-gray-200 hover:border-gray-300")}
                      >
                        <t.icon className={"w-4 h-4 mb-1 " + 
                          (t.color === "red" ? "text-red-600" :
                           t.color === "yellow" ? "text-yellow-600" :
                           "text-blue-600")} />
                        <div className="text-xs font-bold text-gray-900">{t.label}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Describe your feedback</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="4"
                    placeholder={type === "bug" ? "What happened? What did you expect?" : type === "feature" ? "What would you like to see?" : "Share your thoughts..."}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">We'll follow up if we need more details</p>
                </div>

                {/* Auto-captured info */}
                <div className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-700 font-semibold mb-1">We'll also capture:</p>
                      <p className="text-[10px] text-gray-600">Page URL, browser info, timestamp</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                    <Send className="w-3.5 h-3.5" />
                    Send feedback
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Thank you!</h3>
                <p className="text-sm text-gray-500">Your feedback helps us improve QMEET. We will respond within 24 hours if needed.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}