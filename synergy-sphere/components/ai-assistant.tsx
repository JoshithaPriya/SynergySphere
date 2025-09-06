"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Send, Bot, Lightbulb, FileText, GitCommit, Calendar, Zap } from "lucide-react"

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  tasks: any
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "suggestion" | "normal"
}

const quickActions = [
  { icon: Lightbulb, label: "Suggest task", action: "suggest_task" },
  { icon: FileText, label: "Meeting notes", action: "meeting_notes" },
  { icon: GitCommit, label: "Explain commits", action: "explain_commits" },
  { icon: Calendar, label: "Schedule review", action: "schedule_review" },
]

export function AIAssistant({ isOpen, onClose, projectTitle, tasks }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hi! I'm your AI assistant for ${projectTitle}. I can help you with task suggestions, generate meeting notes, explain code commits, and more. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage, tasks)
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse.content,
        sender: "ai",
        timestamp: new Date(),
        type: aiResponse.type,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    let prompt = ""
    switch (action) {
      case "suggest_task":
        prompt = "Can you suggest some tasks for this project based on what we have so far?"
        break
      case "meeting_notes":
        prompt = "Generate meeting notes template for our next team standup"
        break
      case "explain_commits":
        prompt = "Explain the recent commits in our GitHub repository"
        break
      case "schedule_review":
        prompt = "Help me schedule a code review session with the team"
        break
    }

    setNewMessage(prompt)
    handleSendMessage()
  }

  const generateAIResponse = (userInput: string, projectTasks: any) => {
    const input = userInput.toLowerCase()

    if (input.includes("suggest") && input.includes("task")) {
      return {
        content: `Based on your current project progress, here are some suggested tasks:

• **API Integration Testing** - Set up automated tests for the new API endpoints
• **Mobile Responsiveness Review** - Ensure all components work well on mobile devices  
• **Performance Optimization** - Optimize image loading and bundle size
• **Accessibility Audit** - Review components for WCAG compliance
• **Documentation Update** - Update README and component documentation

Would you like me to create any of these tasks for you?`,
        type: "suggestion" as const,
      }
    }

    if (input.includes("meeting") && input.includes("notes")) {
      return {
        content: `Here's a meeting notes template for your team standup:

**${projectTitle} - Team Standup**
*Date: ${new Date().toLocaleDateString()}*

**Attendees:**
- [ ] Sarah Chen (Project Manager)
- [ ] Mike Johnson (Developer)
- [ ] Emily Rodriguez (Designer)
- [ ] David Kim (Developer)

**Agenda:**
1. Progress updates from each team member
2. Blockers and challenges discussion
3. Sprint goals review
4. Next steps and action items

**Action Items:**
- [ ] [Action item 1]
- [ ] [Action item 2]

**Next Meeting:** [Date/Time]`,
        type: "normal" as const,
      }
    }

    if (input.includes("commit") || input.includes("github")) {
      return {
        content: `Based on the recent commits in your repository:

**Latest Commit Analysis:**
• **"feat: add responsive navigation component"** by Mike Johnson
  - Added mobile-friendly navigation with hamburger menu
  - Implemented smooth transitions and accessibility features

• **"fix: resolve mobile layout issues"** by Emily Rodriguez  
  - Fixed responsive grid breakpoints
  - Improved mobile viewport handling

• **"docs: update component documentation"** by David Kim
  - Added comprehensive prop documentation
  - Included usage examples and best practices

The team is making good progress on the responsive design implementation!`,
        type: "normal" as const,
      }
    }

    if (input.includes("schedule") || input.includes("review")) {
      return {
        content: `I can help you schedule a code review session! Here's what I recommend:

**Suggested Schedule:**
• **Duration:** 1-2 hours
• **Best Time:** Tuesday or Thursday afternoon
• **Participants:** All developers + project manager

**Review Checklist:**
- [ ] Code quality and standards
- [ ] Performance considerations  
- [ ] Security best practices
- [ ] Test coverage
- [ ] Documentation completeness

Would you like me to create a calendar invite template?`,
        type: "suggestion" as const,
      }
    }

    // Default responses
    const responses = [
      "I understand you're asking about the project. Could you be more specific about what you'd like help with?",
      "That's an interesting question! I can help with task suggestions, meeting notes, code explanations, or project planning. What would be most useful?",
      "I'm here to assist with your project needs. Try asking me to suggest tasks, generate meeting notes, or explain recent commits.",
    ]

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      type: "normal" as const,
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-r border-border flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Project helper</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              size="sm"
              className="h-auto p-2 flex flex-col items-center space-y-1 bg-transparent"
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex space-x-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {message.sender === "user" ? "U" : <Bot className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.type === "suggestion"
                        ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                        : "bg-muted"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                  {message.type === "suggestion" && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">AI Suggestion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[85%]">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your project..."
              className="resize-none"
              disabled={isTyping}
            />
          </div>

          <Button onClick={handleSendMessage} size="icon" className="flex-shrink-0" disabled={isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
