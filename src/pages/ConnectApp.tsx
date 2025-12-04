import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";

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

const ConnectApp = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();

  const app = integrations.find((integration) => integration.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>App Not Found</CardTitle>
            <CardDescription>The requested app could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/integrations")} className="w-full">
              Back to Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleConnect = () => {
    // TODO: Implement actual connection logic (OAuth, API calls, etc.)
    // For now, simulate connection and redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/integrations")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Integrations
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">{app.icon}</div>
            <h1 className="text-4xl font-bold">Connect {app.name}</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {app.description}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Connect Your Account
              </CardTitle>
              <CardDescription>
                Grant access to your {app.name} account to enable seamless integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="text-2xl">{app.icon}</div>
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.category}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">What we'll access:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Read your project files</li>
                  <li>• Sync data between platforms</li>
                  <li>• Access basic account information</li>
                </ul>
              </div>

              <Button onClick={handleConnect} className="w-full" size="lg">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Connect {app.name}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConnectApp;
