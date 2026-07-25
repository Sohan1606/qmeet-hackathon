"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Clock, DollarSign, Users, Target, Zap, BarChart3, Calendar, ArrowUp, ArrowDown, Plus, ArrowRight, AlertTriangle, CheckCircle, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function AppHomePage() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("qmeet_user")
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch (e) {}
    }
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

  const teamMembers = [
    { name: "Sarah Kim", role: "Senior Designer", tasks: 24, completed: 22, rate: 92, avatar: "SK", color: "bg-purple-500" },
    { name: "Mike Chen", role: "Lead Developer", tasks: 31, completed: 27, rate: 87, avatar: "MC", color: "bg-blue-500" },
    { name: "Priya Sharma", role: "Marketing Head", tasks: 18, completed: 15, rate: 83, avatar: "PS", color: "bg-pink-500" },
    { name: "John Doe", role: "Project Manager", tasks: 42, completed: 34, rate: 81, avatar: "JD", color: "bg-emerald-500" },
    { name: "Rahul Verma", role: "DevOps Engineer", tasks: 15, completed: 11, rate: 73, avatar: "RV", color: "bg-orange-500" }
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <header className="bg-white border-b border-gray-100 h-14 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Welcome back{user?.name ? ", " + user.name.split(" ")[0] : ""}</h1>
          <p className="text-xs text-gray-500">Here's what's happening with your team today</p>
        </div>
        <button onClick={() => router.push("/")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2383E2] text-white rounded text-[12px] font-semibold hover:bg-[#1a6dc4]">
          <Plus className="w-3.5 h-3.5" />
          Analyze new meeting
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-[#FBFBFA]">
        
        {totalMeetings === 0 && !loading && (
          <div className="mb-6 p-6 bg-gradient-to-br from-[#2383E2] to-blue-700 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Analyze your first meeting</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">See how QMEETs 6 AI agents extract action items and automate follow-ups in under 30 seconds.</p>
                <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#2383E2] rounded-lg text-sm font-semibold hover:bg-gray-50">
                  <Plus className="w-4 h-4" />
                  Start with sample meeting
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#2383E2]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#2383E2]" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
                <ArrowUp className="w-3 h-3" />+23%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalMeetings || 0}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total meetings</div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
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
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
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
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2383E2] to-blue-700 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-semibold">+40%</span>
            </div>
            <div className="text-2xl font-bold">Rs {((totalCost || 3420000) * 0.4 / 100000).toFixed(1)}L</div>
            <div className="text-xs opacity-90 mt-0.5">Cost saved</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Recent Meetings</h3>
                <p className="text-xs text-gray-500">Your latest analyzed meetings</p>
              </div>
              <button onClick={() => router.push("/app/meetings")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8"><div className="w-6 h-6 border-2 border-blue-200 border-t-[#2383E2] rounded-full animate-spin mx-auto"></div></div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No meetings analyzed yet</p>
                <button onClick={() => router.push("/")} className="inline-flex items-center gap-1 text-xs text-[#2383E2] font-semibold hover:underline">
                  <Plus className="w-3 h-3" />
                  Analyze your first meeting
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {meetings.slice(0, 5).map((m, i) => (
                  <div key={m.id || i} onClick={() => router.push("/app/meetings/" + m.id)} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer group">
                    <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + 
                      (m.sentiment === "positive" ? "bg-green-100 text-green-700" : 
                       m.sentiment === "tense" ? "bg-red-100 text-red-700" : 
                       "bg-blue-100 text-[#2383E2]")}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{m.title || "Untitled Meeting"}</div>
                      <div className="text-xs text-gray-500">{new Date(m.date || m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · Rs {Math.round((m.meeting_cost_inr || 0) / 1000)}K</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{m.effectiveness_score || 0}<span className="text-xs text-gray-400">/100</span></div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2383E2]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#2383E2]" />
                  AI Insights
                </h3>
                <p className="text-xs text-gray-500">This week</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#2383E2] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">Fridays are 40% more productive for your team</p>
                </div>
              </div>
              <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">Rahul has 15 pending tasks — consider redistributing</p>
                </div>
              </div>
              <div className="p-2.5 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">Save Rs 45,000/mo by making Monday standups async</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Team Accountability</h3>
              <p className="text-xs text-gray-500">Ranked by completion rate</p>
            </div>
            <button onClick={() => router.push("/app/team")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {teamMembers.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="text-xs font-bold text-gray-400 w-4">{i + 1}</div>
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold " + member.color}>{member.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 truncate">{member.name}</span>
                    <span className="text-xs font-bold text-gray-700">{member.rate}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={"h-full rounded-full " + (member.rate >= 90 ? "bg-green-500" : member.rate >= 80 ? "bg-[#2383E2]" : "bg-yellow-500")} style={{ width: member.rate + "%" }}></div>
                    </div>
                    <span className="text-[10px] text-gray-500">{member.completed}/{member.tasks}</span>
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