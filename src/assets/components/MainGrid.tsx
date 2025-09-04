import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import StatCard, { StatCardStruct } from './StatCard';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import IncomeAndRevenueStat from './IncomeAndRevenueStat';
import OrderCountBarChart from './OrderCountBarChart';
import CustomerEntryPieChart, { CustomerEntryStruct } from './CustomerEntryPieChart';
import CustomerRankingBoard, { CustomerRankingBoardStruct } from './CustomerRankingBoardChart';
import ProductRankingBoard, { ProductRankingBoardStruct } from './ProductRankingBoardChart';

const mapNumberToData = (number: number) => {
  switch (number) {
    case 0:
      return 'today';
    case 1:
      return 'thisWeek';
    case 2:
      return 'thisMonth';
    default:
      return 'today';
  }
}

function getTitleByFilterType(type: string, index: number): string {
  switch (type) {
    case "today":
      if (index == 0) {
        return 'กำไรของวันนี้ทั้งสิ้น';
      }
      if (index == 1) {
        return 'กำไรเฉลี่ยของวันนี้ทั้งสิ้น';
      }
      if (index == 2) {
        return 'ต้นทุนที่ขายไปวันนี้ทั้งสิน';
      }
      if (index == 3) {
        return 'จำนวนออเดอร์ของวันนี้ทั้งสิ้น';
      }
    case "thisWeek":
      if (index == 0) {
        return 'กำไรของสัปดาห์นี้ทั้งสิ้น';
      }
      if (index == 1) {
        return 'กำไรเฉลี่ยของสัปดาห์นี้ทั้งสิ้น';
      }
      if (index == 2) {
        return 'ต้นทุนที่ขายไปสัปดาห์นี้ทั้งสิน';
      }
      if (index == 3) {
        return 'จำนวนออเดอร์ของสัปดาห์นี้ทั้งสิ้น';
      }
    case "thisMonth":
      if (index == 0) {
        return 'กำไรของเดือนนี้ทั้งสิ้น';
      }
      if (index == 1) {
        return 'กำไรเฉลี่ยของเดือนนี้ทั้งสิ้น';
      }
      if (index == 2) {
        return 'ต้นทุนที่ขายไปเดือนนี้ทั้งสิน';
      }
      if (index == 3) {
        return 'จำนวนออเดอร์ของเดือนนี้ทั้งสิ้น';
      }
    default:
      return 'กำไรของวันนี้ทั้งสิ้น';
  }
}


export default function MainGrid() {

  React.useEffect(() => {
    const fetchData = async () => {
      const item: StatCardStruct[] = [];

      await fetchTotalIncome(item, "today");
      await fetchAverageIncome(item, "today");
      await fetchTotalRevenue(item, "today");
      await fetchCountOrder(item, "today");
      await fetchAllTotalIncome(item);
      await fetchStockLessItem(item);
      await fetchLatestAddStockDate(item);
      setCard(item);
      setIsPrepareData(true);
    };

    fetchData();
  }, []);

  async function fetchTotalIncomeWithGrid(filterType: string, index: number) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/totalIncome", {
        filterType,
      });
  
      const totalIncome = data.data;
      const isUp = Number(totalIncome.currentDate.totalIncome) > Number(totalIncome.compareDate.totalIncome);
  
      setCard(prev => {
        const newCards = [...prev];
        const target = newCards.find(item => item.tabNumber === index + 1);
  
        if (target) {
          target.mainValue = String(totalIncome.currentDate.totalIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท";
          target.compareValue = String(totalIncome.compareDate.totalIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท";
          target.mainDate = totalIncome.currentDate.dateRange;
          target.compareDate = totalIncome.compareDate.dateRange;
          target.trend = isUp ? "up" : "down";
          target.percentValue = (isUp ? "+" : "-") + String(totalIncome.different.percentage) + "%";
          target.title = getTitleByFilterType(filterType, index);
        }
  
        return newCards;
      });
  
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchTotalRevenueWithGrid(filterType: string, index: number) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/totalRevenue", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const totalRevenue = data.data;
      const isUp = Number(totalRevenue.currentDate.totalRevenue) > Number(totalRevenue.compareDate.totalRevenue);
  
      setCard(prev => {
        const newCards = [...prev];
        const target = newCards.find(item => item.tabNumber === index + 1);
        if (target) {
          target.mainValue = String(totalRevenue.currentDate.totalRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท";
          target.compareValue = String(totalRevenue.compareDate.totalRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท";
          target.mainDate = totalRevenue.currentDate.dateRange;
          target.compareDate = totalRevenue.compareDate.dateRange;
          target.trend = isUp ? "up" : "down";
          target.percentValue = (isUp ? "+" : "-") + String(totalRevenue.different.percentage) + "%";
          target.title = getTitleByFilterType(filterType, index);
        }
  
        return newCards;
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchAverageIncomeWithGrid(filterType: string, index: number) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/averageIncome", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const averageIncome = data.data;
      const isUp = Number(averageIncome.currentDate.averageIncome) > Number(averageIncome.compareDate.averageIncome);
      setCard(prev => {
        const newCards = [...prev];
        const target = newCards.find(item => item.tabNumber === index + 1);
        if (target) {
          target.mainValue = String(averageIncome.currentDate.averageIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท";
          target.compareValue = String(averageIncome.compareDate.averageIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท";
          target.mainDate = averageIncome.currentDate.dateRange;
          target.compareDate = averageIncome.compareDate.dateRange;
          target.trend = isUp ? "up" : "down";
          target.percentValue = (isUp ? "+" : "-") + String(averageIncome.different.percentage) + "%";
          target.title = getTitleByFilterType(filterType, index);
        }
  
        return newCards;
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchCountOrderWithGrid(filterType: string, index: number) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/countOrder", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const totalOrder = data.data;
      const isUp = Number(totalOrder.currentDate.totalOrder) > Number(totalOrder.compareDate.totalOrder);
      setCard(prev => {
        const newCards = [...prev];
        const target = newCards.find(item => item.tabNumber === index + 1);
        if (target) {
          target.mainValue = String(totalOrder.currentDate.totalOrder).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ออเดอร์";
          target.compareValue = String(totalOrder.compareDate.totalOrder).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ออเดอร์";
          target.mainDate = totalOrder.currentDate.dateRange;
          target.compareDate = totalOrder.compareDate.dateRange;
          target.trend = isUp ? "up" : "down";
          target.percentValue = (isUp ? "+" : "-") + String(totalOrder.different.percentage) + "%";
          target.title = getTitleByFilterType(filterType, index);
        }
  
        return newCards;
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchTotalIncome(item: StatCardStruct[], filterType: string) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/totalIncome", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const totalIncome = data.data;
      const isUp = Number(totalIncome.currentDate.totalIncome) > Number(totalIncome.compareDate.totalIncome);
      const todayIncomeItem: StatCardStruct = {
        title: 'กำไรของวันนี้ทั้งสิ้น',
        mainValue: String(totalIncome.currentDate.totalIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท",
        compareValue: String(totalIncome.compareDate.totalIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท",
        mainDate: totalIncome.currentDate.dateRange,
        compareDate: totalIncome.compareDate.dateRange,
        trend: isUp ? "up" : "down",
        percentValue: (isUp ? "+" : "-") + String(totalIncome.different.percentage) + "%",
        type: 'compare',
        tabNumber: 1
      };
      item.push(todayIncomeItem);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchTotalRevenue(item: StatCardStruct[], filterType: string) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/totalRevenue", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const totalRevenue = data.data;
      const isUp = Number(totalRevenue.currentDate.totalRevenue) > Number(totalRevenue.compareDate.totalRevenue);
      const todayRevenueItem: StatCardStruct = {
        title: 'ต้นทุนที่ขายไปวันนี้ทั้งสิน',
        mainValue: String(totalRevenue.currentDate.totalRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท",
        compareValue: String(totalRevenue.compareDate.totalRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท",
        mainDate: totalRevenue.currentDate.dateRange,
        compareDate: totalRevenue.compareDate.dateRange,
        trend: isUp ? "up" : "down",
        percentValue: (isUp ? "+" : "-") + String(totalRevenue.different.percentage) + "%",
        type: 'compare',
        tabNumber: 3
      };
      item.push(todayRevenueItem);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchAverageIncome(item: StatCardStruct[], filterType: string) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/averageIncome", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const averageIncome = data.data;
      const isUp = Number(averageIncome.currentDate.averageIncome) > Number(averageIncome.compareDate.averageIncome);
      const todayAverageIncomeItem: StatCardStruct = {
        title: 'กำไรเฉลี่ยของวันนี้ทั้งสิ้น',
        mainValue: String(averageIncome.currentDate.averageIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท",
        compareValue: String(averageIncome.compareDate.averageIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท",
        mainDate: averageIncome.currentDate.dateRange,
        compareDate: averageIncome.compareDate.dateRange,
        trend: isUp ? "up" : "down",
        percentValue: (isUp ? "+" : "-") + String(averageIncome.different.percentage) + "%",
        type: 'compare',
        tabNumber: 2
      };
      item.push(todayAverageIncomeItem);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchCountOrder(item: StatCardStruct[], filterType: string) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/countOrder", {
        filterType: filterType,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const totalOrder = data.data;
      const isUp = Number(totalOrder.currentDate.totalOrder) > Number(totalOrder.compareDate.totalOrder);
      const todayOrderCountItem: StatCardStruct = {
        title: 'จำนวนออเดอร์ของวันนี้ทั้งสิ้น',
        mainValue: String(totalOrder.currentDate.totalOrder).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ออเดอร์",
        compareValue: String(totalOrder.compareDate.totalOrder).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ออเดอร์",
        mainDate: totalOrder.currentDate.dateRange,
        compareDate: totalOrder.compareDate.dateRange,
        trend: isUp ? "up" : "down",
        percentValue: (isUp ? "+" : "-") + String(totalOrder.different.percentage) + "%",
        type: 'compare',
        tabNumber: 4
      };
      item.push(todayOrderCountItem);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchStockLessItem(item: StatCardStruct[]) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/lessStockProduct");
      const stockLessItem = data.data;
      const todayStockLessItem: StatCardStruct = {
        title: 'จำนวนสินค้าที่เหลือในสต็อกน้อยกว่า 5 ชิ้น',
        mainValue: String(stockLessItem),
        type: 'countInfo',
      };
      item.push(todayStockLessItem);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchLatestAddStockDate(item: StatCardStruct[]) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/lastAddStockDate");
      const latestAddStockDate = data.data;
      const todayLatestAddStockDateItem: StatCardStruct = {
        title: 'วันที่เพิ่มสต็อกครั้งล่าสุด',
        mainValue: `${latestAddStockDate.date}`,
        type: 'info',
      };
      item.push(todayLatestAddStockDateItem);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function fetchAllTotalIncome(item: StatCardStruct[]) {
    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/dashboard/getAllTotalIncome");
      const allData = data.data;
      const allTotalOrder: StatCardStruct = {
        title: 'จำนวนออเดอร์ทั้งหมดตั้งแต่เปิดร้าน',
        mainValue: String(allData.totalOrder).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ออเดอร์',
        type: 'info',
      };
      const allTotalIncome: StatCardStruct = {
        title: 'กำไรทั้งหมดตั้งแต่เปิดร้าน',
        mainValue: String(allData.totalIncome).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' บาท',
        type: 'info',
      };
      const customerEntryList: CustomerEntryStruct[] = []
      allData.orderChannelList.map((item: any) => {
        let customerEntry: CustomerEntryStruct = {
          label: item.channel,
          value: item.orderCount
        }
        customerEntryList.push(customerEntry)
      })
      const customerRankingBoardList: CustomerRankingBoardStruct[] = []
      allData.customerRankingBoard.map((item: any, index: number) => {
        let rankingBoard: CustomerRankingBoardStruct = {
          rank: index + 1,
          customerPhone: item.customerPhone,
          customerName: item.customerName,
          totalIncome: item.incomeAmount,
          spendingAmount: item.spendingAmount
        }
        customerRankingBoardList.push(rankingBoard)
      })
      const productRankingBoardList: ProductRankingBoardStruct[] = []
      allData.top5ProductBoard.map((item: any, index: number) => {
        let rankingBoard: ProductRankingBoardStruct = {
          rank: index + 1,
          productName: item.productName,
          productSaleAmount: item.productSaleAmount,
          productPrice: item.productPrice,
          totalSpend: Number(item.productSaleAmount) * Number(item.productPrice)
        }
        productRankingBoardList.push(rankingBoard)
      })
      const productPieList: CustomerEntryStruct[] = []
      allData.productRankingBoard.map((item: any) => {
        let productPie: CustomerEntryStruct = {
          label: item.productName,
          value: item.productSaleAmount
        }
        productPieList.push(productPie)
      })
      item.push(allTotalOrder);
      item.push(allTotalIncome);
      setCustomerEntryData(customerEntryList)
      setProductPieData(productPieList)
      setCustomerRankingBoardData(customerRankingBoardList)
      setProductRankingBoardData(productRankingBoardList)
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }


  const [tabValue, setTabValue] = useState([0, 0, 0, 0]);
  const [isPrepareData, setIsPrepareData] = useState(false)
  const [card, setCard] = useState<StatCardStruct[]>([])
  const [customerRankingBoardData, setCustomerRankingBoardData] = useState<CustomerRankingBoardStruct[]>([])
  const [productRankingBoardData, setProductRankingBoardData] = useState<ProductRankingBoardStruct[]>([])
  const [customerEntryData, setCustomerEntryData] = useState<CustomerEntryStruct[]>([])
  const [productPieData, setProductPieData] = useState<CustomerEntryStruct[]>([])
  function handleTabChange(index: number, event: React.SyntheticEvent, newValue: number) {
    setTabValue(prev => {
      const updated = [...prev];
      updated[index] = newValue;
      const getDataMapper = mapNumberToData(newValue);
      switch (index) {
        case 0:
          fetchTotalIncomeWithGrid(getDataMapper, index);
          break;
        case 1:
          fetchAverageIncomeWithGrid(getDataMapper, index);
          break;
        case 2:
          fetchTotalRevenueWithGrid(getDataMapper, index);
          break;
        case 3:
          fetchCountOrderWithGrid(getDataMapper, index);
          break;
        default:
          break;
      }
      return updated;
    });
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '100%' } }}>
      {
        isPrepareData && (
          <Grid
            container
            spacing={2}
            columns={12}
            sx={{ mb: (theme) => theme.spacing(2) }}
          >
            {card.map((card, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box sx={{ width: '100%' }}>
                  {
                    card.type == 'compare' && (
                      <Tabs value={tabValue[index]} onChange={(event, newValue) => handleTabChange(index, event, newValue)} selectionFollowsFocus variant="fullWidth">
                        <Tab label="วันนี้" />
                        <Tab label="สัปดาห์" />
                        <Tab label="เดือน" />
                      </Tabs>
                    )
                  }
                  <StatCard {...card} />
                </Box>
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 6 }}>
              <IncomeAndRevenueStat />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <OrderCountBarChart />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomerEntryPieChart title="สัดส่วนของช่องทางที่ลูกค้าติดต่อซื้อสินค้า" customerEntryData={customerEntryData}/>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomerEntryPieChart title="สัดส่วนของสินค้าที่ลูกค้าซื้อ" customerEntryData={productPieData}/>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <CustomerRankingBoard rankingBoardData={customerRankingBoardData} />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <ProductRankingBoard rankingBoardData={productRankingBoardData} />
            </Grid>
          </Grid>
        )
      }
    </Box>
  );
}
