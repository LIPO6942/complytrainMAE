'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { FormEvent, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
    }
  }, [userProfile]);

  const handleSubmit = (e: FormEvent) => {
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
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>
                  C'est ainsi que les autres vous verront sur le site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>
                Gérez les paramètres de votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Les paramètres du compte seront ici.</p>
            </CardContent>
          </Card>
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
