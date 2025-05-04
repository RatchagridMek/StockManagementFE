
import { Sidebar, MenuItem } from "react-mui-sidebar";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Link, useLocation } from "react-router-dom";


function AppSidebar({ isCollapsed }) {

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Sidebar isCollapse={isCollapsed} showProfile={false} themeColor={"#FDF8F8"} textColor={"#000000"} width={"270px"}>
            <br/>
            <MenuItem
                icon={<CottageOutlinedIcon />}
                component={Link}
                link="/tes"
                badge={false}>
                Home
            </MenuItem>
            <MenuItem
                icon={<ProductionQuantityLimitsOutlinedIcon />}
                component={Link}
                link="/products"
                badge={false}
                isSelected={currentPath === "/products"}>
                Product
            </MenuItem>
            <MenuItem
                icon={<Inventory2OutlinedIcon />}
                component={Link}
                link="/test"
                badge={false}
                isSelected={currentPath === "/test"}>
                Order
            </MenuItem>
            <MenuItem
                icon={<CategoryOutlinedIcon />}
                component={Link}
                link="/categorys"
                badge={false}
                isSelected={currentPath === "/categorys"}>
                Category
            </MenuItem>
        </Sidebar>
    );
}

export default AppSidebar;