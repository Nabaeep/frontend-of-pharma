import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://bakendofpharma.onrender.com";

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    name: "",
    batch_no: "",
    expiry_date: "",
    quantity: "",
    supplier_id: "",
    warehouse_id: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) alert("Please log in first!");

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/supplier/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuppliers(data.suppliers || data || []);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        alert(err.response?.data?.message || "Failed to fetch suppliers");
      }
    };
    if (token) fetchSuppliers();
  }, []);

  // Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/warehouse`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWarehouses(data.warehouses || data || []);
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        alert(err.response?.data?.message || "Failed to fetch warehouses");
      }
    };
    if (token) fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const warehouse = warehouses.find((w) => w._id === formData.warehouse_id);
      const body = {
        ...formData,
        quantity: Number(formData.quantity),
        warehouse_location: warehouse?.name || "",
      };

      const { data } = await axios.post(`${API_URL}/api/drug/add`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Drug added successfully!");
      setFormData({
        name: "",
        batch_no: "",
        expiry_date: "",
        quantity: "",
        supplier_id: "",
        warehouse_id: "",
      });
    } catch (err) {
      console.error("Error adding drug:", err);
      alert(err.response?.data?.message || "Failed to add drug");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-6">
      <form
        onSubmit={handleSubmit}
        className="h-auto w-[700px] p-8 rounded-2xl shadow-lg text-gray-200 bg-[#111827]"
      >
        <h1 className="text-2xl font-semibold mb-10 text-center">
          Add <span className="text-blue-400">Drug</span>
        </h1>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Drug Name"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="text"
          name="batch_no"
          value={formData.batch_no}
          onChange={handleChange}
          placeholder="Enter Batch Number"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <select
          name="supplier_id"
          value={formData.supplier_id}
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="warehouse_id"
          value={formData.warehouse_id}
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500 text-white"
          required
        />

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter Quantity"
          className="w-full p-3 mb-10 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-[300px] py-3 rounded-lg ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            } transition text-white font-semibold`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;
