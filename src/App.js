import './App.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Customers from "./components/Customers";
import CustomerOrders from "./components/CustomerOrders";
import Login from "./components/Login";
import ProductCreate from "./components/ProductCreate";
import EditProduct from "./components/EditProduct";
import ProductChart from "./components/ProductChart";
import ProductodrerChart from './components/Chart.js';

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [roleId, setRoleId] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const decoded = parseJwt(savedToken);
    return decoded ? decoded.role_id : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRoleId(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="bg-slate-900 text-slate-200 px-6 py-4 shadow-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/products" className="text-xl font-bold tracking-wider text-white hover:text-indigo-400">
            BRAND<span className="text-indigo-500">.</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/products" className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-indigo-400">
              Products
            </Link>

            <Link to="/customer" className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-indigo-400">
              Customers
            </Link>

            <Link to="/orderchart" className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-indigo-400">
              orderchart
            </Link>

            <Link to="/chart" className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-indigo-400">
              ProductChart
            </Link>

            {token ? (
              <button onClick={handleLogout} className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white">
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-indigo-400">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/product-create"
          element={roleId === 1 ? <ProductCreate /> : <Navigate to="/products" replace />}
        />
        <Route
          path="/products/:id/edit"
          element={roleId === 1 ? <EditProduct /> : <Navigate to="/products" replace />}
        />
        <Route path="/customer" element={<Customers />} />
        <Route
          path="/orderchart"
          element={token ? <ProductodrerChart /> : <Navigate to="/login" replace />}
        />
        <Route path="/customers/:id/orders" element={<CustomerOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chart" element={<ProductChart />} />
        <Route path="*" element={<Navigate to="/products" replace />} />

      </Routes>
    </Router>
  );
}

export default App;