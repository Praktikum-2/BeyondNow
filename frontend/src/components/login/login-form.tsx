import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      await signInWithEmailAndPassword(auth, email, password);
      handleAuthSuccess();
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(
          err.message || "Failed to login. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (
    provider: GoogleAuthProvider | GithubAuthProvider
  ) => {
    try {
      setLoading(true);
      setError("");

      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (err: any) {
      console.error("OAuth login error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelled.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        const email = err.customData?.email;

        if (email) {
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.length > 0) {
              setError(
                `An account already exists for ${email} using ${
                  methods[0] === "password"
                    ? "email/password"
                    : methods[0].charAt(0).toUpperCase() + methods[0].slice(1)
                } sign-in. Please use that method.`
              );
            } else {
              setError(
                "An account already exists with a different sign-in method."
              );
            }
          } catch (methodErr) {
            console.error("Error fetching sign-in methods:", methodErr);
            setError(
              "Something went wrong. Please try a different login method."
            );
          }
        } else {
          setError(
            "An account already exists with a different sign-in method."
          );
        }
      } else {
        setError(err.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => handleOAuthLogin(new GoogleAuthProvider());
  const handleGitHubLogin = () => handleOAuthLogin(new GithubAuthProvider());

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
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleGitHubLogin}
                  disabled={loading}>
                  <FaGithub className='mr-2 h-4 w-4' />
                  {loading ? "Logging in..." : "Login with GitHub"}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleGoogleLogin}
                  disabled={loading}>
                  <FaGoogle className='mr-2 h-4 w-4' />
                  {loading ? "Logging in..." : "Login with Google"}
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
