"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Users, Calendar, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function WorkPage() {
  const [completedProjects, setCompletedProjects] = useState<any[]>([])

  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem("synergy-completed-projects") || "[]")

    // Sort by completion date (most recent first)
    const sortedCompleted = completed.sort((a: any, b: any) => {
      const dateA = new Date(a.completedAt || a.updatedAt).getTime()
      const dateB = new Date(b.completedAt || b.updatedAt).getTime()
      return dateB - dateA
    })

    setCompletedProjects(sortedCompleted)
  }, [])

  if (completedProjects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Our Work
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Completed <span className="text-primary">Projects</span>
            </h1>
            <div className="max-w-md mx-auto mt-16">
              <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Completed Projects Yet</h3>
                <p className="text-muted-foreground mb-4">Complete your first project to see it showcased here.</p>
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Our Work
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Completed <span className="text-primary">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Showcase of successfully completed projects with 100% task completion rate.
          </p>
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{completedProjects.length} Projects Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>
                {completedProjects.reduce((total, project) => total + (project.taskCount || 0), 0)} Tasks Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {completedProjects.map((project) => {
            return (
              <Card key={project.id} className="border-border hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      {project.completedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <Link href={`/projects/${project.id}`}>
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
                    </Link>
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{project.members?.length || 1} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {project.deadline ? `Due ${new Date(project.deadline).toLocaleDateString()}` : "No deadline"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-foreground font-medium">
                          {project.taskCount || project.completedTasks || 0} tasks completed
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Team Members */}
                    {project.members && project.members.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Team:</span>
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 4).map((member: any) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 4 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{project.members.length - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {project.createdAt && project.completedAt && (
                      <div className="text-xs text-muted-foreground">
                        Project duration:{" "}
                        {Math.ceil(
                          (new Date(project.completedAt).getTime() - new Date(project.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Complete Your Next Project?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start a new project and join the showcase of successful completions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start New Project
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
