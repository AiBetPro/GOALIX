'use client';

import { useEffect, useMemo, useState } from 'react';

type Market =
  | 'Résultat'
  | 'Double chance'
  | 'Total buts'
  | 'Les deux équipes marquent'
  | 'Score exact';

type Selection = {
  id: string;
  match: string;
  league: string;
  market: Market;
  choice: string;
  odds: number;
};

const selectionsAvailable: Selection[] = [
  // RESULTAT
  {
    id: 'arsenal-chelsea-1',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Résultat',
    choice: 'Arsenal gagne',
    odds: 1.65,
  },
  {
    id: 'arsenal-chelsea-x',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Résultat',
    choice: 'Match nul',
    odds: 3.70,
  },
  {
    id: 'arsenal-chelsea-2',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Résultat',
    choice: 'Chelsea gagne',
    odds: 4.90,
  },

  // DOUBLE CHANCE
  {
    id: 'arsenal-chelsea-1x',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Double chance',
    choice: '1X — Arsenal ou nul',
    odds: 1.20,
  },
  {
    id: 'arsenal-chelsea-x2',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Double chance',
    choice: 'X2 — Nul ou Chelsea',
    odds: 1.85,
  },
  {
    id: 'arsenal-chelsea-12',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Double chance',
    choice: '12 — Arsenal ou Chelsea',
    odds: 1.30,
  },

  // TOTAL BUTS
  {
    id: 'arsenal-chelsea-over15',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Plus de 1,5 buts',
    odds: 1.35,
  },
  {
    id: 'arsenal-chelsea-under15',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Moins de 1,5 buts',
    odds: 2.80,
  },
  {
    id: 'arsenal-chelsea-over25',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Plus de 2,5 buts',
    odds: 1.70,
  },
  {
    id: 'arsenal-chelsea-under25',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Moins de 2,5 buts',
    odds: 2.10,
  },
  {
    id: 'arsenal-chelsea-over35',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Plus de 3,5 buts',
    odds: 2.40,
  },
  {
    id: 'arsenal-chelsea-under35',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Total buts',
    choice: 'Moins de 3,5 buts',
    odds: 1.50,
  },

  // BTTS
  {
    id: 'arsenal-chelsea-btts-yes',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Les deux équipes marquent',
    choice: 'Oui',
    odds: 1.62,
  },
  {
    id: 'arsenal-chelsea-btts-no',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Les deux équipes marquent',
    choice: 'Non',
    odds: 2.15,
  },

  // SCORE EXACT
  {
    id: 'arsenal-chelsea-score-10',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '1 - 0',
    odds: 7.00,
  },
  {
    id: 'arsenal-chelsea-score-11',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '1 - 1',
    odds: 6.50,
  },
  {
    id: 'arsenal-chelsea-score-20',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '2 - 0',
    odds: 7.50,
  },
  {
    id: 'arsenal-chelsea-score-21',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    market: 'Score exact',
    choice: '2 - 1',
    odds: 8.00,
  },

  // BARCELONA
  {
    id: 'barcelona-sevilla-1',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    market: 'Résultat',
    choice: 'Barcelona gagne',
    odds: 1.42,
  },
  {
    id: 'barcelona-sevilla-1x',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    market: 'Double chance',
    choice: '1X — Barcelona ou nul',
    odds: 1.12,
  },
  {
    id: 'barcelona-sevilla-over25',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    market: 'Total buts',
    choice: 'Plus de 2,5 buts',
    odds: 1.55,
  },
  {
    id: 'barcelona-sevilla-btts',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    market: 'Les deux équipes marquent',
    choice: 'Oui',
    odds: 1.68,
  },

  // INTER MILAN
  {
    id: 'inter-milan-1',
    match: 'Inter vs Milan',
    league: 'Serie A',
    market: 'Résultat',
    choice: 'Inter gagne',
    odds: 1.75,
  },
  {
    id: 'inter-milan-12',
    match: 'Inter vs Milan',
    league: 'Serie A',
    market: 'Double chance',
    choice: '12 — Inter ou Milan',
    odds: 1.28,
  },
  {
    id: 'inter-milan-over15',
    match: 'Inter vs Milan',
    league: 'Serie A',
    market: 'Total buts',
    choice: 'Plus de 1,5 buts',
    odds: 1.30,
  },
];

const marketIcons: Record<Market, string> = {
  Résultat: '⚽',
  'Double chance': '🔄',
  'Total buts': '🥅',
  'Les deux équipes marquent': '🤝',
  'Score exact': '🎯',
};

function createCouponCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let code = '';

  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(
      Math.random() * characters.length
    );

    code += characters[index];
  }

  return `GX-${code}`;
}

export default function BetsPage() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    try {
      const savedSelections = localStorage.getItem(
        'goalix_coupon_selections'
      );

      const savedStake = localStorage.getItem(
        'goalix_coupon_stake'
      );

      const savedCode = localStorage.getItem(
        'goalix_coupon_code'
      );

      if (savedSelections) {
        const parsed = JSON.parse(savedSelections);

        if (Array.isArray(parsed)) {
          setSelections(parsed);
        }
      }

      if (savedStake) {
        setStake(savedStake);
      }

      if (savedCode) {
        setCouponCode(savedCode);
      }
    } catch (error) {
      console.error('Erreur chargement coupon:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'goalix_coupon_selections',
        JSON.stringify(selections)
      );

      localStorage.setItem(
        'goalix_coupon_stake',
        stake
      );

      if (couponCode) {
        localStorage.setItem(
          'goalix_coupon_code',
          couponCode
        );
      }
    } catch (error) {
      console.error('Erreur sauvegarde coupon:', error);
    }
  }, [selections, stake, couponCode]);

  const totalOdds = useMemo(() => {
    if (selections.length === 0) {
      return 0;
    }

    return selections.reduce(
      (total, selection) =>
        total * selection.odds,
      1
    );
  }, [selections]);

  const potentialWin = useMemo(() => {
    const amount = Number(stake);

    if (!amount || totalOdds === 0) {
      return 0;
    }

    return amount * totalOdds;
  }, [stake, totalOdds]);

  function addSelection(selection: Selection) {
    setSelections((current) => {
      const alreadySelected = current.some(
        (item) => item.id === selection.id
      );

      if (alreadySelected) {
        return current;
      }

      const sameMarket = current.find(
        (item) =>
          item.match === selection.match &&
          item.market === selection.market
      );

      if (sameMarket) {
        return current.map((item) =>
          item.id === sameMarket.id
            ? selection
            : item
        );
      }

      return [...current, selection];
    });

    if (!couponCode) {
      setCouponCode(createCouponCode());
    }

    setValidated(false);
  }

  function removeSelection(id: string) {
    setSelections((current) =>
      current.filter((item) => item.id !== id)
    );

    setValidated(false);
  }

  function clearCoupon() {
    setSelections([]);
    setStake('');
    setCouponCode('');
    setCopied(false);
    setShared(false);
    setValidated(false);

    localStorage.removeItem(
      'goalix_coupon_selections'
    );

    localStorage.removeItem(
      'goalix_coupon_stake'
    );

    localStorage.removeItem(
      'goalix_coupon_code'
    );
  }

  async function copyCouponCode() {
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
      console.error('Erreur copie:', error);

      alert(`Code GOALIX : ${couponCode}`);
    }
  }

  async function shareCoupon() {
    if (!couponCode || selections.length === 0) {
      return;
    }

    const text = [
      '🎟️ Coupon GOALIX',
      '',
      `Code : ${couponCode}`,
      `Paris : ${selections.length}`,
      `Cote totale : ${totalOdds.toFixed(2)}`,
      stake
        ? `Mise : ${Number(stake).toLocaleString(
            'fr-FR'
          )} FCFA`
        : '',
      '',
      'Coupon GOALIX — mode démonstration.',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Coupon GOALIX',
          text,
        });

        setShared(true);

        setTimeout(() => {
          setShared(false);
        }, 2000);
      } else {
        await navigator.clipboard.writeText(text);

        alert(
          'Le partage direct n’est pas disponible. Le coupon a été copié.'
        );
      }
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  }

  function validateCoupon() {
    if (selections.length === 0) {
      alert('Ajoutez au moins une sélection.');
      return;
    }

    if (!stake || Number(stake) <= 0) {
      alert('Veuillez saisir une mise.');
      return;
    }

    setValidated(true);

    alert(
      `Coupon ${couponCode} enregistré en mode démonstration.`
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-7">

        {/* HEADER */}

        <header className="mb-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-3xl shadow-sm">
              🎟️
            </div>

            <div>
              <p className="text-xs font-extrabold tracking-[0.25em] text-emerald-600">
                GOALIX
              </p>

              <h1 className="text-4xl font-extrabold text-slate-950">
                Mon coupon
              </h1>

              <p className="mt-1 text-slate-500">
                Préparez vos sélections avant de valider.
              </p>
            </div>
          </div>
        </header>

        {/* MARCHÉS */}

        <section className="mb-7">
          <div className="mb-4">
            <p className="text-xs font-extrabold tracking-[0.2em] text-emerald-600">
              MARCHÉS GOALIX
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              Ajouter des paris
            </h2>
          </div>

          <div className="space-y-4">
            {(
              [
                'Résultat',
                'Double chance',
                'Total buts',
                'Les deux équipes marquent',
                'Score exact',
              ] as Market[]
            ).map((market) => {
              const marketSelections =
                selectionsAvailable.filter(
                  (item) => item.market === market
                );

              return (
                <details
                  key={market}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                  open={market === 'Résultat'}
                >
                  <summary className="cursor-pointer list-none px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {marketIcons[market]}
                        </span>

                        <span className="font-extrabold text-slate-950">
                          {market}
                        </span>
                      </div>

                      <span className="text-slate-400">
                        ▼
                      </span>
                    </div>
                  </summary>

                  <div className="space-y-3 border-t border-slate-100 p-4">
                    {marketSelections.map(
                      (selection) => {
                        const isSelected =
                          selections.some(
                            (item) =>
                              item.id ===
                              selection.id
                          );

                        return (
                          <button
                            key={selection.id}
                            type="button"
                            onClick={() =>
                              addSelection(
                                selection
                              )
                            }
                            className={`w-full rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-slate-400">
                                  {
                                    selection.league
                                  }
                                </p>

                                <p className="mt-1 font-bold text-slate-950">
                                  {
                                    selection.match
                                  }
                                </p>

                                <p className="mt-1 text-sm font-semibold text-emerald-600">
                                  {
                                    selection.choice
                                  }
                                </p>
                              </div>

                              <div
                                className={`rounded-xl px-4 py-3 font-extrabold ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-emerald-600 shadow-sm'
                                }`}
                              >
                                {selection.odds.toFixed(
                                  2
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* COUPON */}

        <section className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl">

          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold tracking-[0.25em] text-emerald-400">
                GOALIX
              </p>

              <h2 className="mt-1 text-2xl font-extrabold">
                🎟️ Votre coupon
              </h2>
            </div>

            {selections.length > 0 && (
              <button
                type="button"
                onClick={clearCoupon}
                className="rounded-xl bg-red-500/15 px-4 py-3 text-sm font-extrabold text-red-300"
              >
                Effacer
              </button>
            )}
          </div>

          {/* CODE */}

          {selections.length > 0 && couponCode && (
            <div className="mb-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-400">
                    CODE DU COUPON
                  </p>

                  <p className="mt-1 text-2xl font-black tracking-[0.15em] text-emerald-300">
                    {couponCode}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyCouponCode}
                    className="rounded-xl bg-white/10 px-3 py-3 text-sm font-bold"
                  >
                    {copied ? '✓ Copié' : '📋 Copier'}
                  </button>

                  <button
                    type="button"
                    onClick={shareCoupon}
                    className="rounded-xl bg-emerald-500 px-3 py-3 text-sm font-bold"
                  >
                    {shared
                      ? '✓ Partagé'
                      : '📤 Partager'}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Vous pouvez partager ce code avant de
                valider le coupon.
              </p>
            </div>
          )}

          {/* SELECTIONS */}

          {selections.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center">
              <div className="text-4xl">🎟️</div>

              <p className="mt-3 font-bold text-slate-200">
                Votre coupon est vide.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Choisissez une cote dans les marchés
                ci-dessus.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {selections.map((selection) => (
                  <div
                    key={selection.id}
                    className="rounded-2xl bg-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400">
                          {selection.market}
                        </p>

                        <p className="mt-1 font-bold text-white">
                          {selection.match}
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {selection.choice}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <strong className="text-lg text-emerald-300">
                          {selection.odds.toFixed(2)}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removeSelection(
                              selection.id
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-lg font-bold text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    </div>
     
