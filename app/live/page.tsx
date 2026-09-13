'use client';

import { useEffect, useState } from 'react';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  status: string;
  startTime: string;
}

export default function LivePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch('/api/matches');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
    const interval = setInterval(fetchMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Live Matches</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {matches.length === 0 ? (
            <p className="text-gray-600">No live matches</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="border rounded p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{match.homeTeam} vs {match.awayTeam}</p>
                    <p className="text-gray-600">{new Date(match.startTime).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded ${match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : match.status === 'live' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {match.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
