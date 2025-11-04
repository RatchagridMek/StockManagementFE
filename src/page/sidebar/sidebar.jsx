
import { Sidebar, MenuItem } from "react-mui-sidebar";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { Link, useLocation } from "react-router-dom";
import Divider from '@mui/material/Divider';
import { Box } from "@mui/material";

function AppSidebar({ isCollapsed }) {

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Sidebar isCollapse={isCollapsed} showProfile={false} themeColor={"#FDF8F8"} textColor={"#000000"} width={"270px"}>
            <Box sx={{
                position: "fixed",
                // Set the fixed width here to contain the sidebar
                width: isCollapsed ? "80px" : "270px",
            }}
            >
                <br />
                <br />
                <br />
                <MenuItem
                    icon={<CottageOutlinedIcon />}
                    component={Link}
                    link="/dashboard"
                    badge={false}>
                    Home
                </MenuItem>
                <Divider />
                <MenuItem
                    icon={<ProductionQuantityLimitsOutlinedIcon />}
                    component={Link}
                    link="/products"
                    badge={false}
                    isSelected={currentPath === "/products"}>
                    Product
                </MenuItem>
                <Divider />
                <MenuItem
                    icon={<Inventory2OutlinedIcon />}
                    component={Link}
                    link="/orders"
                    badge={false}
                    isSelected={currentPath === "/orders"}>
                    Order
                </MenuItem>
                <Divider />
                <MenuItem
                    icon={<CategoryOutlinedIcon />}
                    component={Link}
                    link="/categorys"
                    badge={false}
                    isSelected={currentPath === "/categorys"}>
                    Category
                </MenuItem>
                <Divider />
                <MenuItem
                    icon={<PersonOutlineIcon />}
                    component={Link}
                    link="/customers"
                    badge={false}
                    isSelected={currentPath === "/customers"}>
                    Customer
                </MenuItem>
                <Divider />
                <MenuItem
                    icon={<DeliveryDiningIcon />}
                    component={Link}
                    link="/delivery"
                    badge={false}
                    isSelected={currentPath === "/delivery"}>
                    Delivery
                </MenuItem>
                <Divider />
            </Box>
        </Sidebar>
    );
}

export default AppSidebar;