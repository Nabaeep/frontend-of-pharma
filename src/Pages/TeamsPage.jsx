export default function TeamsPage({ teams }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>

      <div className="grid grid-cols-2 gap-6">
        {teams.map(team => (
          <div key={team.id}
            className="bg-zinc-900 rounded-xl p-6">

            <h2 className="text-xl font-bold text-red-500">
              {team.name}
            </h2>

            <p className="text-gray-400 mb-4">
              Points Left: {team.points}
            </p>

            {team.squad.length === 0 ? (
              <p className="text-gray-500">No players</p>
            ) : (
              team.squad.map(p => (
                <div
                  key={p.id}
                  className="bg-zinc-800 p-2 rounded mb-2"
                >
                  {p.name}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
