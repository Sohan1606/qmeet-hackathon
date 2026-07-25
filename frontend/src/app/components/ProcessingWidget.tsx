"use client"

import { useState, useEffect } from "react"
import { FileText, Target, BarChart3, Zap, Mail, Shield, Check, Loader2, X, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const AGENTS = [
  { id: "transcription", name: "Transcription", icon: FileText, tag: "01" },
  { id: "extraction", name: "Extraction", icon: Target, tag: "02" },
  { id: "memory", name: "Memory", icon: BarChart3, tag: "03" },
  { id: "analysis", name: "Intelligence", icon: Zap, tag: "04" },
  { id: "communication", name: "Communication", icon: Mail, tag: "05" },
  { id: "learning", name: "Learning", icon: Shield, tag: "06" }
]

export default function ProcessingWidget() {
  const [active, setActive] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [meetingTitle, setMeetingTitle] = useState("")
  const [statuses, setStatuses] = useState(["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"])
  const [currentAgent, setCurrentAgent] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [meetingId, setMeetingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const startHandler = (e) => {
      setActive(true)
      setExpanded(true)
      setCompleted(false)
      setMeetingId(null)
      setMeetingTitle(e.detail.title || "New Meeting")
      setStatuses(["processing", "waiting", "waiting", "waiting", "waiting", "waiting"])
      setCurrentAgent(0)
      
      let idx = 0
      const progressTimer = setInterval(() => {
        idx++
        if (idx >= AGENTS.length) {
          clearInterval(progressTimer)
          return
        }
        setStatuses(prev => {
          const newStatuses = [...prev]
          newStatuses[idx - 1] = "done"
          newStatuses[idx] = "processing"
          return newStatuses
        })
        setCurrentAgent(idx)
      }, 2500)
      
      window._qmeetProgressTimer = progressTimer
    }

    const completeHandler = (e) => {
      if (window._qmeetProgressTimer) clearInterval(window._qmeetProgressTimer)
      setStatuses(["done", "done", "done", "done", "done", "done"])
      setCurrentAgent(6)
      setCompleted(true)
      setMeetingId(e.detail.meetingId)
    }

    const errorHandler = (e) => {
      if (window._qmeetProgressTimer) clearInterval(window._qmeetProgressTimer)
      console.error("Processing error:", e.detail.error)
      setActive(false)
    }

    window.addEventListener("qmeet:start-processing", startHandler)
    window.addEventListener("qmeet:processing-complete", completeHandler)
    window.addEventListener("qmeet:processing-error", errorHandler)

    return () => {
      window.removeEventListener("qmeet:start-processing", startHandler)
      window.removeEventListener("qmeet:processing-complete", completeHandler)
      window.removeEventListener("qmeet:processing-error", errorHandler)
    }
  }, [])

  const handleClose = () => {
    setActive(false)
    setCompleted(false)
  }

  const handleView = () => {
    if (meetingId) {
      router.push("/app/meetings/" + meetingId)
      setActive(false)
    }
  }

  if (!active) return null

  const completedCount = statuses.filter(s => s === "done").length
  const progress = (completedCount / AGENTS.length) * 100

  return (
    <div className={"fixed z-40 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all " + 
      (expanded ? "bottom-24 right-6 w-96" : "bottom-24 right-6 w-72")}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl text-white">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={"w-2 h-2 rounded-full " + (completed ? "bg-green-400" : "bg-yellow-400 animate-pulse")}></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate">
              {completed ? "Analysis Complete" : "AI Processing"}
            </div>
            <div className="text-[10px] opacity-90 truncate">{meetingTitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="text-white/80 hover:text-white p-1">
            <span className="text-xs">{expanded ? "−" : "+"}</span>
          </button>
          {completed && (
            <button onClick={handleClose} className="text-white/80 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <>
          {/* Progress bar */}
          <div className="px-3 pt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Progress</span>
              <span className="text-[10px] font-bold text-gray-900">{completedCount}/{AGENTS.length}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={"h-full rounded-full transition-all duration-500 " + 
                (completed ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-blue-600 to-purple-600")}
                style={{ width: progress + "%" }}></div>
            </div>
          </div>

          {/* Agents */}
          <div className="p-3 max-h-64 overflow-y-auto space-y-1.5">
            {AGENTS.map((agent, idx) => {
              const status = statuses[idx]
              const Icon = agent.icon
              return (
                <div key={agent.id} className={"flex items-center gap-2 p-2 rounded-lg transition-all " + 
                  (status === "done" ? "bg-green-50" : 
                   status === "processing" ? "bg-blue-50" : 
                   "bg-gray-50")}>
                  <div className={"w-7 h-7 rounded flex items-center justify-center flex-shrink-0 " + 
                    (status === "done" ? "bg-green-100" : 
                     status === "processing" ? "bg-blue-100" : 
                     "bg-gray-100")}>
                    {status === "done" ? <Check className="w-3.5 h-3.5 text-green-600" /> :
                     status === "processing" ? <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" /> :
                     <Icon className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={"text-xs font-semibold " + 
                      (status === "done" ? "text-green-900" : 
                       status === "processing" ? "text-blue-900" : 
                       "text-gray-500")}>
                      {agent.name} Agent
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {status === "done" ? "Complete" : 
                       status === "processing" ? "Running..." : 
                       "Waiting"}
                    </div>
                  </div>
                  {status === "processing" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-600 text-white rounded-full font-bold animate-pulse">
                      LIVE
                    </span>
                  )}
                  {status === "done" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-green-600 text-white rounded-full font-bold">
                      DONE
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Success action */}
          {completed && meetingId && (
            <div className="p-3 border-t border-gray-100">
              <button 
                onClick={handleView}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-semibold hover:opacity-90"
              >
                View Meeting Analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}