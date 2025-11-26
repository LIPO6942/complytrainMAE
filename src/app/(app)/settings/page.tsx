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
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FormEvent, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


export default function SettingsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({
            title: "Erreur",
            description: "Vous devez être connecté pour mettre à jour votre profil.",
            variant: "destructive",
        });
        return;
    }

    try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            firstName: firstName,
            lastName: lastName,
        }, { merge: true });
        
        toast({
            title: "Succès",
            description: "Votre profil a été mis à jour.",
        });
    } catch (error) {
        console.error("Error updating profile: ", error);
        toast({
            title: "Erreur",
            description: "Une erreur s'est produite lors de la mise à jour de votre profil.",
            variant: "destructive",
        });
    }
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
            <CardContent>
              <p>Les paramètres de notification seront ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="appearance">
           <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Les paramètres d'apparence seront ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
