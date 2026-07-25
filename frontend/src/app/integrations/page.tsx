"use client"

import { Zap, BarChart3, Home, Calendar, Users, Activity, Check, Clock, Slack, Github, Mail } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    { name: "Slack", desc: "Send tasks as DMs, mark done from Slack", status: "coming-q2", category: "Communication", color: "bg-purple-500" },
    { name: "Microsoft Teams", desc: "Native Teams bot for meeting analysis", status: "coming-q2", category: "Communication", color: "bg-blue-600" },
    { name: "Google Meet", desc: "Auto-join meetings via Recall.ai", status: "coming-q2", category: "Meetings", color: "bg-red-500" },
    { name: "Zoom", desc: "Recording bot with real-time analysis", status: "coming-q3", category: "Meetings", color: "bg-blue-500" },
    { name: "Jira", desc: "Auto-create tickets from action items", status: "coming-q2", category: "Task Management", color: "bg-blue-700" },
    { name: "Linear", desc: "Two-way sync with issues and cycles", status: "coming-q2", category: "Task Management", color: "bg-gray-900" },
    { name: "Asana", desc: "Task creation and completion tracking", status: "coming-q3", category: "Task Management", color: "bg-pink-500" },
    { name: "Google Calendar", desc: "Auto-detect and analyze all meetings", status: "coming-q2", category: "Calendar", color: "bg-blue-500" },
    { name: "Outlook", desc: "Enterprise calendar integration", status: "coming-q3", category: "Calendar", color: "bg-blue-700" },
    { name: "Notion", desc: "Sync meeting notes to Notion pages", status: "coming-q3", category: "Docs", color: "bg-gray-900" },
    { name: "Salesforce", desc: "Log meeting outcomes to CRM", status: "coming-q4", category: "CRM", color: "bg-blue-600" },
    { name: "HubSpot", desc: "Sales meeting intelligence", status: "coming-q4", category: "CRM", color: "bg-orange-500" }
  ]

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
            <a href="/team" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Users className="w-3.5 h-3.5" /> Team
            </a>
            <a href="/integrations" className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 text-gray-900 font-medium text-[13px]">
              <Activity className="w-3.5 h-3.5" /> Integrations
            </a>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-100 bg-white px-6 py-5">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Integrations & Roadmap</h1>
          <p className="text-xs text-gray-500">Connect QMEET with the tools your team already uses</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Grace Protocol callout */}
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">The Grace Protocol</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full font-bold">EXCLUSIVE</span>
                </div>
                <p className="text-sm opacity-90 mb-3">When a deadline is missed, QMEET doesn't snitch to your manager. It asks YOU first: "Are you blocked?" — then redirects the issue autonomously.</p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Empathetic AI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Removes blockers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Manager only if needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Coming Soon</h3>
            <span className="text-xs text-gray-500">12 integrations planned</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((int, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#2383E2] hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className={"w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm " + int.color}>
                    {int.name[0]}
                  </div>
                  <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + 
                    (int.status === "coming-q2" ? "bg-blue-100 text-[#2383E2]" : 
                     int.status === "coming-q3" ? "bg-purple-100 text-purple-700" : 
                     "bg-gray-100 text-gray-600")}>
                    {int.status === "coming-q2" ? "Q2 2026" : int.status === "coming-q3" ? "Q3 2026" : "Q4 2026"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{int.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{int.desc}</p>
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{int.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}