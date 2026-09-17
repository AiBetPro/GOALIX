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

function generateCode() {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let result = 'GX-';

  for (let i = 0; i < 6; i++) {
    result += chars[
      Math.floor(Math.random() * chars.length)
    ];
  }

  return result;
}

export default function BetsPage() {
  const [selections, setSelections] =
    useState<Selection[]>([]);

  const [stake, setStake] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('goalix_selections');

      const savedStake =
        localStorage.getItem('goalix_stake');

      const savedCode =
        localStorage.getItem('goalix_coupon_code');

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
      (total, item) => total * item.odds,
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
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);

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

    if (!stake || Number(stake) <= 0) {
      alert(
        'Veuillez entrer une mise.'
      );
      return;
    }

    if (!couponCode) {
      setCouponCode(generateCode());
    }

    setValidated(true);

    alert(
      'Coupon enregistré en mode démonstration.'
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">

      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* HEADER */}
        <header className="mb-8">

          <p className="text-sm font-black tracking-widest text-emerald-600">
            GOALIX
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Mon coupon
          </h1>

          <p className="mt-2 text-slate-500">
            Retrouvez ici les sélections que
            vous avez ajoutées à votre coupon.
          </p>

        </header>

        {/* COUPON */}
        <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-xs font-bold tracking-widest text-emerald-400">
                GOALIX BET SLIP
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

          {/* EMPTY */}
          {selections.length === 0 ? (

            <div className="mt-6 rounded-2xl bg-white/5 p-8 text-center">

              <div className="text-5xl">
                🎟️
              </div>

              <h3 className="mt-4 text-lg font-black">
                Votre coupon est vide
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Ouvrez un match depuis la page
                Sports et choisissez vos marchés.
              </p>

              <a
                href="/dashboard"
                className="mt-6 inline-block rounded-2xl bg-emerald-500 px-6 py-4 font-black text-white"
              >
                ⚽ Voir les matchs
              </a>

            </div>

          ) : (

            <div className="mt-6">

              {/* CODE */}
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
                        onClick={shareCoupon}
                        className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold"
                      >
                        📤 Partager
                      </button>

                    </div>

                  </div>

                </div>
              )}

              {/* SELECTIONS */}
              <div className="mt-5 space-y-3">

                {selections.map((item) => (

                  <div
                    key={item.id}
                    className="rounded-2xl bg-white/10 p-4"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <div className="min-w-0">

                        <p className="text-xs font-bold text-emerald-400">
                          {item.market}
                        </p>

                        <p className="mt-1 font-black">
                          {item.match}
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {item.choice}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.league}
                        </p>

                      </div>

                      <div className="flex shrink-0 items-center gap-3">

                        <span className="font-black text-emerald-300">
                          {item.odds.toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeSelection(item.id)
                          }
                          className="h-9 w-9 rounded-xl bg-red-500/20 text-lg font-black text-red-300"
                        >
                          ×
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* SUMMARY */}
              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-sm text-slate-400">
                    Cote totale
                  </p>

                  <p className="mt-1 text-2xl font-black text-emerald-300">
                    {totalOdds.toFixed(2)}
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

              {/* STAKE */}
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
                    onChange={(event) => {
                      setStake(event.target.value);
                      setValidated(false);
                    }}
                    placeholder="500"
                    className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-slate-600"
                  />

                  <span className="font-black text-emerald-400">
                    FCFA
                  </span>

                </div>

              </div>

              {/* POTENTIAL WIN */}
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

              {/* VALIDATE */}
              <button
                type="button"
                onClick={validateCoupon}
                className="mt-5 w-full rounded-2xl bg-white py-4 text-lg font-black text-slate-950"
              >
                {validated
                  ? '✓ Coupon enregistré'
                  : 'Valider le coupon'}
              </button>

            </div>

          )}

        </section>

        {/* WARNING */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          ⚠️ Les cotes affichées actuellement
          sont des données de démonstration.
          Les vraies cotes Sportmonks seront
          intégrées ensuite.
        </div>

      </div>

    </main>
  );
}
