"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { KanbanBoard } from "@/components/kanban-board"
import { ChatPanel } from "@/components/chat-panel"
import { VideoCallModal } from "@/components/video-call-modal"
import { GitHubPanel } from "@/components/github-panel"
import { AIAssistant } from "@/components/ai-assistant"
import { CalendarModal } from "@/components/calendar-modal"
import {
  ArrowLeft,
  Plus,
  Settings,
  Users,
  Calendar,
  MoreVertical,
  UserPlus,
  MessageSquare,
  Video,
  Github,
  Bot,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProjectWorkspace({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  })
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [isGitHubOpen, setIsGitHubOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: "",
    deadline: "",
    priority: "medium",
    tags: "",
  })
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("")

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("synergy-projects") || "[]")
    const currentProject = projects.find((p: any) => p.id === params.id)

    if (currentProject) {
      setProject(currentProject)
      // Load tasks for this project
      const projectTasks = JSON.parse(
        localStorage.getItem(`synergy-tasks-${params.id}`) || '{"todo":[],"inProgress":[],"done":[]}',
      )
      setTasks(projectTasks)
    }
  }, [params.id])

  useEffect(() => {
    if (project && tasks) {
      // Save tasks to localStorage
      localStorage.setItem(`synergy-tasks-${params.id}`, JSON.stringify(tasks))

      // Calculate task completion and update project
      const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length
      const completedTasks = tasks.done.length

      const updatedProject = {
        ...project,
        taskCount: totalTasks,
        completedTasks: completedTasks,
        updatedAt: new Date().toISOString(),
      }

      // Update project in localStorage
      const projects = JSON.parse(localStorage.getItem("synergy-projects") || "[]")
      const updatedProjects = projects.map((p: any) => (p.id === params.id ? updatedProject : p))
      localStorage.setItem("synergy-projects", JSON.stringify(updatedProjects))

      // If project is 100% complete, add to completed projects for /work page
      if (totalTasks > 0 && completedTasks === totalTasks) {
        const completedProjects = JSON.parse(localStorage.getItem("synergy-completed-projects") || "[]")
        const isAlreadyCompleted = completedProjects.some((cp: any) => cp.id === params.id)

        if (!isAlreadyCompleted) {
          const completedProject = {
            ...updatedProject,
            completedAt: new Date().toISOString(),
            progress: 100,
          }
          completedProjects.push(completedProject)
          localStorage.setItem("synergy-completed-projects", JSON.stringify(completedProjects))
        }
      }

      setProject(updatedProject)
    }
  }, [tasks, params.id])

  const handleAddTask = () => {
    if (!newTask.title.trim() || !project) return

    const assignee = project.members?.find((m: any) => m.id.toString() === newTask.assigneeId) || {
      id: "current-user",
      name: "You",
      initials: "YU",
      role: "Owner",
    }

    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignee,
      deadline: newTask.deadline,
      priority: newTask.priority as "low" | "medium" | "high",
      tags: newTask.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, task],
    }))

    setNewTask({
      title: "",
      description: "",
      assigneeId: "",
      deadline: "",
      priority: "medium",
      tags: "",
    })
    setIsAddTaskOpen(false)
  }

  const handleAddMember = () => {
    if (!newMemberEmail.trim() || !newMemberRole || !project) return

    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      initials: newMemberEmail.substring(0, 2).toUpperCase(),
      role: newMemberRole,
      status: "invited",
      joinedAt: new Date().toISOString(),
    }

    const updatedProject = {
      ...project,
      members: [...(project.members || []), newMember],
      updatedAt: new Date().toISOString(),
    }

    setProject(updatedProject)

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("synergy-projects") || "[]")
    const updatedProjects = projects.map((p: any) => (p.id === params.id ? updatedProject : p))
    localStorage.setItem("synergy-projects", JSON.stringify(updatedProjects))

    setNewMemberEmail("")
    setNewMemberRole("")
    setIsAddMemberOpen(false)
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length
  const completedTasks = tasks.done.length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Back button and project info */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold text-lg text-foreground">{project.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {project.deadline && <span>Due {new Date(project.deadline).toLocaleDateString()}</span>}
                  <span>{progressPercentage}% Complete</span>
                  <span>
                    {completedTasks}/{totalTasks} Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Team members */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {(project.members || []).slice(0, 4).map((member: any) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          placeholder="colleague@company.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="manager">Project Manager</SelectItem>
                            <SelectItem value="qa">QA Tester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={handleAddMember}>
                        Send Invitation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* AI Assistant toggle button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
                className={isAIAssistantOpen ? "bg-primary text-primary-foreground" : "bg-transparent"}
              >
                <Bot className="h-4 w-4" />
              </Button>

              {/* Calendar button */}
              <Button variant="outline" size="icon" onClick={() => setIsCalendarOpen(true)} className="bg-transparent">
                <Calendar className="h-4 w-4" />
              </Button>

              {/* Video call button */}
              <Button variant="outline" size="icon" onClick={() => setIsVideoCallOpen(true)} className="bg-transparent">
                <Video className="h-4 w-4" />
              </Button>

              {/* GitHub toggle button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsGitHubOpen(!isGitHubOpen)}
                className={isGitHubOpen ? "bg-primary text-primary-foreground" : "bg-transparent"}
              >
                <Github className="h-4 w-4" />
              </Button>

              {/* Chat toggle button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={isChatOpen ? "bg-primary text-primary-foreground" : "bg-transparent"}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>

              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings/team")}>
                    <Users className="h-4 w-4 mr-2" />
                    Team Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCalendarOpen(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <GitHubPanel isOpen={isGitHubOpen} onClose={() => setIsGitHubOpen(false)} projectTitle={project.title} />

        <main
          className={`flex-1 transition-all duration-300 ${isChatOpen ? "mr-80" : ""} ${
            isGitHubOpen ? "ml-80" : ""
          } ${isAIAssistantOpen ? "ml-80" : ""}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
            {/* Project Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                {(project.tags || []).map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {progressPercentage === 100 && (
                  <Badge variant="default" className="bg-green-600">
                    ✓ Completed
                  </Badge>
                )}
              </div>

              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Task description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select
                        value={newTask.assigneeId}
                        onValueChange={(value) => setNewTask((prev) => ({ ...prev, assigneeId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current-user">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">YU</AvatarFallback>
                              </Avatar>
                              <span>You</span>
                            </div>
                          </SelectItem>
                          {(project.members || []).map((member: any) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newTask.deadline}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newTask.tags}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="Design, Frontend, API"
                      />
                    </div>

                    <Button onClick={handleAddTask} className="w-full">
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Kanban Board */}
            <div className="h-[calc(100vh-12rem)] overflow-auto">
              <KanbanBoard tasks={tasks} setTasks={setTasks} projectMembers={project.members || []} />
            </div>
          </div>
        </main>

        <AIAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          projectTitle={project.title}
          tasks={tasks}
        />

        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          projectMembers={project.members || []}
          projectTitle={project.title}
        />
      </div>

      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        projectMembers={project.members || []}
        projectTitle={project.title}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        projectTitle={project.title}
        tasks={tasks}
        projectMembers={project.members || []}
      />
    </div>
  )
}
