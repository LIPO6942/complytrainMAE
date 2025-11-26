import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components://components/ui/button';
import { FileDown } from 'lucide-react';
import { reportingData } from '@/lib/data';
import { CompletionChart } from '@/components/app/reporting/completion-chart';
import { SuccessChart } from '@/components/app/reporting/success-chart';
import { Heatmap } from '@/components/app/reporting/heatmap';

export default function ReportingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reporting & Analytics</h1>
          <p className="text-muted-foreground">
            Real-time analysis of your organization&apos;s compliance training.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Course Completion Rate</CardTitle>
            <CardDescription>Monthly completion rate across all active courses.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionChart data={reportingData.completionRate} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Success Rate by Department</CardTitle>
            <CardDescription>Average quiz success rate for each business unit.</CardDescription>
          </CardHeader>
          <CardContent>
            <SuccessChart data={reportingData.successRate} />
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Compliance Risk Heatmap</CardTitle>
          <CardDescription>Scores by user and regulatory topic. Lower scores indicate higher risk.</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap data={reportingData.heatmapData} />
        </CardContent>
      </Card>
    </div>
  );
}
