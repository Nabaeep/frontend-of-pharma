import React, { useEffect, useState } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "IN STOCK":
      return "bg-blue-600 text-white";
    case "LOW STOCK":
      return "bg-gray-700 text-yellow-400";
    case "EXPIRED":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusText = (quantity, expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < now || quantity === 0) return "EXPIRED";
  if (quantity < 200) return "LOW STOCK";
  return "IN STOCK";
};

const demoPharmacies = [
  { _id: "pharmacy1", name: "City Pharmacy" },
  { _id: "pharmacy2", name: "HealthCare Plus" },
  { _id: "pharmacy3", name: "Medico Pharmacy" },
];

const DrugTable = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [sendQty, setSendQty] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch drugs (demo here, or use real API)
useEffect(() => {
  const fetchDrugs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/drug", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        // ✅ Filter only delivered items
        const deliveredDrugs = data.filter((drug) => drug.status === "Delivered");
        setDrugs(deliveredDrugs);
      } else {
        alert(data.message || "Failed to fetch drugs");
      }
    } catch (err) {
      console.error("Error fetching drugs:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  fetchDrugs();
}, []);


  const handleEditClick = (drug) => {
    setSelectedDrug(drug);
    setSendQty("");
    setSelectedPharmacy("");
    setShowModal(true);
  };

  const handleSendToPharmacy = async () => {
    const qty = parseInt(sendQty);
    if (!qty || !selectedPharmacy) {
      alert("Enter quantity and select pharmacy");
      return;
    }
    if (qty > selectedDrug.quantity) {
      alert("Cannot send more than available quantity");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/drug/send", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          drugId: selectedDrug._id,
          quantity: qty,
          pharmacyId: selectedPharmacy,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Sent to ${demoPharmacies.find(p => p._id === selectedPharmacy)?.name}`);
        setDrugs((prev) =>
          prev.map((d) =>
            d._id === selectedDrug._id
              ? { ...d, quantity: d.quantity - qty }
              : d
          )
        );
        setShowModal(false);
      } else {
        alert(data.message || "Failed to send drug");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (drugs.length === 0) return <p className="text-white text-center mt-10">No drugs found</p>;

  return (
    <div className="p-4 border border-gray-700 rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Batch</th>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Expiry</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Warehouse</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug) => {
            const status = getStatusText(drug.quantity, drug.expiry_date);
            return (
              <tr key={drug._id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-4 py-2">{drug.name}</td>
                <td className="px-4 py-2">{drug.batch_no}</td>
                <td className="px-4 py-2">{drug.supplier_id?.name || "N/A"}</td>
                <td className="px-4 py-2">{drug.quantity}</td>
                <td className="px-4 py-2">{new Date(drug.expiry_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </td>
                <td className="px-4 py-2">{drug.warehouse_location}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditClick(drug)}
                    className="bg-gray-700 px-3 py-1 rounded-md text-white hover:bg-gray-600"
                  >
                    Send to Pharmacy
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold text-white mb-4">
              Send {selectedDrug?.name} to Pharmacy
            </h2>

            <label className="block text-gray-300 mb-2">Select Pharmacy:</label>
            <select
              value={selectedPharmacy}
              onChange={(e) => setSelectedPharmacy(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            >
              <option value="">-- Select Pharmacy --</option>
              {demoPharmacies.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <label className="block text-gray-300 mb-2">Quantity:</label>
            <input
              type="number"
              value={sendQty}
              onChange={(e) => setSendQty(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              placeholder="Enter quantity to send"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-3 py-1 rounded text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSendToPharmacy}
                className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugTable;
