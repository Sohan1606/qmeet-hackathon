"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, FileText, Upload, ArrowRight, Sparkles, Check, Zap, Mic, MicOff, Calendar, Link as LinkIcon, Mail, Video, Circle, PlayCircle, PauseCircle } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

const DEMO_TRANSCRIPT = "John (Project Manager): Good morning everyone. Lets discuss the Q3 product launch. Sarah (Designer): I finished the initial mockups last week but need feedback from the dev team. Mike (Developer): Sorry Sarah, I havent reviewed them. I will review all mockups and send feedback by Friday. John: Great. Mike, can you also prepare the technical architecture document for the new payment gateway? Mike: Yes, I will have the technical architecture document ready by next Wednesday. High priority. Sarah: I will finalize UI designs for the payment flow once Mike shares the architecture. John: Priya, can you draft the initial marketing campaign strategy document by next Monday? Priya: Absolutely. I will have the complete marketing strategy ready by Monday. John: I will review and approve the budget within 24 hours. Mike: One concern - our current server infrastructure might not handle the launch load. We should do load testing. John: Good point. Mike, coordinate with DevOps and schedule load testing for the week of September 20th."

export default function NewMeetingModal({ open, onClose }) {
  const [mode, setMode] = useState("quick")
  const [subMode, setSubMode] = useState("demo")
  const [transcript, setTranscript] = useState("")
  const [meetingTitle, setMeetingTitle] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const [zoomUrl, setZoomUrl] = useState("")
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const mediaRecorderRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      setError("Microphone access denied. Please allow microphone in browser settings.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setIsPaused(false)
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }

  const submitRecording = async () => {
    if (!audioBlob) return
    onClose()
    
    window.dispatchEvent(new CustomEvent("qmeet:start-processing", {
      detail: { title: meetingTitle || "Recorded Meeting" }
    }))
    
    try {
      const formData = new FormData()
      const file = new File([audioBlob], "recording.webm", { type: "audio/webm" })
      formData.append("file", file)
      formData.append("meeting_title", meetingTitle || "Recorded Meeting")
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

  const startProcessing = async (text, title) => {
    setError("")
    onClose()
    
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Analyze New Meeting</h2>
              <p className="text-xs text-gray-500">Choose how you want to add this meeting</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meeting Title */}
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

        {/* Mode Selection - 5 Ways */}
        <div className="px-5 pt-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Choose Input Method</p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "quick", icon: Zap, label: "Quick Analyze", badge: null },
              { id: "record", icon: Mic, label: "Record Live", badge: "NEW" },
              { id: "calendar", icon: Calendar, label: "From Calendar", badge: "SOON" },
              { id: "url", icon: LinkIcon, label: "Zoom/Meet URL", badge: "SOON" },
              { id: "email", icon: Mail, label: "Email Forward", badge: "SOON" }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setMode(m.id)}
                disabled={m.badge === "SOON"}
                className={"relative p-3 rounded-lg border-2 transition-all text-center " + 
                  (mode === m.id 
                    ? "border-blue-500 bg-blue-50" 
                    : m.badge === "SOON" 
                      ? "border-gray-100 opacity-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300")}
              >
                <m.icon className={"w-4 h-4 mx-auto mb-1 " + (mode === m.id ? "text-blue-600" : "text-gray-600")} />
                <div className={"text-[10px] font-semibold " + (mode === m.id ? "text-blue-700" : "text-gray-700")}>
                  {m.label}
                </div>
                {m.badge && (
                  <span className={"absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded-full font-bold " + 
                    (m.badge === "NEW" ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white" : "bg-gray-200 text-gray-500")}>
                    {m.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[400px] overflow-y-auto">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* QUICK ANALYZE MODE */}
          {mode === "quick" && (
            <div>
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                {[
                  { id: "demo", icon: Play, label: "Try Sample" },
                  { id: "paste", icon: FileText, label: "Paste Text" },
                  { id: "upload", icon: Upload, label: "Upload File" }
                ].map(sm => (
                  <button 
                    key={sm.id} 
                    onClick={() => setSubMode(sm.id)}
                    className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all " + 
                      (subMode === sm.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}
                  >
                    <sm.icon className="w-3.5 h-3.5" />
                    {sm.label}
                  </button>
                ))}
              </div>

              {subMode === "demo" && (
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

              {subMode === "paste" && (
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

              {subMode === "upload" && (
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
          )}

          {/* LIVE RECORDING MODE */}
          {mode === "record" && (
            <div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Mic className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-1">Record meeting directly in browser</p>
                    <p className="text-[11px] text-gray-600">Click Record to capture audio via your microphone. QMEET will transcribe and analyze automatically.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
                
                {!audioBlob && (
                  <>
                    {/* Recording indicator */}
                    <div className="mb-6">
                      {isRecording ? (
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 font-semibold text-sm">
                            {isPaused ? "PAUSED" : "RECORDING"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm mb-4">Ready to record</div>
                      )}
                      
                      <div className="text-5xl font-mono font-bold">
                        {formatTime(recordingTime)}
                      </div>
                    </div>

                    {/* Mic Button */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {isRecording && (
                        <button 
                          onClick={pauseRecording}
                          className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-all shadow-lg"
                        >
                          {isPaused ? <PlayCircle className="w-7 h-7" /> : <PauseCircle className="w-7 h-7" />}
                        </button>
                      )}
                      
                      <button 
                        onClick={isRecording ? stopRecording : startRecording}
                        className={"w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl " + 
                          (isRecording 
                            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                            : "bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-90")}
                      >
                        {isRecording ? <Circle className="w-10 h-10 fill-white" /> : <Mic className="w-10 h-10 text-white" />}
                      </button>

                      {isRecording && (
                        <div className="w-14 h-14"></div>
                      )}
                    </div>

                    <p className="text-xs text-gray-400">
                      {isRecording ? "Click red button to stop recording" : "Click blue button to start recording"}
                    </p>
                  </>
                )}

                {audioBlob && (
                  <div>
                    <div className="mb-4">
                      <Check className="w-16 h-16 mx-auto text-green-400 mb-3" />
                      <div className="text-lg font-semibold mb-1">Recording Complete!</div>
                      <div className="text-sm text-gray-400">Duration: {formatTime(recordingTime)}</div>
                    </div>
                    
                    <audio src={audioUrl} controls className="mx-auto mb-4" />
                    
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => { setAudioBlob(null); setAudioUrl(null); setRecordingTime(0); }}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
                      >
                        Re-record
                      </button>
                      <button 
                        onClick={submitRecording}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90"
                      >
                        <Sparkles className="w-4 h-4" />
                        Analyze Recording
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CALENDAR MODE - Coming Soon */}
          {mode === "calendar" && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Calendar Integration</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">Connect Google Calendar and QMEET will automatically detect your meetings and offer to join them.</p>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">COMING Q2 2026</span>
            </div>
          )}

          {/* URL MODE - Coming Soon */}
          {mode === "url" && (
            <div className="text-center py-12">
              <LinkIcon className="w-16 h-16 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Import from Zoom/Google Meet</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">Paste your Zoom or Google Meet recording URL and QMEET will fetch and analyze it automatically.</p>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">COMING Q2 2026</span>
            </div>
          )}

          {/* EMAIL MODE - Coming Soon */}
          {mode === "email" && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Forward Integration</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">Forward any meeting invitation or transcript email to meetings@qmeet.ai — we handle the rest.</p>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">COMING Q3 2026</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-0.5">What happens next:</p>
                <p className="text-[11px] text-gray-600">6 AI Agents will transcribe → extract action items → analyze → draft follow-up emails → track completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}