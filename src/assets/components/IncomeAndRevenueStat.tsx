import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

interface FinancialData {
  date: string;
  totalIncome: number;
  totalRevenue: number;
}

interface ChartSeries {
  id: string;
  label: string;
  data: number[];
  color?: string;
  stack: string;
}

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

export default function IncomeAndRevenueStat() {
  const theme = useTheme();

  const [financialData, setFinancialData] = React.useState<FinancialData[]>([]);
  const [maxValues, setMaxValues] = React.useState({ income: 0, revenue: 0 });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/get30DaysIncomeAndRevenue", {
          filterType: "today",
        }, {
          headers: { "Content-Type": "application/json" }
        });
        const myData = data.data.financialData;
        setFinancialData(myData);
        const maxIncome = myData.reduce((max, item) => Math.max(max, item.totalIncome), 0);
        const maxRevenue = myData.reduce((max, item) => Math.max(max, item.totalRevenue), 0);
        setMaxValues({ income: maxIncome, revenue: maxRevenue });
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };
    fetchData();
  }, []);

  const previousMonth = new Date().getMonth();

  const chartSeries: ChartSeries[] = React.useMemo(() => {
    return [
      {
        id: "Revenue",
        label: "ต้นทุน",
        data: financialData.map(item => item.totalRevenue),
        color: '#FF6F00',
        stack: 'total', // Stack Revenue first
      },
      {
        id: "Income",
        label: "กำไร",
        data: financialData.map(item => item.totalIncome),
        color: '#42A5F5',
        stack: 'total', // Stack Income on top of Revenue
      },
    ];
  }, [financialData]);

  const xLabels = financialData.map(item => formatDateLabel(item.date));

  return (
    <Card variant="outlined" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography component="h5" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          กำไรและต้นทุนของเดือน {previousMonth}
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            กำไรสูงสุด: <Box component="span" sx={{ fontWeight: 'bold', color: '#42A5F5' }}>{maxValues.income} บาท</Box>
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            ต้นทุนสูงสุด: <Box component="span" sx={{ fontWeight: 'bold', color: '#FF6F00' }}>{maxValues.revenue} บาท</Box>
          </Typography>
        </Stack>
        
        <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center' }}>
          <BarChart
            height={200}
            series={chartSeries}
            xAxis={[
              {
                scaleType: 'band', // Use 'band' for bar charts
                data: xLabels,
                // Make labels more readable by only showing every 5th day
                tickLabelInterval: (index) => index % 5 === 0,
              },
            ]}
            yAxis={[{ tickNumber: 5 }]}
            margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
            grid={{ horizontal: true }}
            slotProps={{
              tooltip: {
                trigger: 'axis',
              },
              legend: {
                position: { vertical: 'bottom', horizontal: 'center' },
              },
            }}
            sx={{
              '& .MuiBarElement-root': {
                // Apply a single color or keep the gradient for consistency
                borderRadius: 4,
                fillOpacity: 0.8,
              },
              // Ensure labels fit
              '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                fontSize: '10px',
                transform: 'translateY(10px)',
              },
            }}
          >
            {/* You can add a gradient definition here for the bars if you want to match the previous line chart's aesthetic */}
            <defs>
              <linearGradient id="total-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42A5F5" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#FF6F00" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </BarChart>
        </Box>
      </CardContent>
    </Card>
  );
}