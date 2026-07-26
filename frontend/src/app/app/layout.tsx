"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Zap, Home, Calendar, Users, Activity, Settings, LogOut, Plus, MessageSquare, BarChart3, Heart, Bell, Mail, AlertTriangle, CheckCircle, Sparkles } from "lucide-react"
import axios from "axios"
import ReportBugButton from "../components/ReportBugButton"
import NewMeetingModal from "../components/NewMeetingModal"
import ProcessingWidget from "../components/ProcessingWidget"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [newMeetingOpen, setNewMeetingOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("qmeet_user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    try { setUser(JSON.parse(storedUser)) } catch (e) {}
    setChecked(true)

    const storedRead = localStorage.getItem("qmeet_read_notifications")
    if (storedRead) {
      try { setReadIds(JSON.parse(storedRead)) } catch (e) {}
    }
  }, [router])

  useEffect(() => {
    if (!checked) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [checked])

  const fetchNotifications = async () => {
    try {
      const notifs = []
      const now = new Date()

      try {
        const overdueRes = await axios.get(API_URL + "/api/grace/overdue/demo-user")
        const overdueItems = overdueRes.data.overdue_items || []
        overdueItems.slice(0, 3).forEach((item, idx) => {
          notifs.push({
            id: "grace-" + (item.id || idx),
            type: "grace",
            title: "Grace Protocol activated",
            message: (item.owner_name || "Someone") + " has an overdue task: " + (item.task || "").substring(0, 40),
            time: new Date(now.getTime() - (idx + 1) * 15 * 60000),
            link: "/app/grace"
          })
        })
      } catch (e) {}

      try {
        const meetRes = await axios.get(API_URL + "/api/meetings/demo-user")
        const meetings = meetRes.data.meetings || []
        meetings.slice(0, 3).forEach((m, idx) => {
          notifs.push({
            id: "meeting-" + (m.id || idx),
            type: "meeting",
            title: "Meeting analyzed",
            message: (m.title || "Untitled") + " - " + (m.action_items_count || 0) + " action items extracted",
            time: new Date(m.created_at || (now.getTime() - (idx + 1) * 60 * 60000)),
            link: "/app/meetings/" + m.id
          })
        })
      } catch (e) {}

      if (notifs.length === 0) {
        notifs.push({
          id: "welcome-1",
          type: "info",
          title: "Welcome to QMEET",
          message: "Start by analyzing your first meeting from the sidebar",
          time: new Date(now.getTime() - 5 * 60000),
          link: "/app"
        })
      }

      notifs.sort((a, b) => b.time - a.time)
      setNotifications(notifs.slice(0, 10))
    } catch (e) {
      console.error("Notification fetch error:", e)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("qmeet_user")
    localStorage.removeItem("qmeet_intro_ever_shown")
    sessionStorage.removeItem("qmeet_intro_shown")
    router.push("/")
  }

  const handleOpenNotif = () => {
    setNotifOpen(!notifOpen)
    if (!notifOpen) {
      const allIds = notifications.map(n => n.id)
      setReadIds(allIds)
      localStorage.setItem("qmeet_read_notifications", JSON.stringify(allIds))
    }
  }

  const handleNotifClick = (notif) => {
    setNotifOpen(false)
    if (notif.link) router.push(notif.link)
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return minutes + " min ago"
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return hours + "h ago"
    const days = Math.floor(hours / 24)
    return days + "d ago"
  }

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length

  if (!checked || !user) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
  }

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U"

  const navItems = [
    { href: "/app", label: "Home", icon: Home, exact: true },
    { href: "/app/meetings", label: "Meetings", icon: Calendar },
    { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/app/team", label: "Team", icon: Users },
    { href: "/app/grace", label: "Grace Protocol", icon: Heart },
    { href: "/app/digest", label: "Weekly Digest", icon: Mail },
    { href: "/app/integrations", label: "Integrations", icon: Activity }
  ]

  const bottomItems = [
    { href: "/app/settings", label: "Settings", icon: Settings },
    { href: "/contact", label: "Help & Support", icon: MessageSquare }
  ]

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const getNotifIcon = (type) => {
    if (type === "grace") return { Icon: AlertTriangle, color: "text-orange-600 bg-orange-100" }
    if (type === "meeting") return { Icon: CheckCircle, color: "text-green-600 bg-green-100" }
    return { Icon: Sparkles, color: "text-blue-600 bg-blue-100" }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-screen z-30">
        <div className="p-3 border-b border-gray-100">
          <a href="/app" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[14px] font-semibold text-gray-900">QMEET</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-semibold ml-auto">Pro</span>
          </a>
        </div>

        <div className="p-3">
          <button 
            onClick={() => setNewMeetingOpen(true)} 
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[13px] font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Workspace</p>
            {navItems.map(item => (
              <a key={item.href} href={item.href} className={"flex items-center gap-2 px-2 py-1.5 rounded font-medium text-[13px] " + (isActive(item) ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}>
                <item.icon className="w-3.5 h-3.5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded font-bold">{item.badge}</span>}
              </a>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Account</p>
            {bottomItems.map(item => (
              <a key={item.href} href={item.href} className={"flex items-center gap-2 px-2 py-1.5 rounded font-medium text-[13px] " + (isActive(item) ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}>
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="p-2 border-t border-gray-100">
          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-gray-900 truncate">{user.name || "User"}</div>
              <div className="text-[10px] text-gray-500 truncate">{user.company || "Workspace"}</div>
            </div>
            <button onClick={handleSignOut} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed top-0 right-0 left-56 z-20 h-14 bg-white border-b border-gray-100 flex items-center justify-end gap-2 px-6">
        <div className="relative">
          <button onClick={handleOpenNotif} className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>
              </span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                  <button onClick={fetchNotifications} className="text-[11px] text-blue-600 font-semibold hover:underline">
                    Refresh
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => {
                      const { Icon, color } = getNotifIcon(notif.type)
                      return (
                        <div key={notif.id} onClick={() => handleNotifClick(notif)} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + color}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900">{notif.title}</p>
                              <p className="text-[11px] text-gray-600 truncate">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{getTimeAgo(notif.time)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                  <span className="text-[10px] text-gray-500">Auto-refreshes every 30 seconds</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden ml-56 pt-14">{children}</div>
      
      <NewMeetingModal open={newMeetingOpen} onClose={() => setNewMeetingOpen(false)} />
      <ProcessingWidget />
      <ReportBugButton />
    </div>
  )
}
