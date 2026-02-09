import TeamCard from "./TeamCard";

export default function BidPanel({ teams, onBid, highestBidder }) {
  return (
    <div>
      {teams.map(team => (
        <TeamCard
          key={team.id}
          team={team}
          onBid={onBid}
          isHighest={highestBidder === team.id}
        />
      ))}
    </div>
  );
}
