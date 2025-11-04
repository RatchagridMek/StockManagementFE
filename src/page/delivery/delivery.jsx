

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Grid } from '@mui/material';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditButton from '../../assets/components/EditButton';
import ActiveButton from '../../assets/components/ActiveButton';
import DeletedButton from '../../assets/components/DeletedButton';
import CreateButton from '../../assets/components/CreateButton';
import ToggleButton from '@mui/material/ToggleButton';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import CreateDeliveryModal from '../../assets/modal/CreateDeliveryModal';
import DeliveryDetailModal from '../../assets/modal/DeliveryDetailModal';
import axios from 'axios';

const deliveryCompanyList = [
    {
        id: "DELIVERY_01",
        name: "FLASH"
    },
    {
        id: "DELIVERY_02",
        name: "KERRY"
    }
]

const deliveryTypeList = [
    {
        id: "FLASH_EXPRESS",
        name: "การจัดส่งด่วน"
    },
    {
        id: "STANDARD_EXPRESS",
        name: "การจัดส่งมาตรฐาน"
    }
]

const initialList = [
    {
        id: 'pendingItem',
        type: 'sortedItem',
        label: 'สถานะรอดำเนินการ',
        minWidth: 60,
        align: 'center',
        selected: false
    },
    {
        id: 'outDeliveryItem',
        type: 'sortedItem',
        label: 'สถานะกำลังจัดส่ง',
        minWidth: 60,
        align: 'center',
        selected: false
    },
    {
        id: 'deliverItem',
        type: 'sortedItem',
        label: 'สถานะส่งสำเร็จแล้ว',
        minWidth: 60,
        align: 'center',
        selected: false
    },
    {
        id: 'cancelItem',
        type: 'sortedItem',
        label: 'สถานะยกเลิก',
        minWidth: 60,
        align: 'center',
        selected: false
    },
    {
        label: '',
        type: 'searchBar',
        minWidth: 400,
        align: 'center',
        selected: false
    },
    {
        type: 'CreateDeliverybutton',
        minWidth: 100,
        align: 'center',
        selected: false
    }
]

const columns = [
    {
        id: 'orderId',
        label: 'หมายเลขออเดอร์',
        minWidth: 300,
        align: 'center'
    },
    {
        id: 'deliveryStatus',
        label: 'สถานะของการจัดส่ง',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'deliveryType',
        label: 'ประเภทของการจัดส่ง',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'createdDate',
        label: 'วันที่ข้อมูลถูกสร้าง',
        minWidth: 150,
        align: 'center',
    },
    {
        id: 'updatedDate',
        label: 'วันที่ข้อมูลอัพเดตล่าสุด',
        minWidth: 150,
        align: 'center',
    },
    {
        id: 'infoAction',
        label: '',
        minWidth: 50,
        align: 'center',
    },
];

function createData(orderId, deliveryType, deliveryStatus, createdDate, updatedDate) {
    let deliveryTypeText = ""
    switch (deliveryStatus) {
        case "PENDING":
            deliveryTypeText = "อยู่ในระหว่างดำเนินการ"
            break;
        case "OUT_FOR_DELIVERY":
            deliveryTypeText = "กำลังจัดส่งสินค้า"
            break;
        case "DELIVERED":
            deliveryTypeText = "จัดส่งสำเร็จ"
            break;
        case "CANCELLED":
            deliveryTypeText = "ยกเลิกการจัดส่ง"
            break;
    }
    deliveryStatus = deliveryTypeText
    return { orderId, deliveryType, deliveryStatus, createdDate, updatedDate };
}

function Delivery() {

    useEffect(() => {
        async function fetchDeliveryData() {
            fetch("http://localhost:8000/api/v1/delivery/")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    let row = []
                    let pendingRow = []
                    let deliverRow = []
                    let cancelRow = []
                    let outDeliveryRow = []
                    data.data.map((item) => {
                        row.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                        if (item.deliveryStatus === "PENDING") {
                            pendingRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                        } else if (item.deliveryStatus === "DELIVERED") {
                            deliverRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                        } else if (item.deliveryStatus === "CANCELLED") {
                            cancelRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                        } else if (item.deliveryStatus === "OUT_FOR_DELIVERY") {
                            outDeliveryRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                        }
                    })
                    setDataList(row)
                    setAllDataList(row)
                    setPendingDataList(pendingRow)
                    setDeliverDataList(deliverRow)
                    setCancelDataList(cancelRow)
                    setOutDeliveryDataList(outDeliveryRow)
                })
                .catch((error) => console.error("Fetch error:", error));
        }

        fetchDeliveryData()

    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [dataList, setDataList] = useState([])
    const [allDataList, setAllDataList] = useState([])
    const [pendingDataList, setPendingDataList] = useState([])
    const [deliverDataList, setDeliverDataList] = useState([])
    const [cancelDataList, setCancelDataList] = useState([])
    const [outDeliveryDataList, setOutDeliveryDataList] = useState([])
    const [toggleCreateDeliveryModal, setToggleCreateDeliveryModal] = useState(false)
    const [loadingCreateDelivery, setLoadingCreateDelivery] = useState(false)
    const [notificationPopup, setNotificationPopup] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [notificationMessage, setNotificationMessage] = useState("")
    const [search, setSearch] = useState("")
    const [isError, setIsError] = useState(false)
    const [toggleDeliveryDetailModal, setToggleDeliveryDetailModal] = useState(false)
    const defaultDeliverInfo = {
        deliveryId: "",
        orderId: "",
        deliveryFee: "",
        deliveryType: "",
        deliveryCompany: "",
        deliveryDate: "",
        deliveryStatus: "",
        deliveryAddress: "",
        createdDate: "",
        updatedDate: "",
    }
    const [deliveryInfo, setDeliveryInfo] = useState(defaultDeliverInfo)

    const filteredDelivery = search == "" ? dataList : dataList.filter((item) => item.orderId.toLowerCase().includes(search.toLowerCase()))


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
                case 'pendingItem': setDataList(pendingDataList)
                    break;
                case 'deliverItem': setDataList(deliverDataList)
                    break;
                case 'cancelItem': setDataList(cancelDataList)
                    break;
                case 'outDeliveryItem': setDataList(outDeliveryDataList)
                    break;
            }
        } else {
            setDataList(allDataList)
        }
    }

    function handleCloseCreateDeliveryModal() {
        setToggleCreateDeliveryModal(false)
    }

    function handleCloseDeliveryDetailModal(event, type) {
        if (type === undefined || type === "backdropClick") {

        } else {
            if(isError) {
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("อัพเดตสถานะการจัดส่งไม่สำเร็จค่ะ")
            } else {
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("อัพเดตสถานะการจัดส่งสำเร็จค่ะ")
            }
        }
        
        setToggleDeliveryDetailModal(false)
        setDeliveryInfo(defaultDeliverInfo)
        fetchDelivery()
    }

    async function fetchDeliveryByOrderId(orderId) {
        axios.post("http://localhost:8000/api/v1/delivery/", { 
            "orderId": orderId
         }, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setDeliveryInfo(res.data.data)
                
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async function handleToggleDeliveryDetailModal(orderId) {
        await fetchDeliveryByOrderId(orderId)
        setToggleDeliveryDetailModal(true)
    }

    function handleCreateDelivery(form) {
        setLoadingCreateDelivery(true)
        if (form.deliveryDate === '') {
            form.deliveryDate = new Date().toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // 24-hour format
            }).replace(',', '')
        }
        console.log(form)
        axios.post("http://localhost:8000/api/v1/delivery/create", form, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                fetchDelivery()
                setToggleCreateDeliveryModal(false)
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("เพิ่มการจัดส่งสำเร็จค่ะ")
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("เพิ่มการจัดส่งไม่สำเร็จค่ะ")
            })
            .finally(() => {
                setLoadingCreateDelivery(false)
            })
    }

    function fetchDelivery() {
        axios.get("http://localhost:8000/api/v1/delivery/", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                let row = []
                let pendingRow = []
                let deliverRow = []
                let cancelRow = []
                let outDeliveryRow = []
                res.data.data.map((item) => {
                    row.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                    if (item.deliveryStatus === "PENDING") {
                        pendingRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                    } else if (item.deliveryStatus === "DELIVERED") {
                        deliverRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                    } else if (item.deliveryStatus === "CANCELLED") {
                        cancelRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                    } else if (item.deliveryStatus === "OUT_FOR_DELIVERY") {
                        outDeliveryRow.push(createData(item.orderId, item.deliveryType, item.deliveryStatus, item.createdDate, item.updatedDate))
                    }
                })
                setDataList(row)
                setAllDataList(row)
                setPendingDataList(pendingRow)
                setDeliverDataList(deliverRow)
                setCancelDataList(cancelRow)
                setOutDeliveryDataList(outDeliveryRow)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
            })
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
                                Delivery
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
                                    if (sortedItem.type === 'CreateDeliverybutton') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <CreateButton text="เพิ่มดิลิเวอรี่" onClick={() => setToggleCreateDeliveryModal(true)} />
                                            </TableCell>
                                        )
                                    }
                                    else if (sortedItem.type === 'searchBar') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    name="search"
                                                    label="ค้นหาโดยหมายเลขออเดอร์"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    variant="outlined"
                                                />
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
                                                    {sortedItem.id === 'pendingItem' && <PendingActionsIcon />}
                                                    {sortedItem.id === 'outDeliveryItem' && <DeliveryDiningIcon />}
                                                    {sortedItem.id === 'deliverItem' && <CheckBoxIcon />}
                                                    {sortedItem.id === 'cancelItem' && <CancelIcon />}
                                                    {` ${sortedItem.label}`}
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
                            {filteredDelivery
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
                                                    case 'infoAction':
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <EditButton onClick={() => handleToggleDeliveryDetailModal(row.orderId)}>ดูรายละเอียดเพิ่มเติม</EditButton>
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
            </Paper>
            <CreateDeliveryModal open={toggleCreateDeliveryModal} onClose={handleCloseCreateDeliveryModal} onSubmit={handleCreateDelivery} loading={loadingCreateDelivery} categoryList={deliveryCompanyList} deliveryTypeList={deliveryTypeList} />
            <DeliveryDetailModal open={toggleDeliveryDetailModal} handleClose={handleCloseDeliveryDetailModal} data={deliveryInfo} setError={setIsError}/>
        </div>
    )
}

export default Delivery