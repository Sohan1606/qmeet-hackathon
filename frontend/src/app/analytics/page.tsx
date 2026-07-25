"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Clock, DollarSign, Users, Target, Zap, BarChart3, Home, Calendar, Bell, Activity, Award, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Plus, Settings, Search, ArrowRight, MessageSquare, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function AnalyticsPage() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("qmeet_user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    try { setUser(JSON.parse(storedUser)) } catch (e) {}
    fetchData()
  }, [router])

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

  const teamMembers = [
    { name: "Sarah Kim", role: "Senior Designer", tasks: 24, completed: 22, rate: 92, avatar: "SK", color: "bg-purple-500" },
    { name: "Mike Chen", role: "Lead Developer", tasks: 31, completed: 27, rate: 87, avatar: "MC", color: "bg-blue-500" },
    { name: "Priya Sharma", role: "Marketing Head", tasks: 18, completed: 15, rate: 83, avatar: "PS", color: "bg-pink-500" },
    { name: "John Doe", role: "Project Manager", tasks: 42, completed: 34, rate: 81, avatar: "JD", color: "bg-emerald-500" },
    { name: "Rahul Verma", role: "DevOps Engineer", tasks: 15, completed: 11, rate: 73, avatar: "RV", color: "bg-orange-500" }
  ]

  const weeklyData = [
    { day: "Mon", meetings: 12, effectiveness: 78 },
    { day: "Tue", meetings: 15, effectiveness: 82 },
    { day: "Wed", meetings: 18, effectiveness: 85 },
    { day: "Thu", meetings: 14, effectiveness: 79 },
    { day: "Fri", meetings: 8, effectiveness: 88 },
    { day: "Sat", meetings: 3, effectiveness: 90 },
    { day: "Sun", meetings: 1, effectiveness: 92 }
  ]
  const maxMeetings = Math.max(...weeklyData.map(d => d.meetings))

  const handleSignOut = () => {
    localStorage.removeItem("qmeet_user")
    localStorage.removeItem("qmeet_intro_ever_shown")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex">
      
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[14px] font-semibold text-gray-900">QMEET</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-[#2383E2] rounded font-semibold ml-auto">Pro</span>
          </div>
        </div>

        {/* NEW MEETING BUTTON - Prominent */}
        <div className="p-3">
          <button onClick={() => router.push("/")} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2383E2] text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a6dc4] transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Analyze New Meeting
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Workspace</p>
            <a href="/analytics" className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 text-gray-900 font-medium text-[13px]">
              <BarChart3 className="w-3.5 h-3.5" /> Dashboard
            </a>
            <a href="/meetings" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Calendar className="w-3.5 h-3.5" /> Meetings
              <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{totalMeetings}</span>
            </a>
            <a href="/team" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Users className="w-3.5 h-3.5" /> Team
            </a>
            <a href="/integrations" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Activity className="w-3.5 h-3.5" /> Integrations
            </a>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Account</p>
            <a href="/settings" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Settings className="w-3.5 h-3.5" /> Settings
            </a>
            <a href="/contact" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <MessageSquare className="w-3.5 h-3.5" /> Help & Support
            </a>
          </div>
        </nav>

        <div className="p-2 border-t border-gray-100">
          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2383E2] to-blue-700 flex items-center justify-center text-white text-xs font-bold">
              {user.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-gray-900 truncate">{user.name || "User"}</div>
              <div className="text-[10px] text-gray-500 truncate">{user.company || "QMEET"}</div>
            </div>
            <button onClick={handleSignOut} className="text-gray-400 hover:text-red-600" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-14 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Welcome back, {user.name?.split(" ")[0] || "there"}</h1>
            <p className="text-xs text-gray-500">Here's what's happening with your team today</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search meetings..." className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded w-56 focus:outline-none focus:border-[#2383E2]" />
            </div>
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><Bell className="w-4 h-4" /></button>
            <button onClick={() => router.push("/")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2383E2] text-white rounded text-[12px] font-semibold hover:bg-[#1a6dc4]">
              <Plus className="w-3.5 h-3.5" />
              New meeting
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-[#FBFBFA]">
          
          {/* Get Started Banner - if no meetings yet */}
          {totalMeetings === 0 && !loading && (
            <div className="mb-6 p-6 bg-gradient-to-br from-[#2383E2] to-blue-700 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5" />
                    <h3 className="text-lg font-bold">Analyze your first meeting</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-4">See how QMEET's 6 AI agents extract action items and automate follow-ups in under 30 seconds.</p>
                  <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#2383E2] rounded-lg text-sm font-semibold hover:bg-gray-50">
                    <Plus className="w-4 h-4" />
                    Start with sample meeting
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="text-6xl">🎯</div>
                </div>
              </div>
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#2383E2]/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#2383E2]" />
                </div>
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
                  <ArrowUp className="w-3 h-3" />+23%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalMeetings || 0}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total meetings analyzed</div>
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
              <div className="text-xs text-gray-500 mt-0.5">Meeting cost analyzed</div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-[#2383E2] to-blue-700 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-white/90">
                  <ArrowUp className="w-3 h-3" />+40%
                </span>
              </div>
              <div className="text-2xl font-bold">Rs {((totalCost || 3420000) * 0.4 / 100000).toFixed(1)}L</div>
              <div className="text-xs opacity-90 mt-0.5">Cost saved by QMEET</div>
            </div>
          </div>

          {/* Recent Meetings + AI Insights */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            
            {/* Recent Meetings */}
            <div className="col-span-2 p-5 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Recent Meetings</h3>
                  <p className="text-xs text-gray-500">Your latest analyzed meetings</p>
                </div>
                <button onClick={() => router.push("/meetings")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
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
                    <div key={m.id || i} onClick={() => router.push("/dashboard/" + m.id)} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer group">
                      <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + 
                        (m.sentiment === "positive" ? "bg-green-100 text-green-700" : 
                         m.sentiment === "tense" ? "bg-red-100 text-red-700" : 
                         "bg-blue-100 text-[#2383E2]")}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{m.title || "Untitled Meeting"}</div>
                        <div className="text-xs text-gray-500">{new Date(m.date || m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · Rs {Math.round((m.meeting_cost_inr || 0) / 1000)}K cost</div>
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

            {/* AI Insights */}
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

          {/* Charts */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-2 p-5 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Meeting Activity</h3>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-40 pt-4">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                      <div className="text-[10px] font-semibold text-gray-600">{d.effectiveness}%</div>
                      <div className="w-full bg-gradient-to-t from-[#2383E2] to-blue-400 rounded-t" style={{ height: (d.meetings / maxMeetings * 100) + "%" }}></div>
                    </div>
                    <div className="text-[10px] font-semibold text-gray-500">{d.day}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Sentiment</h3>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - positiveRate / 100)} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{positiveRate}%</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500">Positive meetings</div>
            </div>
          </div>

          {/* Team Leaderboard */}
          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Team Accountability</h3>
                <p className="text-xs text-gray-500">Ranked by completion rate</p>
              </div>
              <button onClick={() => router.push("/team")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
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
    </div>
  )
}