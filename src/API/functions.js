import axios from 'axios';

const url="https://fakestoreapi.com/products"

export const fetchData = async () => {
    const response = await fetch(url);
    if (!response.ok) {
       throw new Error('Error: ' + response.statusText);
    }
    return response.json();
   };

  export const fetchProductDetails = async (id) => {
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
    return response.data;
   };