import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Upload, Lock, Mail, User as UserIcon, ArrowLeft } from "lucide-react";

const Auth = () => {
  const [showOptions, setShowOptions] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/", { replace: true });
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          navigate("/", { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login error:", error);
          throw error;
        }

        toast({
          title: "Welcome back!",
          description: "Successfully signed in to OCTABOX.",
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          console.error("Signup error:", error);
          throw error;
        }

        toast({
          title: "Account created!",
          description: "Welcome to OCTABOX. You're now signed in.",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Please try again or create a new account.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            background: 'var(--gradient-mesh)'
          }}
        />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-3d" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl floating-delay-1" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl floating-delay-2" />
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="glass text-foreground hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Auth Container */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* 3D Floating Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-xl opacity-50 animate-pulse" />
              <div className="relative glass p-6 rounded-3xl animate-float-3d">
                <Upload className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">OCTABOX</span>
            </h1>
            <p className="text-muted-foreground">
              {showOptions ? "Choose your login type" : isLogin ? "Welcome back" : "Create your account"}
            </p>
          </div>

          {showOptions ? (
            /* Login Type Selection */
            <div className="space-y-4 animate-scale-in">
              <Button
                onClick={() => setShowOptions(false)}
                className="w-full h-24 glass hover:bg-primary/20 transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3 group"
              >
                <UserIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-lg font-semibold gradient-text">User Login</div>
                  <div className="text-xs text-muted-foreground">Access your OCTABOX storage</div>
                </div>
              </Button>

              <Button
                onClick={() => navigate("/admin-login")}
                className="w-full h-24 glass hover:bg-secondary/20 transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3 group"
              >
                <Lock className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Portal</div>
                  <div className="text-xs text-muted-foreground">Manage app & users</div>
                </div>
              </Button>
            </div>
          ) : (
            /* Auth Form */
            <div className="glass p-8 rounded-2xl backdrop-blur-xl animate-scale-in">
              <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="bg-background/50 border-border/50 focus:border-primary transition-all"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

              {/* Toggle Auth Mode */}
              <div className="mt-6 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <span className="font-semibold gradient-text">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <span className="font-semibold gradient-text">Sign in</span>
                    </>
                  )}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowOptions(true)}
                    className="text-xs text-muted-foreground/70 hover:text-primary transition-colors"
                  >
                    ← Back to login options
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="glass p-4 rounded-xl">
              <div className="text-2xl font-bold gradient-text">100GB</div>
              <div className="text-xs text-muted-foreground mt-1">Free Storage</div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="text-2xl font-bold gradient-text">∞</div>
              <div className="text-xs text-muted-foreground mt-1">Files</div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="text-2xl font-bold gradient-text">3D</div>
              <div className="text-xs text-muted-foreground mt-1">Integration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
