import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. ตรวจสอบ Token ถ้าไม่มีให้เด้งไปหน้า login ทันที
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        // 2. ตรวจสอบ Token หมดอายุหรือไม่มีสิทธิ์
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }

        // กรณีไม่พบสินค้า
        if (response.status === 404) {
          throw new Error("ไม่พบสินค้าที่ต้องการในระบบ");
        }

        if (!response.ok) {
          throw new Error(`เกิดข้อผิดพลาด: สถานะ ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          // รองรับทั้งแบบส่ง object ตรงๆ หรือห่อไว้ใน key ย่อย
          setProduct(data.product || data.data || data);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
        กำลังโหลดข้อมูลสินค้า...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบสินค้าที่ต้องการ</h2>
        <p className="text-gray-500 mb-6">{error || "สินค้าชิ้นนี้อาจถูกลบหรือไม่มีอยู่ในระบบ"}</p>
        <Link 
          to="/products" 
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          กลับไปหน้ารายการสินค้า
        </Link>
      </div>
    );
  }

  // จัดการพาธรูปภาพให้ตรงกับ API/Static Server
  const rawPath = product.img_url || product.image_url || product.img;
  let imageUrl = "https://placehold.co/600x400?text=No+Image";

  if (rawPath) {
    if (rawPath.startsWith("http")) {
      imageUrl = rawPath;
    } else {
      let cleanPath = rawPath.replace(/\\/g, "/");
      if (cleanPath.includes("/uploads/")) {
        cleanPath = cleanPath.replace("/uploads/", "/images/");
      }
      cleanPath = cleanPath.replace(/^\/?public\//, "/");
      if (!cleanPath.startsWith("/")) {
        cleanPath = `/${cleanPath}`;
      }
      imageUrl = `http://localhost:5000${cleanPath}`;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ลิงก์ย้อนกลับ */}
      <Link 
        to="/products" 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← ย้อนกลับไปหน้ารวมสินค้า
      </Link>

      {/* กล่องรายละเอียดสินค้า */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden md:grid md:grid-cols-2 gap-8 items-center">
        {/* รูปภาพสินค้า */}
        <div className="h-72 md:h-full bg-slate-50 overflow-hidden flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
            }}
          />
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {product.stock !== undefined && product.stock <= 0 ? "Out of Stock" : "In Stock"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-2">
              {product.name}
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
              {product.description || "ไม่มีรายละเอียดสินค้า"}
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-extrabold text-slate-900">
                ฿{Number(product.price || 0).toLocaleString()}
              </span>
              <span className="text-sm text-slate-400 font-normal">รวมภาษีมูลค่าเพิ่มแล้ว</span>
            </div>

            <div className="flex gap-3">
              <button 
                disabled={product.stock !== undefined && product.stock <= 0}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-all"
              >
                ใส่ตะกร้าสินค้า
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all">
                ♡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}