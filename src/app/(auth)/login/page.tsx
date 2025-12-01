'use client';

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { setDoc, doc, getFirestore, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staticDepartments } from '@/lib/data';


function AuthButton({ isSignUp }: { isSignUp: boolean }) {
  const { pending } = useFormStatus();
  const icon = isSignUp ? <UserPlus className="mr-2" /> : <LogIn className="mr-2" />;
  const text = isSignUp ? (pending ? "Création du compte..." : "S'inscrire") : (pending ? 'Connexion...' : 'Se connecter');
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {icon}
      {text}
    </Button>
  );
}

function AnonymousLoginButton() {
    const { pending } = useFormStatus();
    const auth = useAuth();
    const handleAnonymousSignIn = async () => {
        if (!auth) return;
        try {
            // This needs to be implemented in a non-blocking way if we re-introduce it
            await signInWithEmailAndPassword(auth, 'anonymous@example.com', 'password');
        } catch (error) {
            console.error("Anonymous sign in failed", error);
        }
    }

    return (
        <Button type="button" variant="secondary" className="w-full" onClick={handleAnonymousSignIn} disabled={pending}>
            {pending ? 'Connexion...' : "Continuer en tant qu'invité"}
        </Button>
    )
}

function AuthForm({ isSignUp }: { isSignUp: boolean }) {
    const auth = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!auth) return;
        setErrorMessage(undefined);
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const departmentId = formData.get('departmentId') as string;
        const agencyCode = formData.get('agencyCode') as string;
        const db = getFirestore(auth.app);

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                const batch = writeBatch(db);

                // 1. Check for a pending invitation
                const invitationsRef = collection(db, 'invitations');
                const q = query(invitationsRef, where("email", "==", email), where("status", "==", "pending"));
                const querySnapshot = await getDocs(q);

                let userRole = 'user'; // Default role
                let userDepartmentId = departmentId;

                if (!querySnapshot.empty) {
                    const invitationDoc = querySnapshot.docs[0];
                    userRole = invitationDoc.data().role;
                    // Invitation department takes precedence if it exists
                    userDepartmentId = invitationDoc.data().departmentId || departmentId;
                    
                    // Mark invitation as completed
                    batch.update(invitationDoc.ref, { status: "completed" });
                }

                // 2. Create the user profile document
                const userRef = doc(db, "users", user.uid);
                batch.set(userRef, {
                    id: user.uid,
                    email: user.email, // Ensure email is always set
                    role: userRole,
                    departmentId: userDepartmentId,
                    agencyCode: agencyCode,
                    createdAt: new Date().toISOString()
                });

                // 3. Commit the batch
                await batch.commit();

            } else { // Sign in
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userRef = doc(db, 'users', user.uid);
                // On sign-in, ensure email is present and update last sign in time
                await setDoc(userRef, { 
                    email: user.email, // Ensure email is present
                    lastSignInTime: new Date().toISOString() 
                }, { merge: true });
            }
        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setErrorMessage('Utilisateur non trouvé. Veuillez vérifier votre email.');
                    break;
                case 'auth/wrong-password':
                    setErrorMessage('Mot de passe incorrect. Veuillez réessayer.');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('Email invalide. Veuillez vérifier votre saisie.');
                    break;
                case 'auth/email-already-in-use':
                    setErrorMessage('Cet email est déjà utilisé.');
                    break;
                case 'auth/weak-password':
                    setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
                    break;
                case 'auth/invalid-credential':
                     setErrorMessage('Les informations d\'identification sont invalides.');
                     break;
                default:
                    console.error("Auth error:", error);
                    setErrorMessage("Une erreur inattendue s'est produite.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                {isSignUp && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="departmentId">Département</Label>
                            <Select name="departmentId">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un département" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staticDepartments.map(dept => (
                                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agencyCode">Code Agence</Label>
                            <Input
                                id="agencyCode"
                                type="text"
                                name="agencyCode"
                                placeholder="ex: 101"
                            />
                        </div>
                    </>
                )}
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
    const { user, isUserLoading } = useUser();

    useEffect(() => {
        if (!isUserLoading && user) {
            redirect('/dashboard');
        }
    }, [user, isUserLoading]);

    if (isUserLoading || user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Chargement...</p>
            </div>
        );
    }
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
