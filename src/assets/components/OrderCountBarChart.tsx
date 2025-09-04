import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

interface OrderData {
  month: number;
  orderCount: number;
}

export default function OrderCountBarChart() {
  const theme = useTheme();

  const [data, setData] = React.useState<OrderData[]>([]);
  const [maxOrder, setMaxOrder] = React.useState(0);
  const [minOrder, setMinOrder] = React.useState(0);

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/getOrderCountEachMonthForCurrentYear", {
          headers: { "Content-Type": "application/json" }
        });
        const myData = data.data as OrderData[];
        setData(myData);
        
        const max = myData.reduce((max, item) => Math.max(max, item.orderCount), 0);
        const min = myData.reduce((min, item) => Math.min(min, item.orderCount), 0);
        setMaxOrder(max);
        setMinOrder(min);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = React.useMemo(() => data.map(item => item.orderCount), [data]);
  const chartLabels = React.useMemo(() => data.map(item => monthNames[item.month - 1]), [data, monthNames]);

  return (
    <Card variant="outlined" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography component="h5" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          จำนวนออเดอร์ของแต่ละเดือน
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            จำนวนสูงสุด: <Box component="span" sx={{ fontWeight: 'bold', color: '#42A5F5' }}>{maxOrder} ออเดอร์</Box>
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            จำนวนต่ำสุด: <Box component="span" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>{minOrder} ออเดอร์</Box>
          </Typography>
        </Stack>
        
        <Box sx={{ width: '100%', height: 250 }}>
          <BarChart
            height={220}
            series={[
              {
                id: 'orderCount',
                label: 'จำนวนออเดอร์',
                data: chartData,
                color: '#42A5F5',
              }
            ]}
            xAxis={[
              {
                scaleType: 'band',
                data: chartLabels,
                tickLabelInterval: (index) => (index + 1) % 2 === 0,
              },
            ]}
            yAxis={[{ width: 30 }]}
            margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
            grid={{ horizontal: true }}
            slotProps={{
              tooltip: {
                trigger: 'item',
              },
              legend: {
                position: { vertical: 'bottom', horizontal: 'center' }
              },
            }}
            sx={{
              '& .MuiBarElement-root': {
                fillOpacity: 0.8,
              },
              '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                fontSize: '10px',
                transform: 'translateY(10px)',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}