"use client"

import { useState } from "react"
import { Search, Star, X, CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react"

type TaskStatus = "done" | "pending" | "in-progress" | "overdue"

interface Task {
  id: number
  title: string
  status: TaskStatus
  dueDate: string
  priority: "high" | "medium" | "low"
  meeting: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
  tasks: number
  completed: number
  rate: number
  avgTime: string
  color: string
  topPerformer: boolean
  taskList: Task[]
}

export default function TeamPage() {
  const [search, setSearch] = useState("")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "done" | "overdue">("all")

  const teamMembers: TeamMember[] = [
    {
      id: 1, name: "Sarah Kim", role: "Senior Designer", email: "sarah@acmecorp.com",
      tasks: 24, completed: 22, rate: 92, avgTime: "1.2 days", color: "bg-purple-500", topPerformer: true,
      taskList: [
        { id: 1, title: "Redesign landing page hero section", status: "done", dueDate: "2026-07-20", priority: "high", meeting: "Q3 Design Review" },
        { id: 2, title: "Create new icon set for dashboard", status: "done", dueDate: "2026-07-18", priority: "medium", meeting: "Design Sync" },
        { id: 3, title: "Update brand guidelines document", status: "pending", dueDate: "2026-07-30", priority: "medium", meeting: "Marketing Sync" },
        { id: 4, title: "Mobile app onboarding flow mockups", status: "pending", dueDate: "2026-07-22", priority: "high", meeting: "Product Standup" },
        { id: 5, title: "User research report presentation", status: "done", dueDate: "2026-07-15", priority: "high", meeting: "UX Review" },
        { id: 6, title: "Design system component library", status: "done", dueDate: "2026-07-10", priority: "medium", meeting: "Engineering Sync" },
      ]
    },
    {
      id: 2, name: "Mike Chen", role: "Lead Developer", email: "mike@acmecorp.com",
      tasks: 31, completed: 27, rate: 87, avgTime: "1.8 days", color: "bg-blue-500", topPerformer: false,
      taskList: [
        { id: 1, title: "Implement authentication middleware", status: "done", dueDate: "2026-07-19", priority: "high", meeting: "Sprint Planning" },
        { id: 2, title: "Optimize database queries for reports", status: "done", dueDate: "2026-07-17", priority: "high", meeting: "Backend Review" },
        { id: 3, title: "Code review for new API endpoints", status: "pending", dueDate: "2026-07-25", priority: "medium", meeting: "Engineering Sync" },
        { id: 4, title: "Deploy staging environment", status: "in-progress", dueDate: "2026-07-24", priority: "high", meeting: "DevOps Standup" },
        { id: 5, title: "Fix WebSocket reconnection bug", status: "overdue", dueDate: "2026-07-18", priority: "high", meeting: "Bug Triage" },
        { id: 6, title: "Refactor payment integration module", status: "pending", dueDate: "2026-07-28", priority: "medium", meeting: "Sprint Planning" },
      ]
    },
    {
      id: 3, name: "Priya Sharma", role: "Marketing Head", email: "priya@acmecorp.com",
      tasks: 18, completed: 15, rate: 83, avgTime: "2.1 days", color: "bg-pink-500", topPerformer: false,
      taskList: [
        { id: 1, title: "Launch Q3 email campaign", status: "done", dueDate: "2026-07-16", priority: "high", meeting: "Marketing Sync" },
        { id: 2, title: "Prepare investor deck presentation", status: "pending", dueDate: "2026-07-26", priority: "high", meeting: "Leadership Meeting" },
        { id: 3, title: "Social media content calendar", status: "done", dueDate: "2026-07-14", priority: "medium", meeting: "Content Planning" },
        { id: 4, title: "Analyze competitor landing pages", status: "in-progress", dueDate: "2026-07-23", priority: "low", meeting: "Marketing Sync" },
        { id: 5, title: "Partnership outreach follow-ups", status: "overdue", dueDate: "2026-07-17", priority: "medium", meeting: "BD Sync" },
      ]
    },
    {
      id: 4, name: "John Doe", role: "Project Manager", email: "john@acmecorp.com",
      tasks: 42, completed: 34, rate: 81, avgTime: "1.5 days", color: "bg-emerald-500", topPerformer: false,
      taskList: [
        { id: 1, title: "Update project roadmap for Q4", status: "pending", dueDate: "2026-07-27", priority: "high", meeting: "Leadership Meeting" },
        { id: 2, title: "Sprint retrospective notes", status: "done", dueDate: "2026-07-19", priority: "medium", meeting: "Sprint Retro" },
        { id: 3, title: "Stakeholder status report", status: "done", dueDate: "2026-07-15", priority: "high", meeting: "Client Sync" },
        { id: 4, title: "Resource allocation review", status: "in-progress", dueDate: "2026-07-25", priority: "medium", meeting: "Ops Review" },
        { id: 5, title: "Risk assessment document", status: "overdue", dueDate: "2026-07-16", priority: "high", meeting: "Leadership Meeting" },
        { id: 6, title: "Onboard 2 new engineers", status: "pending", dueDate: "2026-07-29", priority: "medium", meeting: "HR Sync" },
      ]
    },
    {
      id: 5, name: "Rahul Verma", role: "DevOps Engineer", email: "rahul@acmecorp.com",
      tasks: 15, completed: 11, rate: 73, avgTime: "2.8 days", color: "bg-orange-500", topPerformer: false,
      taskList: [
        { id: 1, title: "Setup CI/CD pipeline for new service", status: "done", dueDate: "2026-07-18", priority: "high", meeting: "DevOps Standup" },
        { id: 2, title: "Kubernetes cluster upgrade", status: "in-progress", dueDate: "2026-07-24", priority: "high", meeting: "Infra Review" },
        { id: 3, title: "Monitor production alerts config", status: "pending", dueDate: "2026-07-26", priority: "medium", meeting: "DevOps Standup" },
        { id: 4, title: "Database backup automation", status: "overdue", dueDate: "2026-07-15", priority: "high", meeting: "Infra Review" },
        { id: 5, title: "Load testing on staging", status: "overdue", dueDate: "2026-07-17", priority: "medium", meeting: "QA Sync" },
      ]
    },
    {
      id: 6, name: "Ananya Iyer", role: "QA Engineer", email: "ananya@acmecorp.com",
      tasks: 28, completed: 24, rate: 86, avgTime: "1.4 days", color: "bg-teal-500", topPerformer: false,
      taskList: [
        { id: 1, title: "Regression testing for v2.4 release", status: "done", dueDate: "2026-07-19", priority: "high", meeting: "QA Sync" },
        { id: 2, title: "Automate login flow test cases", status: "done", dueDate: "2026-07-17", priority: "medium", meeting: "QA Sync" },
        { id: 3, title: "Bug triage for reported issues", status: "in-progress", dueDate: "2026-07-23", priority: "high", meeting: "Bug Triage" },
        { id: 4, title: "Performance testing report", status: "pending", dueDate: "2026-07-26", priority: "medium", meeting: "Engineering Sync" },
        { id: 5, title: "Update test documentation", status: "pending", dueDate: "2026-07-28", priority: "low", meeting: "QA Sync" },
      ]
    }
  ]

  const filtered = teamMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  const getFilteredTasks = (member: TeamMember) => {
    if (activeTab === "all") return member.taskList
    if (activeTab === "done") return member.taskList.filter(t => t.status === "done")
    if (activeTab === "pending") return member.taskList.filter(t => t.status === "pending" || t.status === "in-progress")
    if (activeTab === "overdue") return member.taskList.filter(t => t.status === "overdue")
    return member.taskList
  }

  const getStatusIcon = (status: TaskStatus) => {
    if (status === "done") return <CheckCircle2 className="w-4 h-4 text-green-500" />
    if (status === "overdue") return <AlertCircle className="w-4 h-4 text-red-500" />
    if (status === "in-progress") return <Clock className="w-4 h-4 text-blue-500" />
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  const getStatusBadge = (status: TaskStatus) => {
    const styles = {
      done: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      "in-progress": "bg-blue-100 text-blue-700",
      overdue: "bg-red-100 text-red-700"
    }
    return styles[status]
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-red-50 text-red-600 border-red-200",
      medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
      low: "bg-gray-50 text-gray-600 border-gray-200"
    }
    return styles[priority as keyof typeof styles]
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Team Accountability</h1>
        <p className="text-xs text-gray-500">Track individual performance and reliability across your organization</p>
      </div>

      <div className="border-b border-gray-100 bg-white px-6 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#2383E2]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(member => (
            <div
              key={member.id}
              onClick={() => { setSelectedMember(member); setActiveTab("all") }}
              className="p-5 bg-white rounded-lg border border-gray-200 hover:border-[#2383E2] hover:shadow-md transition-all relative cursor-pointer"
            >
              {member.topPerformer && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  TOP PERFORMER
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={"w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold " + member.color}>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">Reliability Score</span>
                  <span className="text-lg font-bold text-gray-900">{member.rate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={"h-full rounded-full transition-all " + (member.rate >= 90 ? "bg-green-500" : member.rate >= 80 ? "bg-[#2383E2]" : "bg-yellow-500")}
                    style={{ width: member.rate + "%" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Tasks</div>
                  <div className="text-sm font-bold text-gray-900">{member.tasks}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Done</div>
                  <div className="text-sm font-bold text-green-600">{member.completed}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Avg Time</div>
                  <div className="text-sm font-bold text-gray-900">{member.avgTime}</div>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-[#2383E2] font-semibold flex items-center gap-1">
                View task details →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== TASK DETAILS MODAL ==================== */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={"w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold " + selectedMember.color}>
                  {selectedMember.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedMember.name}'s Tasks</h2>
                  <p className="text-xs text-gray-500">{selectedMember.role} · {selectedMember.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 border-b border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{selectedMember.taskList.length}</div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedMember.taskList.filter(t => t.status === "done").length}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {selectedMember.taskList.filter(t => t.status === "pending" || t.status === "in-progress").length}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {selectedMember.taskList.filter(t => t.status === "overdue").length}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Overdue</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 px-6 pt-3 border-b border-gray-100">
              {(["all", "pending", "done", "overdue"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={"px-4 py-2 text-xs font-semibold capitalize transition-colors border-b-2 " +
                    (activeTab === tab ? "text-[#2383E2] border-[#2383E2]" : "text-gray-500 border-transparent hover:text-gray-700")}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4">
              {getFilteredTasks(selectedMember).length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-500">
                  No tasks in this category
                </div>
              ) : (
                <div className="space-y-2">
                  {getFilteredTasks(selectedMember).map(task => (
                    <div
                      key={task.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2383E2] hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-gray-900">{task.title}</h4>
                            <span className={"text-[10px] font-bold px-2 py-0.5 rounded uppercase " + getStatusBadge(task.status)}>
                              {task.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            <span>· {task.meeting}</span>
                            <span className={"text-[10px] font-semibold px-2 py-0.5 rounded border " + getPriorityBadge(task.priority)}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}