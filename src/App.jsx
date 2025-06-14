import MainBar from './page/headers/mainBar.jsx'
import AppSideBar from './page/sidebar/sidebar.jsx'
import { useState } from 'react'
import Product from './page/products/product.jsx';
import Category from './page/categorys/category.jsx'
import { Routes, Route } from 'react-router-dom'
import Orders from './page/orders/orders.jsx'
import Customers from './page/customers/customer.jsx'

function App() {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      <MainBar toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#EEEEEE" }}>
        <AppSideBar isCollapsed={isCollapsed} />
        <div style={{ flex: 1, padding: "1rem", background: "#F7F7F7", marginTop: "64px" }}>
          <Routes>
            <Route path="/products" element={<Product />} />
            <Route path="/categorys" element={<Category />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
