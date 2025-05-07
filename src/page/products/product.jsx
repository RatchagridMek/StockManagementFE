

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Grid } from '@mui/material';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditButton from '../../assets/components/EditButton';
import DeleteButton from '../../assets/components/DeleteButton';
import ActiveButton from '../../assets/components/ActiveButton';
import DeletedButton from '../../assets/components/DeletedButton';
import CreateButton from '../../assets/components/CreateButton';
import RecoverButton from '../../assets/components/RecoverButton';
import ToggleButton from '@mui/material/ToggleButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BentoIcon from '@mui/icons-material/Bento';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CreateProductModal from '../../assets/modal/CreateProductModal';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import UpdateProductModal from '../../assets/modal/UpdateProductModal';
import AddStockModalMain from '../../assets/modal/AddStockModalMain';

const initialList = [
    {
        id: 'activedItem',
        type: 'sortedItem',
        label: 'สินค้าที่เปิดใช้งาน',
        minWidth: 125,
        align: 'center',
        selected: false
    },
    {
        id: 'deletedItem',
        type: 'sortedItem',
        label: 'สินค้าที่ลบไปแล้ว',
        minWidth: 150,
        align: 'center',
        selected: false
    },
    {
        id: 'lowStockItem',
        type: 'sortedItem',
        label: 'สินค้าที่ใกล้หมดสต็อก',
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
        type: 'AddStockbutton',
        minWidth: 150,
        align: 'center',
        selected: false
    },
    {
        type: 'CreateProductbutton',
        minWidth: 150,
        align: 'center',
        selected: false
    }
]

const columns = [
    {
        id: 'productName',
        label: 'ชื่อสินค้า',
        minWidth: 300,
        align: 'center'
    },
    {
        id: 'productStatus',
        label: 'สถานะของสินค้า',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'productAmount',
        label: 'ปริมาณสินค้าในคลัง',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'totalSales',
        label: 'ยอดรวมราคาขาย',
        minWidth: 150,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'totalCosts',
        label: 'ยอดรวมราคาต้นทุน',
        minWidth: 150,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'editAction',
        label: '',
        minWidth: 50,
        align: 'right',
    },
    {
        id: 'deleteAction',
        label: '',
        minWidth: 50,
        align: 'left',
    },
];

const rows = [
    createData('1', 'ขนมเค้ก', 'Active', 1324171354, 3287263, 3287263, 'AB12', 'AB12'),
    createData('2', 'China', 'Active', 1403500365, 9596961, 9596961, 'AB13', 'AB13'),
    createData('3', 'Italy', 'Active', 60483973, 301340, 301340, 'AB14', 'AB14'),
    createData('4', 'United States', 'Active', 327167434, 9833520, 9833520, 'AB15', 'AB15'),
    createData('5', 'Canada', 'Active', 37602103, 9984670, 9984670, 'AB16', 'AB16'),
    createData('6', 'Australia', 'Active', 25475400, 7692024, 7692024, 'AB17', 'AB17'),
    createData('7', 'Germany', 'Active', 83019200, 357578, 357578, 'AB18', 'AB18'),
    createData('8', 'Ireland', 'Active', 4857000, 70273, 70273, 'AB19', 'AB19'),
    createData('9', 'Mexico', 'Active', 126577691, 1972550, 1972550, 'AB20', 'AB20'),
    createData('10', 'Japan', 'Active', 126317000, 377973, 377973, 'AB21', 'AB21'),
    createData('11', 'France', 'Active', 67022000, 640679, 640679, 'AB22', 'AB22'),
    createData('12', 'United Kingdom', 'Active', 67545757, 242495, 242495, 'AB23', 'AB23'),
    createData('13', 'Russia', 'Deleted', 146793744, 17098246, 17098246, 'AB24', 'AB24'),
    createData('14', 'Nigeria', 'Deleted', 200962417, 923768, 923768, 'AB25', 'AB25'),
    createData('15', 'Brazil', 'Deleted', 210147125, 8515767, 8515767, 'AB26', 'AB26'),
];

const deletedData = [
    createData('13', 'Russia', 'Deleted', 146793744, 17098246, 17098246, 'AB24', 'AB24'),
    createData('14', 'Nigeria', 'Deleted', 200962417, 923768, 923768, 'AB25', 'AB25'),
    createData('15', 'Brazil', 'Deleted', 210147125, 8515767, 8515767, 'AB26', 'AB26'),
]

const lowStockData = [
    createData('1', 'ขนมเค้ก', 'Active', 3, 3287263, 3287263, 'AB12', 'AB12'),
    createData('2', 'China', 'Active', 3, 9596961, 9596961, 'AB13', 'AB13'),
    createData('3', 'Italy', 'Active', 4, 301340, 301340, 'AB14', 'AB14'),
    createData('4', 'United States', 'Active', 1, 9833520, 9833520, 'AB15', 'AB15'),
]

const activedData = [
    createData('1', 'ขนมเค้ก', 'Active', 100, 3287263, 3287263, 'AB12', 'AB12'),
    createData('2', 'China', 'Active', 100, 9596961, 9596961, 'AB13', 'AB13'),
    createData('3', 'Italy', 'Active', 100, 301340, 301340, 'AB14', 'AB14'),
    createData('4', 'United States', 'Active', 100, 9833520, 9833520, 'AB15', 'AB15'),
    createData('5', 'Canada', 'Active', 100, 9984670, 9984670, 'AB16', 'AB16'),
    createData('6', 'Australia', 'Active', 100, 7692024, 7692024, 'AB17', 'AB17'),
    createData('7', 'Germany', 'Active', 100, 357578, 357578, 'AB18', 'AB18'),
    createData('8', 'Ireland', 'Active', 100, 70273, 70273, 'AB19', 'AB19'),
    createData('9', 'Mexico', 'Active', 100, 1972550, 1972550, 'AB20', 'AB20'),
    createData('10', 'Japan', 'Active', 100, 377973, 377973, 'AB21', 'AB21'),
    createData('11', 'France', 'Active', 100, 640679, 640679, 'AB22', 'AB22'),
    createData('12', 'United Kingdom', 'Active', 100, 242495, 242495, 'AB23', 'AB23'),
]

function createData(id, productName, productStatus, productAmount, totalSales, totalCosts, editAction, deleteAction) {
    productAmount = productAmount.toLocaleString('en-US') + ' ชิ้น'
    totalSales = formatNumberWithCommasAndDecimals(totalSales) + ' บาท'
    totalCosts = formatNumberWithCommasAndDecimals(totalCosts) + ' บาท'
    return { id, productName, productStatus, productAmount, totalSales, totalCosts, editAction, deleteAction };
}

function formatNumberWithCommasAndDecimals(value) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function Product() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [dataList, setDataList] = useState(rows)
    const [toggleCreateProductModal, setToggleCreateProductModal] = useState(false)
    const [toggleAddStockModal, setToggleAddStockModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [addStockSuccess, setAddStockSuccess] = useState(false);
    const [addStockError, setAddStockError] = useState(false);
    const [createProductSuccess, setCreateProductSuccess] = useState(false);
    const [createProductError, setCreateProductError] = useState(false);
    const [toggleUpdateProductModal, setToggleUpdateProductModal] = useState(false)
    const [updateForm, setUpdateForm] = useState({
        name: '',
        description: '',
        category: '',
        costPrice: '',
        salePrice: '',
    })

    function handleUpdateProduct(form) {
        // TODO: Update Product by productId
        console.log(form)
    }

    function handleDeleteProduct(row) {
        // TODO: Delete Product by productId
        console.log("productId", row.id)
    }

    function buildUpdateData(row) {
        let productId = row.id
        // TODO: Get Product by productId
        let productData = {
            name: 'testProductName',
            description: 'testProductDescription',
            category: 'เยลลี่',
            costPrice: 100,
            salePrice: 200
        }
        setUpdateForm(productData)
        console.log(updateForm)
        setToggleUpdateProductModal(true)
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onClick = () => {
        console.log('create product');
    }

    function onAddProduct(form) {
        setLoading(true)
        // send to backend for create product
        // while create product calling backend API setLoading(true)
        // after done 
        setTimeout(() => {
            setLoading(false)
            setToggleCreateProductModal(false)
            setCreateProductSuccess(true)
        }, 2000)
    }

    function onAddStock(form) {
        setLoading(true)
        // send data to baclemd for add stock
        setTimeout(() => {
            setLoading(false)
            setToggleAddStockModal(false)
            setAddStockSuccess(true)
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
                case 'deletedItem': setDataList(deletedData)
                    break;
                case 'lowStockItem': setDataList(lowStockData)
                    break;
                case 'activedItem': setDataList(activedData)
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
                                Products
                            </Typography>
                        </Grid>
                        <Grid item size={6}>
                            <Snackbar
                                open={addStockSuccess}
                                autoHideDuration={2000}
                                onClose={() => setAddStockSuccess(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setAddStockSuccess(false)} severity="success">เพิ่มสต๊อกสินค้าสำเร็จค่ะ</Alert>
                            </Snackbar>
                            <Snackbar
                                open={addStockError}
                                autoHideDuration={2000}
                                onClose={() => setAddStockError(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setAddStockError(false)} severity="error">เพิ่มสต๊อกสินค้าไม่สำเร็จค่ะ</Alert>
                            </Snackbar>
                            <Snackbar
                                open={createProductSuccess}
                                autoHideDuration={2000}
                                onClose={() => setCreateProductSuccess(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setCreateProductSuccess(false)} severity="success">เพิ่มสินค้าสำเร็จค่ะ</Alert>
                            </Snackbar>
                            <Snackbar
                                open={createProductError}
                                autoHideDuration={2000}
                                onClose={() => setCreateProductError(false)}
                                TransitionComponent={Fade}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Alert variant="filled" onClose={() => setCreateProductError(false)} severity="error">เพิ่มสินค้าไม่สำเร็จค่ะ</Alert>
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
                                    if (sortedItem.type === 'CreateProductbutton') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <CreateButton text="เพิ่มสินค้า" onClick={() => setToggleCreateProductModal(true)} />
                                            </TableCell>
                                        )
                                    }
                                    else if (sortedItem.type === 'AddStockbutton') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <CreateButton text="เพิ่มสต๊อกสินค้า" onClick={() => setToggleAddStockModal(true)} />
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
                                                    {sortedItem.id === 'deletedItem' && <DeleteIcon />}
                                                    {sortedItem.id === 'lowStockItem' && <BentoIcon />}
                                                    {sortedItem.id === 'activedItem' && <StorefrontIcon />}
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
                                                                <EditButton onClick={() => buildUpdateData(row)}>แก้ไข</EditButton>
                                                            </TableCell>
                                                        );
                                                    case 'deleteAction': {
                                                        switch (row.productStatus) {
                                                            case 'Deleted':
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <RecoverButton>กู้คืน</RecoverButton>
                                                                    </TableCell>
                                                                );
                                                            default:
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <DeleteButton onClick={() => handleDeleteProduct(row)}>ลบ</DeleteButton>
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
                    count={dataList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <CreateProductModal open={toggleCreateProductModal} onClose={(current) => setToggleCreateProductModal(!current)} onSubmit={onAddProduct} loading={loading} />
            <AddStockModalMain open={toggleAddStockModal} onClose={(current) => setToggleAddStockModal(!current)} onSubmit={onAddStock} loading={loading} />
            <UpdateProductModal onSubmit={handleUpdateProduct} open={toggleUpdateProductModal} onClose={(current) => setToggleUpdateProductModal(!current)} updateForm={updateForm} />
        </div>
    )
}

export default Product