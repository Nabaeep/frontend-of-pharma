import { useState } from "react";
import { playersData } from "../data/data";

export default function AuctionPage({ teams, setTeams }) {

  const soldPlayerIds = teams.flatMap(t =>
    t.squad.map(p => p.id)
  );

  const availablePlayers = playersData.filter(
    p => !soldPlayerIds.includes(p.id)
  );

  const [playerIndex, setPlayerIndex] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);

  const player = availablePlayers[playerIndex];

  const [currentBid, setCurrentBid] = useState(
    player ? player.basePrice : 0
  );

  if (!player) {
    return (
      <div className="p-10 text-center text-3xl">
        Auction Finished ✅
      </div>
    );
  }


  const placeBid = (teamId) => {
    const team = teams.find(t => t.id === teamId);

    if (team.points >= currentBid + 100) {
      setCurrentBid(prev => prev + 100);
      setHighestBidder(teamId);
    }
  };

  const finalizePlayer = () => {
    if (!highestBidder) return;

    const updatedTeams = teams.map(team => {
      if (team.id === highestBidder) {
        return {
          ...team,
          points: team.points - currentBid,
          squad: [...team.squad, player]
        };
      }
      return team;
    });

    setTeams(updatedTeams);

    setHighestBidder(null);
    setCurrentBid(
      availablePlayers[playerIndex + 1]?.basePrice || 0
    );
    setPlayerIndex(prev => prev + 1);
  };

  return (
    <div className="p-8">

       {/* PLAYER SECTION */}
        <div className="bg-[rgba(0,0,59,0.47)] rounded-2xl p-10">

          <div className="grid grid-cols-3 gap-10 items-center">

            <div className="flex justify-center">
              <img
                src={`/src/assets/player/${player.id}.jpeg`}
                alt={player.name}
                className="h-[500px] object-contain border rounded-2xl"
              />
            </div>

            <div className="ml-20">
              <h2 className="text-4xl font-bold text-red-500">
                {player.name}
              </h2>

              <p className="mt-4">Base Price: {player.basePrice}</p>

              <div className="mt-6">
                <p>Current Bid</p>
                <h3 className="text-5xl font-bold text-green-400">
                  {currentBid}
                </h3>
              </div>

              <button
                onClick={finalizePlayer}
                disabled={!highestBidder}
                className="mt-6 bg-red-600 px-6 py-3 rounded-xl disabled:opacity-50"
              >
                Finalize Player (SOLD)
              </button>
            </div>
          </div>
        </div>


      {/* TEAMS */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        {teams.map(team => (
          <button
            key={team.id}
            onClick={() => placeBid(team.id)}
            className={`p-5 rounded-xl ${
              highestBidder === team.id
                ? "bg-green-600"
                : "bg-zinc-800"
            }`}
          >
            <h3>{team.name}</h3>
            <p>Points: {team.points}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
