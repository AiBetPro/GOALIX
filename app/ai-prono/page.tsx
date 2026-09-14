'use client';

import { useMemo, useState } from 'react';

type RiskProfile = 'prudent' | 'equilibre' | 'audacieux';

type Match = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  odds: number;
  score: number;
  probability: number;
  risk: RiskProfile;
  reason: string;
};

const matches: Match[] = [
  {
    id: 'arsenal-chelsea',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    selection: 'Arsenal gagne',
    odds: 1.65,
    score: 82,
    probability: 61,
    risk: 'prudent',
    reason:
      'La cote disponible favorise Arsenal. Cette sélection présente un profil relativement prudent dans notre démonstration.',
  },
  {
    id: 'barcelona-sevilla',
    league: 'La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Sevilla',
    selection: 'Barcelona gagne',
    odds: 1.42,
    score: 91,
    probability: 70,
    risk: 'prudent',
    reason:
      'Barcelona possède ici la cote la plus basse. Le modèle de démonstration classe cette sélection parmi les options prudentes.',
  },
  {
    id: 'inter-milan',
    league: 'Serie A',
    homeTeam: 'Inter',
    awayTeam: 'Milan',
    selection: 'Inter gagne',
    odds: 1.75,
    score: 76,
    probability: 57,
    risk: 'equilibre',
    reason:
      'La cote offre un compromis entre niveau de risque et gain potentiel.',
  },
];

const riskLabels: Record<RiskProfile, string> = {
  prudent: '🟢 Prudent',
  equilibre: '🟡 Équilibré',
  audacieux: '🔴 Audacieux',
};

export default function AIPronoPage() {
  const [risk, setRisk] = useState<RiskProfile>('prudent');
  const [selected, setSelected] = useState<Match[]>([]);
  const [generated, setGenerated] = useState(false);

  const filteredMatches = useMemo(() => {
    if (risk === 'prudent') {
      return matches.filter((match) => match.risk === 'prudent');
    }

    if (risk === 'equilibre') {
      return matches.filter(
        (match) =>
          match.risk === 'prudent' ||
          match.risk === 'equilibre'
      );
    }

    return matches;
  }, [risk]);

  const totalOdds = useMemo(() => {
    if (selected.length === 0) return 0;

    return selected.reduce(
      (total, match) => total * match.odds,
      1
    );
  }, [selected]);

  function toggleSelection(match: Match) {
    setSelected((current) => {
      const exists = current.some((item) => item.id === match.id);

      if (exists) {
        return current.filter((item) => item.id !== match.id);
      }

      return [...current, match];
    });
  }

  function generateCoupon() {
    const recommended = [...filteredMatches]
      .sort((a, b) => b.score - a.score)
      .slice(0, risk === 'prudent' ? 2 : 3);

    setSelected(recommended);
    setGenerated(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-7">

        <header className="mb-7">
          <div className="mb-2 text-sm font-bold text-emerald-600">
            🤖 GOALIX AI
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            IA Prono
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Analysez les matchs disponibles et construisez un
            coupon à partir des recommandations de GOALIX AI.
          </p>
        </header>

        <section className="mb-6 rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
          <p className="text-sm font-semibold text-emerald-300">
            VOTRE PROFIL DE RISQUE
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Comment souhaitez-vous jouer ?
          </h2>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {(
              ['prudent', 'equilibre', 'audacieux'] as RiskProfile[]
            ).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setRisk(item);
                  setGenerated(false);
                }}
                className={`rounded-2xl px-3 py-4 text-sm font-bold transition ${
                  risk === item
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {riskLabels[item]}
              </button>
            ))}
          </div>

          <button
            onClick={generateCoupon}
            className="mt-5 w-full rounded-2xl bg-white py-4 font-bold text-slate-950 transition hover:bg-slate-100"
          >
            🤖 Générer mon coupon IA
          </button>
        </section>

        {generated && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-800">
              ✅ Coupon IA généré
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Les sélections les mieux classées selon le profil
              choisi ont été ajoutées.
            </p>
          </div>
        )}

        <section className="mb-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-600">
                ANALYSE
              </p>

              <h2 className="text-2xl font-bold text-slate-950">
                Matchs recommandés
              </h2>
            </div>

            <span className="text-sm text-slate-500">
              {filteredMatches.length} match
              {filteredMatches.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {filteredMatches.map((match) => {
              const isSelected = selected.some(
                (item) => item.id === match.id
              );

              return (
                <article
                  key={match.id}
                  className={`rounded-3xl bg-white p-5 shadow-sm ring-1 transition ${
                    isSelected
                      ? 'ring-emerald-400'
                      : 'ring-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        {match.league}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-950">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>

                      <p className="mt-2 font-semibold text-emerald-600">
                        {match.selection}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center">
                      <p className="text-xs text-slate-500">
                        Cote
                      </p>

                      <p className="font-extrabold text-emerald-700">
                        {match.odds.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Score IA
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-950">
                        {match.score}/100
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Probabilité indicative
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-950">
                        {match.probability}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      POURQUOI ?
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {match.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleSelection(match)}
                    className={`mt-4 w-full rounded-2xl py-3 font-bold transition ${
                      isSelected
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isSelected
                      ? '✓ Retirer du coupon'
                      : '+ Ajouter au coupon'}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              🎟️ Coupon IA
            </h2>

            <span className="text-sm text-slate-400">
              {selected.length} sélection
              {selected.length > 1 ? 's' : ''}
            </span>
          </div>

          {selected.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-white/10 p-5 text-center text-sm text-slate-400">
              Aucun pari sélectionné.
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-2">
                {selected.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between rounded-2xl bg-white/10 p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>

                      <p className="text-sm text-slate-400">
                        {match.selection}
                      </p>
                    </div>

                    <strong className="text-emerald-300">
                      {match.odds.toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-slate-400">
                  Cote totale
                </span>

                <strong className="text-2xl text-emerald-300">
                  {totalOdds.toFixed(2)}
                </strong>
              </div>
            </>
          )}

          <a
            href="/bets"
            className="mt-5 block w-full rounded-2xl bg-white py-4 text-center font-bold text-slate-950"
          >
            🎟️ Ouvrir mon coupon
          </a>
        </section>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          ⚠️ Les analyses et probabilités affichées sont
          indicatives et ne garantissent aucun résultat. Les
          paris sportifs comportent un risque de perte.
        </div>
      </div>
    </main>
  );
    }
