"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Flame, ArrowLeft, ArrowUpRight, ArrowUp } from "lucide-react"
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
    } catch (e) {}
    setLoading(false)
  }

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title?.toLowerCase().includes(search.toLowerCase())
    if (filter === "positive") return matchesSearch && m.sentiment === "positive"
    if (filter === "tense") return matchesSearch && m.sentiment === "tense"
    if (filter === "low-score") return matchesSearch && (m.effectiveness_score || 0) < 60
    return matchesSearch
  })

  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const thisWeekMeetings = meetings.filter(m => {
    const d = new Date(m.date || m.created_at)
    return d >= oneWeekAgo && d <= now
  }).length

  const lastWeekMeetings = meetings.filter(m => {
    const d = new Date(m.date || m.created_at)
    return d >= twoWeeksAgo && d < oneWeekAgo
  }).length

  const weekChange = lastWeekMeetings > 0 
    ? Math.round(((thisWeekMeetings - lastWeekMeetings) / lastWeekMeetings) * 100)
    : (thisWeekMeetings > 0 ? 100 : 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Meetings Library</h1>
            <p className="text-xs text-gray-500 mt-0.5">All meetings analyzed by QMEET - {meetings.length} total</p>
          </div>
          <button onClick={() => router.push("/app")} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded text-[12px] font-semibold hover:bg-gray-700">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#2383E2]" />
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Meetings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{meetings.length}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">All time</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">This Week</span>
              </div>
              {weekChange !== 0 && (
                <span className={"flex items-center gap-0.5 text-[10px] font-semibold " + (weekChange > 0 ? "text-green-600" : "text-red-600")}>
                  <ArrowUp className={"w-3 h-3 " + (weekChange < 0 ? "rotate-180" : "")} />
                  {weekChange > 0 ? "+" : ""}{weekChange}%
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">{thisWeekMeetings}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">vs {lastWeekMeetings} last week</div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white px-6 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search meetings..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#2383E2]" />
        </div>
        <div className="flex items-center gap-1">
          {[{ id: "all", label: "All" }, { id: "positive", label: "Positive" }, { id: "tense", label: "Tense" }, { id: "low-score", label: "Low Score" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={"px-3 py-1.5 text-xs font-medium rounded transition-colors " + (filter === f.id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

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
            <p className="text-sm text-gray-500">Use the New Meeting button in the sidebar to analyze one</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMeetings.map((meeting, i) => (
              <div key={meeting.id || i} onClick={() => router.push("/app/meetings/" + meeting.id)} className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-[#2383E2] hover:shadow-md transition-all cursor-pointer">
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
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#2383E2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
