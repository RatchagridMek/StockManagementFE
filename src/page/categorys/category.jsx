

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
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import UpdateCategoryModal from '../../assets/modal/UpdateCategoryModal'
import CategoryIcon from '@mui/icons-material/Category';
import CreateCategoryModal from '../../assets/modal/CreateCategoryModal';

const initialList = [
    {
        id: 'activatedCategory',
        type: 'sortedItem',
        label: 'หมวดหมู่ที่ยังเปิดใช้งาน',
        minWidth: 150,
        align: 'center',
        selected: false
    },
    {
        id: 'deletedCategory',
        type: 'sortedItem',
        label: 'หมวดหมู่ที่ลบไปแล้ว',
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
        type: 'CreateCategoryButton',
        minWidth: 150,
        align: 'center',
        selected: false
    }
]

const columns = [
    {
        id: 'categoryName',
        label: 'ชื่อหมวดหมู่',
        minWidth: 300,
        align: 'center'
    },
    {
        id: 'categoryStatus',
        label: 'สถานะของหมวดหมู่',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'productCountInCategory',
        label: 'จำนวนสินค้าในหมวดหมู่',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'productCountInSale',
        label: 'สินค้าที่กำลังขายอยู่',
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
    createData('1', 'เยลลี่', 'Active', 5, 4, 'AB12', 'AB12'),
    createData('2', 'บราวนี่', 'Active', 4, 4, 'AB13', 'AB13'),
    createData('3', 'คุกกี้', 'Active', 3, 3, 'AB14', 'AB14'),
    createData('4', 'ขนมปัง', 'Active', 2, 0, 'AB15', 'AB15'),
    createData('5', 'โทสต์', 'Deleted', 5, 4, 'AB12', 'AB12'),
    createData('6', 'อาหารเช้า', 'Deleted', 4, 4, 'AB13', 'AB13'),
    createData('7', 'อาหารกลางวัน', 'Deleted', 3, 3, 'AB14', 'AB14'),
    createData('8', 'อาหารเย็น', 'Deleted', 2, 0, 'AB15', 'AB15'),
];

const deletedData = [
    createData('5', 'โทสต์', 'Deleted', 5, 4, 'AB12', 'AB12'),
    createData('6', 'อาหารเช้า', 'Deleted', 4, 4, 'AB13', 'AB13'),
    createData('7', 'อาหารกลางวัน', 'Deleted', 3, 3, 'AB14', 'AB14'),
    createData('8', 'อาหารเย็น', 'Deleted', 2, 0, 'AB15', 'AB15'),
]

const activedData = [
    createData('1', 'เยลลี่', 'Active', 5, 4, 'AB12', 'AB12'),
    createData('2', 'บราวนี่', 'Active', 4, 4, 'AB13', 'AB13'),
    createData('3', 'คุกกี้', 'Active', 3, 3, 'AB14', 'AB14'),
    createData('4', 'ขนมปัง', 'Active', 2, 0, 'AB15', 'AB15'),
]

function createData(id, categoryName, categoryStatus, productCountInCategory, productCountInSale, editAction, deleteAction) {
    productCountInCategory = productCountInCategory.toLocaleString('en-US') + ' ชิ้น'
    productCountInSale = productCountInSale.toLocaleString('en-US') + ' ชิ้น'
    return { id, categoryName, categoryStatus, productCountInCategory, productCountInSale, editAction, deleteAction };
}

function Category() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [dataList, setDataList] = useState(rows)
    const [toggleCreateCategoryModal, setToggleCreateCategoryModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [createProductSuccess, setCreateProductSuccess] = useState(false);
    const [createProductError, setCreateProductError] = useState(false);
    const [toggleUpdateCategoryModal, setToggleUpdateCategoryModal] = useState(false)
    const [updateForm, setUpdateForm] = useState({
        name: '',
    })

    function handleUpdateCategory(form) {
        // TODO: Update Product by productId
        console.log(form)
    }

    function handleDeleteProduct(row) {
        // TODO: Delete Product by productId
        console.log("productId", row.id)
    }

    function buildUpdateData(row) {
        let categoryId = row.id
        let categoryName = row.categoryName
        // TODO: Get Product by productId
        let productData = {
            name: categoryName,
        }
        setUpdateForm(productData)
        console.log(updateForm)
        setToggleUpdateCategoryModal(true)
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

    function onAddCategory(form) {
        setLoading(true)
        console.log(form)
        // send to backend for create product
        // while create product calling backend API setLoading(true)
        // after done 
        setTimeout(() => {
            setLoading(false)
            setToggleCreateCategoryModal(false)
            setCreateProductSuccess(true)
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
                                Categories
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
                                    if (sortedItem.type === 'CreateCategoryButton') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <CreateButton text="เพิ่มหมวดหมู่" onClick={() => setToggleCreateCategoryModal(true)} />
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
            <CreateCategoryModal open={toggleCreateCategoryModal} onClose={(current) => setToggleCreateCategoryModal(!current)} onSubmit={onAddCategory} loading={loading} />
            <UpdateCategoryModal onSubmit={handleUpdateCategory} open={toggleUpdateCategoryModal} onClose={(current) => setToggleUpdateCategoryModal(!current)} updateForm={updateForm} />
        </div>
    )
}

export default Category