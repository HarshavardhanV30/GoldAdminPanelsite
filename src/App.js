import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import SellerTable from "./pages/SellerTable";
import GoldLoanRequest from "./pages/GoldLoanRequest";
import Terms from "./pages/Terms&conditionss";
import BannerManagement from "./pages/Banners";
import CategoryAdminPanel from "./pages/category";
import AddPhoneNumber from "./pages/PhoneNumber";
import GoldPriceDashboard from "./pages/AddGoldPrice";
import SellGoldPrice  from "./pages/SellGoldPrice";
import Sidebar from "../src/components/sidebar";

import "./App.css";
import AddGoldProduct from "./pages/AddGoldProduct";

/* ---------- Layout Wrapper ---------- */
const Layout = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Hide sidebar on login page
  const hideSidebar = location.pathname === "/";

  return (
    <>
      {!hideSidebar && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div style={{ marginLeft: hideSidebar ? 0 : isOpen ? 240 : 70 }}>
        {children}
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/sellertable" element={<SellerTable />} />
          <Route path="/goldloanrequest" element={<GoldLoanRequest />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/AddGoldProducts" element={<AddGoldProduct/>}/>
          <Route path="/AddBanners" element={<BannerManagement/>}/>
          <Route path="/categoryName" element={<CategoryAdminPanel/>}/>
          <Route path="/AddPhonenumbers" element={<AddPhoneNumber/>}/>
          <Route path="/AddGoldPrice" element={<GoldPriceDashboard/>}/>
          <Route path="/SellGold" element={<SellGoldPrice/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
