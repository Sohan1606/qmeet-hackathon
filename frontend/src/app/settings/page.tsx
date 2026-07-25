"use client"

import { useState } from "react"
import { Zap, Home, Calendar, BarChart3, Users, Activity, Settings, User, Bell, CreditCard, Shield, Users as TeamIcon, Link as LinkIcon, LogOut, Camera, Check } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "team", label: "Team Members", icon: TeamIcon },
    { id: "integrations", label: "Integrations", icon: LinkIcon },
    { id: "security", label: "Security", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex">
      
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[14px] font-semibold text-gray-900">QMEET</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-[#2383E2] rounded font-semibold ml-auto">Pro</span>
          </div>
        </div>
        <nav className="flex-1 p-2">
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Workspace</p>
            <a href="/" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]"><Home className="w-3.5 h-3.5" /> Home</a>
            <a href="/meetings" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]"><Calendar className="w-3.5 h-3.5" /> Meetings</a>
            <a href="/analytics" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]"><BarChart3 className="w-3.5 h-3.5" /> Analytics</a>
            <a href="/team" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]"><Users className="w-3.5 h-3.5" /> Team</a>
            <a href="/integrations" className="flex items-center gap-2 px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 font-medium text-[13px]"><Activity className="w-3.5 h-3.5" /> Integrations</a>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Account</p>
            <a href="/settings" className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 text-gray-900 font-medium text-[13px]"><Settings className="w-3.5 h-3.5" /> Settings</a>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-100 bg-white px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your account, workspace, and preferences</p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Settings sidebar */}
          <div className="w-56 border-r border-gray-100 bg-white p-2 overflow-y-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"w-full flex items-center gap-2 px-3 py-2 rounded text-[13px] font-medium transition-colors " + (activeTab === tab.id ? "bg-blue-50 text-[#2383E2]" : "text-gray-600 hover:bg-gray-50")}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-[13px] font-medium text-red-600 hover:bg-red-50">
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </div>

          {/* Settings content */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Profile</h2>
                <p className="text-sm text-gray-600 mb-6">This information will be displayed publicly</p>

                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2383E2] to-blue-700 flex items-center justify-center text-white text-2xl font-bold">JD</div>
                      <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50">
                        <Camera className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500 mb-1">Project Manager at Acme Corp</p>
                      <button className="text-xs text-[#2383E2] font-semibold hover:underline">Change photo</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">First name</label>
                      <input type="text" defaultValue="John" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last name</label>
                      <input type="text" defaultValue="Doe" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                      <input type="email" defaultValue="john@acmecorp.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role / Title</label>
                      <input type="text" defaultValue="Project Manager" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
                      <textarea rows="3" defaultValue="Leading product initiatives at Acme Corp. Passionate about building efficient teams." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] text-sm resize-none"></textarea>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Cancel</button>
                    <button onClick={handleSave} className={"px-4 py-2 text-sm font-semibold rounded-lg transition-all " + (saved ? "bg-green-500 text-white" : "bg-[#2383E2] text-white hover:bg-[#1a6dc4]")}>
                      {saved ? (<span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" />Saved</span>) : "Save changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Notifications</h2>
                <p className="text-sm text-gray-600 mb-6">Control how and when QMEET notifies you</p>

                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                  {[
                    { title: "New meeting analyzed", desc: "When QMEET finishes analyzing a meeting", email: true, push: true, slack: false },
                    { title: "Task assigned to me", desc: "When someone assigns you a task from a meeting", email: true, push: true, slack: true },
                    { title: "Deadline reminders", desc: "Reminder emails before task deadlines", email: true, push: false, slack: true },
                    { title: "Meeting effectiveness reports", desc: "Weekly summary of team performance", email: true, push: false, slack: false },
                    { title: "Escalations", desc: "When AI escalates a missed deadline to your manager", email: true, push: true, slack: true }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{notif.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{notif.desc}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" defaultChecked={notif.email} className="rounded border-gray-300 text-[#2383E2]" />
                          <span className="text-xs text-gray-600">Email</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" defaultChecked={notif.push} className="rounded border-gray-300 text-[#2383E2]" />
                          <span className="text-xs text-gray-600">Push</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" defaultChecked={notif.slack} className="rounded border-gray-300 text-[#2383E2]" />
                          <span className="text-xs text-gray-600">Slack</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="max-w-3xl">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Billing & Plan</h2>
                <p className="text-sm text-gray-600 mb-6">Manage your subscription and billing information</p>

                <div className="p-6 bg-gradient-to-br from-[#2383E2] to-blue-700 rounded-xl text-white mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs opacity-80 uppercase tracking-wider font-semibold mb-1">Current Plan</div>
                      <div className="text-2xl font-bold">Pro</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">Rs 1,499</div>
                      <div className="text-xs opacity-80">per user/month</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
                    <div>
                      <div className="text-lg font-bold">Unlimited</div>
                      <div className="text-xs opacity-80">Meetings/month</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">5 seats</div>
                      <div className="text-xs opacity-80">Team members</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">Aug 25</div>
                      <div className="text-xs opacity-80">Next billing</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Payment method</h3>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-6 rounded bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</div>
                      <div className="text-xs text-gray-500">Expires 12/2028</div>
                    </div>
                    <button className="text-xs text-[#2383E2] font-semibold hover:underline">Update</button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Billing history</h3>
                  <div className="space-y-2">
                    {[
                      { date: "July 25, 2026", amount: "Rs 7,495", status: "Paid" },
                      { date: "June 25, 2026", amount: "Rs 7,495", status: "Paid" },
                      { date: "May 25, 2026", amount: "Rs 4,497", status: "Paid" }
                    ].map((inv, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inv.date}</div>
                          <div className="text-xs text-gray-500">Pro Plan · 5 users</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{inv.status}</span>
                          <span className="text-sm font-bold text-gray-900">{inv.amount}</span>
                          <button className="text-xs text-[#2383E2] font-semibold hover:underline">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
                    <p className="text-sm text-gray-600">Manage who has access to your workspace</p>
                  </div>
                  <button className="px-4 py-2 bg-[#2383E2] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6dc4]">Invite member</button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {[
                    { name: "John Doe", email: "john@acmecorp.com", role: "Admin", status: "Active" },
                    { name: "Sarah Kim", email: "sarah@acmecorp.com", role: "Member", status: "Active" },
                    { name: "Mike Chen", email: "mike@acmecorp.com", role: "Member", status: "Active" },
                    { name: "Priya Sharma", email: "priya@acmecorp.com", role: "Member", status: "Invited" }
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2383E2]/10 flex items-center justify-center text-xs font-semibold text-[#2383E2]">{m.name.split(" ").map(n => n[0]).join("")}</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{m.name}</div>
                          <div className="text-xs text-gray-500">{m.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + (m.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>{m.status}</span>
                        <select defaultValue={m.role} className="text-xs px-2 py-1 border border-gray-200 rounded">
                          <option>Admin</option>
                          <option>Member</option>
                          <option>Viewer</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="max-w-3xl">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Integrations</h2>
                <p className="text-sm text-gray-600 mb-6">Connect QMEET with your favorite tools</p>
                <a href="/integrations" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6dc4]">
                  View all integrations →
                </a>
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Security</h2>
                <p className="text-sm text-gray-600 mb-6">Protect your account with additional security measures</p>

                <div className="space-y-3">
                  <div className="p-5 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-gray-900">Two-Factor Authentication</h3>
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">Off</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Add an extra layer of security to your account</p>
                    <button className="px-3 py-1.5 bg-[#2383E2] text-white rounded text-xs font-semibold hover:bg-[#1a6dc4]">Enable 2FA</button>
                  </div>

                  <div className="p-5 bg-white rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Change password</h3>
                    <p className="text-xs text-gray-500 mb-3">Last changed 30 days ago</p>
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50">Change password</button>
                  </div>

                  <div className="p-5 bg-white rounded-lg border border-red-200">
                    <h3 className="text-sm font-bold text-red-900 mb-1">Delete account</h3>
                    <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all data. This cannot be undone.</p>
                    <button className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700">Delete account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}