
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  TooltipProps 
} from 'recharts';
import { TrendDataPoint } from '@/data/mockPlatformIssues';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PlatformIssuesTrendProps {
  data: TrendDataPoint[];
  isLoading: boolean;
}

export function PlatformIssuesTrend({ data, isLoading }: PlatformIssuesTrendProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Issues Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading trend data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Issues Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No trend data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    total: { label: "Total Issues", theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
    active: { label: "Active Issues", theme: { light: "#F97316", dark: "#F97316" } },
    resolved: { label: "Resolved Issues", theme: { light: "#10B981", dark: "#10B981" } },
  };

  const formatXAxisTick = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Issues Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisTick} 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <Tooltip content={({ active, payload, label }: TooltipProps<number, string>) => {
                  if (!active || !payload?.length) return null;
                  
                  const date = new Date(label);
                  const formattedDate = new Intl.DateTimeFormat('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }).format(date);
                  
                  return (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={formattedDate}
                      labelKey="date"
                      nameKey="name"
                    />
                  );
                }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="total"
                  stroke="var(--color-total)" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  name="active"
                  stroke="var(--color-active)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  name="resolved"
                  stroke="var(--color-resolved)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
