import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">GOALIX</h1>
        <p className="text-xl text-gray-300 mb-8">Sports Betting & AI Predictions Platform</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </Link>
          <Link href="/live" className="bg-green-600 hover:bg-green-700 p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold">Live Matches</h2>
          </Link>
          <Link href="/ai-prono" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold">AI Predictions</h2>
          </Link>
          <Link href="/bets" className="bg-red-600 hover:bg-red-700 p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold">My Bets</h2>
          </Link>
        </div>
      </div>
    </main>
  );
}
