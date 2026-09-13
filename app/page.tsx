'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">GOALIX</h1>
        <p className="text-xl text-gray-600 mb-8">Sports Betting Platform</p>
        <div className="space-x-4">
          <Link href="/bets" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            View Bets
          </Link>
          <Link href="/live" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Live Matches
          </Link>
        </div>
      </div>
    </main>
  );
}
