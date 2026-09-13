'use client';

import { useEffect, useState } from 'react';

interface Bet {
  id: number;
  amount: number;
  odds: number;
  status: string;
  createdAt: string;
}

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBets() {
      try {
        const response = await fetch('/api/bets');
        const data = await response.json();
        setBets(data);
      } catch (error) {
        console.error('Error fetching bets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBets();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Bets</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {bets.length === 0 ? (
            <p className="text-gray-600">No bets yet</p>
          ) : (
            bets.map((bet) => (
              <div key={bet.id} className="border rounded p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">${bet.amount}</p>
                    <p className="text-gray-600">Odds: {bet.odds}</p>
                  </div>
                  <span className={`px-3 py-1 rounded ${bet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : bet.status === 'won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {bet.status}
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
