

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Grid } from '@mui/material';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
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
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';

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
        type: 'searchBar',
        minWidth: 400,
        align: 'center',
        selected: false
    },
    {
        type: 'AddStockbutton',
        minWidth: 50,
        align: 'center',
        selected: false
    },
    {
        type: 'CreateProductbutton',
        minWidth: 50,
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

function createData(id, categoryId, productDescription, productName, productStatus, productAmount, totalSales, totalCosts, editAction, deleteAction, productPrice, productStockPrice) {
    productAmount = productAmount.toLocaleString('en-US') + ' ชิ้น'
    totalSales = formatNumberWithCommasAndDecimals(totalSales) + ' บาท'
    totalCosts = formatNumberWithCommasAndDecimals(totalCosts) + ' บาท'
    return { id, categoryId, productDescription, productName, productStatus, productAmount, totalSales, totalCosts, editAction, deleteAction, productPrice, productStockPrice };
}

function formatNumberWithCommasAndDecimals(value) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function Product() {

    useEffect(() => {
        async function fetchProductData() {
            fetch("http://localhost:8000/api/v1/product/getAll")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    let row = []
                    let deletedRow = []
                    let activedRow = []
                    let lowStockRow = []
                    data.data.map((item) => {
                        let productId = item.id
                        let productCategory = item.categoryId
                        let productDescription = item.description
                        let productName = item.name
                        let productStatus = item.isDeleted ? 'Deleted' : 'Active'
                        let productAmount = Number(item.amount)
                        let productPrice = Number(item.price)
                        let productStockPrice = Number(item.stockPrice)
                        let totalSales = Number(item.amount) * Number(item.price)
                        let totalCosts = Number(item.amount) * Number(item.stockPrice)
                        let editAction = "AB" + item.id
                        let deleteAction = "BA" + item.id
                        if (item.isDeleted) {
                            deletedRow.push(
                                createData(
                                    productId, productCategory,
                                    productDescription, productName,
                                    productStatus, productAmount,
                                    totalSales, totalCosts,
                                    editAction, deleteAction,
                                    productPrice, productStockPrice
                                )
                            )
                        }
                        if (!item.isDeleted) {
                            activedRow.push(
                                createData(
                                    productId, productCategory,
                                    productDescription, productName,
                                    productStatus, productAmount,
                                    totalSales, totalCosts,
                                    editAction, deleteAction,
                                    productPrice, productStockPrice
                                )
                            )
                        }
                        if (Number(item.amount) <= 5) {
                            lowStockRow.push(
                                createData(
                                    productId, productCategory,
                                    productDescription, productName,
                                    productStatus, productAmount,
                                    totalSales, totalCosts,
                                    editAction, deleteAction,
                                    productPrice, productStockPrice
                                )
                            )
                        }
                        row.push(
                            createData(
                                productId, productCategory,
                                productDescription, productName,
                                productStatus, productAmount,
                                totalSales, totalCosts,
                                editAction, deleteAction,
                                productPrice, productStockPrice
                            )
                        )
                    })
                    setDataList(row)
                    setAllDataList(row)
                    setDeletedDataList(deletedRow)
                    setLowStockDataList(lowStockRow)
                    setActivedDataList(activedRow)
                })
                .catch((error) => console.error("Fetch error:", error));
        }

        async function fetchCategoryData() {
            fetch("http://localhost:8000/api/v1/category/getAll")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    setCategoryList(data.data)
                })
                .catch((error) => console.error("Fetch error:", error));
        }

        fetchProductData()
        fetchCategoryData()

    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedList, setSortedList] = useState(initialList);
    const [dataList, setDataList] = useState([])
    const [allDataList, setAllDataList] = useState([])
    const [deletedDataList, setDeletedDataList] = useState([])
    const [lowStockDataList, setLowStockDataList] = useState([])
    const [activedDataList, setActivedDataList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [toggleCreateProductModal, setToggleCreateProductModal] = useState(false)
    const [toggleAddStockModal, setToggleAddStockModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notificationPopup, setNotificationPopup] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [notificationMessage, setNotificationMessage] = useState("")
    const [toggleUpdateProductModal, setToggleUpdateProductModal] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [confirmType, setConfirmType] = useState("")
    const [confirmModalToggle, setConfirmModalToggle] = useState(false)
    const [confirmActionId, setConfirmActionId] = useState("")
    const [buttonActionLoading, setButtonActionLoading] = useState(false)
    const [updateForm, setUpdateForm] = useState({
        name: '',
        description: '',
        category: '',
        costPrice: '',
        salePrice: '',
    })

    const filteredProduct = search == "" ? dataList : dataList.filter((item) => item.productName.toLowerCase().includes(search.toLowerCase()))

    function handleUpdateProduct(form) {
        // TODO: Update Product by productId
        setUpdateLoading(true)
        let productId = form.id
        let productName = form.name
        let productDescription = form.description
        let categoryId = categoryList.find((item) => item.name === form.category).id
        let productCostPrice = Number(form.costPrice)
        let productSalePrice = Number(form.salePrice)
        let updateProductForm = {
            productId: productId,
            name: productName,
            description: productDescription,
            category_id: categoryId,
            stock_price: productCostPrice,
            price: productSalePrice
        }
        fetch("http://localhost:8000/api/v1/product/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateProductForm),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setToggleUpdateProductModal(false)
                setUpdateLoading(false)
                fetchProduct()
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("อัปเดตข้อมูลสินค้าสำเร็จค่ะ")
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("อัปเดตข้อมูลสินค้าไม่สำเร็จค่ะ")
                setUpdateLoading(false)
            });
    }

    function handleConfirmActionProduct(row, type) {
        setConfirmType(type)
        setConfirmModalToggle(true)
        setConfirmActionId(row.id)
    }

    function handleDeleteProduct() {
        // TODO: Delete Product by productId
        setButtonActionLoading(true)
        fetch("http://localhost:8000/api/v1/product/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: confirmActionId }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                fetchProduct()
                setConfirmModalToggle(false)
                setButtonActionLoading(false)
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("ลบสินค้าสำเร็จค่ะ")
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("ลบสินค้าไม่สำเร็จค่ะ")
            });
    }

    function handleRecoverProduct() {
        // TODO: Recover Product by productId
        setButtonActionLoading(true)
        fetch("http://localhost:8000/api/v1/product/restore", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: confirmActionId }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                fetchProduct()
                setConfirmModalToggle(false)
                setButtonActionLoading(false)
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("กู้คืนสินค้าสำเร็จค่ะ")
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("กู้คืนสินค้าไม่สำเร็จค่ะ")
            });
    }

    function buildUpdateData(row) {
        let productId = row.id
        let productName = row.productName
        let productDescription = row.productDescription
        let productCostPrice = row.productStockPrice
        let productSalePrice = row.productPrice

        // TODO: Get Product by productId
        let productData = {
            id: productId,
            name: productName,
            description: productDescription,
            category: categoryList.find((item) => item.id === row.categoryId).name,
            costPrice: productCostPrice,
            salePrice: productSalePrice
        }
        setUpdateForm(productData)
        setToggleUpdateProductModal(true)
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function onAddProduct(form) {
        setLoading(true)
        let createProductPayload = {
            name: form.name,
            description: form.description,
            categoryId: form.category,
            stockPrice: form.costPrice,
            sellPrice: form.salePrice
        }
        fetch("http://localhost:8000/api/v1/product/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createProductPayload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setLoading(false)
                setToggleCreateProductModal(false)
                // setCreateProductSuccess(true)
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("เพิ่มสินค้าสำเร็จค่ะ")
                fetchProduct()
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setLoading(false)
                // setCreateProductError(true)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("เพิ่มสินค้าไม่สำเร็จค่ะ")
            });
    }

    function onAddStock(form) {
        setLoading(true)
        // send data to baclemd for add stock
        let addStockPayload = {
            productList: []
        }
        form.map((item) => {
            addStockPayload.productList.push({
                productId: item.id,
                productAmount: item.quantity
            })
        })
        fetch("http://localhost:8000/api/v1/product/addStock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addStockPayload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setLoading(false)
                setToggleAddStockModal(false)
                // setAddStockSuccess(true)
                setNotificationPopup(true)
                setNotificationType("success")
                setNotificationMessage("เพิ่มสต๊อกสินค้าสำเร็จค่ะ")
                fetchProduct()
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setLoading(false)
                // setAddStockError(true)
                setNotificationPopup(true)
                setNotificationType("error")
                setNotificationMessage("เพิ่มสต๊อกสินค้าไม่สำเร็จค่ะ")
            });
    }

    async function fetchProduct() {
        fetch("http://localhost:8000/api/v1/product/getAll")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                let row = []
                let deletedRow = []
                let activedRow = []
                let lowStockRow = []
                data.data.map((item) => {
                    let productId = item.id
                    let productCategory = item.categoryId
                    let productDescription = item.description
                    let productName = item.name
                    let productStatus = item.isDeleted ? 'Deleted' : 'Active'
                    let productAmount = Number(item.amount)
                    let productPrice = Number(item.price)
                    let productStockPrice = Number(item.stockPrice)
                    let totalSales = Number(item.amount) * Number(item.price)
                    let totalCosts = Number(item.amount) * Number(item.stockPrice)
                    let editAction = "AB" + item.id
                    let deleteAction = "BA" + item.id
                    if (item.isDeleted) {
                        deletedRow.push(
                            createData(
                                productId, productCategory,
                                productDescription, productName,
                                productStatus, productAmount,
                                totalSales, totalCosts,
                                editAction, deleteAction,
                                productPrice, productStockPrice
                            )
                        )
                    }
                    if (!item.isDeleted) {
                        activedRow.push(
                            createData(
                                productId, productCategory,
                                productDescription, productName,
                                productStatus, productAmount,
                                totalSales, totalCosts,
                                editAction, deleteAction,
                                productPrice, productStockPrice
                            )
                        )
                    }
                    if (Number(item.amount) <= 5) {
                        lowStockRow.push(
                            createData(
                                productId, productCategory,
                                productDescription, productName,
                                productStatus, productAmount,
                                totalSales, totalCosts,
                                editAction, deleteAction,
                                productPrice, productStockPrice
                            )
                        )
                    }
                    row.push(
                        createData(
                            productId, productCategory,
                            productDescription, productName,
                            productStatus, productAmount,
                            totalSales, totalCosts,
                            editAction, deleteAction,
                            productPrice, productStockPrice
                        )
                    )
                })
                setDataList(row)
                setAllDataList(row)
                setDeletedDataList(deletedRow)
                setLowStockDataList(lowStockRow)
                setActivedDataList(activedRow)
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
                case 'deletedItem': setDataList(deletedDataList)
                    break;
                case 'lowStockItem': setDataList(lowStockDataList)
                    break;
                case 'activedItem': setDataList(activedDataList)
                    break;
            }
        } else {
            setDataList(allDataList)
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
                                    else if (sortedItem.type === 'searchBar') {
                                        return (
                                            <TableCell
                                                align={sortedItem.align}
                                                style={{ minWidth: sortedItem.minWidth }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    name="search"
                                                    label="ค้นหาโดยชื่อสินค้า"
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
                            {filteredProduct
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
                                                                        <RecoverButton onClick={() => handleConfirmActionProduct(row, 'recover')}>เปิดการใช้งานลูกค้า</RecoverButton>
                                                                    </TableCell>
                                                                );
                                                            default:
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <DeleteButton onClick={() => handleConfirmActionProduct(row, 'delete')}>ปิดการใช้งานลูกค้า</DeleteButton>
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
            <Dialog open={confirmModalToggle} onClose={(current) => setConfirmModalToggle(!current)}>
                <DialogTitle fontWeight="bold">{confirmType === "delete" ? "คุณต้องการที่จะปิดการใช้งานสินค้าใช่หรือไม่ ?" : "คุณต้องการที่จะเปิดการใช้งานสินค้าใช่หรือไม่ ?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmModalToggle(!confirmModalToggle)} color="error" variant="contained">
                        ยกเลิก
                    </Button>
                    <Button onClick={() => {
                        switch (confirmType) {
                            case 'delete': {
                                handleDeleteProduct();
                                break;
                            }
                            case 'recover': {
                                handleRecoverProduct();
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
            <CreateProductModal categoryList={categoryList} open={toggleCreateProductModal} onClose={(current) => setToggleCreateProductModal(!current)} onSubmit={onAddProduct} loading={loading} />
            <AddStockModalMain open={toggleAddStockModal} onClose={(current) => setToggleAddStockModal(!current)} onSubmit={onAddStock} loading={loading} categoryList={categoryList} productList={activedDataList} />
            <UpdateProductModal categoryList={categoryList} updateLoading={updateLoading} onSubmit={handleUpdateProduct} open={toggleUpdateProductModal} onClose={(current) => setToggleUpdateProductModal(!current)} updateForm={updateForm} />

        </div>
    )
}

export default Product