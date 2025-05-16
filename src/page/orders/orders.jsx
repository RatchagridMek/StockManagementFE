

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Grid } from '@mui/material';
import { useState } from 'react';
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
        label: 'ออเดอร์',
        minWidth: 300,
        align: 'center'
    },
    {
        id: 'orderDateTime',
        label: 'ออเดอร์ถูกต้องตอนเวลา',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'orderTotalPrice',
        label: 'ยอดรวมสินค้าทั้งหมด',
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

const rows = [
    createData('1', '2025-05-08T14:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB12'),
    createData('2', '2025-05-08T15:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB13'),
    createData('3', '2025-05-08T16:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB14'),
    createData('4', '2025-05-08T17:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB15'),
    createData('5', '2025-05-08T18:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB12'),
    createData('6', '2025-05-08T19:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB13'),
    createData('7', '2025-05-08T20:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB14'),
    createData('8', '2025-05-08T21:30:00', 1500, 'ไดโน เซบาสเตียน', 'AB15'),
];

function createData(orderId, orderDateTime, orderTotalPrice, customerName, editAction) {
    let orderName = "ออเดอร์ " + orderId
    orderDateTime = orderDateTime.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    orderTotalPrice = formatNumberWithCommasAndDecimals(orderTotalPrice) + " บาท"
    return { orderName, orderDateTime, orderTotalPrice, customerName, editAction };
}

function formatNumberWithCommasAndDecimals(value) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function Orders() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [dataList, setDataList] = useState(rows)
    const [loading, setLoading] = useState(false)
    const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false)
    const [createProductSuccess, setCreateProductSuccess] = useState(false);
    const [createProductError, setCreateProductError] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        name: '',
    })

    function buildUpdateData(row) {
        let customerName = row.customerName
        // TODO: Get Product by productId
        let productData = {
            name: customerName,
        }
        setUpdateForm(productData)
        console.log(updateForm)
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function onAddCategory(form) {
        setLoading(true)
        console.log(form)
        // send to backend for create product
        // while create product calling backend API setLoading(true)
        // after done 
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

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
                                open={createProductSuccess}
                                autoHideDuration={2000}
                                onClose={() => setCreateProductSuccess(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setCreateProductSuccess(false)} severity="success">เพิ่มหมวดหมู่สินค้าสำเร็จค่ะ</Alert>
                            </Snackbar>
                            <Snackbar
                                open={createProductError}
                                autoHideDuration={2000}
                                onClose={() => setCreateProductError(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setCreateProductError(false)} severity="error">เพิ่มหมวดหมู่สินค้าไม่สำเร็จค่ะ</Alert>
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
                <CreateOrderModal open={createOrderModalOpen} onClose={(current) => setCreateOrderModalOpen(!current)}/>
            </Paper>
        </div>
    )
}

export default Orders