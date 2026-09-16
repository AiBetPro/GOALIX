'use client';

import { useEffect, useMemo, useState } from 'react';

type Selection = {
  id: string;
  match: string;
  league: string;
  market: string;
  choice: string;
  odds: number;
};

const markets: Selection[] = [
  {
    id: 'arsenal-1',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Résultat',
    choice: 'Arsenal gagne',
    odds: 1.65,
  },
  {
    id: 'arsenal-x',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Résultat',
    choice: 'Match nul',
    odds: 3.70,
  },
  {
    id: 'arsenal-2',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Résultat',
    choice: 'Chelsea gagne',
    odds: 4.90,
  },
  {
    id: 'arsenal-1x',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Double chance',
    choice: '1X',
    odds: 1.20,
  },
  {
    id: 'arsenal-x2',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Double chance',
    choice: 'X2',
    odds: 1.85,
  },
  {
    id: 'arsenal-12',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Double chance',
    choice: '12',
    odds: 1.30,
  },
  {
    id: 'over15',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Plus de 1,5',
    odds: 1.35,
  },
  {
    id: 'under15',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Moins de 1,5',
    odds: 2.80,
  },
  {
    id: 'over25',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Plus de 2,5',
    odds: 1.70,
  },
  {
    id: 'under25',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Moins de 2,5',
    odds: 2.10,
  },
  {
    id: 'over35',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Plus de 3,5',
    odds: 2.40,
  },
  {
    id: 'under35',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Moins de 3,5',
    odds: 1.50,
  },
  {
    id: 'btts-yes',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Les deux équipes marquent',
    choice: 'Oui',
    odds: 1.62,
  },
  {
    id: 'btts-no',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Les deux équipes marquent',
    choice: 'Non',
    odds: 2.15,
  },
  {
    id: 'score-10',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '1 - 0',
    odds: 7.00,
  },
  {
    id: 'score-11',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '1 - 1',
    odds: 6.50,
  },
  {
    id: 'score-20',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '2 - 0',
    odds: 7.50,
  },
  {
    id: 'score-21',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '2 - 1',
    odds: 8.00,
  },
  {
    id: 'barca',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    market: 'Résultat',
    choice: 'Barcelona gagne',
    odds: 1.42,
  },
  {
    id: 'barca-over',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    market: 'Total buts',
    choice: 'Plus de 2,5',
    odds: 1.55,
  },
  {
    id: 'inter',
    match: 'Inter vs Milan',
    league: 'Serie A',
    market: 'Résultat',
    choice: 'Inter gagne',
    odds: 1.75,
  },
];

function generateCode() {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let result = 'GX-';

  for (let i = 0; i < 6; i++) {
    const position = Math.floor(
      Math.random() * chars.length
    );

    result += chars[position];
  }

  return result;
}

export default function BetsPage() {
  const [selections, setSelections] =
    useState<Selection[]>([]);

  const [stake, setStake] = useState('');

  const [couponCode, setCouponCode] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  const [validated, setValidated] =
    useState(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          'goalix_selections'
        );

      const savedStake =
        localStorage.getItem(
          'goalix_stake'
        );

      const savedCode =
        localStorage.getItem(
          'goalix_coupon_code'
        );

      if (saved) {
        setSelections(JSON.parse(saved));
      }

      if (savedStake) {
        setStake(savedStake);
      }

      if (savedCode) {
        setCouponCode(savedCode);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'goalix_selections',
        JSON.stringify(selections)
      );

      localStorage.setItem(
        'goalix_stake',
        stake
      );

      if (couponCode) {
        localStorage.setItem(
          'goalix_coupon_code',
          couponCode
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [selections, stake, couponCode]);

  const totalOdds = useMemo(() => {
    if (selections.length === 0) {
      return 0;
    }

    return selections.reduce(
      (total, item) =>
        total * item.odds,
      1
    );
  }, [selections]);

  const potentialWin = useMemo(() => {
    const value = Number(stake);

    if (!value || totalOdds === 0) {
      return 0;
    }

    return value * totalOdds;
  }, [stake, totalOdds]);

  function addSelection(
    selection: Selection
  ) {
    setSelections((current) => {
      const exists = current.some(
        (item) =>
          item.id === selection.id
      );

      if (exists) {
        return current;
      }

      return [...current, selection];
    });

    if (!couponCode) {
      setCouponCode(generateCode());
    }

    setValidated(false);
  }

  function removeSelection(id: string) {
    setSelections((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    setValidated(false);
  }

  function clearCoupon() {
    setSelections([]);
    setStake('');
    setCouponCode('');
    setCopied(false);
    setValidated(false);

    localStorage.removeItem(
      'goalix_selections'
    );

    localStorage.removeItem(
      'goalix_stake'
    );

    localStorage.removeItem(
      'goalix_coupon_code'
    );
  }

  async function copyCode() {
    if (!couponCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        couponCode
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  async function shareCoupon() {
    if (!couponCode) {
      return;
    }

    const text =
      '🎟️ Coupon GOALIX\n\n' +
      'Code : ' +
      couponCode +
      '\n' +
      'Paris : ' +
      selections.length +
      '\n' +
      'Cote totale : ' +
      totalOdds.toFixed(2) +
      '\n\n' +
      'Coupon GOALIX - démonstration';

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Coupon GOALIX',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(
          text
        );

        alert(
          'Coupon copié. Vous pouvez le partager.'
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  function validateCoupon() {
    if (selections.length === 0) {
      alert(
        'Ajoutez au moins une sélection.'
      );
      return;
    }

    if (
      !stake ||
      Number(stake) <= 0
    ) {
      alert(
        'Veuillez entrer une mise.'
      );
      return;
    }

    setValidated(true);

    alert(
      'Coupon ' +
        couponCode +
        ' enregistré en mode démonstration.'
    );
  }

  const marketNames = [
    'Résultat',
    'Double chance',
    'Total buts',
    'Les deux équipes marquent',
    'Score exact',
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-8">

        <header className="mb-8">
          <p className="text-sm font-bold tracking-widest text-emerald-600">
            GOALIX
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Mon coupon
          </h1>

          <p className="mt-2 text-slate-500">
            Choisissez vos marchés et préparez
            votre coupon.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-black text-slate-950">
            Marchés disponibles
          </h2>

          <div className="space-y-5">
            {marketNames.map(
              (marketName) => (
                <div
                  key={marketName}
                  className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <h3 className="mb-4 text-lg font-black text-slate-950">
                    {marketName}
                  </h3>

                  <div className="space-y-3">
                    {markets
                      .filter(
                        (item) =>
                          item.market ===
                          marketName
                      )
                      .map(
                        (item) => {
                          const selected =
                            selections.some(
                              (selection) =>
                                selection.id ===
                                item.id
                            );

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                addSelection(
                                  item
                                )
                              }
                              className={
                                'w-full rounded-2xl border p-4 text-left transition ' +
                                (selected
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-slate-200 bg-slate-50')
                              }
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs font-bold text-slate-400">
                                    {item.league}
                                  </p>

                                  <p className="mt-1 font-black text-slate-900">
                                    {item.match}
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-emerald-600">
                                    {item.choice}
                                  </p>
                                </div>

                                <span
                                  className={
                                    'rounded-xl px-4 py-3 font-black ' +
                                    (selected
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-emerald-600')
                                  }
                                >
                                  {item.odds.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-400">
                GOALIX
              </p>

              <h2 className="mt-1 text-2xl font-black">
                🎟️ Votre coupon
              </h2>
            </div>

            {selections.length > 0 && (
              <button
                type="button"
                onClick={clearCoupon}
                className="rounded-xl bg-red-500/20 px-4 py-3 text-sm font-bold text-red-300"
              >
                Effacer
              </button>
            )}
          </div>

          {selections.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white/5 p-6 text-center">
              <p className="text-4xl">
                🎟️
              </p>

              <p className="mt-3 font-bold text-slate-200">
                Votre coupon est vide.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Ajoutez une sélection
                ci-dessus.
              </p>
            </div>
          ) : (
            <div className="mt-6">

              {couponCode && (
                <div className="rounded-2xl bg-emerald-500/10 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    CODE DU COUPON
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-2xl font-black tracking-widest text-emerald-300">
                      {couponCode}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyCode}
                        className="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold"
                      >
                        {copied
                          ? '✓ Copié'
                          : '📋 Copier'}
                      </button>

                      <button
                        type="button"
                        onClick={
                          shareCoupon
                        }
                        className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white"
                      >
                        📤 Partager
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-3">
                {selections.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            {item.market}
                          </p>

                          <p className="mt-1 font-black">
                            {item.match}
                          </p>

                          <p className="mt-1 text-sm text-slate-300">
                            {item.choice}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-emerald-300">
                            {item.odds.toFixed(
                              2
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeSelection(
                                item.id
                              )
                            }
                            className="h-9 w-9 rounded-xl bg-red-500/20 text-lg font-black text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-400">
                    Cote totale
                  </p>

                  <p className="mt-1 text-2xl font-black text-emerald-300">
                    {totalOdds.toFixed(
                      2
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-400">
                    Sélections
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {selections.length}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-white/10 p-4">
                <label
                  htmlFor="stake"
                  className="text-sm text-slate-400"
                >
                  Mise
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="stake"
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={stake}
                    onChange={(event) =>
                      setStake(
                        event.target.value
                      )
                    }
                    placeholder="500"
                    className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-slate-600"
                  />

                  <span className="font-black text-emerald-400">
                    FCFA
                  </span>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-emerald-500 p-5">
                <p className="text-sm font-bold text-emerald-950">
                  Gain potentiel
                </p>

                <p className="mt-1 text-3xl font-black text-white">
                  {potentialWin.toLocaleString(
                    'fr-FR',
                    {
                      maximumFractionDigits: 0,
                    }
                  )}{' '}
                  FCFA
                </p>
              </div>

              <button
                type="button"
                onClick={
                  validateCoupon
                }
                className="mt-5 w-full rounded-2xl bg-white py-4 text-lg font-black text-slate-950"
              >
                {validated
                  ? '✓ Coupon enregistré'
                  : 'Valider le coupon'}
              </button>

            </div>
          )}
        </section>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          ⚠️ Les cotes présentes ici sont
          actuellement des données de
          démonstration. Les vraies cotes
          Sportmonks seront intégrées ensuite.
        </div>

      </div>
    </main>
  );
    }
