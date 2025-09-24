

import { Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, TablePagination, 
    Grid, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditButton from '../../assets/components/EditButton';
import ActiveButton from '../../assets/components/ActiveButton';
import CreateButton from '../../assets/components/CreateButton';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import DeleteButton from '../../assets/components/DeleteButton';
import RecoverButton from '../../assets/components/RecoverButton';
import UpdateCustomerModal from '../../assets/modal/UpdateCustomerModal';
import CreateCustomerModal from '../../assets/modal/CreateCustomerModal';
import DeletedButton from '../../assets/components/DeletedButton';


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
        label: 'searchBar',
        type: 'searchBar',
        minWidth: 300,
        align: 'center',
        selected: false
    },
    {
        type: 'CreateCustomerButton',
        minWidth: 150,
        align: 'center',
        selected: false
    }
]

const columns = [
    {
        id: 'customerName',
        label: 'ชื่อลูกค้า',
        minWidth: 200,
        align: 'center',
    },
    {
        id: 'customerStatus',
        label: 'สถานะ',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'customerPhone',
        label: 'เบอร์โทรศัพท์',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'customerCreatedDate',
        label: 'วันที่สร้าง',
        minWidth: 150,
        align: 'center',
    },
    {
        id: 'editAction',
        label: '',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'deleteAction',
        label: '',
        minWidth: 100,
        align: 'left',
    },
];

function createData(Id, customerName, customerPhone, customerStatus, createdDate, editAction) {
    let customerCreatedDate = new Date(createdDate).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    let customerId = Id
    return { customerId, customerName, customerPhone, customerStatus, customerCreatedDate, editAction };
}


function Customers() {

    useEffect(() => {
        async function fetchCustomers() {
            axios.get("http://localhost:8000/api/v1/customer")
                .then((data) => {
                    const allList = []
                    const datas = data.data.data
                    datas.map((item) => {
                        allList.push(createData(item.id, item.name, item.phone, item.is_deleted ? "Delete" : "Active", item.created_date, item.id + "AB"))
                    })
                    setCustomerList(allList)
                })
                .catch((error) => {
                    console.error("Fetch error:", error)
                });
        }
        fetchCustomers()
    }, [])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [createCustomerModalOpen, setCreateCustomerModalOpen] = useState(false);
    const [createCustomerLoading, setCreateCustomerLoading] = useState(false)
    const [notificationPopup, setNotificationPopup] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [customerList, setCustomerList] = useState([]);
    const [updateCustomerModalOpen, setUpdateCustomerModalOpen] = useState(false);
    const [updateCustomerLoading, setUpdateCustomerLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [confirmActionId, setConfirmActionId] = useState("")
    const [buttonActionLoading, setButtonActionLoading] = useState(false)
    const [confirmModalToggle, setConfirmModalToggle] = useState(false)
    const [confirmType, setConfirmType] = useState("")
    const [customerUpdateForm, setCustomerUpdateForm] = useState({
        customerId: '',
        customerName: '',
        customerPhone: '',
    });

    const filteredCustomers = search == "" ? 
        customerList : customerList.filter((p) => p.customerName.toLowerCase().includes(search.toLowerCase()));

    async function buildUpdateData(form) {
        setCustomerUpdateForm({
            customerId: form.customerId,
            customerName: form.customerName,
            customerPhone: form.customerPhone,
        })
        setUpdateCustomerModalOpen(true)
    }

    async function handleDeleteCustomer() {
        setButtonActionLoading(true)
        axios.post("http://localhost:8000/api/v1/customer/delete", {
            customerId: confirmActionId
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            fetchCustomers()
            setButtonActionLoading(false)
            setNotificationPopup(true)
            setNotificationType("success")
            setNotificationMessage("ลบลูกค้าสำเร็จค่ะ")
            setConfirmModalToggle(false)
        }).catch((error) => {
            console.error("Fetch error:", error)
            setButtonActionLoading(false)
            setNotificationPopup(true)
            setNotificationType("error")
            setNotificationMessage("ลบลูกค้าไม่สำเร็จค่ะ")
            setConfirmModalToggle(false)
        })

    }

    async function handleRecoverCustomer() {
        setButtonActionLoading(true)
        axios.post("http://localhost:8000/api/v1/customer/recover", {
            customerId: confirmActionId
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            fetchCustomers()
            setButtonActionLoading(false)
            setNotificationPopup(true)
            setNotificationType("success")
            setNotificationMessage("กู้คืนลูกค้าสำเร็จค่ะ")
            setConfirmModalToggle(false)
        }).catch((error) => {
            console.error("Fetch error:", error)
            setButtonActionLoading(false)
            setNotificationPopup(true)
            setNotificationType("error")
            setNotificationMessage("กู้คืนลูกค้าไม่สำเร็จค่ะ")
            setConfirmModalToggle(false)
        })
    }
   

    function handleConfirmActionCategory(row, type) {
        console.log(row.customerId)
        setConfirmType(type)
        setConfirmModalToggle(true)
        setConfirmActionId(row.customerId)
    }

    async function fetchCustomers() {
        axios.get("http://localhost:8000/api/v1/customer")
            .then((data) => {
                const allList = []
                const datas = data.data.data
                datas.map((item) => {
                    allList.push(createData(item.id, item.name, item.phone, item.is_deleted ? "Delete" : "Active", item.created_date, item.id + "AB"))
                })
                setCustomerList(allList)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
            });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleUpdateCustomer = (form) => {
        setUpdateCustomerLoading(true)
        axios.post("http://localhost:8000/api/v1/customer/update", form, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((data) => {
                setNotificationType('success')
                setNotificationMessage('Update customer success')
                setUpdateCustomerLoading(false)
                setUpdateCustomerModalOpen(false)
                setNotificationPopup(true)
                fetchCustomers()
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationType('error')
                setNotificationMessage('Update customer failed')
                setUpdateCustomerLoading(false)
                setUpdateCustomerModalOpen(false)
                setNotificationPopup(true)
            });
    }

    const handleCreateCustomer = (form) => {
        console.log(form)
        setCreateCustomerLoading(true)
        axios.post("http://localhost:8000/api/v1/customer/create", form, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((data) => {
                setNotificationPopup(true)
                setNotificationType('success')
                setNotificationMessage('Create customer success')
                setCreateCustomerModalOpen(false)
                setCreateCustomerLoading(false)
                fetchCustomers()
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType('error')
                switch (error.response.data.statusCd) {
                    case "P2002":
                        setNotificationMessage("ชื่อ-นามสกุลลูกค้ามีอยู่แล้วในระบบค่ะ")
                        break;
                    default:
                        setNotificationMessage("Create customer failed with code : " + error.response.data.statusCd)
                }
                setCreateCustomerModalOpen(false)
                setCreateCustomerLoading(false)
            });
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
                                Customers Management
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
                                    if (sortedItem.type === 'CreateCustomerButton') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <CreateButton text="เพิ่มลูกค้า" onClick={() => setCreateCustomerModalOpen(true)} />
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
                                                    label="ค้นหาโดยชื่อลูกค้า"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    variant="outlined"
                                                />
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
                            {filteredCustomers
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
                                                    case 'Delete':
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
                                                                <EditButton onClick={() => buildUpdateData(row)}>แก้ไขข้อมูลลูกค้า</EditButton>
                                                            </TableCell>
                                                        );
                                                    case 'deleteAction': {
                                                        switch (row.customerStatus) {
                                                            case 'Delete':
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <RecoverButton onClick={() => handleConfirmActionCategory(row, "recover")}>เปิดการใช้งานลูกค้า</RecoverButton>
                                                                    </TableCell>
                                                                );
                                                            default:
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <DeleteButton onClick={() => handleConfirmActionCategory(row, "delete")}>ปิดการใช้งานลูกค้า</DeleteButton>
                                                                    </TableCell>
                                                                );
                                                        }
                                                    }
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
                    count={customerList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog open={confirmModalToggle} onClose={(current) => setConfirmModalToggle(!current)}>
                <DialogTitle fontWeight="bold">{confirmType === "delete" ? "คุณต้องการที่จะปิดใช้งานลูกค้าท่านนี้ใช่หรือไม่ ?" : "คุณต้องการที่จะเปิดใช้งานลูกค้าท่านนี้ใช่หรือไม่ ?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmModalToggle(!confirmModalToggle)} color="error" variant="contained">
                        ยกเลิก
                    </Button>
                    <Button onClick={() => {
                        switch (confirmType) {
                            case 'delete': {
                                handleDeleteCustomer();
                                break;
                            }
                            case 'recover': {
                                handleRecoverCustomer();
                                break;
                            }
                        }
                    }} 
                    color="success" 
                    variant="contained"
                    loading={buttonActionLoading}
                    loadingPosition="end"
                    >
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
            <CreateCustomerModal open={createCustomerModalOpen} onClose={() => setCreateCustomerModalOpen(false)} onSubmit={handleCreateCustomer} loading={createCustomerLoading} />
            <UpdateCustomerModal open={updateCustomerModalOpen} onClose={() => setUpdateCustomerModalOpen(false)} onSubmit={handleUpdateCustomer} loading={updateCustomerLoading} updateForm={customerUpdateForm} />
        </div>
    )
}

export default Customers