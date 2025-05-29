import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FaGoogle, FaGithub } from "react-icons/fa";

async function syncUserWithBackend(idToken: string) {
  console.log("HERE");
  console.log("ID TOKEN: ", idToken);
  try {
    const res = await fetch("http://localhost:3000/api/auth/sync", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Backend sync response:", data);
  } catch (error) {
    console.error("Failed to sync with backend:", error);
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuthAndSync = async () => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      await syncUserWithBackend(idToken);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      await signInWithEmailAndPassword(auth, email, password);
      await handleAuthAndSync();
      navigate("/dashboard");
    } catch (err: any) {
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: any, providerName: string) => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, provider);
      await handleAuthAndSync();
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(`${providerName} login failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='bg-card shadow-md border border-border'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-6'>
              <div className='flex flex-col gap-4'>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={async () =>
                    handleOAuthLogin(new GithubAuthProvider(), "GitHub")
                  }>
                  <FaGithub className='mr-2 h-4 w-4' />
                  Login with GitHub
                </Button>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={async () => {
                    handleOAuthLogin(new GoogleAuthProvider(), "Google");
                  }}>
                  <FaGoogle className='mr-2 h-4 w-4' />
                  Login with Google
                </Button>
              </div>

              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                <span className='relative z-10 bg-background bg-white px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>

              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='email@example.com'
                    required
                    ref={emailRef}
                  />
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <a
                      href='#'
                      className='ml-auto text-sm underline-offset-4 hover:underline'>
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    required
                    ref={passwordRef}
                  />
                </div>
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>

              {error && (
                <div className='text-sm text-red-500 text-center'>{error}</div>
              )}

              <div className='text-center text-sm'>
                Don&apos;t have an account?{" "}
                <a href='/signup' className='underline underline-offset-4'>
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  '>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{" "}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
