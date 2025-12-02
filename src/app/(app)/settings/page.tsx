'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, setDocumentNonBlocking, useAuth, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { FormEvent, useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { updatePassword, deleteUser } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Users, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { allDepartments } from '@/lib/data';

export default function SettingsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isAdmin = userProfile?.role === 'admin';
  const isSiegeUser = userProfile?.agencyCode === 'SIEGE';
  
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
    }
  }, [userProfile]);
  
  const departmentName = useMemo(() => {
    if (!userProfile?.departmentId) return "Non assigné";
    return allDepartments.find(dept => dept.id === userProfile.departmentId)?.name || "Inconnu";
  }, [userProfile?.departmentId]);

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
        toast({
            title: "Erreur",
            description: "Vous devez être connecté pour mettre à jour votre profil.",
            variant: "destructive",
        });
        return;
    }

    const userRef = doc(firestore, 'users', user.uid);
    setDocumentNonBlocking(userRef, {
        firstName: firstName,
        lastName: lastName,
    }, { merge: true });
    
    toast({
        title: "Succès",
        description: "Votre profil a été mis à jour.",
    });
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password !== confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas.");
        return;
    }
    if (!user) {
        setPasswordError("Utilisateur non authentifié.");
        return;
    }
    if(password.length < 6) {
        setPasswordError("Le mot de passe doit comporter au moins 6 caractères.");
        return;
    }

    try {
        await updatePassword(user, password);
        toast({
            title: "Succès",
            description: "Votre mot de passe a été mis à jour.",
        });
        setPassword('');
        setConfirmPassword('');
    } catch (error: any) {
        console.error("Password update error:", error);
        if (error.code === 'auth/requires-recent-login') {
             setPasswordError("Cette opération est sensible et nécessite une authentification récente. Veuillez vous reconnecter avant de réessayer.");
        } else {
            setPasswordError("Une erreur s'est produite lors de la mise à jour du mot de passe.");
        }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
        toast({
            title: "Erreur",
            description: "Utilisateur non authentifié.",
            variant: "destructive"
        });
        return;
    }
    try {
        await deleteUser(user);
        toast({
            title: "Compte supprimé",
            description: "Votre compte a été supprimé avec succès.",
        });
        // User will be redirected automatically by the auth listener
    } catch (error: any) {
        console.error("Account deletion error:", error);
        toast({
            title: "Erreur",
            description: error.code === 'auth/requires-recent-login'
                ? "Cette opération est sensible. Veuillez vous reconnecter avant de supprimer votre compte."
                : "Une erreur s'est produite lors de la suppression du compte.",
            variant: "destructive"
        });
    }
  };

  const handleResetProgress = () => {
    if (!user || !firestore) {
        toast({
            title: "Erreur",
            description: "Vous devez être connecté pour réinitialiser votre progression.",
            variant: "destructive",
        });
        return;
    }

    const userRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(userRef, {
        completedQuizzes: [],
        scores: {},
        quizzesPassed: 0,
        quizAttempts: 0,
        averageScore: 0,
        badges: [],
        totalTimeSpent: 0
    });
    
    toast({
        title: "Progression réinitialisée",
        description: "Toutes vos réponses et votre progression ont été effacées.",
    });
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres et les préférences de votre compte.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>
                  C'est ainsi que les autres vous verront sur le site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">{isSiegeUser ? 'Département (Siège)' : 'Délégation'}</Label>
                        <Input id="department" value={departmentName} disabled readOnly />
                    </div>
                    {!isSiegeUser && userProfile?.agencyCode && (
                        <div className="space-y-2">
                            <Label htmlFor="agencyCode">Code Agence</Label>
                            <Input id="agencyCode" value={userProfile.agencyCode} disabled readOnly />
                        </div>
                    )}
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ''} readOnly disabled />
                </div>
                <Button type="submit">Enregistrer les modifications</Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <div className="space-y-6">
             {isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle>Gestion des administrateurs</CardTitle>
                        <CardDescription>
                            Gérez les utilisateurs et les invitations depuis le panneau d'administration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Button asChild>
                           <Link href="/users">
                            <Users className="mr-2 h-4 w-4" />
                            Aller à la gestion des utilisateurs
                           </Link>
                       </Button>
                    </CardContent>
                </Card>
            )}
            <Card>
                <form onSubmit={handlePasswordSubmit}>
                    <CardHeader>
                        <CardTitle>Changer le mot de passe</CardTitle>
                        <CardDescription>
                            Choisissez un nouveau mot de passe fort pour votre compte.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nouveau mot de passe</Label>
                            <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                         {passwordError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>{passwordError}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit">Mettre à jour le mot de passe</Button>
                    </CardContent>
                </form>
            </Card>
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zone de danger</CardTitle>
                    <CardDescription>
                        Ces actions sont permanentes et ne peuvent pas être annulées.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Réinitialiser ma progression
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Réinitialiser votre progression ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action effacera tous vos scores de quiz, badges et temps de formation. Vous pourrez repasser tous les tests comme si c'était la première fois.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={handleResetProgress} className="bg-destructive hover:bg-destructive/90">
                                    Oui, réinitialiser ma progression
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Supprimer le compte</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Toutes vos données, y compris votre progression et vos badges, seront définitivement supprimées.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                    Oui, supprimer mon compte
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
           <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez la manière dont vous recevez les notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Notifications par e-mail</p>
                        <p className="text-sm text-muted-foreground">Recevoir des e-mails pour les mises à jour importantes.</p>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Nouveaux cours</p>
                        <p className="text-sm text-muted-foreground">Être notifié lorsqu'un nouveau cours est disponible.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Rappels de quiz</p>
                        <p className="text-sm text-muted-foreground">Recevoir des rappels pour les quiz non terminés.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="appearance">
           <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application. Passez en mode clair ou sombre.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme}>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Clair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Sombre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">Système</Label>
                    </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
