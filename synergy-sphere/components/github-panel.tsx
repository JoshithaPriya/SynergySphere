"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Github, GitBranch, ExternalLink } from "lucide-react"

interface GitHubPanelProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
}

export function GitHubPanel({ isOpen, onClose, projectTitle }: GitHubPanelProps) {
  const [repoUrl, setRepoUrl] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-r border-border flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Github className="h-5 w-5 text-foreground" />
          <div>
            <h3 className="font-semibold text-foreground">GitHub</h3>
            <p className="text-sm text-muted-foreground">{projectTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Repository Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Repository</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="text-sm"
                  placeholder="Connect your GitHub repository URL"
                />
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {repoUrl && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <GitBranch className="h-4 w-4" />
                  <span>main</span>
                </div>
              )}
            </div>
          </div>

          {!repoUrl && (
            <div className="text-center py-8">
              <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">Connect Your Repository</h4>
              <p className="text-sm text-muted-foreground">
                Add your GitHub repository URL above to see commits, pull requests, and collaboration activity.
              </p>
            </div>
          )}

          {repoUrl && (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">
                Repository connected! Commit history and pull requests will appear here once you start collaborating.
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
