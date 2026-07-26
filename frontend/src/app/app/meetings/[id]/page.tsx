"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, AlertTriangle, Send, TrendingUp, Zap, FileText, ChevronRight, Check, MessageSquare, BarChart3, Target, Share2, Download, Copy, RefreshCw, Inbox } from "lucide-react"
import FollowUpTimeline from "../../../components/FollowUpTimeline"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function MeetingDetailsPage({ params }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [result, setResult] = useState(null)
  const [actionItems, setActionItems] = useState([])
  const [sendingEmails, setSendingEmails] = useState(false)
  const [emailsSent, setEmailsSent] = useState(false)
  const [emailInput, setEmailInput] = useState({})
  const [meetingId, setMeetingId] = useState("")
  const [shareCopied, setShareCopied] = useState(false)
  const [transcriptCopied, setTranscriptCopied] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (params && params.then) {
      params.then(p => setMeetingId(p.id))
    } else if (params && params.id) {
      setMeetingId(params.id)
    }
  }, [params])

  useEffect(() => {
    if (!meetingId) return
    loadMeetingData()
    const interval = setInterval(() => loadMeetingData(true), 30000)
    return () => clearInterval(interval)
  }, [meetingId])

  const loadMeetingData = async (silent = false) => {
    if (!silent) setRefreshing(true)
    let data = null
    try {
      const res = await axios.get(API_URL + "/api/meetings/" + meetingId)
      if (res.data) data = res.data
    } catch (e) {}
    if (!data) {
      const stored = localStorage.getItem("qmeet_result") || localStorage.getItem("nexus_result")
      if (stored) {
        try { data = JSON.parse(stored) } catch (e) {}
      }
    }
    if (data) {
      setResult(data)
      const savedStatuses = JSON.parse(localStorage.getItem("qmeet_item_statuses_" + meetingId) || "{}")
      const items = (data.extraction?.action_items || []).map((item, i) => {
        const id = item.db_id || "item-" + i
        return { ...item, id, status: savedStatuses[id] || item.status || "pending" }
      })
      setActionItems(items)
      const emailMap = {}
      items.forEach((item) => {
        if (item.owner && item.owner !== "Unassigned") {
          emailMap[item.owner] = item.owner_email || ""
        }
      })
      setEmailInput(prev => ({ ...emailMap, ...prev }))
      setLastUpdated(new Date())
    }
    setRefreshing(false)
  }

  const updateItemStatus = async (itemId, newStatus) => {
    setActionItems(prev => {
      const updated = prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item)
      const statusMap = {}
      updated.forEach(i => { statusMap[i.id] = i.status })
      localStorage.setItem("qmeet_item_statuses_" + meetingId, JSON.stringify(statusMap))
      return updated
    })
    try {
      await axios.post(API_URL + "/api/action-items/" + itemId + "/status", { status: newStatus })
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
    setTimeout(() => setEmailsSent(false), 8000)
  }

  const shareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2500)
  }

  const copyTranscript = () => {
    const text = result?.transcription?.full_transcript || ""
    navigator.clipboard.writeText(text)
    setTranscriptCopied(true)
    setTimeout(() => setTranscriptCopied(false), 2500)
  }

  const downloadTranscript = () => {
    const text = result?.transcription?.full_transcript || ""
    const title = (result?.meeting_title || result?.title || "meeting").replace(/[^a-z0-9]/gi, "-").toLowerCase()
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = title + "-transcript.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTimeAgo = () => {
    if (!lastUpdated) return ""
    const s = Math.floor((new Date() - lastUpdated) / 1000)
    if (s < 60) return "just now"
    const m = Math.floor(s / 60)
    if (m < 60) return m + " min ago"
    return Math.floor(m / 60) + "h ago"
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading meeting analysis...</p>
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
  const meetingTitle = result.meeting_title || result.title || "Meeting Analysis"

  const completedItems = actionItems.filter(i => i.status === "completed").length
  const inProgressItems = actionItems.filter(i => i.status === "in-progress").length
  const pendingItems = actionItems.filter(i => i.status === "pending").length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <header className="bg-white border-b border-gray-100 h-12 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px]">
          <a href="/app/meetings" className="text-gray-500 hover:text-gray-900">Meetings</a>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-medium text-gray-900 truncate max-w-md">{meetingTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-[11px] text-gray-500">Updated {getTimeAgo()}</span>}
          <button onClick={() => loadMeetingData()} disabled={refreshing} className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50" title="Refresh">
            <RefreshCw className={"w-3.5 h-3.5 text-gray-600 " + (refreshing ? "animate-spin" : "")} />
          </button>
        </div>
      </header>

      <div className="border-b border-gray-100 bg-white px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-bold text-gray-900">{meetingTitle}</h1>
              <span className={"text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide " + (sentiment.overall === "positive" ? "bg-green-100 text-green-700" : sentiment.overall === "tense" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700")}>
                {sentiment.overall || "neutral"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} - {meetingCost.estimated_duration_minutes || 30} minutes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={shareLink} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-md text-[12px] font-semibold hover:bg-gray-50 transition-all">
              {shareCopied ? (<><Check className="w-3.5 h-3.5 text-green-600" />Link copied!</>) : (<><Share2 className="w-3.5 h-3.5" />Share</>)}
            </button>
            <button onClick={sendAllEmails} disabled={sendingEmails} className={"flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-semibold shadow-sm transition-all " + (emailsSent ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-600 text-white hover:bg-blue-700") + " disabled:opacity-60"}>
              {sendingEmails ? (<><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Sending...</>) : emailsSent ? (<><Check className="w-3.5 h-3.5" />Emails Sent - Resend?</>) : (<><Send className="w-3.5 h-3.5" />Send Follow-ups ({communication.total_emails || 0})</>)}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 border-b border-gray-100 bg-white">
        <div className="p-4 border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Action items</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{summary.action_items_found || actionItems.length || 0}</div>
        </div>
        <div className="p-4 border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Decisions</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{summary.decisions_made || (extraction.decisions_made || []).length || 0}</div>
        </div>
        <div className="p-4 border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3 h-3 text-yellow-600" />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Open questions</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{summary.open_questions || 0}</div>
        </div>
        <div className="p-4 border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Effectiveness</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{effectiveness.score || 0}/100</div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Risk level</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{riskAssessment.overall_risk || "Medium"}</div>
        </div>
      </div>

      <div className="flex gap-0 px-5 border-b border-gray-100 bg-white">
        <button onClick={() => setActiveTab("overview")} className={"flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px " + (activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900")}>
          <BarChart3 className="w-3.5 h-3.5" />
          Overview
        </button>
        <button onClick={() => setActiveTab("actions")} className={"flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px " + (activeTab === "actions" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900")}>
          <CheckCircle className="w-3.5 h-3.5" />
          Action Items ({actionItems.length})
        </button>
        <button onClick={() => setActiveTab("followups")} className={"flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px " + (activeTab === "followups" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900")}>
          <Send className="w-3.5 h-3.5" />
          Follow-ups ({communication.total_emails || 0})
        </button>
        <button onClick={() => setActiveTab("transcript")} className={"flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px " + (activeTab === "transcript" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900")}>
          <FileText className="w-3.5 h-3.5" />
          Transcript
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-gray-50">

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
                          <p className="text-xs text-gray-600">Mitigation: {risk.mitigation}</p>
                        </div>
                        <span className={"text-[10px] px-2 py-0.5 rounded-full font-semibold " + (risk.severity === "High" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800")}>{risk.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FollowUpTimeline actionItems={actionItems} meetingId={meetingId} />
              
              {(extraction.decisions_made || []).length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Decisions Made</h3>
                  <div className="space-y-2">
                    {extraction.decisions_made.map((d, i) => (
                      <div key={i} className="p-3 rounded-lg bg-green-50 border border-green-100">
                        <p className="text-sm text-gray-900 font-medium">{d.decision}</p>
                        <p className="text-xs text-gray-600 mt-1">By {d.decided_by}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold">Effectiveness Score</p>
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">Necessary?</span>
                    <span className={"font-semibold " + (effectiveness.was_meeting_necessary ? "text-green-600" : "text-red-600")}>{effectiveness.was_meeting_necessary ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Could be email?</span>
                    <span className={"font-semibold " + (effectiveness.could_have_been_email ? "text-red-600" : "text-green-600")}>{effectiveness.could_have_been_email ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-900">{meetingCost.estimated_duration_minutes || 30} min</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Task Progress</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold">{completedItems}/{actionItems.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: (actionItems.length > 0 ? (completedItems / actionItems.length * 100) : 0) + "%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">In Progress</span>
                      <span className="font-semibold">{inProgressItems}/{actionItems.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: (actionItems.length > 0 ? (inProgressItems / actionItems.length * 100) : 0) + "%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-semibold">{pendingItems}/{actionItems.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: (actionItems.length > 0 ? (pendingItems / actionItems.length * 100) : 0) + "%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "actions" && (
          <>
            {actionItems.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-1">No action items yet</h3>
                <p className="text-xs text-gray-500">This meeting did not produce any trackable action items</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {["pending", "in-progress", "follow-up-sent", "completed"].map(status => {
                  const labels = { "pending": "Pending", "in-progress": "In Progress", "follow-up-sent": "Follow-up Sent", "completed": "Completed" }
                  const colors = { "pending": "bg-yellow-400", "in-progress": "bg-blue-600", "follow-up-sent": "bg-purple-500", "completed": "bg-green-500" }
                  const colItems = actionItems.filter(item => item.status === status)
                  return (
                    <div key={status} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className={"w-1.5 h-1.5 rounded-full " + colors[status]}></div>
                          <span className="text-xs font-semibold text-gray-900">{labels[status]}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono">{colItems.length}</span>
                      </div>
                      <div className="space-y-2">
                        {colItems.map(item => (
                          <div key={item.id} className="p-2.5 rounded border border-gray-100 hover:border-gray-300 group cursor-pointer">
                            <span className={"inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mb-2 " + (item.priority === "High" ? "bg-red-100 text-red-700" : item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>{item.priority}</span>
                            <p className="text-xs text-gray-900 font-medium leading-relaxed mb-2">{item.task}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-semibold text-blue-600">{(item.owner || "U")[0]?.toUpperCase()}</div>
                                <span className="text-[10px] text-gray-600">{item.owner}</span>
                              </div>
                              {item.deadline && item.deadline !== "Not specified" && (
                                <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                                  <Clock className="w-2.5 h-2.5" />
                                  {item.deadline}
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.status !== "in-progress" && item.status !== "completed" && (
                                <button onClick={() => updateItemStatus(item.id, "in-progress")} className="text-[10px] py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold">Start</button>
                              )}
                              {item.status !== "completed" && (
                                <button onClick={() => updateItemStatus(item.id, "completed")} className="text-[10px] py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 font-semibold">Complete</button>
                              )}
                            </div>
                          </div>
                        ))}
                        {colItems.length === 0 && (
                          <div className="p-3 border border-dashed border-gray-200 rounded text-center">
                            <p className="text-[10px] text-gray-400">No items</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "followups" && (
          <div className="max-w-3xl">
            {(communication.emails_prepared || []).length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-1">No follow-up emails prepared</h3>
                <p className="text-xs text-gray-500 mb-4">This meeting did not generate any follow-up emails to send</p>
                <a href="/app/meetings" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline">
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Back to meetings
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {communication.emails_prepared.map((email, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">{email.owner[0]?.toUpperCase()}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{email.owner}</h3>
                          <p className="text-xs text-gray-500">{email.tasks_count} action items</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-[10px] text-gray-500 font-semibold uppercase mb-1 block">Recipient Email</label>
                      <input type="email" value={emailInput[email.owner] || ""} onChange={(e) => setEmailInput(prev => ({ ...prev, [email.owner]: e.target.value }))} placeholder={email.owner.toLowerCase().replace(/\s/g, ".") + "@company.com"} className="w-full px-3 py-2 rounded border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div className="p-3 rounded bg-gray-50 border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-1 font-semibold uppercase">Subject</p>
                      <p className="text-xs text-gray-800 font-medium">{email.subject}</p>
                    </div>
                  </div>
                ))}
                <button onClick={sendAllEmails} disabled={sendingEmails} className={"w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm " + (emailsSent ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-600 text-white hover:bg-blue-700") + " disabled:opacity-60"}>
                  {sendingEmails ? "Sending..." : emailsSent ? "All Emails Sent - Click to Resend" : "Send All Follow-up Emails"}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "transcript" && (
          <div className="max-w-3xl bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Meeting Transcript</h3>
              {result.transcription?.full_transcript && (
                <div className="flex items-center gap-2">
                  <button onClick={copyTranscript} className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-md text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                    {transcriptCopied ? (<><Check className="w-3 h-3 text-green-600" />Copied!</>) : (<><Copy className="w-3 h-3" />Copy</>)}
                  </button>
                  <button onClick={downloadTranscript} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-[11px] font-semibold hover:bg-blue-700">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              )}
            </div>
            {result.transcription?.full_transcript ? (
              <div className="font-mono text-xs text-gray-700 leading-loose whitespace-pre-wrap max-h-[600px] overflow-y-auto p-4 bg-gray-50 rounded border border-gray-100">{result.transcription.full_transcript}</div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-gray-500">No transcript available for this meeting</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
