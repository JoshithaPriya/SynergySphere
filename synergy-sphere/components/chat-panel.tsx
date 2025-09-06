"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Paperclip, MessageCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: {
    id: number
    name: string
    avatar: string
    initials: string
  }
  timestamp: Date
  type: "text" | "file" | "image"
  fileName?: string
  fileSize?: string
}

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
  projectMembers: Array<{
    id: number
    name: string
    avatar: string
    initials: string
    role: string
  }>
  projectTitle: string
}

export function ChatPanel({ isOpen, onClose, projectMembers, projectTitle }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: projectMembers[0] || {
        id: 1,
        name: "You",
        avatar: "",
        initials: "YU",
      },
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: file.name,
      sender: projectMembers[0] || {
        id: 1,
        name: "You",
        avatar: "",
        initials: "YU",
      },
      timestamp: new Date(),
      type: file.type.startsWith("image/") ? "image" : "file",
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    }

    setMessages((prev) => [...prev, message])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-l border-border flex flex-col z-40">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Team Chat</h3>
          <p className="text-sm text-muted-foreground">{projectTitle}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="font-medium text-foreground mb-2">Start the conversation</h4>
            <p className="text-sm text-muted-foreground">
              Send your first message to begin collaborating with your team.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback className="text-xs">{message.sender.initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-foreground">{message.sender.name}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>

                    {message.type === "text" && (
                      <p className="text-sm text-foreground break-words">{message.content}</p>
                    )}

                    {(message.type === "file" || message.type === "image") && (
                      <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg max-w-xs">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{message.fileName}</p>
                          <p className="text-xs text-muted-foreground">{message.fileSize}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              placeholder="Type a message..."
              className="resize-none"
            />
          </div>

          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="*/*" />

          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button onClick={handleSendMessage} size="icon" className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
