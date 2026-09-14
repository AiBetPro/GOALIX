'use client';

import { useMemo, useState } from 'react';

type Selection = {
  id: string;
  match: string;
  league: string;
  choice: string;
  odds: number;
};

const availableSelections: Selection[] = [
  {
    id: 'arsenal-chelsea-1',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    choice: 'Arsenal gagne',
    odds: 1.65,
  },
  {
    id: 'barca-sevilla-1',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    choice: 'Barcelona gagne',
    odds: 1.42,
  },
  {
    id: 'inter-milan-1',
    match: 'Inter vs Milan',
    league: 'Serie A',
    choice: 'Inter gagne',
    odds: 1.75,
  },
];

export default function BetsPage() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState('');

  const totalOdds = useMemo(() => {
    if (selections.length === 0) return 0;

    return selections.reduce(
      (total, selection) => total * selection.odds,
      1
    );
  }, [selections]);

  const potentialWin = useMemo(() => {
    const amount = Number(stake);

    if (!amount || totalOdds === 0) return 0;

    return amount * totalOdds;
  }, [stake, totalOdds]);

  function addSelection(selection: Selection) {
    setSelections((current) => {
      if (current.some((item) => item.id === selection.id)) {
        return current;
      }

      return [...current, selection];
    });
  }

  function removeSelection(id: string) {
    setSelections((current) =>
      current.filter((selection) => selection.id !== id)
    );
  }

  function clearCoupon() {
    setSelections([]);
    setStake('');
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <section className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-emerald-600">
            🎟️ GOALIX
          </p>

          <h1 className="text-4xl font-bold text-slate-950">
            Mon coupon
          </h1>

          <p className="mt-2 text-slate-500">
            Sélectionnez vos paris et préparez votre coupon.
          </p>
        </div>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">
              Ajouter des sélections
            </h2>

            {selections.length > 0 && (
              <button
                onClick={clearCoupon}
                className="text-sm font-semibold text-red-500"
              >
                Tout effacer
              </button>
            )}
          </div>

          <div className="space-y-3">
            {availableSelections.map((selection) => {
              const selected = selections.some(
                (item) => item.id === selection.id
              );

              return (
                <button
                  key={selection.id}
                  onClick={() => addSelection(selection)}
                  disabled={selected}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">
                        {selection.league}
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {selection.match}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {selection.choice}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white px-4 py-3 text-lg font-bold text-emerald-600 shadow-sm">
                      {selection.odds.toFixed(2)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              🎟️ Votre coupon
            </h2>

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
              {selections.length} pari
              {selections.length > 1 ? 's' : ''}
            </span>
          </div>

          {selections.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-slate-300">
                Votre coupon est vide.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Ajoutez une ou plusieurs sélections ci-dessus.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {selections.map((selection) => (
                  <div
                    key={selection.id}
                    className="flex items-center justify-between rounded-2xl bg-white/10 p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {selection.match}
                      </p>

                      <p className="text-sm text-slate-300">
                        {selection.choice}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-300">
                        {selection.odds.toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeSelection(selection.id)}
                        className="rounded-lg bg-red-500/20 px-2 py-1 text-sm text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-400">
                    Cote totale
                  </p>

                  <p className="mt-1 text-2xl font-bold text-emerald-300">
                    {totalOdds.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-400">
                    Mise
                  </p>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stake}
                    onChange={(event) =>
                      setStake(event.target.value)
                    }
                    className="mt-1 w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-emerald-500 p-5">
                <p className="text-sm font-medium text-emerald-950">
                  Gain potentiel
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {potentialWin.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() =>
                  alert(
                    'Mode démonstration : le pari n’est pas encore réel.'
                  )
                }
                className="mt-5 w-full rounded-2xl bg-white py-4 text-lg font-bold text-slate-950"
              >
                Valider le coupon
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Mode démonstration — aucun argent réel n'est engagé.
              </p>
            </>
          )}
        </section>
      </section>
    </main>
  );
    }
