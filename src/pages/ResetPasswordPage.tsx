import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    // Verify token on component mount
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token/${token}`);
        if (!response.ok) {
          setIsTokenValid(false);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Invalid or expired reset token',
          });
        }
      } catch (error) {
        setIsTokenValid(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to verify reset token',
        });
      }
    };

    verifyToken();
  }, [token, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password must be at least 6 characters long',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Your password has been reset successfully.',
        });
        navigate('/login');
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

  if (!isTokenValid) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please request a new password reset link to continue.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/forgot-password')}
              >
                Request New Reset Link
              </Button>
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
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
} 