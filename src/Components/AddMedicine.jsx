import React, { useState, useEffect } from "react";

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

  // ✅ Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first!");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/supplier/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          alert("Unauthorized. Please log in again.");
          return;
        }

        const data = await res.json();
        setSuppliers(data.suppliers || []);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        alert("Failed to fetch suppliers");
      }
    };

    fetchSuppliers();
  }, []);

  // ✅ Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/warehouse", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          alert("Unauthorized. Please log in again.");
          return;
        }

        const data = await res.json();
        setWarehouses(data.warehouses || []);
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        alert("Failed to fetch warehouses");
      }
    };

    fetchWarehouses();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      setLoading(false);
      return;
    }

    try {
      // Map warehouse_id to warehouse name
      const warehouse = warehouses.find(w => w._id === formData.warehouse_id);
      const body = {
        name: formData.name,
        batch_no: formData.batch_no,
        expiry_date: formData.expiry_date,
        quantity: Number(formData.quantity),
        supplier_id: formData.supplier_id,
        warehouse_location: warehouse?.name || "",
      };

      const res = await fetch("http://localhost:5000/api/drug/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Drug added successfully!");
        setFormData({
          name: "",
          batch_no: "",
          expiry_date: "",
          quantity: "",
          supplier_id: "",
          warehouse_id: "",
        });
      } else {
        alert(data.message || "Failed to add drug");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to connect to server");
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

        {/* Drug Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Drug Name"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        {/* Batch No */}
        <input
          type="text"
          name="batch_no"
          value={formData.batch_no}
          onChange={handleChange}
          placeholder="Enter Batch Number"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        {/* Supplier */}
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

        {/* Warehouse */}
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

        {/* Expiry Date */}
        <input
          type="date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500 text-white"
          required
        />

        {/* Quantity */}
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
