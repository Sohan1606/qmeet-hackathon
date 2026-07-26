"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Clock, Users, Target, Zap, BarChart3, Calendar, ArrowUp, ArrowDown, Award, AlertTriangle, CheckCircle, Activity, Download, Sparkles, ShieldAlert, X, MessageSquareOff, UserX, Repeat, Timer, FileWarning } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function AnalyticsPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7days")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + "/api/meetings/demo-user")
      setMeetings(response.data.meetings || [])
    } catch (e) {}
    setLoading(false)
  }

  const rangeMultiplier = timeRange === "7days" ? 1 : timeRange === "30days" ? 4.3 : timeRange === "90days" ? 12.9 : 26
  const rangeLabel = timeRange === "7days" ? "Last 7 days" : timeRange === "30days" ? "Last 30 days" : timeRange === "90days" ? "Last 90 days" : "All time"

  const positiveCount = meetings.filter(m => m.sentiment === "positive").length
  const positiveRate = meetings.length > 0 ? Math.round((positiveCount / meetings.length) * 100) : 15
  const neutralRate = Math.max(0, 100 - positiveRate - 8)
  const tenseRate = 8

  const baseWeeklyData = [
    { day: "Mon", meetings: 12, effectiveness: 78 },
    { day: "Tue", meetings: 15, effectiveness: 82 },
    { day: "Wed", meetings: 18, effectiveness: 85 },
    { day: "Thu", meetings: 14, effectiveness: 79 },
    { day: "Fri", meetings: 8, effectiveness: 88 },
    { day: "Sat", meetings: 3, effectiveness: 90 },
    { day: "Sun", meetings: 1, effectiveness: 92 }
  ]
  const weeklyData = baseWeeklyData.map(d => ({ ...d, meetings: Math.round(d.meetings * rangeMultiplier) }))
  const maxMeetings = Math.max(...weeklyData.map(d => d.meetings))

  const totalAnalyzed = weeklyData.reduce((s, d) => s + d.meetings, 0)

  const loopholes = [
    { 
      icon: FileWarning,
      title: "No agenda set",
      count: Math.round(totalAnalyzed * 0.32),
      percentage: 32,
      severity: "high",
      description: "Meetings started without a clear agenda",
      impact: "Discussion drifts and loses focus",
      fix: "Enable agenda template for all meeting invites"
    },
    { 
      icon: Target,
      title: "No action items assigned",
      count: Math.round(totalAnalyzed * 0.24),
      percentage: 24,
      severity: "high",
      description: "Meetings ended without assigning next steps",
      impact: "Ideas discussed but nothing gets done",
      fix: "QMEET AI can auto-extract action items"
    },
    { 
      icon: UserX,
      title: "Decision maker absent",
      count: Math.round(totalAnalyzed * 0.18),
      percentage: 18,
      severity: "medium",
      description: "Meetings held without key decision maker",
      impact: "Follow-up meetings required, delays decisions",
      fix: "Check attendee list before scheduling"
    },
    { 
      icon: Timer,
      title: "Ran overtime",
      count: Math.round(totalAnalyzed * 0.28),
      percentage: 28,
      severity: "medium",
      description: "Meetings that exceeded scheduled duration",
      impact: "Disrupts next meetings and productivity",
      fix: "Set hard stops and use time-boxing"
    },
    { 
      icon: MessageSquareOff,
      title: "Silent participants",
      count: Math.round(totalAnalyzed * 0.45),
      percentage: 45,
      severity: "low",
      description: "3+ attendees didn't speak in meetings",
      impact: "Passive attendance = wasted headcount",
      fix: "Question: Do they need to be there?"
    },
    { 
      icon: Repeat,
      title: "Repeated topics",
      count: Math.round(totalAnalyzed * 0.15),
      percentage: 15,
      severity: "medium",
      description: "Same topic discussed in multiple meetings",
      impact: "Wasted cycles, unclear conclusions",
      fix: "Document decisions clearly in meeting notes"
    }
  ]

  const totalLoopholes = loopholes.reduce((s, l) => s + l.count, 0)
  const healthScore = Math.max(0, Math.min(100, 100 - Math.round((totalLoopholes / (totalAnalyzed * 6)) * 100)))

  const RADIUS = 40
  const CIRC = 2 * Math.PI * RADIUS
  const posDash = CIRC * (positiveRate / 100)
  const neuDash = CIRC * (neutralRate / 100)
  const tenDash = CIRC * (tenseRate / 100)

  const handleExport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Time Range", rangeLabel],
      ["Meeting Health Score", healthScore + "/100"],
      ["Positive Sentiment %", positiveRate + "%"],
      ["Neutral Sentiment %", neutralRate + "%"],
      ["Tense Sentiment %", tenseRate + "%"],
      [""],
      ["Day", "Meetings", "Effectiveness %"],
      ...weeklyData.map(d => [d.day, d.meetings, d.effectiveness]),
      [""],
      ["Loophole", "Count", "Percentage", "Severity", "Impact", "Fix"],
      ...loopholes.map(l => [l.title, l.count, l.percentage + "%", l.severity, l.impact, l.fix])
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "qmeet-analytics-" + timeRange + "-" + new Date().toISOString().split("T")[0] + ".csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      <header className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
            <p className="text-xs text-gray-500 mt-0.5">Deep insights into your team's meeting culture</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: "7days", label: "7 days" },
                { id: "30days", label: "30 days" },
                { id: "90days", label: "90 days" },
                { id: "all", label: "All time" }
              ].map(t => (
                <button key={t.id} onClick={() => setTimeRange(t.id)} className={"px-3 py-1 text-xs font-semibold rounded transition-colors " + (timeRange === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="col-span-2 p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Meeting Activity</h3>
                <p className="text-xs text-gray-500">{rangeLabel} - Meetings volume and effectiveness</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-blue-600"></div>
                  <span className="text-gray-600">Meetings</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-green-500"></div>
                  <span className="text-gray-600">Effectiveness</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-56 pt-4">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                    <div className="text-[10px] font-semibold text-green-600">{d.effectiveness}%</div>
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:opacity-80 transition-opacity relative group min-h-[8px]" style={{ height: Math.max(8, (d.meetings / maxMeetings) * 180) + "px" }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {d.meetings} meetings
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-500">{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Sentiment Distribution</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#F3F4F6" strokeWidth="12" />
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray={posDash + " " + CIRC} strokeDashoffset="0" />
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray={neuDash + " " + CIRC} strokeDashoffset={-posDash} />
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray={tenDash + " " + CIRC} strokeDashoffset={-(posDash + neuDash)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{positiveRate}%</span>
                <span className="text-[10px] text-gray-500">positive</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Positive</span>
                </div>
                <span className="font-semibold">{positiveRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">Neutral</span>
                </div>
                <span className="font-semibold">{neutralRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-700">Tense</span>
                </div>
                <span className="font-semibold">{tenseRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Meeting Loopholes Detected
              </h3>
              <p className="text-xs text-gray-500">Bad patterns AI detected in your meetings - {rangeLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Meeting Health</div>
                <div className={"text-lg font-bold " + (healthScore >= 80 ? "text-green-600" : healthScore >= 60 ? "text-yellow-600" : "text-red-600")}>{healthScore}/100</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">FIX THESE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loopholes.map((lh, i) => {
              const Icon = lh.icon
              const severityColor = lh.severity === "high" ? "border-red-200 bg-red-50" : lh.severity === "medium" ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50"
              const iconColor = lh.severity === "high" ? "text-red-600 bg-red-100" : lh.severity === "medium" ? "text-yellow-600 bg-yellow-100" : "text-gray-600 bg-gray-100"
              const badgeColor = lh.severity === "high" ? "bg-red-100 text-red-700" : lh.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
              return (
                <div key={i} className={"p-4 rounded-lg border-2 " + severityColor}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + iconColor}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-gray-900">{lh.title}</h4>
                        <span className={"text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase " + badgeColor}>{lh.severity}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mb-2">{lh.description}</p>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-gray-900">{lh.count}</span>
                        <span className="text-xs text-gray-500">meetings ({lh.percentage}%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/60 space-y-1">
                    <p className="text-[10px] text-gray-700"><strong>Impact:</strong> {lh.impact}</p>
                    <div className="flex items-start gap-1 mt-1">
                      <Sparkles className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-900"><strong>Fix:</strong> {lh.fix}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                AI Insights
              </h3>
              <p className="text-xs text-gray-500">Actionable recommendations from your meeting data</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">POWERED BY AI</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Fridays are 40% more productive</p>
                  <p className="text-[11px] text-gray-600">Schedule important meetings on Fridays for best outcomes</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Rahul is overloaded</p>
                  <p className="text-[11px] text-gray-600">15 tasks, 73% completion. Consider redistributing 3 tasks</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Async opportunity found</p>
                  <p className="text-[11px] text-gray-600">40% of Monday meetings could be async emails</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Sarah is top performer</p>
                  <p className="text-[11px] text-gray-600">92% completion rate. Consider promoting to team lead</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
