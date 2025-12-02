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
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AddUserDialog } from '@/components/app/users/add-user-dialog';
import { useMemo } from 'react';
import { allDepartments } from '@/lib/data';

type UserProfile = {
    id: string;
    email: string;
    role: 'admin' | 'user';
    lastSignInTime?: string;
    departmentId?: string;
    agencyCode?: string;
}

type Invitation = {
    id: string;
    email: string;
    role: 'admin' | 'user';
    status: 'pending' | 'completed';
    departmentId?: string;
}

export default function UsersPage() {
    const { userProfile } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const isAdmin = userProfile?.role === 'admin';

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !isAdmin) return null;
        return collection(firestore, 'users');
    }, [firestore, isAdmin]);

    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);

    const invitationsQuery = useMemoFirebase(() => {
        if (!firestore || !isAdmin) return null;
        return collection(firestore, 'invitations');
    }, [firestore, isAdmin]);

    const { data: invitations, isLoading: isLoadingInvitations } = useCollection<Invitation>(invitationsQuery);
    
    const allUsersAndInvites = useMemo(() => {
        const combined = new Map<string, any>();
        const registeredEmails = new Set<string>();

        // Add registered users first, they have priority
        (users || []).forEach(user => {
            if (user.email) {
              combined.set(user.email, {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  departmentId: user.departmentId,
                  agencyCode: user.agencyCode,
                  status: 'registered',
                  lastSignInTime: user.lastSignInTime,
                  isRegistered: true,
              });
              registeredEmails.add(user.email);
            }
        });

        // Add pending invitations only if the email is not already registered
        (invitations || []).forEach(invite => {
            if (invite.status === 'pending' && !registeredEmails.has(invite.email)) {
                combined.set(invite.email, {
                    id: invite.id,
                    email: invite.email,
                    role: invite.role,
                    departmentId: invite.departmentId,
                    agencyCode: 'N/A',
                    status: 'pending',
                    lastSignInTime: undefined,
                    isRegistered: false,
                });
            }
        });

        return Array.from(combined.values());

    }, [users, invitations]);


    const isLoading = isLoadingUsers || isLoadingInvitations;

    const handleFieldChange = (userId: string, field: 'role' | 'departmentId' | 'agencyCode', value: string) => {
        if (!firestore) return;
        const userRef = doc(firestore, 'users', userId);
        setDocumentNonBlocking(userRef, { [field]: value }, { merge: true });
        toast({
            title: "Utilisateur mis à jour",
            description: `Le profil de l'utilisateur a été mis à jour.`
        });
    };

    if (!isAdmin) {
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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                    <CardDescription>
                        Inviter des utilisateurs et gérer leurs rôles et départements.
                    </CardDescription>
                </div>
                <AddUserDialog />
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Code Agence</TableHead>
                        <TableHead className="text-right">Rôle</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-[180px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-[120px] ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && allUsersAndInvites?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>
                                    {user.isRegistered ? (
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            Inscrit
                                        </Badge>
                                    ) : (
                                         <Badge variant="outline">
                                            En attente
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.isRegistered && user.lastSignInTime 
                                        ? formatDistanceToNow(new Date(user.lastSignInTime), { addSuffix: true, locale: fr }) 
                                        : '—'}
                                </TableCell>
                                <TableCell>
                                     <Select 
                                        value={user.departmentId} 
                                        onValueChange={(newDeptId: string) => handleFieldChange(user.id, 'departmentId', newDeptId)}
                                        disabled={!user.isRegistered}
                                    >
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue placeholder="Non assigné" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allDepartments.map(dept => (
                                                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.agencyCode || '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Select 
                                        defaultValue={user.role} 
                                        onValueChange={(newRole: 'admin' | 'user') => handleFieldChange(user.id, 'role', newRole)}
                                        disabled={!user.isRegistered || user.id === userProfile?.id}
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
