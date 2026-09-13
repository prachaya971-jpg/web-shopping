import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const [roleId] = useState(() => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    return decoded ? decoded.role_id : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setProducts(Array.isArray(data) ? data : data.products || data.data || []);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`ต้องการลบสินค้า "${name}" ใช่หรือไม่?`)) return;

    const token = localStorage.getItem("token");
    setDeletingId(id);

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ไม่สามารถลบสินค้าได้");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("ลบสินค้าเรียบร้อยแล้ว");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">กำลังโหลดรายการสินค้า...</div>;
  if (error) return <div className="p-8 text-center text-red-500">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Products</h2>
        {roleId === 1 && (
          <Link to="/product-create" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg">
            + เพิ่มสินค้าใหม่
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          ไม่พบรายการสินค้า
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const rawPath = product.img_url || product.image_url;
            let imageUrl = "https://placehold.co/300x200?text=No+Image";

            if (rawPath) {
              if (rawPath.startsWith("http")) {
                imageUrl = rawPath;
              } else {
                let cleanPath = rawPath.replace(/\\/g, "/");
                if (cleanPath.includes("/uploads/")) cleanPath = cleanPath.replace("/uploads/", "/images/");
                cleanPath = cleanPath.replace(/^\/?public\//, "/");
                if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;
                imageUrl = `http://localhost:5000${cleanPath}`;
              }
            }

            return (
              <div key={product.id} className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
                <div>
                  <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x200?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                  <p className="text-emerald-600 font-semibold mb-3">฿{Number(product.price).toLocaleString()}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link to={`/products/${product.id}`} className="text-xs font-semibold text-slate-600 hover:text-indigo-600">
                    รายละเอียด
                  </Link>

                  {roleId === 1 && (
                    <div className="flex gap-1.5">
                      <Link to={`/products/${product.id}/edit`} className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200">
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                      >
                        {deletingId === product.id ? "กำลังลบ..." : "ลบ"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}