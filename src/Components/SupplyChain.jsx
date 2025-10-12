import React, { useEffect, useState } from "react";
import axios from "axios";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-gray-500 text-white";
    case "Ordered":
      return "bg-blue-400 text-white";
    case "Shipped":
      return "bg-purple-500 text-white";
    case "Delivered":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const SupplyChain = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${backendUrl}/api/drug`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert(err.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDelivered = async (id) => {
    const confirmAction = window.confirm("Mark this drug as delivered?");
    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backendUrl}/api/drug/${id}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Drug marked as delivered!");
      fetchOrders(); // Refresh table
    } catch (err) {
      console.error("Error delivering drug:", err);
      alert(err.response?.data?.message || "Error connecting to server");
    }
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading orders...</p>;

  return (
    <div className="p-4 border border-gray-700 rounded-lg">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Supply Chain Orders
      </h2>
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="px-4 py-2">Drug Name</th>
            <th className="px-4 py-2">Batch ID</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Warehouse</th>
            <th className="px-4 py-2">Ordered At</th>
            <th className="px-4 py-2">Delivered At</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="px-4 py-2">{order.name}</td>
              <td className="px-4 py-2">{order.batch_no}</td>
              <td className="px-4 py-2">{order.quantity.toLocaleString()}</td>
              <td className="px-4 py-2">{order.supplier_id?.name || "N/A"}</td>
              <td className="px-4 py-2">{order.warehouse_location || "N/A"}</td>
              <td className="px-4 py-2">
                {new Date(order.orderedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString()
                  : "Not Delivered"}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-2">
                {order.status !== "Delivered" && (
                  <button
                    className="bg-green-600 px-3 py-1 rounded-md text-white hover:bg-green-700"
                    onClick={() => markAsDelivered(order._id)}
                  >
                    Deliver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyChain;
