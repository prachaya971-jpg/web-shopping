import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State สำหรับฟอร์ม
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  // State สำหรับรูปภาพ
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // State สำหรับสถานะการทำงาน
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 1. ดึงข้อมูลสินค้าเดิมมาใส่ใน Form
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const product = data.product || data.data || data;

        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          description: product.description || "",
        });

        // จัดการ URL รูปภาพเดิมเพื่อแสดงผลตัวอย่าง
        const rawPath = product.img_url || product.image_url;
        if (rawPath) {
          if (rawPath.startsWith("http")) {
            setPreviewUrl(rawPath);
          } else {
            let cleanPath = rawPath.replace(/\\/g, "/");
            if (cleanPath.includes("/uploads/")) {
              cleanPath = cleanPath.replace("/uploads/", "/images/");
            }
            cleanPath = cleanPath.replace(/^\/?public\//, "/");
            if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;
            setPreviewUrl(`http://localhost:5000${cleanPath}`);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // จัดการการเปลี่ยนค่าใน input ข้อความ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // จัดการการเลือกไฟล์รูปภาพใหม่
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // สร้าง temporary preview URL
    }
  };

  // 2. ส่งข้อมูลอัปเดตไปยัง Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      // ใช้ FormData เพราะมีไฟล์รูปภาพแนบไปด้วย
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);

      if (selectedFile) {
        data.append("image", selectedFile); // ชื่อ field 'image' ตรงกับ upload.single('image') ใน Backend
      }

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // หมายเหตุ: ห้ามใส่ 'Content-Type': 'multipart/form-data' เอง ให้ fetch จัดการ boundary อัตโนมัติ
        },
        body: data,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || "บันทึกข้อมูลไม่สำเร็จ");
      }

      alert("อัปเดตข้อมูลสินค้าสำเร็จ");
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-500 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← ย้อนกลับไปหน้ารายการสินค้า
      </Link>

      <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">แก้ไขสินค้า #{id}</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              ชื่อสินค้า *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              หมวดหมู่ (Category) *
            </label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ราคา และ จำนวนสต็อก */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                ราคา (บาท) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                จำนวนคงเหลือ (Stock)
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              รายละเอียดสินค้า
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* รูปภาพ และ ส่วนแสดง Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              รูปภาพสินค้า
            </label>
            {previewUrl && (
              <div className="mb-3 w-32 h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/150x150?text=No+Image";
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          {/* ปุ่ม Submit */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}