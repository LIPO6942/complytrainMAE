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

export default function SettingsPage() {
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
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                C'est ainsi que les autres vous verront sur le site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" defaultValue="Alex Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex.dupont@example.com" />
              </div>
              <Button>Enregistrer les modifications</Button>
            </CardContent>
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
