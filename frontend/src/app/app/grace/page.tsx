"use client"

import { useState, useEffect } from "react"
import { Heart, Shield, MessageCircle, Clock, AlertTriangle, Check, X, Send, ArrowRight, Sparkles, ThumbsUp, PauseCircle, HelpCircle, RefreshCw, Calendar } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function GracePage() {
  const [overdueItems, setOverdueItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [customMessage, setCustomMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [lastAction, setLastAction] = useState("")
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ blockers_resolved: 0, deadlines_negotiated: 0, completed_on_time: 0, manager_escalations: 0 })
  const [loading, setLoading] = useState(true)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [overdue, historyRes, statsRes] = await Promise.all([
        axios.get(API_URL + "/api/grace/overdue/demo-user"),
        axios.get(API_URL + "/api/grace/history/demo-user"),
        axios.get(API_URL + "/api/grace/stats/demo-user")
      ])
      setOverdueItems(overdue.data.overdue_items || [])
      setHistory(historyRes.data.history || [])
      setStats(statsRes.data || {})
    } catch (e) {
      console.error("Grace fetch error:", e)
    }
    setLoading(false)
  }

  const handleSend = async () => {
    if (!selectedItem || !selectedResponse) return
    setSending(true)
    try {
      const res = await axios.post(API_URL + "/api/grace/respond", {
        action_item_id: selectedItem.id,
        response_type: selectedResponse,
        message: customMessage
      })
      setLastAction(res.data.action_taken || "Action recorded")
      setSent(true)
      setTimeout(async () => {
        await fetchData()
        setSent(false)
        setSelectedItem(null)
        setSelectedResponse(null)
        setCustomMessage("")
        setLastAction("")
      }, 3500)
    } catch (e) {
      console.error("Grace send error:", e)
    }
    setSending(false)
  }

  const responses = [
    { id: "blocked", icon: PauseCircle, label: "I'm blocked", desc: "Something is preventing me from completing this", color: "orange", detail: "QMEET will redirect the blocker to the responsible person" },
    { id: "more-time", icon: Clock, label: "I need more time", desc: "I need 2-3 more days to complete", color: "yellow", detail: "QMEET will extend deadline by 3 days and notify manager" },
    { id: "almost-done", icon: ThumbsUp, label: "Almost done", desc: "I'll finish this within 24 hours", color: "green", detail: "QMEET will check in tomorrow to confirm completion" },
    { id: "need-help", icon: HelpCircle, label: "I need help", desc: "Not sure how to approach this task", color: "blue", detail: "QMEET will connect you with a team expert" }
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <header className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">Grace Protocol</h1>
              <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-full font-bold uppercase tracking-wide">EXCLUSIVE</span>
            </div>
            <p className="text-xs text-gray-500">Empathetic AI that removes blockers instead of creating pressure</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowComparison(!showComparison)} className="text-xs text-blue-600 font-semibold hover:underline whitespace-nowrap">
              {showComparison ? "Hide" : "Show"} comparison
            </button>
            <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 whitespace-nowrap">
              <RefreshCw className={"w-3.5 h-3.5 " + (loading ? "animate-spin" : "")} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        
        {/* Hero */}
        <div className="mb-6 p-8 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Heart className="w-64 h-64" />
          </div>
          <div className="relative max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">The Grace Protocol</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">AI that supports your team, not surveils them.</h2>
            <p className="text-white/90 leading-relaxed mb-6">When someone misses a deadline, QMEET does not snitch to their manager. Instead, our Grace Protocol asks the person first: "Are you blocked?" — then autonomously redirects the issue, negotiates new deadlines, or connects them with the right expert.</p>
          </div>
        </div>

        {showComparison && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-red-900">Traditional AI Tools</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" /><span>Alerts manager immediately when deadline missed</span></div>
                <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" /><span>Creates fear culture</span></div>
                <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" /><span>No context awareness</span></div>
                <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" /><span>Employees find workarounds</span></div>
              </div>
            </div>
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-sm font-bold text-green-900">QMEET Grace Protocol</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" /><span>Asks user first — "How can I help?"</span></div>
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" /><span>Routes blockers autonomously</span></div>
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" /><span>Negotiates new deadlines</span></div>
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" /><span>Only escalates when needed</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Impact Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <PauseCircle className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Blockers Resolved</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.blockers_resolved || 0}</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Deadlines Negotiated</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.deadlines_negotiated || 0}</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Completed On Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completed_on_time || 0}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600 to-blue-700 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-[10px] font-semibold uppercase">Manager Escalations</span>
            </div>
            <div className="text-2xl font-bold">{stats.manager_escalations || 0}</div>
            <div className="text-[10px] opacity-90 mt-0.5">Only when needed</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          
          {/* Overdue Items - REAL DATA */}
          <div className="col-span-2 p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-gray-900">Overdue Action Items</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold">{overdueItems.length} pending</span>
                </div>
                <p className="text-xs text-gray-500">These items need Grace Protocol intervention</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : overdueItems.length === 0 ? (
              <div className="text-center py-12 bg-green-50 rounded-lg border border-green-100">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-900 mb-1">All caught up!</h4>
                <p className="text-xs text-gray-600">No overdue items right now. Great job team!</p>
                <p className="text-[10px] text-gray-500 mt-2">Grace Protocol activates when someone misses a deadline</p>
              </div>
            ) : (
              <div className="space-y-2">
                {overdueItems.map((item, i) => (
                  <div 
                    key={item.id || i}
                    onClick={() => setSelectedItem(item)}
                    className={"p-4 rounded-lg border-2 cursor-pointer transition-all " + 
                      (selectedItem?.id === item.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300")}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={"text-[10px] px-1.5 py-0.5 rounded font-semibold " + 
                          (item.priority === "High" ? "bg-red-100 text-red-700" : 
                           item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : 
                           "bg-green-100 text-green-700")}>{item.priority || "Medium"}</span>
                        <span className="text-xs text-gray-500">Assigned to <strong>{item.owner_name}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
                        <Calendar className="w-3 h-3" />
                        Due: {item.deadline}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{item.task}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Grace Response UI */}
            {selectedItem && (
              <div className="mt-5 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">QMEET AI</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">EMPATHETIC MODE</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed mb-2">
                      Hi <strong>{selectedItem.owner_name}</strong>, I noticed <em>"{selectedItem.task}"</em> was due <strong>{selectedItem.deadline}</strong>. 
                      Before involving anyone else, let me help you first.
                    </p>
                    <p className="text-sm text-gray-600">What is the situation?</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  {responses.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => setSelectedResponse(r.id)}
                      className={"w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left " + 
                        (selectedResponse === r.id 
                          ? (r.color === "orange" ? "border-orange-500 bg-orange-50" :
                             r.color === "yellow" ? "border-yellow-500 bg-yellow-50" :
                             r.color === "green" ? "border-green-500 bg-green-50" :
                             "border-blue-500 bg-blue-50")
                          : "border-gray-200 bg-white hover:border-gray-300")}
                    >
                      <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + 
                        (r.color === "orange" ? "bg-orange-100" :
                         r.color === "yellow" ? "bg-yellow-100" :
                         r.color === "green" ? "bg-green-100" :
                         "bg-blue-100")}>
                        <r.icon className={"w-4 h-4 " + 
                          (r.color === "orange" ? "text-orange-600" :
                           r.color === "yellow" ? "text-yellow-600" :
                           r.color === "green" ? "text-green-600" :
                           "text-blue-600")} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 mb-0.5">{r.label}</div>
                        <div className="text-xs text-gray-600">{r.desc}</div>
                        {selectedResponse === r.id && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex items-start gap-1.5">
                              <Sparkles className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                              <p className="text-[11px] text-gray-700 italic">{r.detail}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedResponse && (
                  <div className="mt-4">
                    <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">Add details (optional)</label>
                    <textarea 
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Any specific details you want to add?"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:border-blue-500"
                      rows="2"
                    ></textarea>
                    <button 
                      onClick={handleSend}
                      disabled={sending || sent}
                      className={"mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all " + 
                        (sent ? "bg-green-500 text-white" : sending ? "bg-blue-400 text-white" : "bg-blue-600 text-white hover:bg-blue-700")}
                    >
                      {sending ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>QMEET is processing...</>
                      ) : sent ? (
                        <><Check className="w-4 h-4" />Done! {lastAction}</>
                      ) : (
                        <><Send className="w-4 h-4" />Send response to QMEET</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="p-5 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">How It Works</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-600 flex-shrink-0">1</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Deadline missed</p>
                  <p className="text-[10px] text-gray-500">QMEET detects overdue task</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-600 flex-shrink-0">2</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">User contacted first</p>
                  <p className="text-[10px] text-gray-500">"How can I help you?"</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-600 flex-shrink-0">3</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">AI takes action</p>
                  <p className="text-[10px] text-gray-500">Routes blockers autonomously</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-[11px] font-bold text-yellow-600 flex-shrink-0">4</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Escalate ONLY if silent</p>
                  <p className="text-[10px] text-gray-500">After 24 hours no response</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <p className="text-[10px] text-purple-800 leading-relaxed">92% of employees perform better when supported rather than surveilled.</p>
            </div>
          </div>
        </div>

        {/* Real History */}
        {history.length > 0 && (
          <div className="p-5 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Recent Grace Protocol Actions</h3>
                <p className="text-xs text-gray-500">Real-time log of interventions</p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">{history.length} actions</span>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map((event, i) => {
                const icon = event.response_type === "blocked" ? PauseCircle : 
                             event.response_type === "more-time" ? Clock :
                             event.response_type === "almost-done" ? ThumbsUp : HelpCircle
                const IconComp = icon
                const colorClass = event.response_type === "blocked" ? "bg-orange-100 text-orange-600" :
                                   event.response_type === "more-time" ? "bg-yellow-100 text-yellow-600" :
                                   event.response_type === "almost-done" ? "bg-green-100 text-green-600" :
                                   "bg-blue-100 text-blue-600"
                return (
                  <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + colorClass}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{event.user}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500 capitalize">{event.response_type.replace("-", " ")}</span>
                      </div>
                      <div className="text-xs text-gray-700">{event.action_taken}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(event.time).toLocaleDateString()}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}