"use client"

import { useState } from "react"
import { Search, Filter, Award, TrendingUp, Users, Zap, BarChart3, Home, Calendar, Activity, Star, Clock, Target } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TeamPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const teamMembers = [
    { id: 1, name: "Sarah Kim", role: "Senior Designer", email: "sarah@acmecorp.com", tasks: 24, completed: 22, rate: 92, avgTime: "1.2 days", color: "bg-purple-500", topPerformer: true },
    { id: 2, name: "Mike Chen", role: "Lead Developer", email: "mike@acmecorp.com", tasks: 31, completed: 27, rate: 87, avgTime: "1.8 days", color: "bg-blue-500", topPerformer: false },
    { id: 3, name: "Priya Sharma", role: "Marketing Head", email: "priya@acmecorp.com", tasks: 18, completed: 15, rate: 83, avgTime: "2.1 days", color: "bg-pink-500", topPerformer: false },
    { id: 4, name: "John Doe", role: "Project Manager", email: "john@acmecorp.com", tasks: 42, completed: 34, rate: 81, avgTime: "1.5 days", color: "bg-emerald-500", topPerformer: false },
    { id: 5, name: "Rahul Verma", role: "DevOps Engineer", email: "rahul@acmecorp.com", tasks: 15, completed: 11, rate: 73, avgTime: "2.8 days", color: "bg-orange-500", topPerformer: false },
    { id: 6, name: "Ananya Iyer", role: "QA Engineer", email: "ananya@acmecorp.com", tasks: 28, completed: 24, rate: 86, avgTime: "1.4 days", color: "bg-teal-500", topPerformer: false }
  ]

  const filtered = teamMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex">
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
        <nav className="flex-1 p-2">
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Workspace</p>
            <a href="/" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Home className="w-3.5 h-3.5" /> Home
            </a>
            <a href="/meetings" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Calendar className="w-3.5 h-3.5" /> Meetings
            </a>
            <a href="/analytics" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </a>
            <a href="/team" className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 text-gray-900 font-medium text-[13px]">
              <Users className="w-3.5 h-3.5" /> Team
              <span className="ml-auto text-[10px] bg-white text-gray-700 px-1.5 py-0.5 rounded font-mono">{teamMembers.length}</span>
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-100 bg-white px-6 py-5">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Team Accountability</h1>
          <p className="text-xs text-gray-500">Track individual performance and reliability across your organization</p>
        </div>

        <div className="border-b border-gray-100 bg-white px-6 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search team members..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#2383E2]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(member => (
              <div key={member.id} className="p-5 bg-white rounded-lg border border-gray-200 hover:border-[#2383E2] hover:shadow-md transition-all relative">
                {member.topPerformer && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    TOP PERFORMER
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={"w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold " + member.color}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">Reliability Score</span>
                    <span className="text-lg font-bold text-gray-900">{member.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={"h-full rounded-full transition-all " + (member.rate >= 90 ? "bg-green-500" : member.rate >= 80 ? "bg-[#2383E2]" : "bg-yellow-500")} style={{ width: member.rate + "%" }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Tasks</div>
                    <div className="text-sm font-bold text-gray-900">{member.tasks}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Done</div>
                    <div className="text-sm font-bold text-green-600">{member.completed}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Avg Time</div>
                    <div className="text-sm font-bold text-gray-900">{member.avgTime}</div>
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