import React, { useState } from "react";
import axios from "axios";

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact_info: "",
    phoneno: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check all fields before submitting
    if (!formData.name || !formData.contact_info || !formData.phoneno || !formData.email) {
      alert("⚠️ All fields are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/supplier/add`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Supplier added successfully!");
      setFormData({ name: "", contact_info: "", phoneno: "", email: "" });
    } catch (err) {
      console.error("Error adding supplier:", err);
      alert(err.response?.data?.message || "Failed to add supplier");
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
          Register <span className="text-blue-400">Supplier</span>
        </h1>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Supplier Name *"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="text"
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
          placeholder="Enter Contact Person *"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="tel"
          name="phoneno"
          value={formData.phoneno}
          onChange={handleChange}
          placeholder="Enter Phone Number *"
          className="w-full p-3 mb-6 bg-[#0d1117] border-b border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email *"
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

export default SupplierForm;
