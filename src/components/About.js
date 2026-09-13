// src/components/About.js
import React from 'react';

export default function About() {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto my-6 text-center">
      {/* หัวข้อ */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-4">
        เกี่ยวกับเรา (About)
      </h2>

      {/* ข้อความเนื้อหา */}
      <p className="text-xl font-semibold text-gray-800 mb-2">
        สวัสดีครับ 👋
      </p>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        เรายินดีที่ได้รู้จักและพร้อมให้บริการสินค้าคุณภาพที่ดีที่สุดแก่คุณ
      </p>
    </div>
  );
}