"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, FileText, Upload, ArrowRight, Sparkles, Check, Zap, Mic, Calendar, Link as LinkIcon, Mail, Video, Circle, PlayCircle, PauseCircle, Copy, Clock, Users, ExternalLink, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

const DEMO_TRANSCRIPT = "John (Project Manager): Good morning everyone. Lets discuss the Q3 product launch. Sarah (Designer): I finished the initial mockups last week but need feedback from the dev team. Mike (Developer): Sorry Sarah, I havent reviewed them. I will review all mockups and send feedback by Friday. John: Great. Mike, can you also prepare the technical architecture document for the new payment gateway? Mike: Yes, I will have the technical architecture document ready by next Wednesday. High priority. Sarah: I will finalize UI designs for the payment flow once Mike shares the architecture. John: Priya, can you draft the initial marketing campaign strategy document by next Monday? Priya: Absolutely. I will have the complete marketing strategy ready by Monday. John: I will review and approve the budget within 24 hours. Mike: One concern - our current server infrastructure might not handle the launch load. We should do load testing. John: Good point. Mike, coordinate with DevOps and schedule load testing for the week of September 20th."

interface CalendarEvent {
  id: number
  title: string
  time: string
  duration: string
  participants: string[]
  platform: string
  link: string
}

interface ForwardedEmail {
  id: number
  subject: string
  from: string
  time: string
  status: string
}

interface Platform {
  name: string
  icon: string
  color: string
}

interface NewMeetingModalProps {
  open: boolean
  onClose: () => void
}

const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 1, title: "Q4 Product Roadmap Review", time: "Today, 2:00 PM", duration: "60 min", participants: ["John", "Sarah", "Mike", "Priya"], platform: "google-meet", link: "https://meet.google.com/abc-defg-hij" },
  { id: 2, title: "Weekly Engineering Standup", time: "Tomorrow, 10:00 AM", duration: "30 min", participants: ["Mike", "Rahul", "Ananya"], platform: "zoom", link: "https://zoom.us/j/123456789" },
  { id: 3, title: "Design System Sync", time: "Wed, Jul 30, 3:30 PM", duration: "45 min", participants: ["Sarah", "Priya"], platform: "google-meet", link: "https://meet.google.com/xyz-uvwx-rst" },
  { id: 4, title: "Client Presentation - Acme Corp", time: "Thu, Jul 31, 11:00 AM", duration: "60 min", participants: ["John", "Priya", "Sarah"], platform: "teams", link: "https://teams.microsoft.com/l/meetup/xyz" },
  { id: 5, title: "Sprint Retrospective", time: "Fri, Aug 1, 4:00 PM", duration: "45 min", participants: ["Mike", "Ananya", "Rahul", "Sarah"], platform: "zoom", link: "https://zoom.us/j/987654321" }
]

const MOCK_FORWARDED_EMAILS: ForwardedEmail[] = [
  { id: 1, subject: "Fwd: Q3 Planning Meeting Notes", from: "sarah@acmecorp.com", time: "2 hours ago", status: "processed" },
  { id: 2, subject: "Fwd: Client Sync - Recording Transcript", from: "john@acmecorp.com", time: "Yesterday", status: "processed" },
  { id: 3, subject: "Fwd: Sprint Planning Session", from: "mike@acmecorp.com", time: "2 days ago", status: "processed" }
]

export default function NewMeetingModal({ open, onClose }: NewMeetingModalProps) {
  const [mode, setMode] = useState<string>("quick")
  const [subMode, setSubMode] = useState<string>("demo")
  const [transcript, setTranscript] = useState<string>("")
  const [meetingTitle, setMeetingTitle] = useState<string>("")
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const [calendarConnected, setCalendarConnected] = useState<boolean>(false)
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  const [meetingUrl, setMeetingUrl] = useState<string>("")
  const [urlValidating, setUrlValidating] = useState<boolean>(false)

  const [emailCopied, setEmailCopied] = useState<boolean>(false)
  const forwardEmail = "meetings-demo-user@qmeet.ai"

  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [recordingTime, setRecordingTime] = useState<number>(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const connectCalendar = () => {
    setCalendarLoading(true)
    setTimeout(() => {
      setCalendarConnected(true)
      setCalendarLoading(false)
    }, 1500)
  }

  const analyzeCalendarEvent = (event: CalendarEvent) => {
    setMeetingTitle(event.title)
    const syntheticTranscript = `Meeting: ${event.title}\nDate: ${event.time}\nDuration: ${event.duration}\nParticipants: ${event.participants.join(", ")}\nPlatform: ${event.platform}\n\n[This meeting is scheduled. QMEET will auto-join, record, and analyze when it starts.]`
    startProcessing(syntheticTranscript, event.title)
  }

  const detectPlatform = (url: string): Platform | null => {
    if (!url) return null
    if (url.includes("zoom.us")) return { name: "Zoom", icon: "🎥", color: "bg-blue-500" }
    if (url.includes("meet.google.com")) return { name: "Google Meet", icon: "📹", color: "bg-green-500" }
    if (url.includes("teams.microsoft.com") || url.includes("teams.live.com")) return { name: "Microsoft Teams", icon: "💼", color: "bg-purple-500" }
    if (url.includes("webex.com")) return { name: "Cisco Webex", icon: "🌐", color: "bg-orange-500" }
    return null
  }

  const deployBot = async () => {
    if (!meetingUrl.trim()) {
      setError("Please enter a valid meeting URL")
      return
    }
    const platform = detectPlatform(meetingUrl)
    if (!platform) {
      setError("Unsupported URL. We support Zoom, Google Meet, Teams & Webex.")
      return
    }

    setUrlValidating(true)
    setError("")

    try {
      const deployRes = await axios.post(API_URL + "/api/bot/join", {
        meeting_url: meetingUrl,
        meeting_title: meetingTitle || `${platform.name} Meeting`,
        user_id: "demo-user"
      })

      const botId = deployRes.data.bot_id
      console.log("✅ Bot deployed:", botId)
      console.log("🔗 Dashboard:", deployRes.data.recall_dashboard)

      onClose()

      window.dispatchEvent(new CustomEvent("qmeet:start-processing", {
        detail: {
          text: "",
          title: meetingTitle || `${platform.name} Meeting`,
          status: "🤖 Bot joining... Turn ON captions (press C)!"
        }
      }))

      let pollCount = 0
      const maxPolls = 480

      const pollInterval = setInterval(async () => {
        pollCount++
        try {
          const statusRes = await axios.get(API_URL + `/api/bot/status/${botId}`)
          const data = statusRes.data

          console.log(`[Poll ${pollCount}] Status: ${data.status} | ${data.message}`)

          if (data.transcript_ready && data.transcript) {
            clearInterval(pollInterval)
            console.log("📝 Transcript received:", data.transcript.substring(0, 200))

            if (data.transcript.trim().length < 10) {
              window.dispatchEvent(new CustomEvent("qmeet:processing-error", {
                detail: { error: "Transcript is empty. Ensure captions were ON during the meeting." }
              }))
              return
            }

            const formData = new FormData()
            formData.append("transcript_text", data.transcript)
            formData.append("meeting_title", meetingTitle || `${platform.name} Meeting`)
            formData.append("user_id", "demo-user")
            formData.append("participants_count", "4")

            const analyzeRes = await axios.post(
              API_URL + "/api/process-meeting",
              formData,
              { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 }
            )

            localStorage.setItem("qmeet_result", JSON.stringify(analyzeRes.data))
            localStorage.setItem("nexus_result", JSON.stringify(analyzeRes.data))

            window.dispatchEvent(new CustomEvent("qmeet:processing-complete", {
              detail: { meetingId: analyzeRes.data.meeting_id }
            }))
          }

          if (pollCount >= maxPolls) {
            clearInterval(pollInterval)
            window.dispatchEvent(new CustomEvent("qmeet:processing-error", {
              detail: { error: "Timeout waiting for meeting to end." }
            }))
          }
        } catch (err) {
          const error = err as Error
          console.error(`[Poll ${pollCount}] Error:`, error.message)
        }
      }, 15000)

    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string }
      setError(error.response?.data?.detail || error.message || "Failed to deploy bot")
      setUrlValidating(false)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(forwardEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.ondataavailable = (e: BlobEvent) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
    } catch (err) {
      setError("Microphone access denied. Please allow microphone in browser settings.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop()
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
    window.dispatchEvent(new CustomEvent("qmeet:start-processing", { detail: { title: meetingTitle || "Recorded Meeting" } }))
    try {
      const formData = new FormData()
      const file = new File([audioBlob], "recording.webm", { type: "audio/webm" })
      formData.append("file", file)
      formData.append("meeting_title", meetingTitle || "Recorded Meeting")
      formData.append("user_id", "demo-user")
      formData.append("participants_count", "4")
      const response = await axios.post(API_URL + "/api/process-meeting", formData, { headers: { "Content-Type": "multipart/form-data" }, timeout: 300000 })
      localStorage.setItem("qmeet_result", JSON.stringify(response.data))
      localStorage.setItem("nexus_result", JSON.stringify(response.data))
      window.dispatchEvent(new CustomEvent("qmeet:processing-complete", { detail: { meetingId: response.data.meeting_id } }))
    } catch (err) {
      const error = err as Error
      window.dispatchEvent(new CustomEvent("qmeet:processing-error", { detail: { error: error.message } }))
    }
  }

  const startProcessing = async (text: string, title: string) => {
    setError("")
    onClose()
    window.dispatchEvent(new CustomEvent("qmeet:start-processing", { detail: { text, title: title || "New Meeting" } }))
    try {
      const formData = new FormData()
      formData.append("transcript_text", text)
      formData.append("meeting_title", title || "New Meeting")
      formData.append("user_id", "demo-user")
      formData.append("participants_count", "4")
      const response = await axios.post(API_URL + "/api/process-meeting", formData, { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 })
      localStorage.setItem("qmeet_result", JSON.stringify(response.data))
      localStorage.setItem("nexus_result", JSON.stringify(response.data))
      window.dispatchEvent(new CustomEvent("qmeet:processing-complete", { detail: { meetingId: response.data.meeting_id } }))
    } catch (err) {
      const error = err as Error
      window.dispatchEvent(new CustomEvent("qmeet:processing-error", { detail: { error: error.message } }))
    }
  }

  const uploadAudio = async (file: File) => {
    onClose()
    window.dispatchEvent(new CustomEvent("qmeet:start-processing", { detail: { text: "", title: file.name.replace(/\.[^/.]+$/, "") } }))
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("meeting_title", file.name.replace(/\.[^/.]+$/, ""))
      formData.append("user_id", "demo-user")
      formData.append("participants_count", "4")
      const response = await axios.post(API_URL + "/api/process-meeting", formData, { headers: { "Content-Type": "multipart/form-data" }, timeout: 300000 })
      localStorage.setItem("qmeet_result", JSON.stringify(response.data))
      localStorage.setItem("nexus_result", JSON.stringify(response.data))
      window.dispatchEvent(new CustomEvent("qmeet:processing-complete", { detail: { meetingId: response.data.meeting_id } }))
    } catch (err) {
      const error = err as Error
      window.dispatchEvent(new CustomEvent("qmeet:processing-error", { detail: { error: error.message } }))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadAudio(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadAudio(file)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!open) return null

  const detectedPlatform = detectPlatform(meetingUrl)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">

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

        <div className="px-5 pt-5">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Meeting Title (optional)</label>
          <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g., Q4 Planning Meeting"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
        </div>

        <div className="px-5 pt-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Choose Input Method</p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "quick", icon: Zap, label: "Quick Analyze", badge: null },
              { id: "record", icon: Mic, label: "Record Live", badge: "NEW" },
              { id: "calendar", icon: Calendar, label: "From Calendar", badge: "LIVE" },
              { id: "url", icon: LinkIcon, label: "Zoom/Meet URL", badge: "LIVE" },
              { id: "email", icon: Mail, label: "Email Forward", badge: "LIVE" }
            ].map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setError("") }}
                className={"relative p-3 rounded-lg border-2 transition-all text-center " +
                  (mode === m.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300")}>
                <m.icon className={"w-4 h-4 mx-auto mb-1 " + (mode === m.id ? "text-blue-600" : "text-gray-600")} />
                <div className={"text-[10px] font-semibold " + (mode === m.id ? "text-blue-700" : "text-gray-700")}>{m.label}</div>
                {m.badge && (
                  <span className={"absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded-full font-bold " +
                    (m.badge === "NEW" ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white" :
                     m.badge === "LIVE" ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" :
                     "bg-gray-200 text-gray-500")}>{m.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 max-h-[400px] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === "quick" && (
            <div>
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                {[
                  { id: "demo", icon: Play, label: "Try Sample" },
                  { id: "paste", icon: FileText, label: "Paste Text" },
                  { id: "upload", icon: Upload, label: "Upload File" }
                ].map(sm => (
                  <button key={sm.id} onClick={() => setSubMode(sm.id)}
                    className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all " +
                      (subMode === sm.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}>
                    <sm.icon className="w-3.5 h-3.5" />{sm.label}
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
                    <p className="text-xs text-gray-700 leading-relaxed font-mono">{DEMO_TRANSCRIPT.substring(0, 400)}...</p>
                  </div>
                  <button onClick={() => startProcessing(DEMO_TRANSCRIPT, meetingTitle || "Q3 Product Launch Meeting")}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">
                    <Sparkles className="w-4 h-4" />Deploy 6 AI Agents<ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {subMode === "paste" && (
                <div>
                  <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste your meeting transcript here..."
                    className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none font-mono"></textarea>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{transcript.split(" ").filter(Boolean).length} words</span>
                    <button onClick={() => startProcessing(transcript, meetingTitle)} disabled={!transcript.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-blue-700">
                      Analyze<ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {subMode === "upload" && (
                <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                  className={"relative border-2 border-dashed rounded-lg p-10 text-center transition-all " + (isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400")}>
                  <input type="file" accept="audio/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handleFileChange} />
                  <Upload className="w-10 h-10 mx-auto text-blue-600 mb-3" />
                  <p className="text-gray-900 font-semibold mb-1">Drop meeting recording here</p>
                  <p className="text-sm text-gray-500">MP3, WAV, M4A, MP4 — up to 25MB</p>
                </div>
              )}
            </div>
          )}

          {mode === "record" && (
            <div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Mic className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-1">Record meeting directly in browser</p>
                    <p className="text-[11px] text-gray-600">Click Record to capture audio via your microphone.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
                {!audioBlob && (
                  <>
                    <div className="mb-6">
                      {isRecording ? (
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 font-semibold text-sm">{isPaused ? "PAUSED" : "RECORDING"}</span>
                        </div>
                      ) : (<div className="text-gray-400 text-sm mb-4">Ready to record</div>)}
                      <div className="text-5xl font-mono font-bold">{formatTime(recordingTime)}</div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                      {isRecording && (
                        <button onClick={pauseRecording} className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-all shadow-lg">
                          {isPaused ? <PlayCircle className="w-7 h-7" /> : <PauseCircle className="w-7 h-7" />}
                        </button>
                      )}
                      <button onClick={isRecording ? stopRecording : startRecording}
                        className={"w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl " +
                          (isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-90")}>
                        {isRecording ? <Circle className="w-10 h-10 fill-white" /> : <Mic className="w-10 h-10 text-white" />}
                      </button>
                      {isRecording && (<div className="w-14 h-14"></div>)}
                    </div>
                    <p className="text-xs text-gray-400">{isRecording ? "Click red button to stop recording" : "Click blue button to start recording"}</p>
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
                      <button onClick={() => { setAudioBlob(null); setAudioUrl(""); setRecordingTime(0); }}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700">Re-record</button>
                      <button onClick={submitRecording}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90">
                        <Sparkles className="w-4 h-4" />Analyze Recording
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === "calendar" && (
            <div>
              {!calendarConnected ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Connect Your Calendar</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">Sync with Google Calendar, Outlook, or Apple Calendar.</p>
                  <div className="flex flex-col gap-2 max-w-xs mx-auto">
                    <button onClick={connectCalendar} disabled={calendarLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-semibold text-gray-700">
                      {calendarLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span className="text-lg">📅</span>}
                      {calendarLoading ? "Connecting..." : "Connect Google Calendar"}
                    </button>
                    <button onClick={connectCalendar} disabled={calendarLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-semibold text-gray-700">
                      <span className="text-lg">📧</span>Connect Outlook
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">Google Calendar Connected</span>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />Refresh
                    </button>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Upcoming Meetings ({MOCK_CALENDAR_EVENTS.length})</p>
                  <div className="space-y-2">
                    {MOCK_CALENDAR_EVENTS.map(event => (
                      <div key={event.id} onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
                        className={"p-3 border rounded-lg cursor-pointer transition-all " +
                          (selectedEvent === event.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300")}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center gap-3 text-[11px] text-gray-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                              <span>·</span><span>{event.duration}</span><span>·</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.participants.length}</span>
                            </div>
                            {selectedEvent === event.id && (
                              <div className="mt-2 pt-2 border-t border-blue-200">
                                <p className="text-[10px] text-gray-600 mb-1"><strong>Participants:</strong> {event.participants.join(", ")}</p>
                                <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />Open meeting link
                                </a>
                              </div>
                            )}
                          </div>
                          <div className={"px-2 py-1 rounded text-[10px] font-bold text-white " +
                            (event.platform === "zoom" ? "bg-blue-500" : event.platform === "google-meet" ? "bg-green-500" : "bg-purple-500")}>
                            {event.platform === "zoom" ? "ZOOM" : event.platform === "google-meet" ? "MEET" : "TEAMS"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedEvent && (
                    <button onClick={() => {
                      const evt = MOCK_CALENDAR_EVENTS.find(e => e.id === selectedEvent)
                      if (evt) analyzeCalendarEvent(evt)
                    }}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 shadow-lg">
                      <Sparkles className="w-4 h-4" />Schedule QMEET to Analyze This Meeting
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {mode === "url" && (
            <div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-0.5">🤖 Real Bot Integration (Powered by Recall.ai)</p>
                    <p className="text-[11px] text-gray-600">QMEET bot will actually join your Zoom/Meet/Teams meeting and generate real transcripts.</p>
                  </div>
                </div>
              </div>

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Live Meeting URL</label>
              <div className="relative">
                <input type="url" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-3 py-2.5 pr-24 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-mono" />
                {detectedPlatform && (
                  <div className={"absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 " + detectedPlatform.color}>
                    <span>{detectedPlatform.icon}</span>{detectedPlatform.name}
                  </div>
                )}
              </div>

              {detectedPlatform && (
                <div className="mt-2 p-2 rounded bg-green-50 border border-green-200 text-[11px] text-green-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />Valid {detectedPlatform.name} URL detected
                </div>
              )}

              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[11px] font-semibold text-gray-900 mb-1">⚠️ IMPORTANT for Google Meet:</p>
                <p className="text-[11px] text-gray-700">You MUST turn on captions in the meeting (press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono">C</kbd>) for the transcript to work with the free tier.</p>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-[11px] font-semibold text-gray-900 mb-1">📋 How it works:</p>
                <ol className="text-[11px] text-gray-600 space-y-1 ml-4 list-decimal">
                  <li>Start your meeting on Zoom / Google Meet / Teams</li>
                  <li>Turn ON captions in the meeting</li>
                  <li>Paste the meeting link above → Click "Deploy Bot"</li>
                  <li>QMEET AI Assistant joins as participant</li>
                  <li>When meeting ends, transcript + insights auto-generated</li>
                </ol>
              </div>

              <button onClick={deployBot} disabled={!meetingUrl.trim() || urlValidating}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
                {urlValidating ? (<><RefreshCw className="w-4 h-4 animate-spin" />Deploying bot...</>) :
                  (<><Sparkles className="w-4 h-4" />Deploy Bot to Meeting<ArrowRight className="w-4 h-4" /></>)}
              </button>
            </div>
          )}

          {mode === "email" && (
            <div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-0.5">Forward meetings via email</p>
                    <p className="text-[11px] text-gray-600">Forward any meeting invite, transcript, or notes to your unique QMEET address</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-blue-200 border-dashed bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Your Unique Forwarding Address</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg font-mono text-sm text-gray-900 select-all">{forwardEmail}</div>
                  <button onClick={copyEmail}
                    className={"px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 " +
                      (emailCopied ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700")}>
                    {emailCopied ? (<><Check className="w-4 h-4" />Copied!</>) : (<><Copy className="w-4 h-4" />Copy</>)}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">How It Works</p>
                <div className="space-y-2">
                  {[
                    { step: "1", text: "Copy the email address above" },
                    { step: "2", text: "Forward any meeting-related email to it" },
                    { step: "3", text: "QMEET auto-processes within 2 minutes" }
                  ].map(item => (
                    <div key={item.step} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">{item.step}</div>
                      <p className="text-xs text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Forwarded Emails</p>
                <div className="space-y-1.5">
                  {MOCK_FORWARDED_EMAILS.map(email => (
                    <div key={email.id} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{email.subject}</p>
                        <p className="text-[10px] text-gray-500">From {email.from} · {email.time}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded font-semibold uppercase">{email.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

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