'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate, signInAnonymously, signUp } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AuthButton({ isSignUp }: { isSignUp: boolean }) {
  const { pending } = useFormStatus();
  const icon = isSignUp ? <UserPlus className="mr-2" /> : <LogIn className="mr-2" />;
  const text = isSignUp ? (pending ? "Création du compte..." : "S'inscrire") : (pending ? 'Connexion...' : 'Se connecter');
  return (
    <Button className="w-full" aria-disabled={pending} disabled={pending}>
      {icon}
      {text}
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

function AuthForm({ isSignUp }: { isSignUp: boolean }) {
    const action = isSignUp ? signUp : authenticate;
    const [errorMessage, dispatch] = useActionState(action, undefined);

    return (
        <form action={dispatch}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={isSignUp ? 'signup-email' : 'signin-email'}>Email</Label>
                    <Input
                        id={isSignUp ? 'signup-email' : 'signin-email'}
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                        defaultValue="admin@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={isSignUp ? 'signup-password' : 'signin-password'}>Mot de passe</Label>
                    <Input
                        id={isSignUp ? 'signup-password' : 'signin-password'}
                        type="password"
                        name="password"
                        required
                        defaultValue="password"
                    />
                </div>
                {errorMessage && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <AuthButton isSignUp={isSignUp} />
                <AnonymousLoginButton />
            </CardFooter>
        </form>
    )
}

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">ComplyTrain</CardTitle>
          <CardDescription>
            Accédez à votre tableau de bord de conformité.
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">S'inscrire</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                <AuthForm isSignUp={false} />
            </TabsContent>
            <TabsContent value="signup">
                <AuthForm isSignUp={true} />
            </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
