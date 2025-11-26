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

const getActionBadgeVariant = (action: string) => {
  if (action.includes('Completed') || action.includes('Generated')) return 'default';
  if (action.includes('Updated') || action.includes('Added')) return 'secondary';
  if (action.includes('Failed') || action.includes('Deleted')) return 'destructive';
  return 'outline';
};

export default function AuditPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>
          A log of all significant user and system actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
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
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
