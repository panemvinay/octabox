import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cloud, Lock, Zap, Share2, Database, Shield, ChevronRight, Box, LogOut, User, Plug, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    // Clear frontend state first
    setUser(null);
    setSession(null);
    
    // Try backend logout but don't let it block the flow
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log("Backend logout failed, but frontend state cleared");
    }
    
    // Always show success and redirect
    toast({
      title: "Signed out",
      description: "You've been successfully logged out.",
    });
    
    navigate("/");
  };

  const handleFeatureClick = (featureTitle: string, description: string) => {
    toast({
      title: featureTitle,
      description: description,
    });
  };

  const features = [
    {
      icon: Cloud,
      title: "Unlimited Cloud Storage",
      description: "Store all your 3DGENI creations, AI outputs, and personal files in one secure place."
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-level encryption ensures your creative work and data stay private and protected."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Access your files instantly with our optimized global CDN infrastructure."
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your 3D creations and files with anyone, anywhere, in just a few clicks."
    },
    {
      icon: Database,
      title: "Smart Organization",
      description: "AI-powered file management keeps your creative projects organized automatically."
    },
    {
      icon: Shield,
      title: "Automatic Backup",
      description: "Never lose your work. Every file is automatically backed up and version-controlled."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-10" style={{ background: "var(--gradient-mesh)" }} />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Box className="w-8 h-8 text-primary animate-float-3d" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">OCTABOX</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <button onClick={() => navigate("/integrations")} className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <Plug className="w-4 h-4" />
              Integrations
            </button>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden md:inline">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-muted-foreground">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      My Dashboard
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Integrated with 3DGENI</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Store Your <span className="gradient-text">3D Creations</span> in the Cloud
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                OCTABOX is the ultimate cloud storage solution for your 3DGENI characters, AI-generated content, and all your creative files. Secure, fast, and seamlessly integrated.
              </p>
              
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Secure & Reliable</span>
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold gradient-text">100GB</div>
                  <div className="text-sm text-muted-foreground">Free Storage</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold gradient-text">256-bit</div>
                  <div className="text-sm text-muted-foreground">Encryption</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold gradient-text">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>

            {/* 3D Floating Boxes */}
            <div className="relative h-[600px] hidden lg:block animate-scale-in">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl shadow-primary/50 floating transform rotate-6" 
                   style={{ transform: "perspective(1000px) rotateY(-15deg) rotateX(10deg)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Box className="w-24 h-24 text-white/90" />
                </div>
              </div>
              
              <div className="absolute top-48 left-12 w-48 h-48 bg-gradient-to-br from-secondary to-accent rounded-3xl shadow-2xl shadow-secondary/50 floating-delay-1" 
                   style={{ transform: "perspective(1000px) rotateY(15deg) rotateX(-10deg)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cloud className="w-20 h-20 text-white/90" />
                </div>
              </div>
              
              <div className="absolute bottom-12 right-24 w-56 h-56 bg-gradient-to-br from-accent to-primary rounded-3xl shadow-2xl shadow-accent/50 floating-delay-2" 
                   style={{ transform: "perspective(1000px) rotateY(-10deg) rotateX(15deg)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="w-20 h-20 text-white/90" />
                </div>
              </div>

              {/* Glow effects */}
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Powerful Features for <span className="gradient-text">Creative Storage</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to store, manage, and share your 3D creations and digital content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 group cursor-pointer"
                onClick={() => handleFeatureClick(feature.title, feature.description)}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
              <Box className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Seamless Integration</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              Works Perfectly with <span className="gradient-text">3DGENI</span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every 3D character you create with 3DGENI is automatically saved to your OCTABOX account. Access your entire creative library from anywhere, share with friends, and never worry about losing your masterpieces.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-bold text-lg">Create in 3DGENI</h3>
                <p className="text-sm text-muted-foreground">Upload your photo and generate amazing 3D characters</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-bold text-lg">Auto-Save to OCTABOX</h3>
                <p className="text-sm text-muted-foreground">Your creations are instantly stored in the cloud</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-bold text-lg">Access Anywhere</h3>
                <p className="text-sm text-muted-foreground">View, download, and share from any device</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-xl shadow-primary/30 text-lg px-8 mt-8"
              onClick={() => toast({
                title: "3DGENI Integration",
                description: "Connect your 3DGENI account to automatically save all your 3D creations to OCTABOX cloud storage.",
              })}
            >
              Connect 3DGENI Now
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent p-12 md:p-16 border-0">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl floating" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl floating-delay-1" />
            </div>

            <div className="relative z-10 text-center space-y-6 text-white">
              <h2 className="text-4xl md:text-5xl font-bold">
                Start Storing Smarter Today
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of creators using OCTABOX to store and manage their 3D creations. Get 100GB free storage when you sign up today.
              </p>
              <div className="flex items-center gap-3 justify-center pt-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 border border-white/30">
                  <Cloud className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">100GB Free Storage</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 border border-white/30">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Enterprise Security</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Box className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold">OCTABOX</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Cloud storage designed for 3D creators and digital artists.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li>
                  <button 
                    onClick={() => navigate("/admin-login")}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2024 OCTABOX. All rights reserved. Built for 3DGENI creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
