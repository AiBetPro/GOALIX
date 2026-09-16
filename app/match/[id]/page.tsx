'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

type Market = {
  id: string;
  name: string;
  selections: {
    id: string;
    label: string;
    odds: number;
  }[];
};

const markets: Market[] = [
  {
    id: 'result',
    name: 'Résultat du match',
    selections: [
      { id: 'home', label: 'Arsenal', odds: 1.65 },
      { id: 'draw', label: 'Match nul', odds: 3.70 },
      { id: 'away', label: 'Chelsea', odds: 4.90 },
    ],
  },
  {
    id: 'double-chance',
    name: 'Double chance',
    selections: [
      { id: '1x', label: '1X', odds: 1.20 },
      { id: 'x2', label: 'X2', odds: 1.85 },
      { id: '12', label: '12', odds: 1.30 },
    ],
  },
  {
    id: 'total-goals',
    name: 'Total buts',
    selections: [
      { id: 'over-15', label: 'Plus de 1,5', odds: 1.35 },
      { id: 'under-15', label: 'Moins de 1,5', odds: 2.80 },
      { id: 'over-25', label: 'Plus de 2,5', odds: 1.70 },
      { id: 'under-25', label: 'Moins de 2,5', odds: 2.10 },
      { id: 'over-35', label: 'Plus de 3,5', odds: 2.40 },
      { id: 'under-35', label: 'Moins de 3,5', odds: 1.50 },
    ],
  },
  {
    id: 'btts',
    name: 'Les deux équipes marquent',
    selections: [
      { id: 'btts-yes', label: 'Oui', odds: 1.62 },
      { id: 'btts-no', label: 'Non', odds: 2.15 },
    ],
  },
  {
    id: 'team-goals',
    name: 'Buts équipe',
    selections: [
      {
        id: 'arsenal-over-05',
        label: 'Arsenal +0,5',
        odds: 1.25,
      },
      {
        id: 'arsenal-over-15',
        label: 'Arsenal +1,5',
        odds: 1.75,
      },
      {
        id: 'chelsea-over-05',
        label: 'Chelsea +0,5',
        odds: 1.55,
      },
      {
        id: 'chelsea-over-15',
        label: 'Chelsea +1,5',
        odds: 2.30,
      },
    ],
  },
  {
    id: 'correct-score',
    name: 'Score exact',
    selections: [
      { id: 'score-10', label: '1 - 0', odds: 7.00 },
      { id: 'score-11', label: '1 - 1', odds: 6.50 },
      { id: 'score-20', label: '2 - 0', odds: 7.50 },
      { id: 'score-21', label: '2 - 1', odds: 8.00 },
      { id: 'score-22', label: '2 - 2', odds: 12.00 },
      { id: 'score-01', label: '0 - 1', odds: 10.00 },
    ],
  },
];

export default function MatchPage() {
  const params = useParams();
  const id = params?.id;

  const [added, setAdded] = useState<string | null>(null);

  function addToCoupon(
    marketName: string,
    selectionLabel: string,
    odds: number
  ) {
    const selection = {
      id: `${id}-${marketName}-${selectionLabel}`,
      match: 'Arsenal vs Chelsea',
      league: 'Premier League',
      market: marketName,
      choice: selectionLabel,
      odds,
    };

    try {
      const saved =
        localStorage.getItem('goalix_selections');

      const current = saved
        ? JSON.parse(saved)
        : [];

      const exists = current.some(
        (item: any) => item.id === selection.id
      );

      if (!exists) {
        localStorage.setItem(
          'goalix_selections',
          JSON.stringify([
            ...current,
            selection,
          ])
        );
      }

      setAdded(selectionLabel);

      setTimeout(() => {
        setAdded(null);
      }, 1500);
    } catch (error) {
      console.error(
        'Erreur ajout coupon:',
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">

      {/* HEADER */}

      <header className="bg-slate-950 px-4 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">

          <div className="flex items-center justify-between">
            <a
              href="/dashboard"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold"
            >
              ← Retour
            </a>

            <a
              href="/bets"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold"
            >
              🎟️ Coupon
            </a>
          </div>

          <div className="mt-8 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Premier League
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Arsenal
            </h1>

            <p className="my-2 text-sm font-bold text-slate-400">
              VS
            </p>

            <h2 className="text-3xl font-black">
              Chelsea
            </h2>

            <p className="mt-4 text-sm text-slate-400">
              Match de démonstration
            </p>

          </div>
        </div>
      </header>

      {/* CONTENU */}

      <div className="mx-auto max-w-4xl px-4 py-6">

        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          ⚠️ Les cotes affichées sont actuellement
          des données de démonstration. Les vraies
          cotes seront connectées aux données
          Sportmonks ensuite.
        </div>

        {/* MARCHÉS */}

        <div className="space-y-5">

          {markets.map((market) => (
            <section
              key={market.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
            >

              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-lg font-black text-slate-950">
                  {market.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">

                {market.selections.map(
                  (selection) => (
                    <button
                      key={selection.id}
                      type="button"
                      onClick={() =>
                        addToCoupon(
                          market.name,
                          selection.label,
                          selection.odds
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
                        added === selection.label
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                      }`}
                    >

                      <p className="text-sm font-bold text-slate-600">
                        {selection.label}
                      </p>

                      <p className="mt-2 text-xl font-black text-emerald-600">
                        {selection.odds.toFixed(2)}
                      </p>

                      {added ===
                        selection.label && (
                        <p className="mt-1 text-xs font-bold text-emerald-600">
                          ✓ Ajouté
                        </p>
                      )}

                    </button>
                  )
                )}

              </div>

            </section>
          ))}

        </div>

        {/* BOUTON COUPON */}

        <div className="sticky bottom-4 mt-8">
          <a
            href="/bets"
            className="block w-full rounded-2xl bg-emerald-600 px-5 py-4 text-center text-lg font-black text-white shadow-xl"
          >
            🎟️ Voir mon coupon
            {added ? ' ✓' : ''}
          </a>
        </div>

      </div>
    </main>
  );
  }
