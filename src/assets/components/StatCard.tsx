import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

export interface StatCardStruct {
  title: string;
  mainValue?: string;
  compareValue?: string | any;
  mainDate?: string | any;
  compareDate?: string | any;
  percentValue?: string | any;
  type: string;
  trend?: string | any;
  tabNumber?: number;
};

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days: string[] = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({
  title,
  mainValue,
  compareValue,
  mainDate,
  compareDate,
  trend,
  percentValue,
  type
}: StatCardStruct) {

  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const trendValues = { up: '+25%', down: '-25%', neutral: '+5%' };

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              {
                type == 'compare' && (
                  <Typography variant="h4" component="p">
                    {mainValue}
                  </Typography>
                )
              }
              {
                type == 'info' && (
                  <Typography variant="h5" component="p">
                    {mainValue}
                  </Typography>
                )
              }
              {
                type == 'countInfo' && (
                  <Typography style={Number(mainValue) < 1 ? { color: 'green' } : { color: 'red' }} variant="h5" component="p">
                    {mainValue} ชิ้น
                  </Typography>
                )
              }
              {
                type == 'compare' && (
                  <Chip size="small" color={color} label={percentValue} />
                )
              }
            </Stack>
            {
              type == 'compare' && (
                <Typography variant="caption">
                  {mainDate}
                </Typography>
              )
            }
          </Stack>
        </Stack>
        {
          type == 'compare' && (
            <Stack direction="column" spacing={1} flexGrow={1}>
              <Stack>
                <Stack direction="row" color="text.secondary" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4">{compareValue}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {compareDate}
                </Typography>
              </Stack>
            </Stack>

          )
        }
      </CardContent>
    </Card>
  );
}
