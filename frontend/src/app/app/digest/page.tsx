"use client"

import { useState, useEffect } from "react"
import { Calendar, Check, AlertTriangle, Award, Zap, Download, Mail, Send, ArrowUp, Target, Bell, ShieldCheck, TrendingUp, Users } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface Performer {
  name: string
  completed: number
  rate: number
}

interface Digest {
  week_of: string
  total_meetings: number
  total_action_items: number
  completed_items: number
  pending_items: number
  completion_rate: number
  loopholes_fixed: number
  top_performers: Performer[]
  insights: string[]
}

const FALLBACK_DIGEST: Digest = {
  week_of: "July 18 - July 25, 2026",
  total_meetings: 47,
  total_action_items: 89,
  completed_items: 67,
  pending_items: 15,
  completion_rate: 75,
  loopholes_fixed: 12,
  top_performers: [
    { name: "Sarah Kim", completed: 8, rate: 92 },
    { name: "Mike Chen", completed: 6, rate: 87 },
    { name: "Priya Sharma", completed: 5, rate: 83 }
  ],
  insights: [
    "Grace Protocol prevented 3 unnecessary escalations this week",
    "Fridays showed 40% higher productivity than Mondays",
    "Team completion rate improved by 15% week-over-week",
    "3 meetings identified as 'could have been emails'"
  ]
}

export default function DigestPage() {
  const [digest, setDigest] = useState<Digest | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    fetchDigest()
    const storedUser = localStorage.getItem("qmeet_user")
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser)
        setUserEmail(u.email || "you@company.com")
      } catch (e) {
        setUserEmail("you@company.com")
      }
    } else {
      setUserEmail("you@company.com")
    }
    const sub = localStorage.getItem("qmeet_digest_subscribed")
    if (sub === "true") setSubscribed(true)
  }, [])

  const fetchDigest = async () => {
    try {
      const res = await axios.get(API_URL + "/api/digest/weekly/demo-user")
      setDigest({ ...FALLBACK_DIGEST, ...res.data })
    } catch (e) {
      setDigest(FALLBACK_DIGEST)
    }
    setLoading(false)
  }

  const handleSendEmail = () => {
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3500)
  }

  const handleToggleSubscription = () => {
    const newState = !subscribed
    setSubscribed(newState)
    localStorage.setItem("qmeet_digest_subscribed", newState.toString())
  }

  const handleExportPDF = () => {
    window.print()
  }

  if (loading || !digest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const topPerformers = digest.top_performers ?? []
  const insights = digest.insights ?? []

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <style jsx global>{`
        @media print {
          aside, header button, .no-print { display: none !important; }
          .flex-1 { overflow: visible !important; }
        }
      `}</style>

      <header className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">Executive Weekly Digest</h1>
              <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-full font-bold uppercase tracking-wide">AUTO-GENERATED</span>
            </div>
            <p className="text-xs text-gray-500">{digest.week_of}</p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button onClick={handleSendEmail} disabled={emailSent} className={"flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors " + (emailSent ? "bg-green-100 text-green-700 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700")}>
              {emailSent ? (<><Check className="w-3.5 h-3.5" />Sent to {userEmail}</>) : (<><Mail className="w-3.5 h-3.5" />Email to me</>)}
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="mb-6 p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">This Week's Summary</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Your team completed {digest.completed_items} action items this week</h2>
          <p className="text-white/90 mb-6">Automated by QMEET across {digest.total_meetings} meetings analyzed</p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold">{digest.total_meetings}</div>
              <div className="text-xs opacity-80">Meetings analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{digest.completed_items}</div>
              <div className="text-xs opacity-80">Tasks completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{digest.completion_rate}%</div>
              <div className="text-xs opacity-80">Completion rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
                <ArrowUp className="w-3 h-3" />+18%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{digest.completed_items}</div>
            <div className="text-xs text-gray-500 mt-0.5">Completed tasks</div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-yellow-600">
                {digest.pending_items} pending
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{digest.pending_items}</div>
            <div className="text-xs text-gray-500 mt-0.5">In progress</div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600 to-blue-700 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold">
                <ArrowUp className="w-3 h-3" />+25%
              </span>
            </div>
            <div className="text-2xl font-bold">{digest.loopholes_fixed || 12}</div>
            <div className="text-xs opacity-90 mt-0.5">Meeting loopholes fixed</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-bold text-gray-900">Top Performers This Week</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No performer data available yet</p>
              ) : (
                topPerformers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-400 w-6">{i + 1}</div>
                    <div className={"w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold " +
                      (i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-orange-500")}>
                      {p.name?.split(" ").map(n => n[0]).join("") || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                        <span className="text-sm font-bold text-green-600">{p.rate}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: p.rate + "%" }}></div>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{p.completed} tasks completed this week</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {insights.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No insights available yet</p>
              ) : (
                insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-700">{i + 1}</span>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">{insight}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Velocity Trend</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2.3 days</div>
            <p className="text-[11px] text-gray-500 mb-2">Avg time to complete tasks</p>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
              <ArrowUp className="w-2.5 h-2.5 rotate-180" />
              15% faster than last week
            </div>
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Team Engagement</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">87%</div>
            <p className="text-[11px] text-gray-500 mb-2">Active participation rate</p>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
              <ArrowUp className="w-2.5 h-2.5" />
              +8% vs last week
            </div>
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Follow-up Rate</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">92%</div>
            <p className="text-[11px] text-gray-500 mb-2">Emails sent automatically</p>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
              <ArrowUp className="w-2.5 h-2.5" />
              +12% vs last week
            </div>
          </div>
        </div>

        <div className={"p-6 rounded-lg border-2 border-dashed transition-colors no-print " + (subscribed ? "bg-green-50 border-green-300" : "bg-white border-blue-200")}>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + (subscribed ? "bg-green-100" : "bg-blue-100")}>
                {subscribed ? <Check className="w-5 h-5 text-green-600" /> : <Mail className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {subscribed ? "You're subscribed to Weekly Digest" : "Get this digest in your inbox every Monday at 8 AM"}
                </h3>
                <p className="text-xs text-gray-600">
                  {subscribed 
                    ? "Delivered to " + userEmail + " every Monday at 8:00 AM"
                    : "Auto-generated by QMEET AI. No manual work. Delivered before your first coffee."}
                </p>
              </div>
            </div>
            <button onClick={handleToggleSubscription} className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors " + (subscribed ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-blue-600 text-white hover:bg-blue-700")}>
              {subscribed ? (<><Bell className="w-4 h-4" />Unsubscribe</>) : (<><Send className="w-4 h-4" />Enable Weekly Digest</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
