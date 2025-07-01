

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditButton from '../../assets/components/EditButton';
import ActiveButton from '../../assets/components/ActiveButton';
import CreateButton from '../../assets/components/CreateButton';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import CategoryIcon from '@mui/icons-material/Category';
import CreateOrderModal from '../../assets/modal/CreateOrderModal';
import OrderDetailModal from '../../assets/modal/OrderDetailModal';
import axios from 'axios';

const initialList = [
    {
        label: '',
        type: 'empty',
        minWidth: 150,
        align: 'center',
        selected: false
    },
    {
        label: '',
        type: 'empty',
        minWidth: 150,
        align: 'center',
        selected: false
    },
    {
        label: '',
        type: 'empty',
        minWidth: 100,
        align: 'center',
        selected: false
    },
    {
        label: '',
        type: 'empty',
        minWidth: 100,
        align: 'center',
        selected: false
    },
    {
        label: '',
        type: 'empty',
        minWidth: 100,
        align: 'center',
        selected: false
    },
    {
        type: 'CreateOrderButton',
        minWidth: 150,
        align: 'center',
        selected: false
    }
]

const columns = [
    {
        id: 'orderName',
        label: 'หมายเลขออเดอร์',
        minWidth: 300,
        align: 'center'
    },
    {
        id: 'orderDateTime',
        label: 'ออเดอร์ถูกสร้างเมื่อ',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'orderTotalPrice',
        label: 'ยอดรวมสินค้าทั้งหมด',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'orderTotalOriginPrice',
        label: 'ยอดรวมราคาต้นทุนสินค้า',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'profit',
        label: 'ยอดรวมกำไร',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'customerName',
        label: 'ชื่อลูกค้า',
        minWidth: 150,
        align: 'center',
    },
    {
        id: 'editAction',
        label: '',
        minWidth: 100,
        align: 'left',
    },
];


function createData(orderId, orderDateTime, orderTotalPrice, totalOriginPrice, customerName, editAction) {
    // let orderName = orderId.slice(orderId.length - 5) + orderDateTime.replaceAll("/", "")
    let orderName = orderId
    orderDateTime = orderDateTime.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    orderTotalPrice = formatNumberWithCommasAndDecimals(orderTotalPrice) + " บาท"
    let orderTotalOriginPrice = formatNumberWithCommasAndDecimals(totalOriginPrice) + " บาท"
    let profit = formatNumberWithCommasAndDecimals(parseFloat(orderTotalPrice) - parseFloat(totalOriginPrice)) + " บาท"
    return { orderId, orderName, orderDateTime, orderTotalPrice, orderTotalOriginPrice, profit, customerName, editAction };
}

function formatNumberWithCommasAndDecimals(value) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function Orders() {

    useEffect(() => {
        async function fetchOrderData() {
            fetch("http://localhost:8000/api/v1/order/")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    const allList = []
                    data.data.map((map) => {
                        allList.push(createData(map.id, map.createdDate, map.totalPrice, map.totalOriginPrice, map.customerName, "AB" + map.id))
                    })
                    setDataList(allList)

                })
                .catch((error) => {
                    console.error("Fetch error:", error)
                });
        }
        async function fetchCustomer() {
            fetch("http://localhost:8000/api/v1/customer/")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    setCustomerList(data.data)
                })
                .catch((error) => {
                    console.error("Fetch error:", error)
                });
        }
        async function fetchProduct() {
            fetch("http://localhost:8000/api/v1/product/getAll")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    setProductList(data.data)
                })
                .catch((error) => {
                    console.error("Fetch error:", error)
                });
        }
        async function fetchCategory() {
            axios.get("http://localhost:8000/api/v1/category/getAll")
                .then((data) => {
                    const allList = []
                    const dataList = data.data.data
                    allList.push({ "id": "ทั้งหมด", "name": "ทั้งหมด" })
                    dataList.map((item) => {
                        if(!item.is_deleted) {
                            allList.push(item)
                        }
                    })
                    setCategoryList(allList)
                })
                .catch((error) => {
                    console.error("Fetch error:", error)
                });
        }
        fetchOrderData()
        fetchCustomer()
        fetchProduct()
        fetchCategory()
    }, [])


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [dataList, setDataList] = useState([])
    const [productList, setProductList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [toggleOrderDetailModal, setToggleOrderDetailModel] = useState(false)
    const [orderDetail, setOrderDetail] = useState({
        id: '',
        customerName: '',
        createdDate: '',
        totalPrice: '',
        deliveryFee: '',
        orderChannel: '',
        productList: [{
            productId: '',
            productName: '',
            productAmount: '',
            totalProductPrice: ''
        }],
        giveawayList: [{
            productId: '',
            productName: '',
            productAmount: '',
            totalProductPrice: ''
        }],
    });

    useEffect(() => {
        if (orderDetail.id) setLoading(false)
    }, [orderDetail])

    const [loading, setLoading] = useState(false)
    const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false)
    const [notificationPopup, setNotificationPopup] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [notificationMessage, setNotificationMessage] = useState("")

    async function fetchOrderById(orderId) {
        axios.post("http://localhost:8000/api/v1/order/get", {
            orderId: orderId
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((data) => {
                let response = data.data.data
                setOrderDetail(response)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
            });
    }

    function fetchOrder() {
        axios.get("http://localhost:8000/api/v1/order/")
            .then((data) => {
                const allList = []
                const dataList = data.data.data
                dataList.map((map) => {
                    allList.push(createData(map.id, map.createdDate, map.totalPrice, map.totalOriginPrice, map.customerName, "AB" + map.id))
                })
                setDataList(allList)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
            });
    }

    function fetchProduct() {
        axios.get("http://localhost:8000/api/v1/product/getAll")
            .then((data) => {
                setProductList(data.data.data)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
            });
    }

    async function buildUpdateData(row) {
        await fetchOrderById(row.orderId)
        setToggleOrderDetailModel(true)
        setLoading(true)
    }

    function handleSubmitCreateOrder(customerName, customerPhone, isSaveCustomer, selectedProducts, selectedOrderChannel) {
        setLoading(true)
        let productList = []
        selectedProducts.map((item) => {
            productList.push({
                productId: item.id,
                productName: item.name,
                productAmount: item.quantity,
                isGiveaway: item.isGiveaway
            })
        })
        axios.post("http://localhost:8000/api/v1/order/create", {
            customerName: customerName,
            customerPhoneNo: customerPhone,
            isRememberCustomer: isSaveCustomer,
            productList: productList,
            orderChannel: selectedOrderChannel
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((data) => {
                setLoading(false)
                setCreateOrderModalOpen(false)
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("สร้างคำสั่งซื้อสำเร็จค่ะ")
                fetchOrder()
                fetchProduct()
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setLoading(false)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("สร้างคำสั่งซื้อไม่สำเร็จค่ะ")
            });
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function handleToggle(sortedItem) {
        let isClear = false
        if (sortedItem.selected) {
            const updatedList = sortedList.map(item => ({
                ...item,
                selected: false
            }));
            setSortedList(updatedList);
            isClear = true
        } else {
            const updatedList = sortedList.map(item => ({
                ...item,
                selected: item.id === sortedItem.id, // only clicked one is selected
            }));
            setSortedList(updatedList);
            isClear = false
        }
        if (!isClear) {
            switch (sortedItem.id) {
                case 'activatedCategory': setDataList(activedData)
                    break;
                case 'deletedCategory': setDataList(deletedData)
                    break;
            }
        } else {
            setDataList(rows)
        }
    }


    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >

                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item size={6}>
                            <Typography color="black" variant="h4" gutterBottom>
                                Orders
                            </Typography>
                        </Grid>
                        <Grid item size={6}>
                            <Snackbar
                                open={notificationPopup}
                                autoHideDuration={2000}
                                onClose={() => setNotificationPopup(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setNotificationPopup(false)} severity={notificationType}>{notificationMessage}</Alert>
                            </Snackbar>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 1000 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {sortedList.map((sortedItem) => {
                                    if (sortedItem.type === 'CreateOrderButton') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <CreateButton text="เพิ่มออเดอร์" onClick={() => setCreateOrderModalOpen(true)} />
                                            </TableCell>
                                        )
                                    }
                                    else if (sortedItem.type === 'sortedItem') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <ToggleButton
                                                    value="check"
                                                    selected={sortedItem.selected}
                                                    onChange={() => handleToggle(sortedItem)}
                                                >
                                                    {sortedItem.id === 'activatedCategory' && <CategoryIcon />}
                                                    {sortedItem.id === 'deletedCategory' && <DeleteIcon />}
                                                    {sortedItem.label}
                                                </ToggleButton>
                                            </TableCell>
                                        )
                                    }
                                    else {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                {sortedItem.label}
                                            </TableCell>
                                        )
                                    }
                                })}
                            </TableRow>
                        </TableHead>
                    </Table>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                // check status
                                                switch (value) {
                                                    case 'Active':
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <ActiveButton>Active</ActiveButton>
                                                            </TableCell>
                                                        );
                                                    case 'Deleted':
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <DeletedButton>Deleted</DeletedButton>
                                                            </TableCell>
                                                        );
                                                }
                                                // check action
                                                switch (column.id) {
                                                    case 'editAction':
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <EditButton onClick={() => buildUpdateData(row)}>ดูรายละเอียดเพิ่มเติม</EditButton>
                                                            </TableCell>
                                                        );
                                                    default:
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                }
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={dataList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <CreateOrderModal onSubmit={handleSubmitCreateOrder} productList={productList} categoryList={categoryList} open={createOrderModalOpen} onClose={(current) => setCreateOrderModalOpen(!current)} customerList={customerList} loading={loading} setLoading={setLoading} />
                <OrderDetailModal open={toggleOrderDetailModal} orderData={orderDetail} onClose={(current) => setToggleOrderDetailModel(!current)} loading={loading} setLoading={setLoading} setNotificationPopup={setNotificationPopup} setNotificationType={setNotificationType} setNotificationMessage={setNotificationMessage} />
            </Paper>
        </div>
    )
}

export default Orders