import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. ตรวจสอบ Token ก่อน ถ้าไม่มีให้ redirect ทันทีโดยไม่ต้องยิง fetch
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch("http://localhost:5000/api/customers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        // 2. Token ไม่ถูกต้อง หรือหมดอายุ
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }

        // 3. จัดการ HTTP Error อื่นๆ เช่น 500, 404
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          // ป้องกันข้อผิดพลาดกรณี API ส่ง { customers: [...] } หรือ { data: [...] }
          setCustomers(Array.isArray(data) ? data : data.customers || data.data || []);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="p-4 text-slate-500">Loading customers...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        Customers List
      </h2>

      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          ไม่พบข้อมูลลูกค้า
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="border border-slate-200 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">
                  {customer.name}
                </h3>
                <p className="text-slate-600 text-sm mb-1">
                  <span className="font-semibold text-slate-700">Email:</span> {customer.email}
                </p>
                <p className="text-slate-500 text-xs mb-5">
                  <span className="font-semibold text-slate-600">Joined:</span> {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Link
                  to={`/customers/${customer.id}/orders`}
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200"
                >
                  View Orders
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}