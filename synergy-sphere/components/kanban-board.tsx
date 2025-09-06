"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, Edit, Trash2, Flag } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  assignee: {
    id: number
    name: string
    avatar: string
    initials: string
  }
  deadline: string
  priority: "low" | "medium" | "high"
  tags: string[]
}

interface Tasks {
  todo: Task[]
  inProgress: Task[]
  done: Task[]
}

interface KanbanBoardProps {
  tasks: Tasks
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>
  projectMembers: Array<{
    id: number
    name: string
    avatar: string
    initials: string
    role: string
  }>
}

export function KanbanBoard({ tasks, setTasks, projectMembers }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<{ task: Task; from: keyof Tasks } | null>(null)

  const columns = [
    { id: "todo" as keyof Tasks, title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
    { id: "inProgress" as keyof Tasks, title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/20" },
    { id: "done" as keyof Tasks, title: "Done", color: "bg-green-100 dark:bg-green-900/20" },
  ]

  const handleDragStart = (task: Task, from: keyof Tasks) => {
    setDraggedTask({ task, from })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, to: keyof Tasks) => {
    e.preventDefault()

    if (!draggedTask) return

    const { task, from } = draggedTask

    if (from === to) {
      setDraggedTask(null)
      return
    }

    setTasks((prev) => ({
      ...prev,
      [from]: prev[from].filter((t) => t.id !== task.id),
      [to]: [...prev[to], task],
    }))

    setDraggedTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-muted-foreground"
    }
  }

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }

  const deleteTask = (taskId: string, column: keyof Tasks) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== taskId),
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`rounded-lg p-4 min-h-[600px] ${column.color}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {tasks[column.id].length}
            </Badge>
          </div>

          <div className="space-y-3">
            {tasks[column.id].map((task) => (
              <Card
                key={task.id}
                className="cursor-move hover:shadow-md transition-shadow bg-background"
                draggable
                onDragStart={() => handleDragStart(task, column.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium text-balance leading-tight">{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id, column.id)}>
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                  )}

                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Priority and Deadline */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                      <span className={`text-xs capitalize ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </div>

                    {task.deadline && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span
                          className={`text-xs ${
                            isDeadlineApproaching(task.deadline)
                              ? "text-orange-600 dark:text-orange-400 font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
