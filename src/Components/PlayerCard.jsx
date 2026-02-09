export default function PlayerCard({ player, currentBid }) {
  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>
      <h2>{player.name}</h2>
      <p>Base Price: {player.basePrice}</p>
      <h3>Current Bid: {currentBid}</h3>
    </div>
  );
}
