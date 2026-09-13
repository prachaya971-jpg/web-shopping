import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function CustomerOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. ตรวจสอบว่ามี Token หรือไม่ ถ้าไม่มีให้ดีดไปหน้า login ทันทีโดยไม่ยิง fetch
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`http://localhost:5000/api/customers/${id}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        // 2. Token หมดอายุ หรือไม่มีสิทธิ์
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }

        // 3. จัดการ Error อื่นๆ เช่น 404, 500
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <div className="p-4 text-slate-500">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/customers" 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← ย้อนกลับไปหน้ารายชื่อลูกค้า
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        Orders for Customer #{id}
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          ไม่พบรายการคำสั่งซื้อสำหรับลูกค้ารายนี้
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {order.status}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">
                  Order ID: #{order.id}
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  <span className="font-semibold text-slate-600">Order Date:</span> {new Date(order.order_date).toLocaleString()}
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="text-2xl font-extrabold text-slate-900">
                  ฿{Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}