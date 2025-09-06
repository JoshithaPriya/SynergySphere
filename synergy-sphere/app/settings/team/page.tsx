import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Mail, UserPlus, Settings } from "lucide-react"

export default function TeamSettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Team Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and permissions</p>
        </div>

        <div className="grid gap-6">
          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Team Information
              </CardTitle>
              <CardDescription>Update your team details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input id="teamName" placeholder="Enter team name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamDescription">Team Description</Label>
                <Input id="teamDescription" placeholder="Describe your team" />
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Manage who has access to your team</CardDescription>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current User */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="You" />
                      <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">You</p>
                      <p className="text-sm text-muted-foreground">your.email@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Owner</Badge>
                  </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                  <p className="text-muted-foreground mb-4">Invite your colleagues to start collaborating</p>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
