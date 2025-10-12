import React, { useState } from "react";
import { Package, Truck, BarChart3 } from "lucide-react";
import Dashbord from "../Components/Dashbord";
import heroImage from "../assets/medicine.jpg";
import Inventory from "../Components/Inventory";
import SupplyChain from "../Components/SupplyChain";
const Home = () => {
  const [currRole, setCurrRole] = useState("admin");
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Define all tabs
  const tabs = [
    { value: "Dashboard", label: "Dashboard", icon: BarChart3 },
    { value: "Inventory", label: "Inventory", icon: Package },
    { value: "Supplychain", label: "Supply Chain", icon: Truck },
  ];

  // Render tab content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <div><Dashbord/></div>;
      case "Inventory":
        return <div><Inventory/></div>;
      case "Supplychain":
        return <div><SupplyChain/></div>;
      default:
        return null;
    }
  };

  return (
    <div className="6 bg-gray-950 min-h-screen text-white">
         <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Pharmaceutical Supply Chain" 
          className="w-full h-full object-cover"
        />
        </div>
      
      <div className="container mx-auto p-6 space-y-6 ">
        {/* Tab Buttons */}
        <div className="w-full h-15 bg-[#1C2531] border-none rounded-xl flex justify-around items-center px-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center  justify-center gap-2 px-30 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  activeTab === tab.value
                    ? "bg-gray-950 text-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;
