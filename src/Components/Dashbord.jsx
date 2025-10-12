import React, { useEffect, useState } from "react";
import { Clock, Truck, CheckCircle, Package, Users } from "lucide-react";

export default function Dashboard() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchDrugs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/drug", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDrugs(data);
        else alert(data.message || "Failed to fetch drugs");
      } catch (err) {
        console.error("Error fetching drugs:", err);
        alert("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };
    fetchDrugs();
  }, []);

  // Transform drugs into activity log
  const recentActivity = drugs
    .map((drug) => {
      const activities = [];
      if (drug.orderedAt)
        activities.push({
          id: `${drug._id}-ordered`,
          action: `Ordered: ${drug.name} (${drug.batch_no})`,
          timestamp: new Date(drug.orderedAt).toLocaleString(),
          status: "info",
          user: drug.supplier_id?.name || "Supplier",
        });
      if (drug.deliveredAt)
        activities.push({
          id: `${drug._id}-delivered`,
          action: `Delivered: ${drug.name} (${drug.batch_no})`,
          timestamp: new Date(drug.deliveredAt).toLocaleString(),
          status: "success",
          user: drug.supplier_id?.name || "Supplier",
        });
      if (drug.lastSentToPharmacy)
        activities.push({
          id: `${drug._id}-pharmacy`,
          action: `Sent to Pharmacy: ${drug.name} (${drug.batch_no}), Qty: ${drug.lastSentToPharmacy.quantity}`,
          timestamp: new Date(drug.lastSentToPharmacy.sentAt).toLocaleString(),
          status: "warning",
          user: `Pharmacy ID: ${drug.lastSentToPharmacy.pharmacyId}`,
        });
      return activities;
    })
    .flat()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const metrics = [
    { label: "Suppliers", value: 156, icon: Users, trend: "+12%" },
    { label: "Total Batches", value: drugs.length, icon: Package, trend: "+8%" },
    {
      label: "Active Shipments",
      value: drugs.filter((d) => d.status === "Delivered").length,
      icon: Truck,
      trend: "+15%",
    },
    { label: "Compliance Score", value: "94%", icon: CheckCircle, trend: "+2%" },
  ];

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Recent Activity */}
        <div className="md:col-span-1 bg-gray-900 p-4 rounded-xl shadow-md max-h-[600px] overflow-y-auto">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Clock className="h-5 w-5" /> Recent Activity
          </h3>

          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-800"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Metrics & Supply Chain */}
        <div className="md:col-span-2 space-y-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm text-gray-400">{metric.label}</h3>
                  <metric.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold mt-2">{metric.value}</div>
                <p className="text-xs text-green-400">{metric.trend} from last month</p>
              </div>
            ))}
          </div>

          {/* Supply Chain Overview */}
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Truck className="h-5 w-5" /> Supply Chain Overview
            </h3>
            <div className="space-y-4">
              {[
                { label: "Manufacturing", value: 94 },
                { label: "Distribution", value: 87 },
                { label: "Retail", value: 91 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="mt-2 text-center">
                <span className="bg-gray-800 text-green-400 px-3 py-1 rounded-full text-sm">
                  Overall Health: Excellent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
