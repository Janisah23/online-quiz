import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      navigate('/');
    } catch (error) {
      setMessage('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md pt-12 px-4 sm:pt-24">
      <Card className="shadow-sm">
        <CardHeader className="space-y-1.5 text-center pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Login
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your credentials to access the quiz system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 transition-colors focus-visible:ring-1"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 transition-colors focus-visible:ring-1"
              required
            />

            {message && (
              <p className="rounded-md bg-destructive/10 p-3 text-[13px] font-medium text-destructive">
                {message}
              </p>
            )}

            <Button type="submit" className="h-10 w-full font-medium" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="pt-2 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;