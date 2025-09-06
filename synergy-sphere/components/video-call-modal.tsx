"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Phone,
  Settings,
  Users,
  MessageSquare,
  MoreVertical,
} from "lucide-react"

interface VideoCallModalProps {
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

export function VideoCallModal({ isOpen, onClose, projectMembers, projectTitle }: VideoCallModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectedMembers] = useState(projectMembers.slice(0, 3))
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map())
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const videoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  const rtcConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      initializeWebRTC()
    } else {
      setCallDuration(0)
      cleanupWebRTC()
    }

    return () => {
      if (interval) clearInterval(interval)
      cleanupWebRTC()
    }
  }, [isOpen])

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      })

      setLocalStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Initialize peer connections for each member
      connectedMembers.forEach((member) => {
        if (member.id.toString() !== "user") {
          createPeerConnection(member.id.toString(), stream)
        }
      })
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const createPeerConnection = (memberId: string, stream: MediaStream) => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration)

    // Add local stream tracks to peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream)
    })

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      setRemoteStreams((prev) => new Map(prev.set(memberId, remoteStream)))

      const videoElement = remoteVideoRefs.current.get(memberId)
      if (videoElement) {
        videoElement.srcObject = remoteStream
      }
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real implementation, send this candidate to the remote peer
        console.log("ICE candidate:", event.candidate)
      }
    }

    setPeerConnections((prev) => new Map(prev.set(memberId, peerConnection)))
  }

  const cleanupWebRTC = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }

    peerConnections.forEach((pc) => pc.close())
    setPeerConnections(new Map())
    setRemoteStreams(new Map())
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream
        }

        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0]
        peerConnections.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video")
          if (sender) {
            sender.replaceTrack(videoTrack)
          }
        })

        setIsScreenSharing(true)
        setLocalStream(screenStream)

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          // Return to camera
          navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((cameraStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = cameraStream
            }
            setLocalStream(cameraStream)

            const videoTrack = cameraStream.getVideoTracks()[0]
            peerConnections.forEach((pc) => {
              const sender = pc.getSenders().find((s) => s.track?.kind === "video")
              if (sender) {
                sender.replaceTrack(videoTrack)
              }
            })
          })
        }
      } else {
        // Stop screen sharing and return to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream
        }

        const videoTrack = cameraStream.getVideoTracks()[0]
        peerConnections.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video")
          if (sender) {
            sender.replaceTrack(videoTrack)
          }
        })

        setIsScreenSharing(false)
        setLocalStream(cameraStream)
      }
    } catch (error) {
      console.error("Screen sharing failed:", error)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }

  const handleEndCall = () => {
    cleanupWebRTC()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-slate-900 border-slate-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <div>
                <h3 className="font-semibold text-white">{projectTitle} - Team Meeting</h3>
                <p className="text-sm text-slate-400">{formatDuration(callDuration)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                <Users className="h-3 w-3 mr-1" />
                {connectedMembers.length}
              </Badge>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {/* Main video (current user) */}
              <div className="relative bg-slate-800 rounded-lg overflow-hidden md:col-span-2 lg:col-span-2">
                {isVideoEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl">YU</AvatarFallback>
                    </Avatar>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 bg-black/50 rounded px-2 py-1">
                  <span className="text-white text-sm">You {isScreenSharing && "(sharing screen)"}</span>
                </div>

                {!isVideoEnabled && (
                  <div className="absolute top-4 right-4">
                    <VideoOff className="h-5 w-5 text-red-400" />
                  </div>
                )}
              </div>

              {/* Other participants */}
              {connectedMembers.slice(1).map((member) => (
                <div key={member.id} className="relative bg-slate-800 rounded-lg overflow-hidden">
                  <video
                    ref={(el) => {
                      if (el) remoteVideoRefs.current.set(member.id.toString(), el)
                    }}
                    autoPlay
                    className="w-full h-full object-cover"
                    style={{ display: remoteStreams.has(member.id.toString()) ? "block" : "none" }}
                  />

                  {!remoteStreams.has(member.id.toString()) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-xs">{member.name}</span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isAudioEnabled ? "secondary" : "destructive"}
                size="icon"
                onClick={toggleAudio}
                className="h-12 w-12 rounded-full"
              >
                {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isVideoEnabled ? "secondary" : "destructive"}
                size="icon"
                onClick={toggleVideo}
                className="h-12 w-12 rounded-full"
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="icon"
                onClick={handleScreenShare}
                className="h-12 w-12 rounded-full"
              >
                {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              </Button>

              <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                <MessageSquare className="h-5 w-5" />
              </Button>

              <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                <Settings className="h-5 w-5" />
              </Button>

              <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={handleEndCall}
                className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
