import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Lightbulb, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration First",
      description: "We believe the best work happens when teams can communicate and collaborate seamlessly.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Results Driven",
      description: "Every feature we build is designed to help teams achieve their goals faster and more efficiently.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in team collaboration technology.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "User Focused",
      description: "Our users' success is our success. We listen, learn, and iterate based on real feedback.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Building the Future of <span className="text-primary">Team Collaboration</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            We're on a mission to help teams work better together by providing intuitive, powerful tools that make
            collaboration feel effortless and productive.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                SynergySphere was created to solve the common problem of fragmented collaboration tools. We recognized
                that teams were struggling with switching between multiple applications, which disrupted workflow and
                hindered productivity.
              </p>
              <p>
                Our platform brings together project management, communication, and development tools in one seamless
                experience, allowing teams to focus on what matters most: getting work done together.
              </p>
              <p>
                We're committed to continuous improvement and building features that truly serve the needs of modern
                collaborative teams.
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">2024</div>
                <div className="text-sm text-muted-foreground">Launched</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Possibilities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Open Source</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-border text-center">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Start Collaborating Today</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join teams around the world who are already using SynergySphere to work better together. Create your first
            project and experience seamless collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
