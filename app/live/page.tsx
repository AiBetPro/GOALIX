'use client';

import { useState } from 'react';

type LiveMatch = {
  id: string;
  league: string;
  minute: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  homeOdd: string;
  drawOdd: string;
  awayOdd: string;
  events: string[];
};

const liveMatches: LiveMatch[] = [
  {
    id: 'arsenal-chelsea-live',
    league: 'Premier League',
    minute: "67'",
    home: 'Arsenal',
    away: 'Chelsea',
    homeScore: 2,
    awayScore: 1,
    homeOdd: '1.32',
    drawOdd: '4.60',
    awayOdd: '7.20',
    events: [
      "⚽ Arsenal — 54'",
      "🟨 Chelsea — 61'",
    ],
  },
  {
    id: 'barca-sevilla-live',
    league: 'La Liga',
    minute: "73'",
    home: 'Barcelona',
    away: 'Sevilla',
    homeScore: 1,
    awayScore: 0,
    homeOdd: '1.18',
    drawOdd: '6.20',
    awayOdd: '12.00',
    events: [
      "⚽ Barcelona — 38'",
      "🟨 Sevilla — 69'",
    ],
  },
  {
    id: 'inter-milan-live',
    league: 'Serie A',
    minute: "41'",
    home: 'Inter',
    away: 'Milan',
    homeScore: 0,
    awayScore: 0,
    homeOdd: '2.05',
    drawOdd: '2.10',
    awayOdd: '4.80',
    events: [
      "🟨 Inter — 22'",
    ],
  },
];

export default function LivePage() {
  const [selected, setSelected] = useState<string | null>(
    null
  );

  const [market, setMarket] = useState('Résultat');

  function selectOdd(id: string) {
    setSelected(id);

    setTimeout(() => {
      setSelected(null);
    }, 900);
  }

  return (
    <main className="live-page">

      {/* HEADER */}
      <header className="live-header">

        <div>
          <div className="live-logo">
            GOA<span>LIX</span>
          </div>

          <div className="live-subtitle">
            SPORTS BETTING
          </div>
        </div>

        <a
          href="/bets"
          className="live-coupon-button"
        >
          🎟️
        </a>

      </header>

      {/* LIVE HERO */}
      <section className="live-hero">

        <div className="live-hero-content">

          <div className="live-status">
            <span />
            LIVE
          </div>

          <h1>
            Matchs
            <br />
            <strong>en direct</strong>
          </h1>

          <p>
            Suivez les rencontres et consultez les
            opportunités disponibles en direct.
          </p>

        </div>

        <div className="live-radar">
          <div className="radar-ring ring-one" />
          <div className="radar-ring ring-two" />
          <div className="radar-core">
            LIVE
          </div>
        </div>

      </section>

      {/* FILTER */}
      <section className="live-filter">

        <button
          className={
            market === 'Résultat' ? 'active' : ''
          }
          onClick={() =>
            setMarket('Résultat')
          }
        >
          Résultat
        </button>

        <button
          className={
            market === 'Buts' ? 'active' : ''
          }
          onClick={() =>
            setMarket('Buts')
          }
        >
          ⚽ Buts
        </button>

        <button
          className={
            market === 'Mi-temps' ? 'active' : ''
          }
          onClick={() =>
            setMarket('Mi-temps')
          }
        >
          Mi-temps
        </button>

      </section>

      {/* MATCH COUNT */}
      <div className="live-section-title">

        <div>
          <span>EN DIRECT MAINTENANT</span>

          <h2>
            Matchs Live
          </h2>
        </div>

        <div className="live-count">
          <span />
          {liveMatches.length}
        </div>

      </div>

      {/* LIVE MATCHES */}
      <section className="live-matches">

        {liveMatches.map((match) => (

          <article
            key={match.id}
            className="live-match-card"
          >

            {/* MATCH HEADER */}
            <div className="live-match-top">

              <span>
                {match.league}
              </span>

              <div className="live-minute">
                <i />
                {match.minute}
              </div>

            </div>

            {/* SCORE */}
            <div className="live-score">

              <div className="live-team">

                <div className="live-team-logo">
                  {match.home.charAt(0)}
                </div>

                <strong>
                  {match.home}
                </strong>

              </div>

              <div className="score-center">

                <div className="score">
                  <strong>
                    {match.homeScore}
                  </strong>

                  <span>
                    -
                  </span>

                  <strong>
                    {match.awayScore}
                  </strong>
                </div>

                <small>
                  {match.minute}
                </small>

              </div>

              <div className="live-team">

                <div className="live-team-logo">
                  {match.away.charAt(0)}
                </div>

                <strong>
                  {match.away}
                </strong>

              </div>

            </div>

            {/* EVENTS */}
            <div className="live-events">

              {match.events.map((event) => (

                <span key={event}>
                  {event}
                </span>

              ))}

            </div>

            {/* MARKET */}
            <div className="live-market-title">
              {market.toUpperCase()}
            </div>

            {/* ODDS */}
            <div className="live-odds">

              <button
                onClick={() =>
                  selectOdd(
                    `${match.id}-1`
                  )
                }
                className={
                  selected === `${match.id}-1`
                    ? 'selected'
                    : ''
                }
              >
                <small>1</small>

                <strong>
                  {match.homeOdd}
                </strong>
              </button>

              <button
                onClick={() =>
                  selectOdd(
                    `${match.id}-x`
                  )
                }
                className={
                  selected === `${match.id}-x`
                    ? 'selected'
                    : ''
                }
              >
                <small>X</small>

                <strong>
                  {match.drawOdd}
                </strong>
              </button>

              <button
                onClick={() =>
                  selectOdd(
                    `${match.id}-2`
                  )
                }
                className={
                  selected === `${match.id}-2`
                    ? 'selected'
                    : ''
                }
              >
                <small>2</small>

                <strong>
                  {match.awayOdd}
                </strong>
              </button>

            </div>

            {/* ACTIONS */}
            <div className="live-actions">

              <button>
                📊 Statistiques
              </button>

              <a href="/bets">
                🎟️ Coupon
              </a>

            </div>

          </article>

        ))}

      </section>

      {/* INFO */}
      <section className="live-info">

        <div className="live-info-icon">
          ⚡
        </div>

        <div>
          <strong>
            Cotes Live
          </strong>

          <p>
            Les cotes peuvent évoluer ou être
            temporairement suspendues pendant
            les événements du match.
          </p>
        </div>

      </section>

      {/* AI */}
      <section className="live-ai-banner">

        <div>

          <span>
            🤖 GOALIX AI
          </span>

          <h2>
            Une analyse
            <br />
            pendant le match ?
          </h2>

          <p>
            Consultez les recommandations de
            notre système d'analyse.
          </p>

          <a href="/ai-prono">
            Ouvrir IA Prono →
          </a>

        </div>

        <div className="live-ai-orb">
          AI
        </div>

      </section>

      {/* FOOTER */}
      <footer className="live-footer">

        <strong>
          GOA<span>LIX</span>
        </strong>

        <p>
          Live Sports & AI Predictions
        </p>

      </footer>

    </main>
  );
    }
