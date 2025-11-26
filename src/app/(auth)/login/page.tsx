'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate, signInAnonymously } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';
import { Logo } from '@/components/icons';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" aria-disabled={pending} disabled={pending}>
      <LogIn className="mr-2" />
      {pending ? 'Connexion...' : 'Se connecter'}
    </Button>
  );
}

function AnonymousLoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="button" variant="secondary" className="w-full" onClick={() => signInAnonymously()} disabled={pending}>
            {pending ? 'Connexion...' : "Continuer en tant qu'invité"}
        </Button>
    )
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">ComplyTrain</CardTitle>
          <CardDescription>
            Veuillez vous connecter pour accéder à votre tableau de bord de conformité.
          </CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                defaultValue="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                name="password" 
                required 
                defaultValue="password"
              />
            </div>
            {errorMessage && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur de connexion</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <LoginButton />
            <AnonymousLoginButton />
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
