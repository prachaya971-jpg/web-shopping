// src/DataFetcher.js
import React, { useState, useEffect } from 'react';
function DataFetcher() {
 const [user, setUser] = useState(null);
 useEffect(() => {
 // รันเมื่อ Component mount ครั้งแรก
fetch('https://jsonplaceholder.typicode.com/users/1')
 .then(res => res.json())
 .then(data => setUser(data))
 .catch(console.error);
 }, []); // [] : รันแค่ครั้งเดียว
if (!user) {
 return <p>ก ำลังโหลดข้อมูลผู้ใช้…</p>;
 }
 return (
 <div>
 <h3>{user.name}</h3>
 <p>อีเมล: {user.email}</p>
 </div>
 );
}
export default DataFetcher;