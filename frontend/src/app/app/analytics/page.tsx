"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Clock, DollarSign, Users, Target, Zap, BarChart3, Calendar, ArrowUp, ArrowDown, Award, AlertTriangle, CheckCircle, Activity, Download, Filter } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function AnalyticsPage() {
  const [meetings, setMeetings] = useState([])
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

  const totalMeetings = meetings.length
  const totalCost = meetings.reduce((sum, m) => sum + (m.meeting_cost_inr || 0), 0)
  const avgScore = totalMeetings > 0 ? Math.round(meetings.reduce((sum, m) => sum + (m.effectiveness_score || 0), 0) / totalMeetings) : 82
  const positiveCount = meetings.filter(m => m.sentiment === "positive").length
  const positiveRate = totalMeetings > 0 ? Math.round((positiveCount / totalMeetings) * 100) : 68

  const weeklyData = [
    { day: "Mon", meetings: 12, effectiveness: 78, cost: 342000 },
    { day: "Tue", meetings: 15, effectiveness: 82, cost: 425000 },
    { day: "Wed", meetings: 18, effectiveness: 85, cost: 512000 },
    { day: "Thu", meetings: 14, effectiveness: 79, cost: 398000 },
    { day: "Fri", meetings: 8, effectiveness: 88, cost: 228000 },
    { day: "Sat", meetings: 3, effectiveness: 90, cost: 85000 },
    { day: "Sun", meetings: 1, effectiveness: 92, cost: 28000 }
  ]
  const maxMeetings = Math.max(...weeklyData.map(d => d.meetings))

  const teamMembers = [
    { name: "Sarah Kim", role: "Senior Designer", tasks: 24, completed: 22, rate: 92, avatar: "SK", color: "bg-purple-500" },
    { name: "Mike Chen", role: "Lead Developer", tasks: 31, completed: 27, rate: 87, avatar: "MC", color: "bg-blue-500" },
    { name: "Priya Sharma", role: "Marketing Head", tasks: 18, completed: 15, rate: 83, avatar: "PS", color: "bg-pink-500" },
    { name: "John Doe", role: "Project Manager", tasks: 42, completed: 34, rate: 81, avatar: "JD", color: "bg-emerald-500" },
    { name: "Rahul Verma", role: "DevOps Engineer", tasks: 15, completed: 11, rate: 73, avatar: "RV", color: "bg-orange-500" }
  ]

  const departments = [
    { name: "Engineering", meetings: 42, cost: 1440000, color: "bg-blue-600" },
    { name: "Marketing", meetings: 23, cost: 780000, color: "bg-purple-600" },
    { name: "Sales", meetings: 18, cost: 620000, color: "bg-pink-600" },
    { name: "Design", meetings: 12, cost: 410000, color: "bg-orange-600" },
    { name: "Operations", meetings: 5, cost: 170000, color: "bg-teal-600" }
  ]
  const maxCost = Math.max(...departments.map(d => d.cost))

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
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
                <ArrowUp className="w-3 h-3" />+23%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalMeetings || 71}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total meetings</div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "72%" }}></div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
                <ArrowUp className="w-3 h-3" />+12%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{avgScore}<span className="text-sm text-gray-400 font-normal">/100</span></div>
            <div className="text-xs text-gray-500 mt-0.5">Avg effectiveness</div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: avgScore + "%" }}></div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-pink-600" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-600">
                <ArrowDown className="w-3 h-3" />-8%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">Rs {((totalCost || 3420000) / 100000).toFixed(1)}L</div>
            <div className="text-xs text-gray-500 mt-0.5">Meeting cost</div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold">
                <ArrowUp className="w-3 h-3" />+40%
              </span>
            </div>
            <div className="text-2xl font-bold">Rs {((totalCost || 3420000) * 0.4 / 100000).toFixed(1)}L</div>
            <div className="text-xs opacity-90 mt-0.5">Cost saved by QMEET</div>
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "40%" }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="col-span-2 p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Meeting Activity</h3>
                <p className="text-xs text-gray-500">Last 7 days - Meetings volume and effectiveness</p>
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
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                    <div className="text-[10px] font-semibold text-gray-600">{d.effectiveness}%</div>
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:opacity-80 transition-opacity relative group" style={{ height: (d.meetings / maxMeetings * 100) + "%" }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <div>{d.meetings} meetings</div>
                        <div className="text-[9px] opacity-80">Rs {(d.cost / 1000).toFixed(0)}K cost</div>
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
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - positiveRate / 100)} strokeLinecap="round" />
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
                <span className="font-semibold">{100 - positiveRate - 8}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-700">Tense</span>
                </div>
                <span className="font-semibold">8%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Cost by Department</h3>
                <p className="text-xs text-gray-500">Meeting cost breakdown this quarter</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Total</div>
                <div className="text-lg font-bold text-gray-900">Rs 34.2L</div>
              </div>
            </div>
            <div className="space-y-3">
              {departments.map((dept, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className={"w-2 h-2 rounded-full " + dept.color}></div>
                      <span className="font-semibold text-gray-900">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{dept.meetings} meetings</span>
                      <span className="font-bold text-gray-900">Rs {(dept.cost / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={"h-full rounded-full " + dept.color} style={{ width: (dept.cost / maxCost * 100) + "%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  AI Insights
                </h3>
                <p className="text-xs text-gray-500">Actionable recommendations</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">POWERED BY AI</span>
            </div>
            <div className="space-y-2">
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
                    <p className="text-xs font-semibold text-gray-900 mb-1">Save Rs 45,000/month</p>
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

        <div className="p-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Team Accountability Leaderboard</h3>
              <p className="text-xs text-gray-500">Ranked by task completion rate</p>
            </div>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-2">
            {teamMembers.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-xs font-bold text-gray-400 w-4">{i + 1}</div>
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold " + member.color}>{member.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs font-semibold text-gray-900">{member.name}</span>
                      <span className="text-[10px] text-gray-500 ml-2">{member.role}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{member.rate}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={"h-full rounded-full " + (member.rate >= 90 ? "bg-green-500" : member.rate >= 80 ? "bg-blue-600" : "bg-yellow-500")} style={{ width: member.rate + "%" }}></div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{member.completed}/{member.tasks} tasks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}