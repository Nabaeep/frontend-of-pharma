export default function TeamCard({ team, onBid, isHighest }) {
  return (
    <button
      onClick={() => onBid(team.id)}
      style={{
        padding: "10px",
        background: isHighest ? "green" : "#ddd",
        margin: "5px"
      }}
    >
      {team.name} ({team.points})
    </button>
  );
}
