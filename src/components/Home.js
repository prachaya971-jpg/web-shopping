// src/components/Home.js
import React from 'react';

export default function Home() {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto my-6 text-center">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
        หน้าแรก (Home)
      </h2>
      <p className="text-gray-600 text-lg font-medium leading-relaxed">
        ยินดีต้อนรับสู่เว็บไซต์ของเรา!
      </p>
      <p className="text-sm text-gray-400 mt-2">
        ค้นพบสินค้าและบริการที่ดีที่สุดได้ที่นี่
      </p>
    </div>
  );
}