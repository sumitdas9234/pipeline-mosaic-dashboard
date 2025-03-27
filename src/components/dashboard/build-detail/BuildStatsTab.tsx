
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import { ExternalLink } from 'lucide-react';
import { Build } from '@/types';

interface BuildStatsTabProps {
  build: Build;
  pipelineStats: {
    passed: number;
    failed: number;
    inprogress: number;
  } | null;
}

export function BuildStatsTab({ build, pipelineStats }: BuildStatsTabProps) {
  if (!pipelineStats) return null;

  const chartData = [
    { name: 'Passed', value: pipelineStats.passed, color: '#10B981' }, // Green for pass
    { name: 'Failed', value: pipelineStats.failed, color: '#EF4444' }, // Red for fail
    { name: 'In Progress', value: pipelineStats.inprogress, color: '#F97316' } // Amber for in progress
  ].filter(item => item.value > 0);

  const chartConfig = {
    passed: { 
      color: '#10B981',
      label: 'Passed'
    },
    failed: { 
      color: '#EF4444',
      label: 'Failed'
    },
    inprogress: { 
      color: '#F97316',
      label: 'In Progress'
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-sans"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer config={chartConfig}>
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
              </RechartsPieChart>
            </ChartContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-status-passed"></div>
              <span className="text-sm">Passed: {pipelineStats.passed}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-status-failed"></div>
              <span className="text-sm">Failed: {pipelineStats.failed}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-status-inprogress"></div>
              <span className="text-sm">In Progress: {pipelineStats.inprogress}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jenkins URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CI/CD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span>Jenkins Pipeline:</span>
            <a 
              href={build.jenkinsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-crystal-primary hover:underline flex items-center gap-1"
            >
              View pipeline
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
