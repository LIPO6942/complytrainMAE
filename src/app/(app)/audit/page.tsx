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
import { auditLogs } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const getActionBadgeVariant = (action: string) => {
  if (action.includes('Terminé') || action.includes('Généré')) return 'default';
  if (action.includes('Mis à jour') || action.includes('Ajouté')) return 'secondary';
  if (action.includes('Échec') || action.includes('Supprimé')) return 'destructive';
  return 'outline';
};

export default function AuditPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Piste d'audit</CardTitle>
        <CardDescription>
          Un journal de toutes les actions importantes des utilisateurs et du système.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead className="text-right">Horodatage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>
                  <Badge variant={getActionBadgeVariant(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{log.details}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
