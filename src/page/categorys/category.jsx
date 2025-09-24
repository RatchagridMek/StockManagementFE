

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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

function createData(id, categoryName, categoryStatus, productCountInCategory, productCountInSale, editAction, deleteAction) {
    productCountInCategory = productCountInCategory.toLocaleString('en-US') + ' ชิ้น'
    productCountInSale = productCountInSale.toLocaleString('en-US') + ' ชิ้น'
    return { id, categoryName, categoryStatus, productCountInCategory, productCountInSale, editAction, deleteAction };
}

function Category() {

    useEffect(() => {
        fetch("http://localhost:8000/api/v1/category/getAll/product")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                const allList = [];
                const activeList = [];
                const deletedList = [];

                data.data.forEach((category) => {
                    const item = createData(
                        category.id,
                        category.name,
                        category.is_deleted ? "Deleted" : "Active",
                        category.productCount,
                        category.productActiveCount,
                        "AB" + category.id,
                        "BA" + category.id
                    );

                    allList.push(item);
                    if (category.is_deleted) {
                        deletedList.push(item);
                    } else {
                        activeList.push(item);
                    }
                });

                setAllCategoryList(allList);
                setCategoryList(allList);
                setActivateCategoryList(activeList);
                setDeletedCategoryList(deletedList);
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [toggleCreateCategoryModal, setToggleCreateCategoryModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [createProductSuccess, setCreateProductSuccess] = useState(false);
    const [confirmModalToggle, setConfirmModalToggle] = useState(false)
    const [confirmType, setConfirmType] = useState("")
    const [buttonActionLoading, setButtonActionLoading] = useState(false)
    const [toggleUpdateCategoryModal, setToggleUpdateCategoryModal] = useState(false)
    const [allCategoryList, setAllCategoryList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [activateCategoryList, setActivateCategoryList] = useState([])
    const [deletedCategoryList, setDeletedCategoryList] = useState([])
    const [notificationPopup, setNotificationPopup] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [notificationMessage, setNotificationMessage] = useState("")
    const [confirmActionId, setConfirmActionId] = useState("")
    const [updateForm, setUpdateForm] = useState({
        id: '',
        name: '',
    })
    

    function handleUpdateCategory(form) {
        // TODO: Update Product by productId
        setUpdateLoading(true)
        fetch("http://localhost:8000/api/v1/category/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoryId: form.id,
                updateName: form.name
            })
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                fetchCategory()
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("แก้ไขหมู่หมวดสินค้าสำเร็จค่ะ")
                setUpdateLoading(false)
                setToggleUpdateCategoryModal(false)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("แก้ไขหมู่หมวดสินค้าไม่สำเร็จค่ะ")
                setUpdateLoading(false)
            });
    }

    function handleConfirmActionCategory(row, type) {
        setConfirmType(type)
        setConfirmModalToggle(true)
        setConfirmActionId(row.id)
    }

    function handleDeleteCategory(row) {
        // TODO: Delete Category by categoryI'd
        setButtonActionLoading(true)
        fetch("http://localhost:8000/api/v1/category/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoryId: confirmActionId
            })
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                fetchCategory()
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("ลบหมู่หมวดสินค้าสำเร็จค่ะ")
                setButtonActionLoading(false)
                setConfirmModalToggle(false)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("ลบหมู่หมวดสินค้าไม่สำเร็จค่ะ")
            });
    }

    function handleRecoverCategory() {
        // TODO: Recover Category by categoryId
        setButtonActionLoading(true)
        fetch("http://localhost:8000/api/v1/category/recovery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoryId: confirmActionId
            })
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                fetchCategory()
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("กู้คืนหมู่หมวดสินค้าสำเร็จค่ะ")
                setButtonActionLoading(false)
                setConfirmModalToggle(false)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("กู้คืนหมู่หมวดสินค้าไม่สำเร็จค่ะ")
                setButtonActionLoading(false)
            });
    }

    async function fetchCategory() {
        await fetch("http://localhost:8000/api/v1/category/getAll/product")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                const allList = [];
                const activeList = [];
                const deletedList = [];

                data.data.forEach((category) => {
                    const item = createData(
                        category.id,
                        category.name,
                        category.is_deleted ? "Deleted" : "Active",
                        category.productCount,
                        category.productActiveCount,
                        "AB" + category.id,
                        "BA" + category.id
                    );

                    allList.push(item);
                    if (category.is_deleted) {
                        deletedList.push(item);
                    } else {
                        activeList.push(item);
                    }
                });

                setAllCategoryList(allList);
                setCategoryList(allList);
                setActivateCategoryList(activeList);
                setDeletedCategoryList(deletedList);
            })
            .catch((error) => console.error("Fetch error:", error));
    }

    function buildUpdateData(row) {
        let categoryId = row.id
        let categoryName = row.categoryName
        // TODO: Get Product by productId
        let productData = {
            id: categoryId,
            name: categoryName,
        }
        setUpdateForm(productData)
        setToggleUpdateCategoryModal(true)
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
        fetch("http://localhost:8000/api/v1/category/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                fetchCategory()
                setLoading(false)
                setToggleCreateCategoryModal(false)
                setCreateProductSuccess(true)
                sortedList.map((sortItem) => { sortItem.selected = false })
            })
            .catch((error) => console.error("Fetch error:", error));
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
                case 'activatedCategory': setCategoryList(activateCategoryList)
                    break;
                case 'deletedCategory': setCategoryList(deletedCategoryList)
                    break;
            }
        } else {
            setCategoryList(allCategoryList)
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
                            {categoryList
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
                                                                <ActiveButton></ActiveButton>
                                                            </TableCell>
                                                        );
                                                    case 'Deleted':
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <DeletedButton></DeletedButton>
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
                                                        switch (row.categoryStatus) {
                                                            case 'Deleted':
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <RecoverButton onClick={() => handleConfirmActionCategory(row, "recover")}>เปิดการใช้งานหมวดหมู่</RecoverButton>
                                                                    </TableCell>
                                                                );
                                                            default:
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <DeleteButton onClick={() => handleConfirmActionCategory(row, "delete")}>ปิดการใช้งานหมวดหมู่</DeleteButton>
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
                    count={categoryList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog open={confirmModalToggle} onClose={(current) => setConfirmModalToggle(!current)}>
                <DialogTitle fontWeight="bold">{confirmType === "delete" ? "คุณต้องการที่จะปิดการใช้งานหมวดหมู่ใช่หรือไม่ ?" : "คุณต้องการที่จะเปิดการใช้งานหมวดหมู่ใช่หรือไม่ ?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmModalToggle(!confirmModalToggle)} color="error" variant="contained">
                        ยกเลิก
                    </Button>
                    <Button onClick={() => {
                        switch (confirmType) {
                            case 'delete': {
                                handleDeleteCategory();
                                break;
                            }
                            case 'recover': {
                                handleRecoverCategory();
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
            <CreateCategoryModal open={toggleCreateCategoryModal} onClose={(current) => setToggleCreateCategoryModal(!current)} onSubmit={onAddCategory} loading={loading} />
            <UpdateCategoryModal loading={updateLoading} onSubmit={handleUpdateCategory} open={toggleUpdateCategoryModal} onClose={(current) => setToggleUpdateCategoryModal(!current)} updateForm={updateForm} />
        </div>
    )
}

export default Category