import React, { useState } from 'react';
function FormExample() {
 const [text, setText] = useState('');
 // จัดการเมื่อกรอก input
 function handleChange(e) {
 setText(e.target.value);
 }
 // จัดการเมื่อกด submit
 function handleSubmit(e) {
 e.preventDefault(); // ป้องกันรีโหลดหน้า
alert(`You submitted: ${text}`);
 setText(''); // ล้างค่า input
 }
return (
 <form onSubmit={handleSubmit}>
 <label>
 Enter text:
 <input
 type="text"
 value={text}
 onChange={handleChange}
 />
 </label>
 <button type="submit">Submit</button>
 </form>
 );
}
export default FormExample;