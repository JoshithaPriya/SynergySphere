"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, TrendingUp, CheckCircle } from "lucide-react"

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  tasks: any
  projectMembers: Array<{
    id: number
    name: string
    avatar: string
    initials: string
    role: string
  }>
}

// Generate calendar data
const generateCalendarData = (tasks: any) => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Create calendar grid
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dayTasks = []

    // Add tasks with deadlines on this day
    Object.values(tasks)
      .flat()
      .forEach((task: any) => {
        if (task.deadline) {
          const taskDate = new Date(task.deadline)
          if (
            taskDate.getDate() === day &&
            taskDate.getMonth() === currentMonth &&
            taskDate.getFullYear() === currentYear
          ) {
            dayTasks.push(task)
          }
        }
      })

    calendarDays.push({
      day,
      date,
      tasks: dayTasks,
      isToday: date.toDateString() === today.toDateString(),
    })
  }

  return calendarDays
}

export function CalendarModal({ isOpen, onClose, projectTitle, tasks, projectMembers }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "progress">("calendar")

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const calendarData = generateCalendarData(tasks)

  // Calculate progress statistics
  const allTasks = Object.values(tasks).flat()
  const completedTasks = tasks.done.length
  const totalTasks = allTasks.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100)

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getTasksByMember = () => {
    const tasksByMember = new Map()

    allTasks.forEach((task: any) => {
      const memberId = task.assignee.id
      if (!tasksByMember.has(memberId)) {
        tasksByMember.set(memberId, {
          member: task.assignee,
          total: 0,
          completed: 0,
        })
      }

      const memberData = tasksByMember.get(memberId)
      memberData.total++

      if (tasks.done.includes(task)) {
        memberData.completed++
      }
    })

    return Array.from(tasksByMember.values())
  }

  const memberProgress = getTasksByMember()

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{projectTitle} - Calendar & Progress</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Track deadlines and team progress</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("progress")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          {viewMode === "calendar" ? (
            <div className="space-y-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarData.map((dayData, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-border rounded-lg ${
                      dayData?.isToday ? "bg-primary/10 border-primary" : "bg-background"
                    } ${!dayData ? "opacity-0" : ""}`}
                  >
                    {dayData && (
                      <>
                        <div
                          className={`text-sm font-medium mb-2 ${dayData.isToday ? "text-primary" : "text-foreground"}`}
                        >
                          {dayData.day}
                        </div>
                        <div className="space-y-1">
                          {dayData.tasks.map((task: any) => (
                            <div
                              key={task.id}
                              className="text-xs p-1 rounded bg-primary/20 text-primary flex items-center space-x-1"
                            >
                              <Avatar className="h-3 w-3">
                                <AvatarImage
                                  src={task.assignee.avatar || "/placeholder.svg"}
                                  alt={task.assignee.name}
                                />
                                <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                              </Avatar>
                              <span className="truncate">{task.title}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Project Progress</h3>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {progressPercentage}%
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-3 mb-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{totalTasks - completedTasks}</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </div>

              {/* Team Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Team Progress</h3>
                <div className="space-y-4">
                  {memberProgress.map((memberData) => (
                    <div key={memberData.member.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={memberData.member.avatar || "/placeholder.svg"}
                          alt={memberData.member.name}
                        />
                        <AvatarFallback>{memberData.member.initials}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">{memberData.member.name}</h4>
                            <p className="text-sm text-muted-foreground">{memberData.member.role}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {memberData.completed}/{memberData.total} tasks
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round((memberData.completed / memberData.total) * 100)}% complete
                            </div>
                          </div>
                        </div>
                        <Progress value={(memberData.completed / memberData.total) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Status Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Task Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">To Do</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{tasks.todo.length}</div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-900 dark:text-orange-100">In Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{tasks.inProgress.length}</div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900 dark:text-green-100">Done</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{tasks.done.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
