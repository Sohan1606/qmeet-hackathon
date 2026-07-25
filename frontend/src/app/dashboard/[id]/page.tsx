"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, AlertTriangle, Send, TrendingUp, Zap, FileText, ChevronRight, Check, MessageSquare, BarChart3, DollarSign, Users, Home, Calendar, Settings, Bell, Search, Target, Activity } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function DashboardPage({ params }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [result, setResult] = useState(null)
  const [actionItems, setActionItems] = useState([])
  const [sendingEmails, setSendingEmails] = useState(false)
  const [emailsSent, setEmailsSent] = useState(false)
  const [emailInput, setEmailInput] = useState({})
  const [meetingId, setMeetingId] = useState("")

  useEffect(() => {
    if (params && params.then) {
      params.then(p => setMeetingId(p.id))
    } else if (params && params.id) {
      setMeetingId(params.id)
    }
  }, [params])

  useEffect(() => {
    const stored = localStorage.getItem("qmeet_result") || localStorage.getItem("nexus_result")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setResult(data)
        const items = (data.extraction?.action_items || []).map((item, i) => ({
          ...item,
          id: item.db_id || "item-" + i,
          status: "pending"
        }))
        setActionItems(items)
        const emailMap = {}
        items.forEach((item) => {
          if (item.owner && item.owner !== "Unassigned") emailMap[item.owner] = item.owner_email || ""
        })
        setEmailInput(emailMap)
      } catch (e) {}
    }
  }, [])

  const updateItemStatus = async (itemId, newStatus) => {
    setActionItems(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item))
    try {
      if (itemId.includes("-") && !itemId.startsWith("item-")) {
        await axios.patch(API_URL + "/api/action-items/" + itemId, { status: newStatus })
      }
    } catch (e) {}
  }

  const sendAllEmails = async () => {
    if (!result) return
    setSendingEmails(true)
    const emails = result.communication?.emails_prepared || []
    for (const email of emails) {
      const ownerEmail = emailInput[email.owner] || email.owner.toLowerCase().replace(/\s/g, ".") + "@example.com"
      try {
        await axios.post(API_URL + "/api/send-email", {
          owner: email.owner,
          email_to: ownerEmail,
          email_html: email.email_html,
          email_text: email.email_text,
          subject: email.subject,
          meeting_id: meetingId
        })
        setActionItems(prev => prev.map(item => item.owner === email.owner ? { ...item, status: "follow-up-sent" } : item))
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (e) {}
    }
    setSendingEmails(false)
    setEmailsSent(true)
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-[#2383E2] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const summary = result.summary || {}
  const analysis = result.analysis || {}
  const extraction = result.extraction || {}
  const effectiveness = analysis.meeting_effectiveness || {}
  const sentiment = analysis.sentiment_analysis || {}
  const meetingCost = analysis.meeting_cost || {}
  const riskAssessment = analysis.risk_assessment || {}
  const meetingSummary = analysis.meeting_summary || {}
  const communication = result.communication || {}

  const completedItems = actionItems.filter(i => i.status === "completed").length
  const inProgressItems = actionItems.filter(i => i.status === "in-progress").length
  const pendingItems = actionItems.filter(i => i.status === "pending").length

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
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 text-gray-900 font-medium text-[13px]">
              <Home className="w-3.5 h-3.5" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Calendar className="w-3.5 h-3.5" /> Meetings
              <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">12</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Target className="w-3.5 h-3.5" /> Action Items
              <span className="ml-auto text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono">3</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Users className="w-3.5 h-3.5" /> Team
            </a>
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Activity className="w-3.5 h-3.5" /> Analytics
            </a>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Account</p>
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]">
              <Settings className="w-3.5 h-3.5" /> Settings
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
        
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-12 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-gray-500">Meetings</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-medium text-gray-900">Q3 Product Launch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input placeholder="Search..." className="pl-8 pr-3 py-1 text-[12px] border border-gray-200 rounded w-56 focus:outline-none focus:border-[#2383E2]" />
            </div>
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Meeting Title & Action */}
        <div className="border-b border-gray-100 bg-white px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-gray-900">Q3 Product Launch Meeting</h1>
                <span className={"text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide " + (sentiment.overall === "positive" ? "bg-green-100 text-green-700" : sentiment.overall === "tense" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700")}>
                  {sentiment.overall || "neutral"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · 5 participants · {meetingCost.estimated_duration_minutes || 30} minutes
              </p>
            </div>
            <button onClick={sendAllEmails} disabled={sendingEmails || emailsSent} className={"flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-semibold shadow-sm transition-all " + (emailsSent ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#2383E2] text-white hover:bg-[#1a6dc4]") + " disabled:opacity-60"}>
              {sendingEmails ? (<><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Sending...</>) : emailsSent ? (<><Check className="w-3.5 h-3.5" />Emails Sent</>) : (<><Send className="w-3.5 h-3.5" />Send Follow-ups ({communication.total_emails || 0})</>)}
            </button>
          </div>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-6 border-b border-gray-100 bg-white">
          {[
            { label: "Action items", value: summary.action_items_found || 0, icon: Target, color: "text-[#2383E2]" },
            { label: "Decisions", value: summary.decisions_made || 0, icon: Zap, color: "text-blue-600" },
            { label: "Open questions", value: summary.open_questions || 0, icon: MessageSquare, color: "text-yellow-600" },
            { label: "Effectiveness", value: (effectiveness.score || 0) + "/100", icon: TrendingUp, color: "text-green-600" },
            { label: "Risk level", value: riskAssessment.overall_risk || "Medium", icon: AlertTriangle, color: riskAssessment.overall_risk === "High" ? "text-red-600" : "text-orange-500" },
            { label: "Meeting cost", value: "Rs " + Math.round((meetingCost.estimated_cost_inr || 0) / 1000) + "K", icon: DollarSign, color: "text-pink-600" }
          ].map((stat, i) => (
            <div key={i} className={"p-4 " + (i < 5 ? "border-r border-gray-100" : "")}>
              <div className="flex items-center gap-1.5 mb-1">
                <stat.icon className={"w-3 h-3 " + stat.color} />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-5 border-b border-gray-100 bg-white">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "actions", label: "Action Items (" + actionItems.length + ")", icon: CheckCircle },
            { id: "followups", label: "Follow-ups (" + (communication.total_emails || 0) + ")", icon: Send },
            { id: "transcript", label: "Transcript", icon: FileText }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px " + (activeTab === tab.id ? "border-[#2383E2] text-[#2383E2]" : "border-transparent text-gray-500 hover:text-gray-900")}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#FBFBFA]">
          
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Meeting Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{meetingSummary.one_line || "Meeting analysis complete"}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    {(meetingSummary.bullet_points || []).map((point, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {(riskAssessment.risks || []).length > 0 && (
                  <div className="bg-white rounded-lg border border-red-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h3 className="text-sm font-bold text-gray-900">Risk Flags</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">{riskAssessment.risks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {riskAssessment.risks.map((risk, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                          <div className={"w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 " + (risk.severity === "High" ? "bg-red-500" : "bg-yellow-500")}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium mb-1">{risk.risk}</p>
                            <p className="text-xs text-gray-600">💡 {risk.mitigation}</p>
                          </div>
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-semibold " + (risk.severity === "High" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800")}>{risk.severity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(extraction.decisions_made || []).length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Decisions Made</h3>
                    <div className="space-y-2">
                      {extraction.decisions_made.map((d, i) => (
                        <div key={i} className="p-3 rounded-lg bg-green-50 border border-green-100">
                          <p className="text-sm text-gray-900 font-medium">{d.decision}</p>
                          <p className="text-xs text-gray-600 mt-1">By {d.decided_by} · {d.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(extraction.open_questions || []).length > 0 && (
                  <div className="bg-white rounded-lg border border-yellow-200 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-yellow-600" />
                      Open Questions
                    </h3>
                    <div className="space-y-2">
                      {extraction.open_questions.map((q, i) => (
                        <div key={i} className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                          <p className="text-sm text-gray-900">{q.question}</p>
                          <p className="text-xs text-gray-500 mt-1">Raised by {q.raised_by} · {q.urgency} urgency</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                
                {/* Effectiveness score */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold">Meeting Effectiveness</p>
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#2383E2" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - (effectiveness.score || 0) / 100)} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{effectiveness.score || 0}</span>
                      <span className="text-[10px] text-gray-400">of 100</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-left pt-3 border-t border-gray-100 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Necessary?</span><span className={"font-semibold " + (effectiveness.was_meeting_necessary ? "text-green-600" : "text-red-600")}>{effectiveness.was_meeting_necessary ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Could be email?</span><span className={"font-semibold " + (effectiveness.could_have_been_email ? "text-red-600" : "text-green-600")}>{effectiveness.could_have_been_email ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-500">ROI Prediction</span><span className="font-semibold text-[#2383E2]">{meetingCost.roi_prediction || "Medium"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Cost</span><span className="font-semibold text-gray-900">Rs {(meetingCost.estimated_cost_inr || 0).toLocaleString("en-IN")}</span></div>
                  </div>
                </div>

                {/* Task progress */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Task Progress</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-600">Completed</span><span className="font-semibold text-gray-900">{completedItems}/{actionItems.length}</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: (actionItems.length > 0 ? (completedItems / actionItems.length * 100) : 0) + "%" }}></div></div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-600">In Progress</span><span className="font-semibold text-gray-900">{inProgressItems}/{actionItems.length}</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#2383E2] rounded-full" style={{ width: (actionItems.length > 0 ? (inProgressItems / actionItems.length * 100) : 0) + "%" }}></div></div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-600">Pending</span><span className="font-semibold text-gray-900">{pendingItems}/{actionItems.length}</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 rounded-full" style={{ width: (actionItems.length > 0 ? (pendingItems / actionItems.length * 100) : 0) + "%" }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Action Items</h2>
                  <p className="text-xs text-gray-500">{completedItems} of {actionItems.length} completed</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[{id:"pending",label:"Pending",color:"bg-yellow-400"},{id:"in-progress",label:"In Progress",color:"bg-[#2383E2]"},{id:"follow-up-sent",label:"Follow-up Sent",color:"bg-purple-500"},{id:"completed",label:"Completed",color:"bg-green-500"}].map(col => {
                  const colItems = actionItems.filter(item => item.status === col.id)
                  return (
                    <div key={col.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className={"w-1.5 h-1.5 rounded-full " + col.color}></div>
                          <span className="text-xs font-semibold text-gray-900">{col.label}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono">{colItems.length}</span>
                      </div>
                      <div className="space-y-2">
                        {colItems.map(item => (
                          <div key={item.id} className="p-2.5 rounded border border-gray-100 hover:border-gray-300 group cursor-pointer">
                            <span className={"inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mb-2 " + (item.priority === "High" ? "bg-red-100 text-red-700" : item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>{item.priority}</span>
                            <p className="text-xs text-gray-900 font-medium leading-relaxed mb-2">{item.task}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-[#2383E2]/10 flex items-center justify-center text-[9px] font-semibold text-[#2383E2]">{(item.owner || "U")[0]?.toUpperCase()}</div><span className="text-[10px] text-gray-600">{item.owner}</span></div>
                              {item.deadline && item.deadline !== "Not specified" && (<div className="flex items-center gap-0.5 text-[10px] text-gray-500"><Clock className="w-2.5 h-2.5" />{item.deadline}</div>)}
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.status !== "in-progress" && item.status !== "completed" && (<button onClick={() => updateItemStatus(item.id, "in-progress")} className="text-[10px] py-1 rounded bg-blue-50 text-[#2383E2] hover:bg-blue-100 font-semibold">Start</button>)}
                              {item.status !== "completed" && (<button onClick={() => updateItemStatus(item.id, "completed")} className="text-[10px] py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 font-semibold">Complete</button>)}
                              {item.status === "completed" && (<button onClick={() => updateItemStatus(item.id, "pending")} className="col-span-2 text-[10px] py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold">Reopen</button>)}
                            </div>
                          </div>
                        ))}
                        {colItems.length === 0 && (<div className="p-3 border border-dashed border-gray-200 rounded text-center"><p className="text-[10px] text-gray-400">No items</p></div>)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === "followups" && (
            <div className="max-w-3xl">
              <div className="mb-4">
                <h2 className="text-base font-bold text-gray-900">Follow-up Emails</h2>
                <p className="text-xs text-gray-500">Personalized emails ready for each participant</p>
              </div>
              <div className="space-y-3">
                {(communication.emails_prepared || []).map((email, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2383E2] to-blue-700 flex items-center justify-center text-white font-bold text-sm">{email.owner[0]?.toUpperCase()}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{email.owner}</h3>
                          <p className="text-xs text-gray-500">{email.tasks_count} action item{email.tasks_count > 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded font-semibold">{email.follow_up_schedule?.length || 0} auto follow-ups</span>
                    </div>
                    <div className="mb-3">
                      <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Recipient Email</label>
                      <input type="email" value={emailInput[email.owner] || ""} onChange={(e) => setEmailInput(prev => ({ ...prev, [email.owner]: e.target.value }))} placeholder={email.owner.toLowerCase().replace(/\s/g, ".") + "@company.com"} className="w-full px-3 py-2 rounded border border-gray-200 text-gray-800 focus:outline-none focus:border-[#2383E2] text-sm" />
                    </div>
                    <div className="p-3 rounded bg-gray-50 border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-1 font-semibold uppercase tracking-wider">Subject</p>
                      <p className="text-xs text-gray-800 font-medium">{email.subject}</p>
                    </div>
                  </div>
                ))}
                {(communication.emails_prepared || []).length > 0 && (
                  <button onClick={sendAllEmails} disabled={sendingEmails || emailsSent} className={"w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm shadow-sm " + (emailsSent ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#2383E2] text-white hover:bg-[#1a6dc4]") + " disabled:opacity-60"}>
                    {sendingEmails ? (<><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Sending...</>) : emailsSent ? (<><Check className="w-4 h-4" />All Emails Sent</>) : (<><Send className="w-4 h-4" />Send All Follow-up Emails</>)}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="max-w-3xl bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Meeting Transcript</h3>
              <div className="font-mono text-xs text-gray-700 leading-loose whitespace-pre-wrap">{result.transcription?.full_transcript || "No transcript available"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}