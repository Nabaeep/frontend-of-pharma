import { useState, useEffect } from "react";
import "./index.css";

import AuctionPage from "./pages/AuctionPage";
import TeamsPage from "./Pages/TeamsPage";
import LotteryPage from "./Pages/LotteryPage"; // <-- new
import { teamsData } from "./data/data";

function App() {

  // LOAD FROM LOCAL STORAGE
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("teams");
    return saved ? JSON.parse(saved) : teamsData;
  });

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const [page, setPage] = useState("auction");

  return (
    <div className="min-h-screen bg-[#2b2928] text-white">

      {/* TOP NAV */}
      <div className="flex gap-4 p-4 bg-zinc-900">
        <button
          onClick={() => setPage("auction")}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Auction
        </button>

        <button
          onClick={() => setPage("teams")}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Teams
        </button>

        <button
          onClick={() => setPage("lottery")}
          className="px-4 py-2 bg-green-600 rounded"
        >
          Lottery
        </button>
      </div>

      {/* PAGE CONTENT */}
      {page === "auction" && (
        <AuctionPage teams={teams} setTeams={setTeams} />
      )}

      {page === "teams" && (
        <TeamsPage teams={teams} />
      )}

      {page === "lottery" && (
        <LotteryPage teams={teams} setTeams={setTeams} />
      )}
    </div>
  );
}

export default App;
