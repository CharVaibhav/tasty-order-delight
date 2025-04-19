import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEmailSent(true);
        toast({
          title: 'Success!',
          description: 'Password reset instructions have been sent to your email.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Something went wrong',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to connect to server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please check your email for a link to reset your password. If you don't see it, check your spam folder.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Return to Login
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive the email?{' '}
                <button
                  type="button"
                  onClick={() => setIsEmailSent(false)}
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
} 