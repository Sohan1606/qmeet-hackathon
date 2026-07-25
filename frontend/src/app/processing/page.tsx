"use client"

import { useEffect, useState } from "react"
import { FileText, Target, BarChart3, Zap, Mail, Shield, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const AGENTS = [
  { id: "transcription", name: "Transcription Agent", icon: FileText, description: "Converting speech to text", detail: "Running Whisper Large V3 with speaker identification", tag: "01" },
  { id: "extraction", name: "Extraction Agent", icon: Target, description: "Extracting commitments and decisions", detail: "Identifying tasks, owners, deadlines, priorities", tag: "02" },
  { id: "memory", name: "Memory Agent", icon: BarChart3, description: "Cross-referencing meeting history", detail: "Checking for repeat tasks and behavioral patterns", tag: "03" },
  { id: "analysis", name: "Intelligence Agent", icon: Zap, description: "Analyzing effectiveness and ROI", detail: "Calculating meeting cost, sentiment, and effectiveness", tag: "04" },
  { id: "communication", name: "Communication Agent", icon: Mail, description: "Drafting personalized follow-ups", detail: "Creating individual emails per participant", tag: "05" },
  { id: "learning", name: "Learning Agent", icon: Shield, description: "Updating team intelligence", detail: "Refining accountability scores over time", tag: "06" }
]

export default function ProcessingPage() {
  const [currentAgentIdx, setCurrentAgentIdx] = useState(0)
  const [statuses, setStatuses] = useState(["processing", "waiting", "waiting", "waiting", "waiting", "waiting"])
  const [liveItems, setLiveItems] = useState([])
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const items = [
      "Mike Chen → Technical architecture document · Due Wednesday",
      "Sarah Kim → UI designs for payment flow · 3 days after Mike",
      "Priya Sharma → Marketing campaign strategy · Due Monday",
      "John Doe → Budget approval · Within 24 hours",
      "Mike Chen → Load testing coordination · Week of Sep 20",
      "Sarah Kim → Design review meeting invite · Today EOD",
      "All Team → Project status form · Tomorrow EOD"
    ]

    setTimeout(() => {
      items.forEach((item, i) => {
        setTimeout(() => setLiveItems(prev => [...prev, item]), i * 350)
      })
    }, 3500)

    const progressTimer = setInterval(() => {
      setCurrentAgentIdx(prev => {
        const next = prev + 1
        if (next >= AGENTS.length) {
          clearInterval(progressTimer)
          return prev
        }
        setStatuses(currentStatuses => {
          const newStatuses = [...currentStatuses]
          newStatuses[prev] = "done"
          newStatuses[next] = "processing"
          return newStatuses
        })
        return next
      })
    }, 2500)

    const checkTimer = setInterval(() => {
      const result = localStorage.getItem("qmeet_result") || localStorage.getItem("nexus_result")
      if (result && !redirecting) {
        clearInterval(progressTimer)
        clearInterval(checkTimer)
        setRedirecting(true)
        setStatuses(["done", "done", "done", "done", "done", "done"])
        setCurrentAgentIdx(AGENTS.length)
        setTimeout(() => {
          try {
            const data = JSON.parse(result)
            if (data.meeting_id) router.push("/dashboard/" + data.meeting_id)
          } catch (e) {}
        }, 1800)
      }
    }, 500)

    return () => {
      clearInterval(progressTimer)
      clearInterval(checkTimer)
    }
  }, [router, redirecting])

  const completedCount = statuses.filter(s => s === "done").length
  const progress = (completedCount / AGENTS.length) * 100
  const allDone = completedCount === AGENTS.length

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900">QMEET</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={"w-2 h-2 rounded-full " + (allDone ? "bg-green-500" : "bg-blue-500 animate-pulse")}></div>
            <span className="text-[13px] text-gray-600 font-medium">
              {allDone ? "Complete — opening dashboard" : "Analyzing meeting"}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Progress Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2383E2] animate-pulse"></div>
            <span className="text-[11px] font-semibold text-[#2383E2] tracking-wide uppercase">Live processing</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {allDone ? "Analysis complete" : "AI Analysis in progress"}
          </h1>
          <p className="text-gray-600 mb-6">
            {allDone ? "Preparing your dashboard..." : "6 specialized agents are processing your meeting"}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</span>
              <span className="text-xs font-bold text-gray-900">{completedCount} / {AGENTS.length} agents</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2383E2] rounded-full transition-all duration-500" style={{ width: progress + "%" }}></div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {AGENTS.map((agent, idx) => {
            const status = statuses[idx]
            const Icon = agent.icon
            return (
              <div key={agent.id} className={"p-4 rounded-xl border transition-all bg-white " + 
                (status === "done" ? "border-green-200 bg-green-50/40" : 
                 status === "processing" ? "border-[#2383E2] bg-blue-50/50 shadow-md scale-[1.01]" : 
                 "border-gray-200")}>
                <div className="flex items-center gap-3">
                  <div className={"w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 " + 
                    (status === "done" ? "bg-green-100" : 
                     status === "processing" ? "bg-[#2383E2]/10" : 
                     "bg-gray-100")}>
                    {status === "done" ? <Check className="w-5 h-5 text-green-600" /> : 
                     status === "processing" ? <Loader2 className="w-5 h-5 text-[#2383E2] animate-spin" /> : 
                     <Icon className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={"text-sm font-semibold " + 
                        (status === "done" ? "text-green-900" : 
                         status === "processing" ? "text-gray-900" : 
                         "text-gray-500")}>
                        {agent.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400 font-semibold">· {agent.tag}</span>
                    </div>
                    <p className={"text-xs " + (status === "waiting" ? "text-gray-400" : "text-gray-600")}>
                      {status === "processing" ? agent.detail : agent.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {status === "processing" && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#2383E2] text-white rounded-full font-semibold animate-pulse">
                        RUNNING
                      </span>
                    )}
                    {status === "done" && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-600 text-white rounded-full font-semibold">
                        DONE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Extraction Feed */}
        {liveItems.length > 0 && (
          <div className="p-5 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2383E2] animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Live extraction feed</span>
              </div>
              <span className="text-xs font-semibold text-[#2383E2] bg-blue-50 px-2 py-0.5 rounded-full">
                {liveItems.length} items detected
              </span>
            </div>
            <div className="space-y-1.5">
              {liveItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                  <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}