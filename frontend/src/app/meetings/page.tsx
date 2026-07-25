"use client"

import { useState, useEffect } from "react"
import { Search, Filter, TrendingUp, Clock, DollarSign, Users, ChevronRight, Zap, BarChart3, Target, Home, Calendar, Settings, Bell, Activity, Plus, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(API_URL + "/api/meetings/demo-user")
      setMeetings(response.data.meetings || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title?.toLowerCase().includes(search.toLowerCase())
    if (filter === "positive") return matchesSearch && m.sentiment === "positive"
    if (filter === "tense") return matchesSearch && m.sentiment === "tense"
    if (filter === "high-cost") return matchesSearch && m.meeting_cost_inr > 50000
    return matchesSearch
  })

  const totalCost = meetings.reduce((sum, m) => sum + (m.meeting_cost_inr || 0), 0)
  const avgEffectiveness = meetings.length > 0 
    ? Math.round(meetings.reduce((sum, m) => sum + (m.effectiveness_score || 0), 0) / meetings.length)
    : 0

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
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Workspace</p>
            <a href="/" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Home className="w-3.5 h-3.5" /> Home
            </a>
            <a href="/meetings" className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 text-gray-900 font-medium text-[13px]">
              <Calendar className="w-3.5 h-3.5" /> Meetings
              <span className="ml-auto text-[10px] bg-white text-gray-700 px-1.5 py-0.5 rounded font-mono">{meetings.length}</span>
            </a>
            <a href="/analytics" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </a>
            <a href="/team" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Users className="w-3.5 h-3.5" /> Team
            </a>
            <a href="/integrations" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Activity className="w-3.5 h-3.5" /> Integrations
            </a>
          </div>
        </nav>
        <div className="p-2 border-t border-gray-100">
          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2383E2] to-blue-700 flex items-center justify-center text-white text-xs font-bold">JD</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-gray-900 truncate">John Doe</div>
              <div className="text-[10px] text-gray-500 truncate">Acme Corp</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-12 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="font-medium text-gray-900">All Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/")} className="flex items-center gap-1.5 px-3 py-1 text-[12px] bg-[#2383E2] text-white rounded font-semibold hover:bg-[#1a6dc4]">
              <Plus className="w-3.5 h-3.5" />
              New meeting
            </button>
          </div>
        </header>

        {/* Header */}
        <div className="border-b border-gray-100 bg-white px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meetings Library</h1>
              <p className="text-xs text-gray-500 mt-0.5">All meetings analyzed by QMEET · {meetings.length} total</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#2383E2]" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Meetings</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{meetings.length}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Avg Effectiveness</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{avgEffectiveness}<span className="text-sm text-gray-400 font-normal">/100</span></div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-pink-600" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Cost Analyzed</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">Rs {(totalCost / 100000).toFixed(1)}L</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#2383E2] to-blue-700 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Est. Saved</span>
              </div>
              <div className="text-2xl font-bold">Rs {((totalCost * 0.4) / 100000).toFixed(1)}L</div>
              <div className="text-[10px] mt-0.5 opacity-90">40% waste eliminated</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-100 bg-white px-6 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search meetings..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#2383E2]"
            />
          </div>
          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "All" },
              { id: "positive", label: "Positive" },
              { id: "tense", label: "Tense" },
              { id: "high-cost", label: "High Cost" }
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={"px-3 py-1.5 text-xs font-medium rounded transition-colors " + (filter === f.id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meetings list */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FBFBFA]">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-[#2383E2] rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading meetings...</p>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-semibold mb-1">No meetings yet</p>
              <p className="text-sm text-gray-500 mb-4">Analyze your first meeting to get started</p>
              <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6dc4]">
                <Plus className="w-4 h-4" />
                Analyze a meeting
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMeetings.map((meeting, i) => (
                <div 
                  key={meeting.id || i} 
                  onClick={() => router.push("/dashboard/" + meeting.id)}
                  className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-[#2383E2] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={"w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 " + 
                        (meeting.sentiment === "positive" ? "bg-green-100 text-green-700" : 
                         meeting.sentiment === "tense" ? "bg-red-100 text-red-700" : 
                         "bg-blue-100 text-[#2383E2]")}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{meeting.title || "Untitled Meeting"}</h3>
                          <span className={"text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide " + 
                            (meeting.sentiment === "positive" ? "bg-green-100 text-green-700" : 
                             meeting.sentiment === "tense" ? "bg-red-100 text-red-700" : 
                             "bg-blue-100 text-blue-700")}>
                            {meeting.sentiment || "neutral"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(meeting.date || meeting.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Score</div>
                        <div className="text-lg font-bold text-gray-900">{meeting.effectiveness_score || 0}<span className="text-xs text-gray-400 font-normal">/100</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Cost</div>
                        <div className="text-lg font-bold text-gray-900">Rs {Math.round((meeting.meeting_cost_inr || 0) / 1000)}K</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#2383E2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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