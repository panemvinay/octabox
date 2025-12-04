import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plug, ExternalLink } from "lucide-react";

const integrations = [
  {
    id: "3dgeni",
    name: "3DGENI",
    description: "Connect to 3DGENI for advanced 3D modeling and rendering",
    icon: "🎨",
    category: "3D & Design"
  },
  {
    id: "autocad",
    name: "AutoCAD",
    description: "Integrate with AutoCAD for CAD file management",
    icon: "📐",
    category: "CAD Software"
  },
  {
    id: "ai-photoshoot",
    name: "AI Photoshoot",
    description: "Generate professional AI-powered photoshoots for products, models, and virtual scenes using advanced machine learning algorithms",
    icon: "📸",
    category: "AI Tools"
  },
  {
    id: "little-legends",
    name: "Little Legends",
    description: "Connect to Little Legends for interactive storytelling and educational gaming experiences tailored for children",
    icon: "🎮",
    category: "Gaming & Education"
  }
];

const Integrations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Plug className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Integrations</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Connect your favorite apps and services to enhance your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/connect/${app.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{app.icon}</div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {app.category}
                  </span>
                </div>
                <CardTitle className="text-xl">{app.name}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
