import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Calendar, MessageSquare, Video, Github, Bot } from "lucide-react"

export default function SolutionsPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Project Management",
      description: "Organize teams and track progress with intuitive dashboards",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Kanban Boards",
      description: "Visual task management with drag-and-drop functionality",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Real-time Chat",
      description: "Threaded conversations with file sharing and emoji reactions",
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Collaboration",
      description: "Built-in video calls with screen sharing capabilities",
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: "GitHub Integration",
      description: "Track commits, PRs, and repository activity directly in projects",
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Assistant",
      description: "Smart suggestions for tasks, documentation, and meeting notes",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Complete Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Everything Your Team Needs to <span className="text-primary">Collaborate</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            From project planning to deployment, SynergySphere provides all the tools your team needs to work together
            efficiently and deliver exceptional results.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Free Trial
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose SynergySphere?</h2>
              <div className="space-y-4">
                {[
                  "Increase team productivity by 40%",
                  "Reduce project delivery time",
                  "Improve communication and transparency",
                  "Seamless integration with existing tools",
                  "Enterprise-grade security and compliance",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-background rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of teams already using SynergySphere to streamline their workflow.
              </p>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
