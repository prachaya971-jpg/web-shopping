import React, { useState } from "react";
import axios from "axios";

function ProductCreate() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [file, setFile] = useState(null); // เก็บ Object ไฟล์รูป
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ใช้ FormData สำหรับส่งไฟล์รูปภาพ
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (file) {
      formData.append("image", file); // ชื่อ key ต้องตรงกับ upload.single('image') ใน backend
    }

    try {
      const res = await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(`สร้างสินค้าสำเร็จ ID: ${res.data.id}`);
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock(0);
      setFile(null);
      e.target.reset(); // รีเซ็ต input file
    } catch (err) {
      setMessage("เกิดข้อผิดพลาด: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Create Product</h3>
      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="border p-2 rounded" 
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
          className="border p-2 rounded" 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="border p-2 rounded" 
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
          className="border p-2 rounded" 
        />
        <input 
          type="number" 
          placeholder="Stock" 
          value={stock} 
          onChange={(e) => setStock(e.target.value)} 
          className="border p-2 rounded" 
        />

        {/* Input สำหรับเลือกรูปภาพ */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="border p-2 rounded file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-100" 
        />

        <button 
          type="submit" 
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default ProductCreate;