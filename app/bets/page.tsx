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
      if (
        current.some(
          (item) => item.id === selection.id
        )
      ) {
        return current;
      }

      return [...current, selection];
    });
  }

  function removeSelection(id: string) {
    setSelections((current) =>
      current.filter(
        (selection) => selection.id !== id
      )
    );
  }

  function clearCoupon() {
    setSelections([]);
    setStake('');
  }

  return (
    <main className="bets-page">

      {/* BRAND */}
      <header className="bets-brand">

        <div className="bets-logo">
          GOA<span>LIX</span>
        </div>

        <div className="bets-subtitle">
          SPORTS BETTING
        </div>

      </header>

      {/* TITLE */}
      <section className="bets-intro">

        <div className="bets-icon">
          🎟️
        </div>

        <div>
          <span>GOALIX</span>

          <h1>
            Mon coupon
          </h1>

          <p>
            Préparez vos sélections avant de valider
            votre pari.
          </p>
        </div>

      </section>

      {/* AVAILABLE */}
      <section className="bets-available">

        <div className="bets-section-title">
          <div>
            <span>SÉLECTIONS</span>
            <h2>
              Ajouter des paris
            </h2>
          </div>

          <strong>
            {availableSelections.length}
          </strong>
        </div>

        <div className="bets-selection-grid">

          {availableSelections.map((selection) => {

            const selected = selections.some(
              (item) => item.id === selection.id
            );

            return (
              <button
                key={selection.id}
                onClick={() =>
                  addSelection(selection)
                }
                disabled={selected}
                className={`bets-selection-card ${
                  selected ? 'selected' : ''
                }`}
              >

                <div className="selection-league">
                  {selection.league}
                </div>

                <div className="selection-match">
                  {selection.match}
                </div>

                <div className="selection-bottom">

                  <span>
                    {selection.choice}
                  </span>

                  <strong>
                    {selection.odds.toFixed(2)}
                  </strong>

                </div>

                {selected && (
                  <div className="selection-check">
                    ✓
                  </div>
                )}

              </button>
            );
          })}

        </div>
      </section>

      {/* COUPON */}
      <section className="bets-coupon">

        <div className="bets-coupon-header">

          <div>
            <span>🎟️</span>

            <div>
              <small>GOALIX</small>

              <h2>
                Votre coupon
              </h2>
            </div>
          </div>

          {selections.length > 0 && (
            <button
              onClick={clearCoupon}
              className="clear-button"
            >
              Effacer
            </button>
          )}

        </div>

        {selections.length === 0 ? (

          <div className="bets-empty">

            <div className="empty-ticket">
              🎫
            </div>

            <strong>
              Votre coupon est vide
            </strong>

            <p>
              Ajoutez une ou plusieurs sélections
              pour commencer.
            </p>

          </div>

        ) : (

          <>

            <div className="bets-chosen">

              {selections.map((selection) => (

                <div
                  key={selection.id}
                  className="chosen-item"
                >

                  <div>
                    <strong>
                      {selection.match}
                    </strong>

                    <span>
                      {selection.choice}
                    </span>
                  </div>

                  <div className="chosen-right">

                    <b>
                      {selection.odds.toFixed(2)}
                    </b>

                    <button
                      onClick={() =>
                        removeSelection(
                          selection.id
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <div className="bets-summary">

              <div>
                <span>
                  Cote totale
                </span>

                <strong>
                  {totalOdds.toFixed(2)}
                </strong>
              </div>

              <div>
                <span>
                  Nombre de paris
                </span>

                <strong>
                  {selections.length}
                </strong>
              </div>

            </div>

            <div className="stake-box">

              <label>
                Votre mise
              </label>

              <div className="stake-input">

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={stake}
                  onChange={(event) =>
                    setStake(event.target.value)
                  }
                />

                <span>
                  FCFA
                </span>

              </div>

            </div>

            <div className="potential-win">

              <span>
                Gain potentiel
              </span>

              <strong>
                {potentialWin.toFixed(0)}
                <small> FCFA</small>
              </strong>

            </div>

            <button
              onClick={() =>
                alert(
                  'Mode démonstration : aucun pari réel n’est engagé.'
                )
              }
              className="validate-bet"
            >
              Valider le coupon
              <span>→</span>
            </button>

            <p className="demo-warning">
              Mode démonstration — aucun argent réel
              n'est engagé.
            </p>

          </>

        )}

      </section>

      <footer className="bets-footer">
        <strong>
          GOA<span>LIX</span>
        </strong>

        <p>
          Sports Betting Platform
        </p>
      </footer>

    </main>
  );
        }
