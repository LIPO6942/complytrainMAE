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
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Alex Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex.dupont@example.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account settings will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
           <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="appearance">
           <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Appearance settings will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
