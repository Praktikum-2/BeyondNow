import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
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
        default:
          message = err.message || message;
      }

      setError(message);
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
            Fill in the details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-6'>
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='Name'
                    required
                    ref={firstNameRef}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Name'
                    required
                    ref={lastNameRef}
                  />
                </div>
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
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    required
                    ref={passwordRef}
                  />
                </div>
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>

              {error && (
                <div className='text-sm text-red-500 text-center'>{error}</div>
              )}
            </div>

            <div className='my-5 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
              <span className='relative z-10 bg-background bg-white px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>

            <div className='flex flex-col gap-4'>
              <Button
                variant='outline'
                className='w-full'
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError("");
                    const provider = new GithubAuthProvider();
                    await signInWithPopup(auth, provider);
                    navigate("/dashboard");
                  } catch (err: any) {
                    console.error(err);
                    setError("GitHub login failed.");
                  } finally {
                    setLoading(false);
                  }
                }}>
                <FaGithub className='mr-2 h-4 w-4' />
                Login with GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError("");
                    const provider = new GoogleAuthProvider();
                    await signInWithPopup(auth, provider);
                    navigate("/dashboard");
                  } catch (err: any) {
                    console.error(err);
                    setError("Google login failed.");
                  } finally {
                    setLoading(false);
                  }
                }}>
                <FaGoogle className='mr-2 h-4 w-4' />
                Login with Google
              </Button>
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
