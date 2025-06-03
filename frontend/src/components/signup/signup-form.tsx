import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { cn } from "@/lib/utils";

import { FaGithub, FaGoogle } from "react-icons/fa";

// Updated syncUserWithBackend to accept optional name parameter
async function syncUserWithBackend(idToken: string, name?: string) {
  try {
    const requestBody: any = {};
    if (name) {
      requestBody.name = name;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL_LOCAL}/api/auth/sync`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body:
          Object.keys(requestBody).length > 0
            ? JSON.stringify(requestBody)
            : undefined,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Sync failed");
    }

    const data = await res.json();
    console.log("Backend sync response:", data);
    return data;
  } catch (error) {
    console.error("Failed to sync with backend:", error);
    throw error;
  }
}

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Updated handleAuthAndSync to accept optional name parameter
  const handleAuthAndSync = async (name?: string) => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      await syncUserWithBackend(idToken, name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setError("");

    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";
    const firstName = firstNameRef.current?.value.trim() || "";
    const lastName = lastNameRef.current?.value.trim() || "";

    if (!firstName || !lastName || !email || !password) {
      setEmailLoading(false);
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setEmailLoading(false);
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Combine first and last name
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

      // Sync with backend, passing the full name
      await handleAuthAndSync(fullName);

      navigate("/startup");
    } catch (err: any) {
      console.error("Firebase Signup Error:", err);
      let message = "Failed to sign up. Please try again.";

      switch (err.code) {
        case "auth/email-already-in-use":
          message = "This email is already in use.";
          break;
        case "auth/invalid-email":
          message = "The email address is invalid.";
          break;
        case "auth/weak-password":
          message = "The password is too weak.";
          break;
        case "auth/operation-not-allowed":
          message = "Email/password accounts are not enabled.";
          break;
        default:
          message = err.message || message;
      }

      setError(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      // For Google signup, use the displayName from Google profile
      await handleAuthAndSync(result.user.displayName || undefined);
      navigate("/startup");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with this email using a different sign-in method."
        );
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-up was cancelled.");
      } else {
        setError("Google sign-up failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setGithubLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, new GithubAuthProvider());
      // For GitHub signup, use the displayName from GitHub profile
      await handleAuthAndSync(result.user.displayName || undefined);
      navigate("/startup");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with this email using a different sign-in method."
        );
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-up was cancelled.");
      } else {
        setError("GitHub sign-up failed. Please try again.");
      }
    } finally {
      setGithubLoading(false);
    }
  };

  const isLoading = emailLoading || googleLoading || githubLoading;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='bg-card shadow-md border border-border'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create an account</CardTitle>
          <CardDescription>
            Fill in the details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='flex flex-col gap-4'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleGithubSignup}
                disabled={isLoading}>
                <FaGithub className='mr-2 h-4 w-4' />
                {githubLoading ? "Connecting..." : "Sign up with GitHub"}
              </Button>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleGoogleSignup}
                disabled={isLoading}>
                <FaGoogle className='mr-2 h-4 w-4' />
                {googleLoading ? "Connecting..." : "Sign up with Google"}
              </Button>
            </div>

            <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
              <span className='relative z-10 bg-background bg-white px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>

            <form onSubmit={handleSubmit}>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <div className='text-xs text-muted-foreground'>
                    Password must be at least 6 characters long
                  </div>
                </div>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {emailLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
            </form>

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
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{" "}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
