import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';

export interface CustomerEntryStruct {
  label: string;
  value: number;
  color?: string; 
}

interface CustomerEntryPieChartProps {
  customerEntryData: CustomerEntryStruct[];
  title: string;
}

export default function CustomerEntryPieChart({ customerEntryData, title }: CustomerEntryPieChartProps) {
  const theme = useTheme();

  // A more modern, subtle color palette
  const modernColors = ['#4A90E2', '#FFC107', '#4CAF50', '#9C27B0', '#F57C00', '#795548', '#607D8B'];

  // Calculate total for percentages
  const total = customerEntryData.reduce((sum, entry) => sum + entry.value, 0);

  const pieChartData = customerEntryData.map((item, index) => ({
    ...item,
    id: index,
    color: item.color || modernColors[index % modernColors.length],
  }));

  return (
    <Card variant="outlined" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography component="h5" variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4 }}>
          {/* Pie Chart */}
          <Box sx={{ flexShrink: 0, '& .MuiChartsSurface-root': {
            borderRadius: '50%', // Make the chart container round
            overflow: 'hidden'
          }}}>
            <PieChart
              series={[
                {
                  data: pieChartData,
                  innerRadius: 40, // More modern "donut" style
                  outerRadius: 80,
                  paddingAngle: 3, // Small gap between slices
                  cornerRadius: 5, // Rounded corners on slices
                  highlightScope: { highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={250}
              width={200}
              // Hide the default legend to use our custom one
            />
          </Box>

          {/* Custom Stacked Legend */}
          <Stack
            direction="column"
            spacing={1}
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
              pl: { sm: 2 }
            }}
          >
            {pieChartData.map((item) => (
              <Stack key={item.id} direction="row" alignItems="center" spacing={1.5}>
                {/* Color indicator */}
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 1.5, // Subtle rounded square
                    bgcolor: item.color,
                  }}
                />
                {/* Label and Percentage */}
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  <Box component="span" sx={{ fontWeight: 600, color: theme.palette.text.primary, mr: 0.5 }}>
                    {item.label}:
                  </Box>
                  {((item.value / total) * 100).toFixed(1)}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}