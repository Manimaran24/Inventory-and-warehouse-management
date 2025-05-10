import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ["#FF8042", "#FFBB28", "#00C49F"];

const Dashboard = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [counts, setCounts] = useState({
    delivery: 0,
    intransit: 0,
    inventory: 0
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/Dashboard/Dashboard")
      .then((res) => {
        const warehouse = res.data.warehouses;
        const products = res.data.product;
        const top = res.data.top_product;
       

        const formattedProducts = products.map(p => ({
          name: p.name,
          available: p.availbale_stock,
          usage: p.total_stock - p.availbale_stock
        }));

        const formattedTop = top.map(p => ({
          name: p.product_name,
          quantity: p.total_quantity
        }));

        setWarehouseData(warehouse);
        setProductData(formattedProducts);
        setTopProducts(formattedTop);

       
        setCounts({
          delivery: res.data.deivery_count,
          
          intransit: res.data.intransit_count,
          inventory: res.data.inventory_count
          
        });
        console.log("API response: ", res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <>
   
      <div
        className="dashboard"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          padding: '60px',
          fontFamily: 'Arial, sans-serif',
          marginTop: '7%',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="chart-container"
          style={{
            backgroundColor: '#E3F2FD',
            padding: '30px',
            borderRadius: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: '400px',
            marginRight: '1050px',
            marginTop: '-50px'
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Warehouse Capacity</h2>
          {warehouseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={warehouseData}
                  dataKey="capacity"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {warehouseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        <div
          className="bar-container"
          style={{
            backgroundColor: '#E3F2FD',
            padding: '30px',
            borderRadius: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: '400px',
            marginLeft: '-100px',
            marginTop: '-450px'
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Product Stock Status</h2>
          {productData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="available" stackId="a" fill="#FFBB28" />
                <Bar dataKey="usage" stackId="a" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading product chart...</p>
          )}
        </div>
      </div>

      <div
        className="top-product-container"
        style={{
          backgroundColor: '#E3F2FD',
          padding: '20px',
          borderRadius: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '400px',
          margin: '30px auto',
          fontFamily: 'Arial, sans-serif',
          marginLeft: '1000px',
          marginTop: '-513px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Top Product Sales</h2>
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={topProducts}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading top products...</p>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '40px',
          fontFamily: 'Arial, sans-serif',
          flexWrap: 'wrap'
        }}
      >
        <div style={{
          backgroundColor: '#E9A5F1',
          padding: '20px',
          borderRadius: '20px',
          width: '180px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginTop:'20px'
        }}>
          <h3>Delivery</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{counts.delivery??0}</p>
        </div>

        <div style={{
          backgroundColor: '#E9A5F1',
          padding: '20px',
          borderRadius: '20px',
          width: '180px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginTop:'20px'
        }}>
          <h3>In-Transit</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{counts.intransit}</p>
        </div>

        <div style={{
          backgroundColor: '#E9A5F1',
          padding: '20px',
          borderRadius: '20px',
          width: '180px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginTop:'20px'
        }}>
          <h3>Inventory</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{counts.inventory}</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
