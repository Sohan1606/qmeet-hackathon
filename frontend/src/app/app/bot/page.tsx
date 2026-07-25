"use client"

import { useState } from "react"
import { Video, Calendar, Check, Clock, Users, Zap, Play, Circle, Mic, MicOff, Volume2, MonitorPlay, ArrowRight, Bell } from "lucide-react"

export default function BotPage() {
  const [botActive, setBotActive] = useState(false)
  const [connected, setConnected] = useState(false)

  const upcomingMeetings = [
    { title: "Q3 Product Review", time: "In 15 minutes", platform: "Google Meet", attendees: 6, willJoin: true },
    { title: "Marketing Sync", time: "Tomorrow 10 AM", platform: "Zoom", attendees: 4, willJoin: true },
    { title: "1:1 with Sarah", time: "Tomorrow 2 PM", platform: "Microsoft Teams", attendees: 2, willJoin: false }
  ]

  const platforms = [
    { name: "Google Meet", icon: "🎥", status: "connected", color: "bg-red-100 text-red-700" },
    { name: "Zoom", icon: "📹", status: "connected", color: "bg-blue-100 text-blue-700" },
    { name: "Microsoft Teams", icon: "👥", status: connected ? "connected" : "connect", color: "bg-purple-100 text-purple-700" }
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <header className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">Meeting Bot</h1>
              <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-full font-bold uppercase tracking-wide">AUTO-JOIN</span>
            </div>
            <p className="text-xs text-gray-500">QMEET automatically joins your meetings and analyzes them in real-time</p>
          </div>
          <div className={"flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold " + (botActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
            <div className={"w-2 h-2 rounded-full " + (botActive ? "bg-green-500 animate-pulse" : "bg-gray-400")}></div>
            {botActive ? "Bot Active" : "Bot Inactive"}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        
        {/* Hero Toggle */}
        <div className="mb-6 p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">Meeting Bot Automation</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Never manually record another meeting</h2>
              <p className="text-white/90 mb-6 max-w-xl">QMEET Bot auto-joins your Zoom, Google Meet, and Teams calls. Records, transcribes, extracts action items — all without you clicking a single button.</p>
              
              <button 
                onClick={() => setBotActive(!botActive)}
                className={"px-6 py-3 rounded-lg font-semibold text-sm transition-all " + (botActive ? "bg-red-500 text-white hover:bg-red-600" : "bg-white text-blue-700 hover:bg-gray-50")}
              >
                {botActive ? "Deactivate Bot" : "Activate Meeting Bot"}
              </button>
            </div>
            <div className="hidden md:block">
              <div className="w-40 h-40 rounded-2xl bg-white/10 flex items-center justify-center">
                <div className="text-6xl">🤖</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Meeting Simulator */}
        {botActive && (
          <div className="mb-6 p-6 bg-black rounded-2xl text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full">
              <Circle className="w-2 h-2 fill-white animate-pulse" />
              <span className="text-xs font-bold">RECORDING</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">QMEET Bot is in the meeting</div>
                <div className="text-xs text-gray-400">Q3 Product Review · 12 minutes elapsed</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {["John Doe", "Sarah Kim", "Mike Chen", "Priya S.", "Rahul V.", "QMEET Bot"].map((name, i) => (
                <div key={i} className={"aspect-video rounded-lg flex items-center justify-center relative " + (name === "QMEET Bot" ? "bg-gradient-to-br from-blue-600 to-purple-700 border-2 border-blue-400" : "bg-gray-800")}>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                      {name === "QMEET Bot" ? <Zap className="w-6 h-6" /> : <span className="text-lg font-bold">{name.split(" ").map(n => n[0]).join("")}</span>}
                    </div>
                    <div className="text-[10px] font-semibold">{name}</div>
                  </div>
                  {name === "QMEET Bot" && (
                    <div className="absolute top-1 right-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs font-semibold">Live Transcription</span>
              </div>
              <div className="text-sm text-gray-300 font-mono leading-relaxed">
                <span className="text-blue-400">John:</span> Let's discuss the Q3 launch...<br/>
                <span className="text-green-400">Sarah:</span> I'll have designs ready by Friday...<br/>
                <span className="text-purple-400">Mike:</span> Yes, I can complete the architecture doc by next Wednesday...<br/>
                <span className="text-gray-500 italic">... continuing to listen ...</span>
              </div>
            </div>
          </div>
        )}

        {/* Connected Platforms */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {platforms.map((p, i) => (
            <div key={i} className="p-5 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{p.icon}</div>
                <span className={"text-[10px] px-2 py-1 rounded-full font-semibold " + p.color}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{p.name}</h3>
              <p className="text-xs text-gray-500 mb-3">
                {p.status === "connected" ? "Bot will auto-join meetings" : "Click to enable auto-join"}
              </p>
              {p.status === "connected" ? (
                <button className="text-xs text-red-600 font-semibold hover:underline">Disconnect</button>
              ) : (
                <button onClick={() => setConnected(true)} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Upcoming Meetings */}
        <div className="p-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Upcoming Meetings</h3>
              <p className="text-xs text-gray-500">Bot will auto-join these meetings</p>
            </div>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingMeetings.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{m.title}</span>
                    {m.willJoin && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        BOT WILL JOIN
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {m.time}
                    </span>
                    <span>·</span>
                    <span>{m.platform}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {m.attendees} attendees
                    </span>
                  </div>
                </div>
                {m.willJoin ? (
                  <button className="text-xs text-red-600 font-semibold hover:underline">
                    Cancel
                  </button>
                ) : (
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">
                    Auto-join
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}