import React, { useState } from "react";
import { regularPlayers } from "../data/data";

const LotteryPage = ({ teams, setTeams }) => {
  const [lotteryDone, setLotteryDone] = useState(false);

  const runLottery = () => {
    // 1. Fixed players for Captain C
    const captainCFixedNames = ["Nabadeep Dutta", "Rahul Saikia", "Bishal Ranjan Nath"];
    const captainCFixed = regularPlayers.filter(p => captainCFixedNames.includes(p.name));

    // 2. Other players (excluding the fixed ones)
    let otherPlayers = regularPlayers.filter(p => !captainCFixedNames.includes(p.name));

    // 3. Shuffle remaining players
    otherPlayers = otherPlayers.sort(() => 0.5 - Math.random());

    // 4. Reset squads
    const newTeams = teams.map(team => ({ ...team, squad: [] }));

    // 5. Assign fixed + 2 random players to Captain C
    const captainCIndex = newTeams.findIndex(team => team.name === "Captain C");
    const captainCRandom = otherPlayers.splice(0, 2); // take first 2 random players
    newTeams[captainCIndex].squad.push(...captainCFixed, ...captainCRandom);

    // 6. Assign remaining players to other teams in round-robin
    let teamIndex = 0;
    otherPlayers.forEach(player => {
      // Skip Captain C
      if (teamIndex === captainCIndex) teamIndex = (teamIndex + 1) % newTeams.length;

      newTeams[teamIndex].squad.push(player);
      teamIndex = (teamIndex + 1) % newTeams.length;
    });

    // 7. Limit each team to 5 players
    newTeams.forEach(team => {
      if (team.squad.length > 5) {
        team.squad = team.squad.slice(0, 5);
      }
    });

    setTeams(newTeams);
    setLotteryDone(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Player Lottery</h1>
      <button
        onClick={runLottery}
        className="px-4 py-2 bg-green-600 rounded mb-6"
      >
        Run Lottery
      </button>

      {lotteryDone &&
        teams.map(team => (
          <div key={team.id} className="mb-4 p-4 bg-zinc-800 rounded">
            <h2 className="text-xl mb-2">{team.name} Squad (Lottery Players):</h2>
            <ul className="list-disc list-inside">
              {team.squad.map(player => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default LotteryPage;
