import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import {
  Box,
  Cloud,
  Database,
  FileImage,
  FileVideo,
  File,
  Folder,
  HardDrive,
  Link2,
  Plus,
  ArrowLeft,
  Trash2,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileItem {
  id: string;
  name: string;
  type: "image" | "video" | "model" | "document";
  size: string;
  uploadedAt: string;
  source: string;
}

interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "pending";
  filesCount: number;
  lastSync: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for frontend-first approach
  const storageUsed = 24.5; // GB
  const storageTotal = 100; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const recentFiles: FileItem[] = [
    { id: "1", name: "character_hero_v2.glb", type: "model", size: "45.2 MB", uploadedAt: "2 hours ago", source: "3DGENI" },
    { id: "2", name: "ai_portrait_final.png", type: "image", size: "8.4 MB", uploadedAt: "5 hours ago", source: "AI Photoshoot" },
    { id: "3", name: "legend_warrior.fbx", type: "model", size: "62.1 MB", uploadedAt: "Yesterday", source: "Little Legends" },
    { id: "4", name: "texture_pack.zip", type: "document", size: "128.5 MB", uploadedAt: "2 days ago", source: "Manual Upload" },
    { id: "5", name: "promo_video.mp4", type: "video", size: "256.8 MB", uploadedAt: "3 days ago", source: "Manual Upload" },
  ];

  const connectedApps: ConnectedApp[] = [
    { id: "1", name: "3DGENI", icon: "🎮", status: "connected", filesCount: 47, lastSync: "Just now" },
    { id: "2", name: "AI Photoshoot", icon: "📸", status: "connected", filesCount: 23, lastSync: "5 min ago" },
    { id: "3", name: "Little Legends", icon: "⚔️", status: "pending", filesCount: 0, lastSync: "Not synced" },
  ];

  const storageBreakdown = [
    { type: "3D Models", size: 12.4, color: "bg-primary", icon: Box },
    { type: "Images", size: 6.8, color: "bg-secondary", icon: FileImage },
    { type: "Videos", size: 3.2, color: "bg-accent", icon: FileVideo },
    { type: "Documents", size: 2.1, color: "bg-muted-foreground", icon: File },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <FileImage className="w-5 h-5 text-secondary" />;
      case "video": return <FileVideo className="w-5 h-5 text-accent" />;
      case "model": return <Box className="w-5 h-5 text-primary" />;
      default: return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Box className="w-16 h-16 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Background Mesh */}
      <div className="fixed inset-0 -z-10" style={{ background: "var(--gradient-mesh)" }} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Box className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">My Storage</h1>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Storage Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Storage Card */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <HardDrive className="w-5 h-5 text-primary-foreground" />
                </div>
                Storage Usage
              </CardTitle>
              <CardDescription>Your cloud storage consumption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-4xl font-bold gradient-text">{storageUsed}</span>
                    <span className="text-xl text-muted-foreground"> / {storageTotal} GB</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{storagePercentage.toFixed(1)}% used</span>
                </div>
                <Progress value={storagePercentage} className="h-3" />
              </div>

              {/* Storage Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {storageBreakdown.map((item) => (
                  <div key={item.type} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                    <p className="text-lg font-semibold">{item.size} GB</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg shadow-secondary/30">
                  <Zap className="w-5 h-5 text-secondary-foreground" />
                </div>
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">Connected Apps</p>
                <p className="text-3xl font-bold">{connectedApps.filter(a => a.status === "connected").length}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">Last Upload</p>
                <p className="text-lg font-semibold">2 hours ago</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Apps */}
        <Card className="bg-card/50 backdrop-blur-sm border-2 hover:border-primary/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30">
                  <Link2 className="w-5 h-5 text-accent-foreground" />
                </div>
                Connected Apps
              </CardTitle>
              <CardDescription>Apps syncing files to your OCTABOX</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/integrations")}>
              <Plus className="w-4 h-4 mr-2" />
              Connect App
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {connectedApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{app.icon}</span>
                      <div>
                        <h4 className="font-semibold">{app.name}</h4>
                        <Badge
                          variant={app.status === "connected" ? "default" : "secondary"}
                          className={app.status === "connected" ? "bg-green-500/20 text-green-600 border-green-500/30" : ""}
                        >
                          {app.status === "connected" ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" /> Pending</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Files synced</span>
                      <span className="font-medium">{app.filesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last sync</span>
                      <span className="font-medium">{app.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card className="bg-card/50 backdrop-blur-sm border-2 hover:border-primary/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Folder className="w-5 h-5 text-primary-foreground" />
                </div>
                Recent Files
              </CardTitle>
              <CardDescription>Your latest uploads and synced files</CardDescription>
            </div>
            <Button variant="outline">
              View All Files
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.size} • {file.uploadedAt} • <span className="text-primary">{file.source}</span>
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: "Download started", description: `Downloading ${file.name}` })}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => toast({ title: "File deleted", description: `${file.name} has been deleted` })}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
