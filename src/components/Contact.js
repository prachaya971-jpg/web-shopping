// src/components/Contact.js
import React from 'react';

export default function Contact() {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto my-6">
      {/* หัวข้อหลัก */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-2">
        ติดต่อเรา (Contact)
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถติดต่อเราได้ตามช่องทางด้านล่าง
      </p>

      {/* ข้อมูลการติดต่อ */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <p className="text-base text-gray-600 flex items-center justify-between">
          <span className="font-semibold text-gray-800">อีเมล:</span>
          <span className="font-medium text-blue-600 hover:underline cursor-pointer">support@example.com</span>
        </p>
        <p className="text-base text-gray-600 flex items-center justify-between">
          <span className="font-semibold text-gray-800">โทร:</span>
          <span className="font-medium text-gray-900 tracking-wide">+66 012 345 6789</span>
        </p>
      </div>
    </div>
  );
}