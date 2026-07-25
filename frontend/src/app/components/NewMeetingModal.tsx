"use client"

import { useState } from "react"
import { X, Play, FileText, Upload, ArrowRight, Sparkles, Check, Zap } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

const DEMO_TRANSCRIPT = "John (Project Manager): Good morning everyone. Lets discuss the Q3 product launch. Sarah (Designer): I finished the initial mockups last week but need feedback from the dev team. Mike (Developer): Sorry Sarah, I havent reviewed them. I will review all mockups and send feedback by Friday. John: Great. Mike, can you also prepare the technical architecture document for the new payment gateway? Mike: Yes, I will have the technical architecture document ready by next Wednesday. High priority. Sarah: I will finalize UI designs for the payment flow once Mike shares the architecture. John: Priya, can you draft the initial marketing campaign strategy document by next Monday? Priya: Absolutely. I will have the complete marketing strategy ready by Monday. John: I will review and approve the budget within 24 hours. Mike: One concern - our current server infrastructure might not handle the launch load. We should do load testing. John: Good point. Mike, coordinate with DevOps and schedule load testing for the week of September 20th."

export default function NewMeetingModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("demo")
  const [transcript, setTranscript] = useState("")
  const [meetingTitle, setMeetingTitle] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")

  const startProcessing = async (text, title) => {
    setError("")
    onClose()
    
    // Trigger the processing widget
    window.dispatchEvent(new CustomEvent("qmeet:start-processing", {
      detail: { text, title: title || "New Meeting" }
    }))
    
    try {
      const formData = new FormData()
      formData.append("transcript_text", text)
      formData.append("meeting_title", title || "New Meeting")
      formData.append("user_id", "demo-user")
      formData.append("participants_count", "4")
      
      const response = await axios.post(
        API_URL + "/api/process-meeting", 
        formData, 
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 }
      )
      
      localStorage.setItem("qmeet_result", JSON.stringify(response.data))
      localStorage.setItem("nexus_result", JSON.stringify(response.data))
      
      // Notify processing widget that we're done
      window.dispatchEvent(new CustomEvent("qmeet:processing-complete", {
        detail: { meetingId: response.data.meeting_id }
      }))
    } catch (err) {
      window.dispatchEvent(new CustomEvent("qmeet:processing-error", {
        detail: { error: err.message }
      }))
    }
  }

  const uploadAudio = async (file) => {
    onClose()
    window.dispatchEvent(new CustomEvent("qmeet:start-processing", {
      detail: { text: "", title: file.name.replace(/\.[^/.]+$/, "") }
    }))
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("meeting_title", file.name.replace(/\.[^/.]+$/, ""))
      formData.append("user_id", "demo-user")
      formData.append("participants_count", "4")
      
      const response = await axios.post(
        API_URL + "/api/process-meeting", 
        formData, 
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 300000 }
      )
      
      localStorage.setItem("qmeet_result", JSON.stringify(response.data))
      localStorage.setItem("nexus_result", JSON.stringify(response.data))
      
      window.dispatchEvent(new CustomEvent("qmeet:processing-complete", {
        detail: { meetingId: response.data.meeting_id }
      }))
    } catch (err) {
      window.dispatchEvent(new CustomEvent("qmeet:processing-error", {
        detail: { error: err.message }
      }))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadAudio(file)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Analyze New Meeting</h2>
              <p className="text-xs text-gray-500">6 AI agents will process your meeting in 30 seconds</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meeting Title Input */}
        <div className="px-5 pt-5">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Meeting Title (optional)</label>
          <input 
            type="text" 
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g., Q4 Planning Meeting" 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Mode Tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { id: "demo", icon: Play, label: "Try Sample" },
              { id: "paste", icon: FileText, label: "Paste Transcript" },
              { id: "upload", icon: Upload, label: "Upload Audio" }
            ].map(m => (
              <button 
                key={m.id} 
                onClick={() => setMode(m.id)}
                className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all " + 
                  (mode === m.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-96 overflow-y-auto">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {mode === "demo" && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Q3 Product Launch Meeting</span>
                <span className="text-xs text-gray-500">5 participants · 15 min</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4 max-h-40 overflow-y-auto">
                <p className="text-xs text-gray-700 leading-relaxed font-mono">
                  {DEMO_TRANSCRIPT.substring(0, 400)}...
                </p>
              </div>
              <button 
                onClick={() => startProcessing(DEMO_TRANSCRIPT, meetingTitle || "Q3 Product Launch Meeting")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Deploy 6 AI Agents
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {mode === "paste" && (
            <div>
              <textarea 
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here..."
                className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none font-mono"
              ></textarea>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {transcript.split(" ").filter(Boolean).length} words
                </span>
                <button 
                  onClick={() => startProcessing(transcript, meetingTitle)}
                  disabled={!transcript.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-blue-700"
                >
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {mode === "upload" && (
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={"relative border-2 border-dashed rounded-lg p-10 text-center transition-all " + 
                (isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400")}
            >
              <input 
                type="file" 
                accept="audio/*,video/*"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => { const f = e.target.files[0]; if (f) uploadAudio(f) }}
              />
              <Upload className="w-10 h-10 mx-auto text-blue-600 mb-3" />
              <p className="text-gray-900 font-semibold mb-1">Drop meeting recording here</p>
              <p className="text-sm text-gray-500">MP3, WAV, M4A, MP4 — up to 25MB</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 pb-5">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-0.5">6 AI Agents will:</p>
                <p className="text-[11px] text-gray-600">Transcribe → Extract → Analyze → Score → Draft emails → Learn patterns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}