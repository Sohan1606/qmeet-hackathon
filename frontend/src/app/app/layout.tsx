"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Zap, Home, Calendar, Users, Activity, Settings, LogOut, Plus, MessageSquare, BarChart3, Heart, Bell, Video, Mail } from "lucide-react"
import ReportBugButton from "../components/ReportBugButton"
import NewMeetingModal from "../components/NewMeetingModal"
import ProcessingWidget from "../components/ProcessingWidget"

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [newMeetingOpen, setNewMeetingOpen] = useState(false)
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
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("qmeet_user")
    localStorage.removeItem("qmeet_intro_ever_shown")
    sessionStorage.removeItem("qmeet_intro_shown")
    router.push("/")
  }

  if (!checked || !user) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
  }

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U"

  const navItems = [
    { href: "/app", label: "Home", icon: Home, exact: true },
    { href: "/app/meetings", label: "Meetings", icon: Calendar },
    { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/app/team", label: "Team", icon: Users },
    { href: "/app/grace", label: "Grace Protocol", icon: Heart, badge: "NEW" },
    { href: "/app/bot", label: "Meeting Bot", icon: Video, badge: "NEW" },
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
        <button 
          onClick={() => setNewMeetingOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Analyze Meeting
        </button>
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Notifications</h3></div>
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-xs font-semibold text-gray-900">Grace Protocol activated</p>
                  <p className="text-[11px] text-gray-600">3 overdue items need attention</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-xs font-semibold text-gray-900">Meeting analyzed</p>
                  <p className="text-[11px] text-gray-600">Q3 Product Launch - 8 items extracted</p>
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