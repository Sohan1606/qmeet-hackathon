"use client"

import { useState, useEffect } from "react"
import { Zap, Calendar, Check, Clock, Users, TrendingUp, Download, Copy, ExternalLink } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function SharedMeetingPage({ params }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [meetingId, setMeetingId] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params && params.then) {
      params.then(p => setMeetingId(p.id))
    } else if (params && params.id) {
      setMeetingId(params.id)
    }
  }, [params])

  useEffect(() => {
    // Try to load from localStorage first (if user came from their own dashboard)
    const stored = localStorage.getItem("qmeet_result")
    if (stored) {
      try {
        setResult(JSON.parse(stored))
        setLoading(false)
        return
      } catch (e) {}
    }
    
    // Otherwise fetch from backend
    if (meetingId) {
      fetchMeeting()
    }
  }, [meetingId])

  const fetchMeeting = async () => {
    try {
      const response = await axios.get(API_URL + "/api/meeting/" + meetingId)
      setResult(response.data)
    } catch (e) {}
    setLoading(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-[#2383E2] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Meeting not found</h1>
          <p className="text-sm text-gray-500 mb-4">This shared meeting link may have expired or been removed.</p>
          <a href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6dc4]">
            Go to QMEET
          </a>
        </div>
      </div>
    )
  }

  const summary = result.summary || {}
  const analysis = result.analysis || {}
  const extraction = result.extraction || {}
  const effectiveness = analysis.meeting_effectiveness || {}
  const meetingSummary = analysis.meeting_summary || {}
  const actionItems = extraction.action_items || []
  const decisions = extraction.decisions_made || []

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900">QMEET</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={copyLink} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-600" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy link</>}
            </button>
            <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2383E2] text-white rounded-lg text-xs font-semibold hover:bg-[#1a6dc4]">
              Try QMEET Free
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Shared banner */}
      <div className="bg-blue-50 border-b border-blue-100 py-2 px-6 text-center">
        <p className="text-xs text-blue-900">
          <strong>📎 Public shared meeting</strong> · Anyone with this link can view · No login required
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Meeting title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-gray-500 font-mono">MEETING SUMMARY</div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {result.meeting_title || "Meeting Analysis"}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            {meetingSummary.one_line || "Meeting analysis complete"}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Action Items</div>
            <div className="text-2xl font-bold text-gray-900">{actionItems.length}</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Decisions</div>
            <div className="text-2xl font-bold text-gray-900">{decisions.length}</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Effectiveness</div>
            <div className="text-2xl font-bold text-gray-900">{effectiveness.score || 0}<span className="text-sm text-gray-400">/100</span></div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Duration</div>
            <div className="text-2xl font-bold text-gray-900">{analysis.meeting_cost?.estimated_duration_minutes || 30}<span className="text-sm text-gray-400"> min</span></div>
          </div>
        </div>

        {/* Key highlights */}
        {meetingSummary.bullet_points && meetingSummary.bullet_points.length > 0 && (
          <div className="p-6 bg-white rounded-xl border border-gray-200 mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Key Highlights</h2>
            <div className="space-y-3">
              {meetingSummary.bullet_points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#2383E2]" />
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decisions */}
        {decisions.length > 0 && (
          <div className="p-6 bg-white rounded-xl border border-gray-200 mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Decisions Made</h2>
            <div className="space-y-2">
              {decisions.map((d, i) => (
                <div key={i} className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-sm font-medium text-gray-900 mb-1">{d.decision}</p>
                  <p className="text-xs text-gray-600">By {d.decided_by} · {d.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action items */}
        {actionItems.length > 0 && (
          <div className="p-6 bg-white rounded-xl border border-gray-200 mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Action Items</h2>
            <div className="space-y-2">
              {actionItems.map((item, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{item.task}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{item.owner || "Unassigned"}</span>
                        </div>
                        {item.deadline && item.deadline !== "Not specified" && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.deadline}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={"text-xs px-2 py-0.5 rounded-full font-semibold " + 
                      (item.priority === "High" ? "bg-red-100 text-red-700" : 
                       item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : 
                       "bg-green-100 text-green-700")}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Powered by CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-[#2383E2] to-blue-700 rounded-2xl text-white text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
            <Zap className="w-3 h-3" />
            <span className="text-xs font-semibold uppercase tracking-widest">Powered by QMEET</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Want this for your meetings?</h3>
          <p className="opacity-90 mb-6 max-w-md mx-auto">Turn every meeting into resolved action items with 6 autonomous AI agents. Free forever plan available.</p>
          <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2383E2] rounded-lg font-semibold text-sm hover:bg-gray-50">
            Try QMEET Free
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <p className="text-xs text-gray-500">
            This meeting was analyzed by QMEET AI · <a href="/" className="text-[#2383E2] hover:underline font-semibold">Learn more</a>
          </p>
        </div>
      </div>
    </div>
  )
}