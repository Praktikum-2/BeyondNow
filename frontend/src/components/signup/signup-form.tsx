import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
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

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
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
      const email = emailRef.current?.value?.trim() || "";
      const password = passwordRef.current?.value || "";
      const firstName = firstNameRef.current?.value?.trim() || "";
      const lastName = lastNameRef.current?.value?.trim() || "";

      if (!firstName || !lastName) {
        setError("Please fill in all fields.");
        return;
      }

      const fullName = `${firstName} ${lastName}`;

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      handleAuthSuccess();
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters long.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/password accounts are not enabled.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (err: any) {
      console.error("GitHub signup error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Signup cancelled.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with this email using a different sign-in method."
        );
      } else {
        setError(err.message || "GitHub signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (err: any) {
      console.error("Google signup error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Signup cancelled.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with this email using a different sign-in method."
        );
      } else {
        setError(err.message || "Google signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='bg-card shadow-md border border-border'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create an account</CardTitle>
          <CardDescription>
            Sign up with your GitHub or Google account
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
                  onClick={handleGitHubSignup}
                  disabled={loading}>
                  <FaGithub className='mr-2 h-4 w-4' />
                  {loading ? "Signing up..." : "Sign up with GitHub"}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleGoogleSignup}
                  disabled={loading}>
                  <FaGoogle className='mr-2 h-4 w-4' />
                  {loading ? "Signing up..." : "Sign up with Google"}
                </Button>
              </div>

              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                <span className='relative z-10 bg-background bg-white px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>

              <div className='grid gap-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      type='text'
                      placeholder='John'
                      required
                      ref={firstNameRef}
                      disabled={loading}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      type='text'
                      placeholder='Doe'
                      required
                      ref={lastNameRef}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='email@example.com'
                    required
                    ref={emailRef}
                    disabled={loading}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    required
                    ref={passwordRef}
                    disabled={loading}
                  />
                  <div className='text-xs text-muted-foreground'>
                    Password must be at least 6 characters long
                  </div>
                </div>
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>

              {error && (
                <div className='text-sm text-red-500 text-center'>{error}</div>
              )}

              <div className='text-center text-sm'>
                Already have an account?{" "}
                <a href='/login' className='underline underline-offset-4'>
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{" "}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
