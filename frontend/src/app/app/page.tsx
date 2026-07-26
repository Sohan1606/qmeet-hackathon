"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Clock, Users, Target, Zap, BarChart3, Calendar, ArrowUp, Plus, ArrowRight, AlertTriangle, CheckCircle, Award, ListTodo, RefreshCw, Inbox } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function AppHomePage() {
  const [meetings, setMeetings] = useState([])
  const [overdueItems, setOverdueItems] = useState([])
  const [graceStats, setGraceStats] = useState({ completed_on_time: 0 })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("qmeet_user")
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch (e) {}
    }
    fetchData()
    const interval = setInterval(() => fetchData(true), 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      const userId = "demo-user"
      const [meetRes, graceRes, statsRes] = await Promise.all([
        axios.get(API_URL + "/api/meetings/" + userId).catch(() => ({ data: { meetings: [] } })),
        axios.get(API_URL + "/api/grace/overdue/" + userId).catch(() => ({ data: { overdue_items: [] } })),
        axios.get(API_URL + "/api/grace/stats/" + userId).catch(() => ({ data: {} }))
      ])
      setMeetings(meetRes.data.meetings || [])
      setOverdueItems(graceRes.data.overdue_items || [])
      setGraceStats(statsRes.data || {})
      setLastUpdated(new Date())
    } catch (e) {}
    setLoading(false)
    setRefreshing(false)
  }

  const totalMeetings = meetings.length
  const pendingItemsCount = overdueItems.length
  const completedTasksCount = graceStats.completed_on_time || 0

  const uniqueOwners = new Map()
  meetings.forEach(m => {
    (m.action_items || []).forEach(item => {
      if (item.owner && item.owner !== "Unassigned") {
        if (!uniqueOwners.has(item.owner)) {
          uniqueOwners.set(item.owner, { name: item.owner, total: 0, completed: 0 })
        }
        const o = uniqueOwners.get(item.owner)
        o.total++
        if (item.status === "completed") o.completed++
      }
    })
  })

  const teamMembers = Array.from(uniqueOwners.values())
    .map(o => ({
      name: o.name,
      role: "Team Member",
      tasks: o.total,
      completed: o.completed,
      rate: o.total > 0 ? Math.round((o.completed / o.total) * 100) : 0,
      avatar: o.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      color: ["bg-purple-500", "bg-blue-500", "bg-pink-500", "bg-emerald-500", "bg-orange-500"][Math.floor(Math.random() * 5)]
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)

  const myTasks = overdueItems.slice(0, 6).map(item => ({
    priority: item.priority || "Medium",
    task: item.task,
    due: item.deadline,
    overdue: true
  }))

  const upcomingMeetings = meetings
    .filter(m => new Date(m.date || m.created_at) >= new Date())
    .slice(0, 5)
    .map(m => ({
      time: new Date(m.date || m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      title: m.title || "Untitled Meeting",
      attendees: (m.action_items || []).length || 0,
      platform: m.platform || "QMEET"
    }))

  const getTimeAgo = () => {
    if (!lastUpdated) return ""
    const s = Math.floor((new Date() - lastUpdated) / 1000)
    if (s < 60) return "just now"
    const m = Math.floor(s / 60)
    if (m < 60) return m + " min ago"
    return Math.floor(m / 60) + "h ago"
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <header className="bg-white border-b border-gray-100 h-14 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Welcome back{user?.name ? ", " + user.name.split(" ")[0] : ""}</h1>
          <p className="text-xs text-gray-500">Here's what's happening with your team today</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && <span className="text-[11px] text-gray-500">Updated {getTimeAgo()}</span>}
          <button onClick={() => fetchData()} disabled={refreshing} className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50" title="Refresh">
            <RefreshCw className={"w-3.5 h-3.5 text-gray-600 " + (refreshing ? "animate-spin" : "")} />
          </button>
        </div>
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

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#2383E2]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#2383E2]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalMeetings}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total meetings</div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <span className={"flex items-center gap-0.5 text-[10px] font-semibold " + (pendingItemsCount > 0 ? "text-orange-600" : "text-green-600")}>
                {pendingItemsCount > 0 ? "Needs attention" : "All clear"}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{pendingItemsCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">Pending action items</div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedTasksCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">Tasks completed</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-[#2383E2]" />
                  Your Action Items Today
                </h3>
                <p className="text-xs text-gray-500">{myTasks.length} {myTasks.length === 1 ? "task needs" : "tasks need"} your attention</p>
              </div>
              <button onClick={() => router.push("/app/grace")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {myTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-semibold">All caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">No overdue action items</p>
                </div>
              ) : (
                myTasks.map((task, i) => (
                  <div key={i} onClick={() => router.push("/app/grace")} className="flex items-start gap-2 p-2.5 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all">
                    <span className={"text-[9px] px-1.5 py-0.5 rounded font-semibold mt-0.5 flex-shrink-0 " + 
                      (task.priority === "High" ? "bg-red-100 text-red-700" : 
                       task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : 
                       "bg-green-100 text-green-700")}>{task.priority}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 font-medium truncate">{task.task}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-[10px] text-red-600 font-semibold">Overdue: {task.due}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-5 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Recent Meetings
                </h3>
                <p className="text-xs text-gray-500">{meetings.length} analyzed</p>
              </div>
              <button onClick={() => router.push("/app/meetings")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {meetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-semibold">No meetings yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "New Meeting" to analyze one</p>
                </div>
              ) : (
                meetings.slice(0, 5).map((m, i) => (
                  <div key={m.id || i} onClick={() => router.push("/app/meetings/" + m.id)} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all">
                    <div className={"w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 " + 
                      (m.sentiment === "positive" ? "bg-green-100 text-green-700" : 
                       m.sentiment === "tense" ? "bg-red-100 text-red-700" : 
                       "bg-blue-100 text-[#2383E2]")}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{m.title || "Untitled Meeting"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500">{new Date(m.date || m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        <span className="text-[10px] text-gray-400">·</span>
                        <span className="text-[10px] font-semibold text-gray-700">{m.effectiveness_score || 0}/100</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Team Accountability</h3>
              <p className="text-xs text-gray-500">Ranked by task completion rate</p>
            </div>
            <button onClick={() => router.push("/app/team")} className="text-xs text-[#2383E2] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-semibold">No team data yet</p>
              <p className="text-xs text-gray-400 mt-1">Team members appear here as meetings are analyzed</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
