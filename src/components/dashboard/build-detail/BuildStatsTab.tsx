
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
        className="text-xs font-sans font-medium"
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
          {/* Increased height and improved centering for chart container */}
          <div className="h-[360px] w-full flex justify-center items-center">
            <ChartContainer config={chartConfig} className="w-full max-w-[450px]">
              {/* Fixed dimensions and increased margins for better visibility */}
              <RechartsPieChart width={450} height={300} margin={{ top: 30, right: 40, left: 40, bottom: 30 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  innerRadius={55}
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
          
          {/* More space between chart and legend, better flex layout for legend */}
          <div className="flex justify-center items-center gap-6 mt-6">
            {chartData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm whitespace-nowrap">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
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
