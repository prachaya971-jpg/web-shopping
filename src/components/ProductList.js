import React, { useState, useEffect } from 'react';
import axios from 'axios';
function ProductList() {
 const [products, setProducts] = useState([]);
 useEffect(() => {
 axios.get('http://localhost:3000/api/products')
 .then(res => setProducts(res.data))
 .catch(err => console.error(err));
 }, []);
 return (
 <div>
 <h2>Product List</h2>
 <pre>{JSON.stringify(products, null, 2)}</pre>
 </div>
 );
}
export default ProductList;