import React from 'react';
function Greeting(props) {
 return (
 <div>
 <h2>Hello, {props.name}!</h2>
 <p>วันนี้คุณมี {props.messages} ข้อความ</p>
 </div>
 );
}
export default Greeting;