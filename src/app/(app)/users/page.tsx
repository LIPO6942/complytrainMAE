'use client';
import { useCollection, useFirestore, useUser, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type UserProfile = {
    id: string;
    email: string;
    role: 'admin' | 'user';
    lastSignInTime?: string;
}

export default function UsersPage() {
    const { userProfile } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || userProfile?.role !== 'admin') return null;
        return collection(firestore, 'users');
    }, [firestore, userProfile]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
        if (!firestore) return;
        const userRef = doc(firestore, 'users', userId);
        setDocumentNonBlocking(userRef, { role: newRole }, { merge: true });
        toast({
            title: "Rôle mis à jour",
            description: `Le rôle de l'utilisateur a été défini sur ${newRole}.`
        });
    };

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Accès refusé</CardTitle>
                        <CardDescription>
                            Vous devez être un administrateur pour accéder à cette page.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                    Gérer les utilisateurs et leurs rôles.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead className="text-right">Changer de rôle</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-[120px] ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                        {users?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.lastSignInTime ? formatDistanceToNow(new Date(user.lastSignInTime), { addSuffix: true, locale: fr }) : 'Jamais'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Select 
                                        defaultValue={user.role} 
                                        onValueChange={(newRole: 'admin' | 'user') => handleRoleChange(user.id, newRole)}
                                        disabled={user.id === userProfile?.id}
                                    >
                                        <SelectTrigger className="w-[120px] ml-auto">
                                            <SelectValue placeholder="Changer de rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">Utilisateur</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}
