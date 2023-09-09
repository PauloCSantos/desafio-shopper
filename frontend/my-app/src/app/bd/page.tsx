"use client"
import React, { useEffect, useState } from "react";

const Bd = () => {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/bdvalues`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setPacks(data.packs);
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Preço de Venda</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any, index: number) => (
            <tr key={index}>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.sales_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Packs</h2>
      <table className="table-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pack ID</th>
            <th>Product ID</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {packs.map((pack: any, index: number) => (
            <tr key={index}>
              <td>{pack.id}</td>
              <td>{pack.pack_id}</td>
              <td>{pack.product_id}</td>
              <td>{pack.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bd;