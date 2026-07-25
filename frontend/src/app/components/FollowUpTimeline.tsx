"use client"

import { useState } from "react"
import { Check, Clock, AlertTriangle, Send, Zap, Calendar, ArrowRight } from "lucide-react"

export default function FollowUpTimeline({ actionItems, meetingId }) {
  const [selectedTask, setSelectedTask] = useState(null)

  if (!actionItems || actionItems.length === 0) return null

  const generateReminders = (item) => {
    const reminders = []
    if (!item.deadline || item.deadline === "Not specified") {
      return [{ type: "flexible", label: "Flexible timing", status: "info" }]
    }
    
    try {
      const deadline = new Date(item.deadline)
      const today = new Date()
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
      
      reminders.push({ type: "assignment", label: "Assignment email", when: "Sent now", status: "sent" })
      
      if (daysUntil > 5) {
        reminders.push({ type: "midpoint", label: "Midpoint check", when: `In ${Math.floor(daysUntil / 2)} days`, status: "scheduled" })
      }
      
      if (daysUntil > 1) {
        reminders.push({ type: "deadline", label: "Deadline warning", when: "1 day before", status: "scheduled" })
      }
      
      reminders.push({ type: "verify", label: "Completion check", when: "On deadline", status: "scheduled" })
      
      if (daysUntil < 0) {
        reminders.push({ type: "escalate", label: "Grace Protocol", when: "Active now", status: "active" })
      } else {
        reminders.push({ type: "escalate", label: "Auto-escalation", when: "If missed 24hr", status: "conditional" })
      }
    } catch (e) {}
    
    return reminders
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Auto Follow-Up Timeline</h3>
            <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-bold">AI POWERED</span>
          </div>
          <p className="text-xs text-gray-500">QMEET will automatically follow up until every task is complete</p>
        </div>
      </div>

      <div className="space-y-3">
        {actionItems.slice(0, 5).map((item, i) => {
          const reminders = generateReminders(item)
          const isSelected = selectedTask === i
          
          return (
            <div 
              key={i} 
              className={"border rounded-lg overflow-hidden transition-all " + 
                (isSelected ? "border-blue-500 shadow-md" : "border-gray-200")}
            >
              <button 
                onClick={() => setSelectedTask(isSelected ? null : i)}
                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">{(item.owner || "U")[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.task}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{item.owner || "Unassigned"}</span>
                    {item.deadline && item.deadline !== "Not specified" && (
                      <>
                        <span>·</span>
                        <Calendar className="w-3 h-3" />
                        <span>{item.deadline}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={"text-[10px] px-2 py-0.5 rounded-full font-semibold " + 
                  (item.priority === "High" ? "bg-red-100 text-red-700" : 
                   item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : 
                   "bg-green-100 text-green-700")}>
                  {item.priority}
                </span>
                <ArrowRight className={"w-4 h-4 text-gray-400 transition-transform " + (isSelected ? "rotate-90" : "")} />
              </button>
              
              {isSelected && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Follow-up Schedule</p>
                  <div className="space-y-2">
                    {reminders.map((r, ri) => (
                      <div key={ri} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className={"w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 " + 
                          (r.status === "sent" ? "bg-green-100" :
                           r.status === "active" ? "bg-red-100" :
                           r.status === "scheduled" ? "bg-blue-100" :
                           r.status === "conditional" ? "bg-yellow-100" :
                           "bg-gray-100")}>
                          {r.status === "sent" ? <Check className="w-3 h-3 text-green-600" /> :
                           r.status === "active" ? <AlertTriangle className="w-3 h-3 text-red-600" /> :
                           r.status === "scheduled" ? <Clock className="w-3 h-3 text-blue-600" /> :
                           r.status === "conditional" ? <Zap className="w-3 h-3 text-yellow-600" /> :
                           <Send className="w-3 h-3 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">{r.label}</p>
                          <p className="text-[10px] text-gray-500">{r.when || ""}</p>
                        </div>
                        <span className={"text-[9px] px-2 py-0.5 rounded-full font-bold " + 
                          (r.status === "sent" ? "bg-green-500 text-white" :
                           r.status === "active" ? "bg-red-500 text-white" :
                           r.status === "scheduled" ? "bg-blue-500 text-white" :
                           r.status === "conditional" ? "bg-yellow-500 text-white" :
                           "bg-gray-500 text-white")}>
                          {r.status === "sent" ? "SENT" :
                           r.status === "active" ? "ACTIVE" :
                           r.status === "scheduled" ? "SCHEDULED" :
                           r.status === "conditional" ? "IF NEEDED" :
                           "INFO"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-[11px] text-blue-800">
                      <strong>QMEET Promise:</strong> Will not stop following up until task is marked complete or escalated
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {actionItems.length > 5 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">+ {actionItems.length - 5} more items with active follow-ups</p>
        </div>
      )}
    </div>
  )
}